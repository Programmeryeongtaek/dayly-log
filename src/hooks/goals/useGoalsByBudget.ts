import { supabase } from '@/lib/supabase';
import { Goal } from '@/types/goals';
import { useQuery } from '@tanstack/react-query';

interface UseGoalsByBudgetProps {
  userId?: string;
  categoryName?: string;
  type?: "income" | "expense";
}

export const useGoalsByBudget = ({
  userId,
  categoryName,
  type,
}: UseGoalsByBudgetProps = {}) => {
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals-by-budget", userId, categoryName, type],
    queryFn: async (): Promise<Goal[]> => {
      if (!userId || !categoryName) return [];

      // 카테고리와 연결된 목표들 조회
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", userId)
        .eq("name", categoryName)
        .in("type", [`${type}_variable`, `${type}_fixed`]);

      if (!categoryData || categoryData.length === 0) return [];

      const categoryIds = categoryData.map(cat => cat.id);

      const { data, error } = await supabase
        .from("goals")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("user_id", userId)
        .in("category_id", categoryIds)
        .eq("status", "active");

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId && !!categoryName && !!type,
  });

  return {
    goals,
    isLoading,
    hasMultipleGoals: goals.length > 1,
    hasSingleGoal: goals.length === 1,
    hasNoGoals: goals.length === 0,
  };
};