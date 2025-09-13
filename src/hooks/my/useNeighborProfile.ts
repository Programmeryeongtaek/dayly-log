import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/my'
import { useCallback, useEffect, useState } from 'react'

interface NeighborProfileStats {
  total_posts: number;
  total_reflections: number;
  total_questions: number;
  answered_questions: number;
  neighbor_count: number;
}

interface NeighborActivity {
  type: 'reflection' | 'question';
  title: string;
  date: string;
  content_preview: string;
}

interface NeighborProfileData extends Profile {
  stats: NeighborProfileStats;
  recent_activity: NeighborActivity[];
}

interface UseNeighborProfileParams {
  neighborId: string | null;
  enabled?: boolean;
}

interface UseNeighborProfileReturn {
  profile: NeighborProfileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNeighborProfile = ({ 
  neighborId, 
  enabled = true 
}: UseNeighborProfileParams): UseNeighborProfileReturn => {
  const [profile, setProfile] = useState<NeighborProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!neighborId || !enabled) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching profile for neighborId:', neighborId);

      // 현재 사용자 ID 가져오기
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('인증이 필요합니다.');

      // 이웃 관계 확인
      const { data: neighborRelation, error: relationError } = await supabase
        .from('neighbor_relationships')
        .select('*')
        .or(`and(requester_id.eq.${user.id},recipient_id.eq.${neighborId},status.eq.accepted),and(requester_id.eq.${neighborId},recipient_id.eq.${user.id},status.eq.accepted)`)
        .single();

      if (relationError || !neighborRelation) {
        throw new Error('이웃 관계를 찾을 수 없습니다.');
      }

      // 프로필 기본 정보 조회
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, nickname, created_at, updated_at, email')
        .eq('id', neighborId)
        .single();

      if (profileError || !profileData) {
        throw new Error('프로필 정보를 불러올 수 없습니다.');
      }

      // 통계 데이터를 위한 병렬 쿼리 실행
      const [
        reflectionsStatsResult,
        questionsStatsResult,
        answeredQuestionsResult,
        neighborsCountResult
      ] = await Promise.all([
        // 회고 총 개수 (전체)
        supabase
          .from('reflections')
          .select('id', { count: 'exact' })
          .eq('user_id', neighborId),
          
        // 질문 총 개수 (전체)
        supabase
          .from('questions')
          .select('id', { count: 'exact' })
          .eq('user_id', neighborId),
          
        // 답변완료 질문 개수 (전체)
        supabase
          .from('questions')
          .select('id', { count: 'exact' })
          .eq('user_id', neighborId)
          .eq('is_answered', true),
          
        // 이웃 수
        supabase
          .from('neighbor_relationships')
          .select('id', { count: 'exact' })
          .or(`requester_id.eq.${neighborId},recipient_id.eq.${neighborId}`)
          .eq('status', 'accepted')
      ]);

      // 최근 활동을 위한 공개된 데이터만 조회 (미리보기용)
      const [recentReflectionsResult, recentQuestionsResult] = await Promise.all([
        supabase
          .from('reflections')
          .select('id, title, content, date, created_at')
          .eq('user_id', neighborId)
          .or('is_public.eq.true,is_neighbor_visible.eq.true')
          .order('date', { ascending: false })
          .limit(3),
          
        supabase
          .from('questions')
          .select('id, title, content, date, is_answered, created_at')
          .eq('user_id', neighborId)
          .or('is_public.eq.true,is_neighbor_visible.eq.true')
          .order('date', { ascending: false })
          .limit(3)
      ]);

      // 통계 계산
      const totalReflections = reflectionsStatsResult.count || 0;
      const totalQuestions = questionsStatsResult.count || 0;
      const answeredQuestions = answeredQuestionsResult.count || 0;
      const neighborCount = neighborsCountResult.count || 0;

      // 최근 활동 데이터 처리
      const reflectionsData = recentReflectionsResult.data || [];
      const questionsData = recentQuestionsResult.data || [];

      // 최근 활동 데이터 합치기 및 정렬
      const recentActivity: NeighborActivity[] = [
        ...reflectionsData.map(item => ({
          type: 'reflection' as const,
          title: item.title || '제목 없음',
          date: item.date,
          content_preview: item.content.substring(0, 100) + (item.content.length > 100 ? '...' : ''),
        })),
        ...questionsData.map(item => ({
          type: 'question' as const,
          title: item.title,
          date: item.date,
          content_preview: item.content?.substring(0, 100) + (item.content && item.content.length > 100 ? '...' : '') || '',
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const profileWithStats: NeighborProfileData = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        nickname: profileData.nickname,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
        stats: {
          total_posts: totalReflections + totalQuestions,
          total_reflections: totalReflections,
          total_questions: totalQuestions,
          answered_questions: answeredQuestions,
          neighbor_count: neighborCount,
        },
        recent_activity: recentActivity,
      };

      setProfile(profileWithStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '프로필을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch neighbor profile:', err);
    } finally {
      setLoading(false);
    }
  }, [neighborId, enabled]);

  useEffect(() => {
    if (neighborId && enabled) {
      fetchProfile();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [fetchProfile, neighborId, enabled]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};