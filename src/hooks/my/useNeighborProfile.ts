import { supabase } from '@/lib/supabase';
import { DomainStats, DomainType, NeighborProfileData } from '@/types/my'
import { useCallback, useMemo, useState } from 'react'
export const useNeighborProfile = (neighborId: string) => {
  const [data, setData] = useState<NeighborProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainType>('gratitude');

  const fetchNeighborProfile = useCallback(async () => {
    if (!neighborId) return;

    setLoading(true);
    setError(null);

    try {
      // 프로필 정보 가져오기
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, nickname, created_at')
        .eq('id', neighborId)
        .single();

      if (profileError) throw profileError;

      // 이웃 관계 확인
      const { data: relation, error: relationError } = await supabase
        .from('neighbor_relationships')
        .select('*')
        .or(
          `and(requester_id.eq.${supabase.auth.getUser().then(u => u.data.user?.id)},recipient_id.eq.${neighborId}),and(requester_id.eq.${neighborId},recipient_id.eq.${supabase.auth.getUser().then(u => u.data.user?.id)})`
        )
        .eq('status', 'accepted')
        .maybeSingle();

      if (relationError) throw relationError;
      if (!relation) throw new Error('이웃 관계가 없습니다.');

      // 회고 데이터 가져오기 (공개된 것만)
      const { data: reflections, error: reflectionsError } = await supabase
        .from('reflections_with_keywords')
        .select('*')
        .eq('user_id', neighborId)
        .eq('is_public', true)
        .eq('is_neighbor_visible', true)
        .order('date', { ascending: false });

      if (reflectionsError) throw reflectionsError;

      // 질문 데이터 가져오기 (공개된 것만)
      const { data: questions, error: questionsError } = await supabase
        .from('questions_with_keywords')
        .select('*')
        .eq('user_id', neighborId)
        .eq('is_public', true)
        .eq('is_neighbor_visible', true)
        .order('date', { ascending: false });

      if (questionsError) throw questionsError;

      // 각 도메인별로 공개 설정 확인
      const { data: reflectionVisibility } = await supabase
        .from('neighbor_visibility_settings')
        .select('category_id, is_visible_to_neighbors')
        .eq('user_id', neighborId)
        .eq('is_visible_to_neighbors', true);

      const { data: questionVisibility } = await supabase
        .from('question_neighbor_visibility_settings')
        .select('category_id, is_visible_to_neighbors')
        .eq('user_id', neighborId)
        .eq('is_visible_to_neighbors', true);

      const visibleReflectionCategories = new Set(
        reflectionVisibility?.map(v => v.category_id) || []
      );
      const visibleQuestionCategories = new Set(
        questionVisibility?.map(v => v.category_id) || []
      );

      // 필터링된 데이터 정리
      const filteredReflections = (reflections || [])
        .filter(r => visibleReflectionCategories.has(r.category_id))
        .map(r => ({
          ...r,
          keywords: r.keywords || []
        }));

      const filteredQuestions = (questions || [])
        .filter(q => visibleQuestionCategories.has(q.category_id))
        .map(q => ({
          ...q,
          keywords: q.keywords || []
        }));

    // 도메인별 통계 계산
    const domainStats: DomainStats = {
        gratitude: filteredReflections.filter(r => r.category_name === 'gratitude').length,
        reflection: filteredReflections.filter(r => r.category_name === 'reflection').length,
        daily: filteredQuestions.filter(q => q.category_name === 'daily').length,
        growth: filteredQuestions.filter(q => q.category_name === 'growth').length,
        custom: filteredQuestions.filter(q => q.category_name === 'custom').length,
      };

      // 도메인별 게시글 분류
      const posts = {
        gratitude: filteredReflections.filter(r => r.category_name === 'gratitude'),
        reflection: filteredReflections.filter(r => r.category_name === 'reflection'),
        daily: filteredQuestions.filter(q => q.category_name === 'daily'),
        growth: filteredQuestions.filter(q => q.category_name === 'growth'),
        custom: filteredQuestions.filter(q => q.category_name === 'custom'),
      };

      setData({
        profile: {
          id: profile.id,
          name: profile.name,
          nickname: profile.nickname,
          accepted_at: relation.created_at,
          mutual_friends_count: 0, // 실제로는 상호 이웃 수 계산
          last_active: profile.created_at,
        },
        domainStats,
        posts,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [neighborId, supabase]);

  const currentPosts = useMemo(() => {
    return data?.posts[activeDomain] || [];
  }, [data, activeDomain]);

  const totalPosts = useMemo(() => {
    if (!data) return 0;
    return Object.values(data.domainStats).reduce((sum, count) => sum + count, 0);
  }, [data]);

  return {
    data,
    loading,
    error,
    activeDomain,
    currentPosts,
    totalPosts,
    setActiveDomain,
    fetchNeighborProfile
  }
}