"use client";

import { useGoalCompletionAlert } from "@/hooks/goals/useFoalCompletionAlert";
import { ReactNode } from "react";
import GoalCompletionNotification from "./GoalCompletionNotification";

interface GoalCompletionProviderProps {
  children: ReactNode;
}

const GoalCompletionProvider = ({ children }: GoalCompletionProviderProps) => {
  const { completedGoals, hideCompletionAlert } = useGoalCompletionAlert();

  return (
    <>
      {children}

      {/* 완료 알림들 렌더링 */}
      {completedGoals.map((goal) => (
        <GoalCompletionNotification
          key={goal.id}
          goalTitle={goal.title}
          onClose={() => hideCompletionAlert(goal.id)}
        />
      ))}
    </>
  );
};

export default GoalCompletionProvider;
