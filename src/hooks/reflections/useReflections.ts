import { supabase } from '@/lib/supabase';
import { Keyword, Reflection, ReflectionFilters, ReflectionFormData, ReflectionWithKeywords } from '@/types/reflections';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseReflectionsProps {
  userId?: string;
  filters?: ReflectionFilters;
}

interface ReflectionQueryResult extends Omit<Reflection, 'keywords'> {
  keywords?: Array<{
    keyword: Keyword;
  }>;
  category?: {
    id: string;
    name: 'gratitude' | 'reflection';
    display_name: string;
  };
}

export const useReflections = ({ userId, filters }: UseReflectionsProps = {}) => {
  const queryClient = useQueryClient();

  // 회고 목록 조회
  const { data: reflections = [], isLoading, error } = useQuery({
    queryKey: ['reflections', userId, filters],
    queryFn: async (): Promise<ReflectionWithKeywords[]> => {
      let query = supabase
        .from('reflections')
        .select(`
          *,
          category:reflection_categories(*),
          keywords:reflection_keyword_relations(
            keyword:reflection_keywords(*)
          )
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      // 사용자 필터
      if (userId) {
        query = query.eq('user_id', userId);
      }

      // 카테고리 필터
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('category.name', filters.type);
      }

      // 날짜 범위 필터
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      // 데이터 변환
      const transformedData = (data || []).map((reflection: ReflectionQueryResult) => {
        const keywords = reflection.keywords?.map(rk => rk.keyword) || [];
        
        // 가시성 계산
        const effective_visibility: 'public' | 'neighbors' | 'private' = 
          reflection.is_public && reflection.is_neighbor_visible ? 'public' :
          reflection.is_public && !reflection.is_neighbor_visible ? 'neighbors' :
          'private';

        return {
          ...reflection,
          keywords,
          effective_visibility,
          is_own: reflection.user_id === userId,
        };
      });

      // 클라이언트 사이드 필터링
      let filteredData = transformedData;

      // 키워드 필터
      if (filters?.keywords && filters.keywords.length > 0) {
        filteredData = filteredData.filter(reflection =>
          reflection.keywords?.some(keyword =>
            filters.keywords!.includes(keyword.name)
          )
        );
      }

      // 검색어 필터
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(reflection =>
          reflection.title?.toLowerCase().includes(searchLower) ||
          reflection.content.toLowerCase().includes(searchLower) ||
          reflection.keywords?.some(keyword => 
            keyword.name.toLowerCase().includes(searchLower)
          )
        );
      }

      // 가시성 필터
      if (filters?.visibility && filters.visibility !== 'all') {
        filteredData = filteredData.filter(reflection =>
          reflection.effective_visibility === filters.visibility
        );
      }

      // 작성자 필터
      if (filters?.author_id) {
        filteredData = filteredData.filter(reflection =>
          reflection.user_id === filters.author_id
        );
      }

      return filteredData;
    },
    enabled: !!userId,
  });

  // 회고 생성
  const createReflectionMutation = useMutation({
    mutationFn: async (formData: ReflectionFormData & { user_id: string }) => {
      const { keywords: keywordNames, ...reflectionData } = formData;

      // 기본값 설정
      const dataWithDefaults = {
        ...reflectionData,
        is_public: reflectionData.is_public ?? true,
        is_neighbor_visible: reflectionData.is_neighbor_visible ?? true,
      };

      // 1. 회고 생성
      const { data: reflection, error: reflectionError } = await supabase
        .from('reflections')
        .insert([dataWithDefaults])
        .select()
        .single();

      if (reflectionError) throw reflectionError;

      // 2. 키워드 처리
      if (keywordNames.length > 0) {
        await processKeywords(
          keywordNames,
          formData.user_id,
          formData.category_id,
          reflection.id
        );
      }

      return reflection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
    },
  });

  // 회고 수정
  const updateReflectionMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ReflectionFormData>) => {
      const { keywords: keywordNames, ...reflectionUpdates } = updates;

      // 1. 회고 업데이트
      const { data: reflection, error: reflectionError } = await supabase
        .from('reflections')
        .update(reflectionUpdates)
        .eq('id', id)
        .select()
        .single();

      if (reflectionError) throw reflectionError;

      // 2. 키워드가 포함된 경우 처리
      if (keywordNames) {
        // 기존 관계 삭제
        await supabase
          .from('reflection_keyword_relations')
          .delete()
          .eq('reflection_id', id);

        // 새 키워드 처리
        if (keywordNames.length > 0) {
          await processKeywords(
            keywordNames,
            reflection.user_id,
            reflection.category_id,
            id
          );
        }
      }

      return reflection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
    },
  });

  // 회고 삭제
  const deleteReflectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reflections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
    },
  });

  // 키워드 처리 헬퍼 함수
  const processKeywords = async (
    keywordNames: string[],
    userId: string,
    categoryId: string,
    reflectionId: string
  ) => {
    // 기존 키워드 조회
    const { data: existingKeywords } = await supabase
      .from('reflection_keywords')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .in('name', keywordNames);

    const existingKeywordNames = existingKeywords?.map(k => k.name) || [];
    const newKeywordNames = keywordNames.filter(name => 
      !existingKeywordNames.includes(name)
    );

    // 새 키워드 생성
    if (newKeywordNames.length > 0) {
      const newKeywords = newKeywordNames.map(name => ({
        user_id: userId,
        category_id: categoryId,
        name,
        color: '#14b8a6', // 기본 색상
      }));

      const { error: keywordError } = await supabase
        .from('reflection_keywords')
        .insert(newKeywords);

      if (keywordError) throw keywordError;
    }

    // 모든 키워드 다시 조회
    const { data: allKeywords } = await supabase
      .from('reflection_keywords')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .in('name', keywordNames);

    // 회고-키워드 관계 생성
    if (allKeywords) {
      const reflectionKeywords = allKeywords.map(keyword => ({
        reflection_id: reflectionId,
        keyword_id: keyword.id,
      }));

      const { error: relationError } = await supabase
        .from('reflection_keyword_relations')
        .insert(reflectionKeywords);

      if (relationError) throw relationError;
    }
  };

  // 통계 계산
  const statistics = useMemo(() => {
    const gratitudeCount = reflections.filter(r => r.category?.name === 'gratitude').length;
    const reflectionCount = reflections.filter(r => r.category?.name === 'reflection').length;
    
    const allKeywords = reflections.flatMap(r => r.keywords || []);
    const uniqueKeywords = Array.from(new Set(allKeywords.map(k => k.name)));

    return {
      total: reflections.length,
      gratitude: gratitudeCount,
      reflection: reflectionCount,
      uniqueKeywords: uniqueKeywords.length,
    };
  }, [reflections]);

  return {
    reflections,
    statistics,
    isLoading,
    error,
    createReflection: createReflectionMutation.mutate,
    isCreatingReflection: createReflectionMutation.isPending,
    updateReflection: updateReflectionMutation.mutate,
    isUpdatingReflection: updateReflectionMutation.isPending,
    deleteReflection: deleteReflectionMutation.mutate,
    isDeletingReflection: deleteReflectionMutation.isPending,
    createReflectionMutation
  };
};