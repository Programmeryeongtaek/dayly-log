import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query'
import { useGoalCompletionAlert } from './useFoalCompletionAlert';

export const useGoalStatusUpdater = () => {
  const queryClient = useQueryClient();
  const { showCompletionAlert } = useGoalCompletionAlert();

  const checkAndUpdateGoalStatus = async (goalId: string, userId: string) => {
    try {
      // 목표 정보 조회
      const { data: goal, error: goalError } = await supabase
        .from('goals')
        .select('*')
        .eq('id', goalId)
        .eq('user_id', userId)
        .single();

      if (goalError || !goal) {
        console.error('목표 조회 실패:', goalError);
        return;
      }

      // 이미 완료된 목표는 건너뛰기
      if (goal.status === 'completed') return;

      // 현재 월의 실제 데이터 조회
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const tableName = goal.type === 'increase_income' ? 'incomes' : 'expenses';

      const { data: transactions } = await supabase
        .from(tableName)
        .select('amount')
        .eq('user_id', userId)
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (!transactions) return;

      // 실제 달성 현황 계산
      const actualAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      const actualCount = transactions.length;

      // 목표 달성 여부 확인
      let isCompleted = false;

      if (goal.challenge_mode === 'amount') {
        isCompleted = goal.target_amount ? actualAmount >= goal.target_amount : false;
      } else if (goal.challenge_mode === 'count') {
        isCompleted = goal.target_count ? actualCount >= goal.target_count : false;
      } else { // 'both' - OR 조건
        const amountComplete = goal.target_amount ? actualAmount >= goal.target_amount : true;
        const countComplete = goal.target_count ? actualCount >= goal.target_count : true;
        isCompleted = amountComplete || countComplete;
      }

      // 목표 달성 시 상태 업데이트
      if (isCompleted) {
        const { error: updateError } = await supabase
          .from('goals')
          .update({
            status: 'completed',
            current_amount: actualAmount,
            current_count: actualCount,
          })
          .eq('id', goalId);

        if (updateError) {
          console.error('목표 상태 업데이트 실패:', updateError);
        } else {
          // 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ['goals'] });

          // 완료 알림 표시
          showCompletionAlert({
            id: goal.id,
            title: goal.totle,
          });
        }
      } else {
        // 완료되지 않았지만 current 값은 업데이트
        const { error: updateError } = await supabase
          .from('goals')
          .update({
            current_amount: actualAmount,
            current_count: actualCount,
          })
          .eq('id', goalId);

        if (updateError) {
          console.error('목표 진행률 업데이트 실패:', updateError);
        }
      }

    } catch (error) {
      console.error('목표 상태 확인 중 오류:', error);
    }
  };

  // 여러 목표를 배치로 확인
  const checkMultipleGoals = async (goalIds: string[], userId: string) => {
    await Promise.allSettled(
      goalIds.map(goalId => checkAndUpdateGoalStatus(goalId, userId))
    );
  };

  // 특정 카테고리와 관련된 모든 목표 확인
  const checkGoalsByCategory = async (userId: string, categoryName: string, type: 'income' | 'expense') => {
    try {
      const goalType = type === 'income' ? 'increase_income' : 'reduce_expense';

      const { data: goals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', userId)
        .eq('type', goalType)
        .eq('status', 'active')

      if (goals && goals.length > 0) {
        const goalIds = goals.map(g => g.id);
        await checkMultipleGoals(goalIds, userId);
      }
    } catch (error) {
      console.error('카테고리별 목표 확인 실패:', error);
    }
  };

  return {
    checkAndUpdateGoalStatus,
    checkMultipleGoals,
    checkGoalsByCategory,
  };
};