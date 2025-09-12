import { supabase } from '@/lib/supabase';
import { MyStats } from '@/types/my';
import { useCallback, useEffect, useState } from 'react';

export const useMyPageStats = () => {
  const [stats, setStats] = useState<MyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('인증이 필요합니다.');

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoString = oneWeekAgo.toISOString().split('T')[0];

      // 병렬로 모든 통계 데이터 가져오기
      const [
        reflectionsResult,
        questionsResult,
        answeredQuestionsResult,
        neighborsResult,
        pendingRequestsResult,
        scrapsResult,
        weekReflectionsResult,
        weekQuestionsResult,
        weekScrapsResult,
        weekNeighborsResult,
      ] = await Promise.all([
        // 전체 회고 수
        supabase
          .from('reflections')
          .select('id', { count: 'exact', head: true})
          .eq('user_id', user.id),

        // 전체 질문 수
        supabase
        .from('questions')
          .select('id', { count: 'exact', head: true})
          .eq('user_id', user.id),

        // 답변된 질문 수
        supabase
          .from('questions')
          .select('id', { count: 'exact', head: true})
          .eq('user_id', user.id)
          .eq('is_answered', true),

        // 전체 이웃 수
        supabase
          .from('neighbor_relationships')
          .select('id', { count: 'exact', head: true })
          .or(`and(requester_id.eq.${user.id},status.eq.accepted),and(recipient_id.eq.${user.id},status.eq.accepted)`),
      
        // 대기 중인 요청 수
        supabase
          .from('neighbor_relationships')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('status', 'pending'),

        // 전체 스크랩 수
        supabase
          .from('scraps')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        // 이번 주 회고 수
        supabase
          .from('reflections')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('date', weekAgoString),

        // 이번 주 질문 수
        supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', weekAgoString),

        // 이번 주 스크랩 수
        supabase
          .from('scraps')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', weekAgoString),

        // 이번 주 새 이웃 수
        supabase
          .from('neighbor_relationships')
          .select('id', { count: 'exact', head: true })
          .or(`and(requester_id.eq.${user.id},status.eq.accepted),and(recipient_id.eq.${user.id},status.eq.accepted)`)
          .gte('updated_at', weekAgoString),
      ]);

      // 에러 체크
      const results = [
        reflectionsResult, questionsResult, answeredQuestionsResult, neighborsResult,
        pendingRequestsResult, scrapsResult, weekReflectionsResult, weekQuestionsResult,
        weekScrapsResult, weekNeighborsResult
      ];

      const errorResult = results.find(result => result.error);
      if (errorResult?.error) throw errorResult.error;

      const stats: MyStats = {
        total_reflections: reflectionsResult.count || 0,
        total_questions: questionsResult.count || 0,
        total_posts: (reflectionsResult.count || 0) + (questionsResult.count || 0),
        answered_questions: answeredQuestionsResult.count || 0,
        total_neighbors: neighborsResult.count || 0,
        pending_requests: pendingRequestsResult.count || 0,
        total_scraps: scrapsResult.count || 0,
        this_week_posts: (weekReflectionsResult.count || 0) + (weekQuestionsResult.count || 0),
        this_week_scraps: weekScrapsResult.count || 0,
        this_week_new_neighbors: weekNeighborsResult.count || 0,
      };

      setStats(stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '통계 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};