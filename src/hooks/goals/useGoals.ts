import { supabase } from "@/lib/supabase";
import { Goal, GoalFormData } from "@/types/goals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseGoalsProps {
  userId?: string;
}

export const useGoals = ({ userId }: UseGoalsProps = {}) => {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals", userId],
    queryFn: async (): Promise<Goal[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("goals")
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // 목표 업데이트
  const updateGoalMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<GoalFormData>;
    }) => {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("goals")
        .update(updateData)
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
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  // 목표 삭제
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  // 목표 상태별 분류
  const { activeGoals, completedGoals } = useMemo(() => {
    const active = goals.filter((goal) => goal.status === "active");
    const completed = goals.filter((goal) => goal.status === "completed");

    return {
      activeGoals: active,
      completedGoals: completed,
    };
  }, [goals]);

  return {
    goals,
    activeGoals,
    completedGoals,
    isLoading,
    updateGoal: updateGoalMutation.mutate,
    isUpdatingGoal: updateGoalMutation.isPending,
    deleteGoal: deleteGoalMutation.mutate,
    isDeletingGoal: deleteGoalMutation.isPending,
  };
};
