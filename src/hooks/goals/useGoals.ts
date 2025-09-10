import { supabase } from "@/lib/supabase";
import { Goal, GoalFormData, GoalProgressInfo } from "@/types/goals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseGoalsProps {
  userId?: string;
  status?: Goal["status"];
}

export const useGoals = ({ userId, status }: UseGoalsProps = {}) => {
  const queryClient = useQueryClient();

  // 목표 조회
  const {
    data: goals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["goals", userId, status],
    queryFn: async (): Promise<Goal[]> => {
      let query = supabase
        .from("goals")
        .select(
          `
          *,
          category:categories(*)
        `,
        )
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // 목표 생성
  const createGoalMutation = useMutation({
    mutationFn: async (newGoal: GoalFormData & { user_id: string }) => {
      const goalData = {
        ...newGoal,
        current_amount: 0,
        current_count: 0,
        status: "active" as const,
        created_from_date: new Date().toISOString().split("T")[0],
      };

      const { data, error } = await supabase
        .from("goals")
        .insert([goalData])
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

  // 목표 수정
  const updateGoalMutation = useMutation({
    mutationFn: async (updates: { id: string } & Partial<Goal>) => {
      const { id, ...goalUpdates } = updates;

      const { data, error } = await supabase
        .from("goals")
        .update(goalUpdates)
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

  // 목표 진행률 계산
  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const progressInfo = calculateGoalProgress(goal);
      return {
        ...goal,
        progress: progressInfo,
      };
    });
  }, [goals]);

  // 활성 목표만 필터링
  const activeGoals = useMemo(() => {
    return goalsWithProgress.filter((goal) => goal.status === "active");
  }, [goalsWithProgress]);

  // 완료된 목표만 필터링
  const completedGoals = useMemo(() => {
    return goalsWithProgress.filter((goal) => goal.status === "completed");
  }, [goalsWithProgress]);

  return {
    goals: goalsWithProgress,
    activeGoals,
    completedGoals,
    isLoading,
    error,
    createGoal: createGoalMutation.mutate,
    isCreatingGoal: createGoalMutation.isPending,
    updateGoal: updateGoalMutation.mutate,
    isUpdatingGoal: updateGoalMutation.isPending,
  };
};

// 목표 진행률 계산 함수
const calculateGoalProgress = (goal: Goal): GoalProgressInfo => {
  const currentDate = new Date();
  const targetDate = goal.target_date ? new Date(goal.target_date) : null;

  // 남은 일수 계산
  const daysLeft = targetDate
    ? Math.max(
        0,
        Math.ceil(
          (targetDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  // 금액 진행률 계산
  const amountProgress =
    goal.target_amount && goal.target_amount > 0
      ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
      : 0;

  // 횟수 진행률 계산
  const countProgress =
    goal.target_count && goal.target_count > 0
      ? Math.min(100, (goal.current_count / goal.target_count) * 100)
      : 0;

  // 완료 상태 체크
  const isAmountComplete = goal.target_amount
    ? goal.current_amount >= goal.target_amount
    : true;
  const isCountComplete = goal.target_count
    ? goal.current_count >= goal.target_count
    : true;

  // 전체 진행률 계산 (OR 조건 - 하나만 완료해도 성공)
  let overallProgress = 0;
  let isComplete = false;

  if (goal.challenge_mode === "amount") {
    overallProgress = amountProgress;
    isComplete = isAmountComplete;
  } else if (goal.challenge_mode === "count") {
    overallProgress = countProgress;
    isComplete = isCountComplete;
  } else {
    // 'both' - OR 조건
    overallProgress = Math.max(amountProgress, countProgress);
    isComplete = isAmountComplete || isCountComplete;
  }

  // 진행 상태 텍스트
  let progressText = "";
  if (isComplete) {
    progressText = "목표 달성! 🎉";
  } else if (daysLeft === 0 && targetDate) {
    progressText = "기한 만료";
  } else if (daysLeft > 0) {
    progressText = `${daysLeft}일 남음`;
  } else {
    progressText = "진행 중";
  }

  return {
    amountProgress,
    countProgress,
    overallProgress,
    isAmountComplete,
    isCountComplete,
    isComplete,
    daysLeft,
    progressText,
  };
};
