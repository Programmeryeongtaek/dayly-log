import { MyStats } from '@/types/my';
import { useCallback, useEffect, useState } from 'react';

export const useMyPageStats = () => {
  const [stats, setStats] = useState<MyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 호출로 대체
      const mockStats: MyStats = {
        total_posts: 24,
        total_reflections: 15,
        total_questions: 9,
        answered_questions: 7,
        total_neighbors: 12,
        pending_requests: 2,
        total_scraps: 8,
        this_week_posts: 3,
        this_week_scraps: 2,
        this_week_new_neighbors: 1,
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(mockStats);
      setError(null);
    } catch (err) {
      setError('통계 데이터를 불러오는데 실패했습니다.');
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