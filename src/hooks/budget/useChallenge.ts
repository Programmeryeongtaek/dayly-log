import { supabase } from "@/lib/supabase";
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
      const goalType = data.categoryType === "income" ? "increase_income" : "reduce_expense";

      // 카테고리 ID 조회
      const categoryId = await getCategoryIdByName(
        data.category, 
        data.categoryType, 
        data.userId
      );

      const goalData = {
        user_id: data.userId,
        title: data.title,
        description: data.description || null,
        reason: data.reason || null,
        type: goalType,
        target_amount: data.enableAmountGoal ? Number(data.targetAmount) : null,
        target_count: data.enableCountGoal ? Number(data.targetCount) : null,
        target_date: data.targetDate,
        challenge_mode: challengeMode,
        category_id: categoryId,
        current_amount: 0,
        current_count: 0,
        status: "active" as const,
        created_from_date: new Date().toISOString().split("T")[0],
      };

      const { data: result, error } = await supabase
        .from("goals")
        .insert([goalData])
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) {
        console.error("목표 생성 에러:", error);
        throw error;
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  return {
    createChallenge: createChallengeMutation.mutate,
    isCreatingChallenge: createChallengeMutation.isPending,
    createChallengeError: createChallengeMutation.error,
  };
};

const getCategoryIdByName = async (
  categoryName: string, 
  categoryType: "income" | "expense", 
  userId: string
): Promise<string | null> => {
  try {
    // 두 타입 모두 한 번에 조회
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, type")
      .eq("user_id", userId)
      .eq("name", categoryName)
      .in("type", [`${categoryType}_fixed`, `${categoryType}_variable`]);

    if (error) {
      console.error("카테고리 조회 에러:", error);
      return null;
    }

    if (!categories || categories.length === 0) {
      console.warn(`카테고리를 찾을 수 없습니다: ${categoryName} (${categoryType})`);
      return null;
    }

    const fixedCategory = categories.find(cat => cat.type === `${categoryType}_fixed`);
    const variableCategory = categories.find(cat => cat.type === `${categoryType}_variable`);

    return fixedCategory?.id || variableCategory?.id || null;

  } catch (error) {
    console.error("카테고리 ID 조회 실패:", error);
    return null;
  }
};