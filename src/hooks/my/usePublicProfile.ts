import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

interface PublicProfile {
  id: string;
  email?: string;
  name: string;
  nickname: string;
  created_at: string;
  updated_at?: string;
  stats: {
    total_posts: number;
    total_reflections: number;
    total_questions: number;
    answered_questions: number;
    neighbor_count?: number;
  };
  recent_activity: Array<{
    type: 'reflection' | 'question';
    title: string;
    date: string;
    content_preview: string;
  }>;
}

export const usePublicProfile = (userId: string, enabled: boolean) => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicProfile = useCallback(async () => {
    if (!userId || !enabled) return;

    try {
      setLoading(true);
      setError(null);

      // 프로필 기본 정보 조회
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, nickname, created_at')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error('프로필을 찾을 수 없습니다.');

      // 병렬로 통계 데이터 조회 (공개된 게시물)
      const [
        reflectionsResult,
        questionsResult,
        answeredQuestionsResult,
        recentReflectionsResult,
        recentQuestionsResult,
      ] = await Promise.all([
        // 공개된 회고 수
        supabase
          .from('reflections')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_public', true),

        // 공개된 질문 수
        supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_public', true),

        // 공개된 답변 완료 질문 수
        supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_public', true)
          .eq('is_answered', true),

        // 최근 공개 회고 (최대 3개)
        supabase
          .from('reflections')
          .select('title, content, date')
          .eq('user_id', userId)
          .eq('is_public', true)
          .order('date', { ascending: false })
          .limit(3),

        // 최근 공개 질문 (최대 3개)
        supabase
          .from('questions')
          .select('title, content, date')
          .eq('user_id', userId)
          .eq('is_public', true)
          .order('date', { ascending: false })
          .limit(3),
      ]);

      // 에러 체크
      if (reflectionsResult.error) throw reflectionsResult.error;
      if (questionsResult.error) throw questionsResult.error;
      if (answeredQuestionsResult.error) throw answeredQuestionsResult.error;

      const totalReflections = reflectionsResult.count || 0;
      const totalQuestions = questionsResult.count || 0;
      const answeredQuestions = answeredQuestionsResult.count || 0;

      // 최근 활동 통합 (회고 + 질문)
      const recentActivity = [
        ...(recentReflectionsResult.data || []).map(item => ({
          type: 'reflection' as const,
          title: item.title || '제목 없음',
          date: item.date,
          content_preview: item.content?.substring(0, 100) + (item.content && item.content.length > 100 ? '...' : '') || '',
        })),
        ...(recentQuestionsResult.data || []).map(item => ({
          type: 'question' as const,
          title: item.title,
          date: item.date,
          content_preview: item.content?.substring(0, 100) + (item.content && item.content.length > 100 ? '...' : '') || '',
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const publicProfile: PublicProfile = {
        id: profileData.id,
        name: profileData.name,
        nickname: profileData.nickname,
        created_at: profileData.created_at,
        stats: {
          total_posts: totalReflections + totalQuestions,
          total_reflections: totalReflections,
          total_questions: totalQuestions,
          answered_questions: answeredQuestions,
        },
        recent_activity: recentActivity,
      };

      setProfile(publicProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로필을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch public profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, enabled]);

  useEffect(() => {
    if (userId && enabled) {
      fetchPublicProfile();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [fetchPublicProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchPublicProfile,
  };
};