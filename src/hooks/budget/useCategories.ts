import { supabase } from "@/lib/supabase";
import { Category, CategoryFormData } from "@/types/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCategories = (userId?: string) => {
  const queryClient = useQueryClient();

  // 카테고리 조회
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", userId],
    queryFn: async (): Promise<Category[]> => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId!)
        .order("is_deleted", { ascending: true })
        .order("is_default", { ascending: false })
        .order("name");

      if (categoriesError) throw categoriesError;

      // 각 카테고리의 거래 건수 계산
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const [incomeResult, expenseResult] = await Promise.all([
            supabase
              .from("incomes")
              .select("id")
              .eq("category_id", category.id),
            supabase
              .from("expenses")
              .select("id")
              .eq("category_id", category.id),
          ]);

          const incomeCount = incomeResult.data?.length || 0;
          const expenseCount = expenseResult.data?.length || 0;
          const totalCount = incomeCount + expenseCount;

          return {
            ...category,
            transactionCount: totalCount,
          };
        }),
      );

      return categoriesWithCount;
    },
    enabled: !!userId,
  });

  // 카테고리 추가
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: CategoryFormData & { user_id: string }) => {
      const categoryData = {
        ...newCategory,
        color: newCategory.color || "#14b8a6",
        is_default: false,
      };

      const { data, error } = await supabase
        .from("categories")
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // 카테고리 삭제 (사용중인 지출이 있으면 삭제 불가)
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // 고정-변동 카테고리 분류
  const { fixedCategories, variableCategories } = useMemo(
    () => ({
      fixedCategories: categories.filter((cat) => cat.type === "expense_fixed"),
      variableCategories: categories.filter(
        (cat) => cat.type === "expense_variable",
      ),
    }),
    [categories],
  );

  return {
    categories,
    fixedCategories,
    variableCategories,
    isLoading,
    error,
    addCategory: addCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isAddingCategory: addCategoryMutation.isPending,
    isDeletingCategory: deleteCategoryMutation.isPending,
  };
};
