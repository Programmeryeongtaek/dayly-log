'use client';

import { supabase } from '@/lib/supabase';
import { ReflectionCategory } from '@/types/reflections';
import { useQuery } from '@tanstack/react-query';

export const useReflectionCategories = () => {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['reflection-categories'],
    queryFn: async (): Promise<ReflectionCategory[]> => {
      const { data, error } = await supabase
        .from('reflection_categories')
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
    gratitudeCategory: categories.find(c => c.name === 'gratitude'),
    reflectionCategory: categories.find(c => c.name === 'reflection'),
  };
};