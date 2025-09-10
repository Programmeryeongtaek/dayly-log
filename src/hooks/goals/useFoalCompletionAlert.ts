import { useCallback, useState } from "react";

interface CompletedGoal {
  id: string;
  title: string;
}

export const useGoalCompletionAlert = () => {
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>([]);

  const showCompletionAlert = useCallback((goal: CompletedGoal) => {
    setCompletedGoals((prev) => {
      // 중복 방지
      const exists = prev.some((g) => g.id === goal.id);
      if (exists) return prev;

      return [...prev, goal];
    });
  }, []);

  const hideCompletionAlert = useCallback((goalId: string) => {
    setCompletedGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  return {
    completedGoals,
    showCompletionAlert,
    hideCompletionAlert,
  };
};
