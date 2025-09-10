import { supabase } from "@/lib/supabase";
import { Goal } from "@/types/goals";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";

interface GoalWithCurrentData extends Goal {
  currentMonthAmount: number;
  currentMonthCount: number;
  hasDataMismatch: boolean;
}

export const useGoalChecker = (userId?: string, categoryName?: string) => {
  const { data: affectedGoals = [] } = useQuery({
    queryKey: ["affected-goals", userId, categoryName],
    queryFn: async (): Promise<GoalWithCurrentData[]> => {
      if (!userId || !categoryName) return [];

      // 현재 월의 시작일과 종료일
      const now = new Date();
      const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
      // 활성화된 목표들 조회
      const { data: goals, error: goalsError } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active");

      if (goalsError) throw goalsError;
      if (!goals || goals.length === 0) return [];

      // 각 목표에 대해 현재 월 실제 데이터 계산
      const goalsWithCurrentData = await Promise.all(
        goals.map(async (goal) => {
          const tableName =
            goal.type === "increase_income" ? "incomes" : "expenses";

          // 해당 목표와 연관될 수 있는 카테고리의 현재 월 데이터 조회
          const { data: transactions } = await supabase
            .from(tableName)
            .select("amount, category:categories(name)")
            .eq("user_id", userId)
            .gte("date", monthStart)
            .lte("date", monthEnd);

          // 해당 카테고리 이름과 관련된 데이터 집계
          const relatedTransactions = (transactions || []).filter(
            (t) =>
              t.category &&
              "name" in t.category &&
              t.category.name === categoryName,
          );

          const currentMonthAmount = relatedTransactions.reduce(
            (sum, t) => sum + t.amount,
            0,
          );
          const currentMonthCount = relatedTransactions.length;

          // 데이터 불일치 여부 확인
          const hasDataMismatch =
            goal.current_amount !== currentMonthAmount || // 1원 이상 차이
            goal.current_count !== currentMonthCount; // 1회 이상 차이

          return {
            ...goal,
            currentMonthAmount,
            currentMonthCount,
            hasDataMismatch,
          };
        }),
      );

      // 불일치가 있는 목표들만 반환
      return goalsWithCurrentData.filter((goal) => goal.hasDataMismatch);
    },
    enabled: !!userId && !!categoryName,
  });

  return {
    affectedGoals,
    hasAffectedGoals: affectedGoals.length > 0,
  };
};
