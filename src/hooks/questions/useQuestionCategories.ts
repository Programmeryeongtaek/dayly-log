import { supabase } from '@/lib/supabase'
import { QuestionCategory } from '@/types/questions'
import { useQuery } from '@tanstack/react-query'

export const useQuestionsCategories = () => {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['question-categories'],
    queryFn: async (): Promise<QuestionCategory[]> => {
      const { data, error } = await supabase
        .from('question_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });

  return {
    categories,
    isLoading,
    error,
    dailyCategory: categories.find(c => c.name === 'daily'),
    growthCategory: categories.find(c => c.name === 'growth'),
    customCategory: categories.find(c => c.name === 'custom'),
  };
};

