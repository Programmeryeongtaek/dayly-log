import { supabase } from '@/lib/supabase';
import { QuestionKeyword, QuestionKeywordFormData } from '@/types/questions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UseQuestionKeywordsProps {
  userId?: string;
  categoryId?: string;
}

export const useQuestionKeywords = ({ userId, categoryId }: UseQuestionKeywordsProps = {}) => {
  const queryClient = useQueryClient();

  // 키워드 목록 조회
  const { data: keywords = [], isLoading, error } = useQuery({
    queryKey: ['question-keywords', userId, categoryId],
    queryFn: async (): Promise<QuestionKeyword[]> => {
      let query = supabase
        .from('question_keywords')
        .select('*')
        .order('name');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // 키워드 생성
  const createKeywordMutation = useMutation({
    mutationFn: async (formData: QuestionKeywordFormData & { user_id: string }) => {
      const { data, error } = await supabase
        .from('question_keywords')
        .insert([{
          ...formData,
          color: formData.color || '#3b82f6',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-keywords'] });
    },
  });

  // 키워드 수정
  const updateKeywordMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<QuestionKeywordFormData>) => {
      const { data, error } = await supabase
        .from('question_keywords')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-keywords'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  // 키워드 삭제
  const deleteKeywordMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('question_keywords')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-keywords'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  return {
    keywords,
    isLoading,
    error,
    createKeyword: createKeywordMutation.mutate,
    isCreatingKeyword: createKeywordMutation.isPending,
    updateKeyword: updateKeywordMutation.mutate,
    isUpdatingKeyword: updateKeywordMutation.isPending,
    deleteKeyword: deleteKeywordMutation.mutate,
    isDeletingKeyword: deleteKeywordMutation.isPending,
  };
};