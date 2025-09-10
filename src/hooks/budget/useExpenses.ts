import { supabase } from "@/lib/supabase";
import {
  CategoryTotal,
  BudgetTransaction,
  BudgetFormData,
  BudgetStatistics,
} from "@/types/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseExpensesProps {
  userId?: string;
  date?: string;
  month?: string;
}

export const useExpenses = ({ userId, date, month }: UseExpensesProps = {}) => {
  const queryClient = useQueryClient();

  // 지출 데이터 조회
  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses", userId, date, month],
    queryFn: async (): Promise<BudgetTransaction[]> => {
      let query = supabase
        .from("expenses")
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .order("date", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      if (date) {
        query = query.eq("date", date);
      } else if (month) {
        const startOfMonth = `${month}-01`;
        const endOfMonth = new Date(
          new Date(month).getFullYear(),
          new Date(month).getMonth() + 1,
          0,
        )
          .toISOString()
          .split("T")[0];
        query = query.gte("date", startOfMonth).lte("date", endOfMonth);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // 지출 추가
  const addExpenseMutation = useMutation({
    mutationFn: async (
      newExpense: BudgetFormData & { user_id: string; category_id: string },
    ) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert([newExpense])
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  // 지출 삭제
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  // 지출 수정
  const updateExpenseMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<BudgetFormData> & { id: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  // 통계 계산 - 메모리 효율적 구현
  const statistics: BudgetStatistics = useMemo(() => {
    const stats = {
      income: { fixed: 0, variable: 0, total: 0, count: 0 },
      expense: { fixed: 0, variable: 0, total: 0, count: 0 },
      net: 0,
      totalTransactions: expenses.length,
    };

    expenses.forEach((expense) => {
      const amount = expense.amount;
      const categoryType = expense.category?.type;

      if (expense.type === "expense") {
        stats.expense.count++;
        if (categoryType === "expense_fixed") {
          stats.expense.fixed += amount;
        } else {
          stats.expense.variable += amount;
        }
      } else if (expense.type === "income") {
        stats.income.count++;
        if (categoryType === "income_fixed") {
          stats.income.fixed += amount;
        } else {
          stats.income.variable += amount;
        }
      }
    });

    stats.income.total = stats.income.fixed + stats.income.variable;
    stats.expense.total = stats.expense.fixed + stats.expense.variable;
    stats.net = stats.income.total - stats.expense.total;

    return stats;
  }, [expenses]);

  // 카테고리별 집계 - 메모리 효율적 구현
  const categoryTotals: CategoryTotal[] = useMemo(() => {
    const totalsMap: Record<string, CategoryTotal> = {};

    expenses.forEach((expense) => {
      const categoryName = expense.category?.name || "Unknown";
      const categoryType = expense.category?.type || "expense_variable";
      const amount = expense.amount;

      if (!totalsMap[categoryName]) {
        totalsMap[categoryName] = {
          name: categoryName,
          amount: 0,
          type: categoryType,
          count: 0,
          percentage: 0,
        };
      }

      totalsMap[categoryName].amount += amount;
      totalsMap[categoryName].count++;
    });

    const totalAmount = statistics.income.total + statistics.expense.total;

    return Object.values(totalsMap).map((category) => ({
      ...category,
      percentage: totalAmount > 0 ? (category.amount / totalAmount) * 100 : 0,
    }));
  }, [expenses, statistics]);

  return {
    expenses,
    statistics,
    categoryTotals,
    isLoading,
    error,
    addExpense: addExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    isAddingExpense: addExpenseMutation.isPending,
    isDeletingExpense: deleteExpenseMutation.isPending,
    isUpdatingExpense: updateExpenseMutation.isPending,
  };
};
