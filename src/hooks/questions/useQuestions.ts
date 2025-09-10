import { supabase } from '@/lib/supabase';
import { Question, QuestionFilters, QuestionFormData, QuestionKeyword, QuestionWithKeywords } from '@/types/questions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseQuestionsProps {
  userId?: string;
  filters?: QuestionFilters;
}

interface QuestionQueryResult extends Omit<Question, 'keywords'> {
  keywords?: Array<{
    keyword: QuestionKeyword;
  }>;
  category?: {
    id: string;
    name: 'daily' | 'growth' | 'custom';
    display_name: string;
  };
}

export const useQuestions = ({ userId, filters }: UseQuestionsProps = {}) => {
  const queryClient = useQueryClient();

  // 질문 목록 조회
  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['questions', userId, filters],
    queryFn: async (): Promise<QuestionWithKeywords[]> => {
      let query = supabase
        .from('questions')
        .select(`
          *,
          category:question_categories(*),
          keywords:question_keyword_relations(
            keyword:question_keywords(*)
          )
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      // 사용자 필터
      if (userId) {
        query = query.eq('user_id', userId);
      }

      // 카테고리 필터
      if (filters?.categories && filters.categories.length > 0) {
        query = query.in('category.name', filters.categories);
      }

      // 답변 상태 필터
      if (filters?.isAnswered !== undefined) {
        query = query.eq('is_answered', filters.isAnswered);
      }

      // 공개 설정 필터
      if (filters?.visibility && filters.visibility.length > 0) {
        const visibilityConditions = filters.visibility.map(v => {
          switch (v) {
            case 'public':
              return 'is_public.eq.true,is_neighbor_visible.eq.true';
            case 'neighbors':
              return 'is_public.eq.true,is_neighbor_visible.eq.false';
            case 'private':
              return 'is_public.eq.false';
            default:
              return '';
          }
        }).filter(Boolean);

        if (visibilityConditions.length > 0) {
          query = query.or(visibilityConditions.join(','));
        }
      }

      // 날짜 범위 필터
      if (filters?.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('date', filters.dateTo);
      }

      // 검색 쿼리 필터
      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%,answer.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // 데이터 변환
      const transformedData = (data || []).map((question: QuestionQueryResult): QuestionWithKeywords => {
      const keywords = question.keywords?.map(qk => qk.keyword) || [];

      // 가시성 계산
      const effective_visibility: 'public' | 'neighbors' | 'private' = 
        question.is_public && question.is_neighbor_visible ? 'public' :
        question.is_public && !question.is_neighbor_visible ? 'neighbors' : 'private';

      return {
        ...question,
        keywords,
        category: question.category || {
          id: '',
          name: 'custom',
          display_name: '알 수 없음'
        },
        effective_visibility,
        is_own: question.user_id === userId,
      } as QuestionWithKeywords;
    });

      return transformedData;
    },
    enabled: !!userId,
  });

  // 질문 생성
  const createQuestionMutation = useMutation({
    mutationFn: async (formData: QuestionFormData & { user_id: string }) => {
      const { keywords: keywordNames, ...questionData } = formData;

      // 기본값 설정
      const dataWithDefaults = {
        ...questionData,
        is_public: questionData.is_public ?? true,
        is_neighbor_visible: questionData.is_neighbor_visible ?? true,
        is_answered: questionData.is_answered ?? false,
      };

      // 1. 질문 생성
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert([dataWithDefaults])
        .select()
        .single();

      if (questionError) throw questionError;

      // 2. 키워드 처리
      if (keywordNames.length > 0) {
        await processKeywords(
          keywordNames,
          formData.user_id,
          formData.category_id,
          question.id
        );
      }

      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question-keywords'] });
    },
  });

  // 질문 수정
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<QuestionFormData>) => {
      const { keywords: keywordNames, ...questionUpdates } = updates;

      // 1. 질문 업데이트
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .update(questionUpdates)
        .eq('id', id)
        .select()
        .single();

      if (questionError) throw questionError;

      // 2. 키워드가 포함된 경우 처리
      if (keywordNames) {
        // 기존 관계 삭제
        await supabase
          .from('question_keyword_relations')
          .delete()
          .eq('question_id', id);

        // 새 키워드 처리
        if (keywordNames.length > 0) {
          await processKeywords(
            keywordNames,
            question.user_id,
            question.category_id,
            id
          );
        }
      }

      return question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question-keywords'] });
    },
  });

  // 질문 삭제
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question-keywords'] });
    },
  });

  // 답변 업데이트 (별도 함수로 분리)
  const updateAnswerMutation = useMutation({
    mutationFn: async ({ id, answer }: { id: string; answer: string }) => {
      const { data, error } = await supabase
        .from('questions')
        .update({ 
          answer,
          is_answered: answer.trim().length > 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  // 키워드 처리 헬퍼 함수
  const processKeywords = async (
    keywordNames: string[],
    userId: string,
    categoryId: string,
    questionId: string
  ) => {
    // 기존 키워드 조회
    const { data: existingKeywords } = await supabase
      .from('question_keywords')
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
        color: '#3b82f6', // 기본 색상
      }));

      const { error: keywordError } = await supabase
        .from('question_keywords')
        .insert(newKeywords);

      if (keywordError) throw keywordError;
    }

    // 모든 키워드 다시 조회
    const { data: allKeywords } = await supabase
      .from('question_keywords')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .in('name', keywordNames);

    // 질문-키워드 관계 생성
    if (allKeywords) {
      const questionKeywords = allKeywords.map(keyword => ({
        question_id: questionId,
        keyword_id: keyword.id,
      }));

      const { error: relationError } = await supabase
        .from('question_keyword_relations')
        .insert(questionKeywords);

      if (relationError) throw relationError;
    }
  };

  // 통계 계산
  const statistics = useMemo(() => {
    const dailyCount = questions.filter(q => q.category?.name === 'daily').length;
    const growthCount = questions.filter(q => q.category?.name === 'growth').length;
    const customCount = questions.filter(q => q.category?.name === 'custom').length;
    const answeredCount = questions.filter(q => q.is_answered).length;
    const unansweredCount = questions.filter(q => !q.is_answered).length;
    
    const allKeywords = questions.flatMap(q => q.keywords || []);
    const uniqueKeywords = Array.from(new Set(allKeywords.map(k => k.name)));

    return {
      total: questions.length,
      daily: dailyCount,
      growth: growthCount,
      custom: customCount,
      answered: answeredCount,
      unanswered: unansweredCount,
      uniqueKeywords: uniqueKeywords.length,
      answerRate: questions.length > 0 ? (answeredCount / questions.length) * 100 : 0,
    };
  }, [questions]);

  return {
    questions,
    statistics,
    isLoading,
    error,
    createQuestion: createQuestionMutation.mutate,
    isCreatingQuestion: createQuestionMutation.isPending,
    updateQuestion: updateQuestionMutation.mutate,
    isUpdatingQuestion: updateQuestionMutation.isPending,
    deleteQuestion: deleteQuestionMutation.mutate,
    isDeletingQuestion: deleteQuestionMutation.isPending,
    updateAnswer: updateAnswerMutation.mutate,
    isUpdatingAnswer: updateAnswerMutation.isPending,
    createQuestionMutation,
    updateQuestionMutation,
  };
};