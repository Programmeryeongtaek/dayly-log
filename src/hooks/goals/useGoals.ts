import { supabase } from '@/lib/supabase';
import { Goal } from '@/types/goals';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseGoalsProps {
  userId?: string;
}

export const useGoals = ({ userId }: UseGoalsProps = {}) => {
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals', userId],
    queryFn: async (): Promise<Goal[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('goals')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // 목표 상태별 분류
  const { activeGoals, completedGoals } = useMemo(() => {
    const active = goals.filter(goal => goal.status === 'active');
    const completed = goals.filter(goal => goal.status === 'completed');

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
  };
};