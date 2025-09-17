import { Goal } from '@/types/goals';
import { useMemo } from 'react';

const useGoalStatistics = (goals: Goal[]) => {
  return useMemo(() => {
    const total = goals.length;
    const active = goals.filter((goal) => goal.status === 'active');
    const completed = goals.filter((goal) => goal.status === 'completed');

    // 곧 마감되는 목표들 (7일 이내)
    const soonDue = active.filter((goal) => {
      if (!goal.target_date) return false;
      const daysLeft = Math.ceil(
        (new Date(goal.target_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysLeft <= 7 && daysLeft > 0;
    });

    // 완료율 계산
    const completionRate =
      total > 0 ? Math.round((completed.length / total) * 100) : 0;

    return {
      total,
      active: active.length,
      completed: completed.length,
      soonDue: soonDue.length,
      completionRate,
    };
  }, [goals]);
};

export default useGoalStatistics;