import { supabase } from "@/lib/supabase";
import { GoalFormData } from "@/types/goals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateChallengeData {
  title: string;
  description: string;
  reason: string;
  enableAmountGoal: boolean;
  enableCountGoal: boolean;
  targetAmount: string; // TODO: 카테고리에 따라 필요하지 않을 수도 있음. 검토바람
  targetCount: string;
  targetDate: string;
  category: string;
  categoryType: "income" | "expense";
  userId: string;
}

export const useChallenge = () => {
  const queryClient = useQueryClient();

  const createChallengeMutation = useMutation({
    mutationFn: async (data: CreateChallengeData) => {
      // 챌린지 모드 결정
      let challengeMode: "amount" | "count" | "both" = "amount";
      if (data.enableAmountGoal && data.enableCountGoal) {
        challengeMode = "both";
      } else if (data.enableCountGoal) {
        challengeMode = "count";
      }

      // 목표 타입 결정
      const goalType =
        data.categoryType === "income" ? "increase_income" : "reduce_expense";

      const goalData: GoalFormData & { user_id: string } = {
        user_id: data.userId,
        title: data.title,
        description: data.description || null,
        reason: data.reason || null,
        type: goalType,
        target_amount: data.enableAmountGoal ? Number(data.targetAmount) : null,
        target_count: data.enableCountGoal ? Number(data.targetCount) : null,
        target_date: data.targetDate,
        challenge_mode: challengeMode,
        category_id: null, // TODO:카테고리별 목표가 필요하다면 추후 구현
      };

      const { data: result, error } = await supabase
        .from("goals")
        .insert([
          {
            ...goalData,
            current_amount: 0,
            current_count: 0,
            status: "active",
            created_from_date: new Date().toISOString().split("T")[0],
          },
        ])
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      // goals 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  return {
    createChallenge: createChallengeMutation.mutate,
    isCreatingChallenge: createChallengeMutation.isPending,
    createChallengeError: createChallengeMutation.error,
  };
};
