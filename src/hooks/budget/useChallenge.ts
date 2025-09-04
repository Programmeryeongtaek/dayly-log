import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateChallengeData {
  title: string;
  description: string;
  reason: string;
  targetAmount: string; // TODO: 카테고리에 따라 필요하지 않을 수도 있음. 검토바람
  targetDate: string;
  category: string;
  userId: string;
}

export const useChallenge = () => {
  const queryClient = useQueryClient();

  const createChallengeMutation = useMutation({
    mutationFn: async (data: CreateChallengeData) => {
      const challengeData = {
        user_id: data.userId,
        title: data.title,
        description: data.description || null,
        type: 'reduce_expense', // 지출에서 생성되는 챌린지
        target_amount: Number(data.targetAmount),
        current_amount: 0,
        target_date: data.targetDate,
        status: 'active',
        created_from_date: new Date().toISOString().split('T')[0],
        // reason을 description에 포함 (현재 DB 스키마에 reason 필드가 없음)
        ...(data.reason && {
          description: data.description 
            ? `${data.reason}\n\n${data.description}` 
            : data.reason
        }),
      };

      const { data: result, error } = await supabase
        .from('goals')
        .insert([challengeData])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      // goals 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  return {
    createChallenge: createChallengeMutation.mutate,
    isCreatingChallenge: createChallengeMutation.isPending,
    createChallengeError: createChallengeMutation.error,
  };
};