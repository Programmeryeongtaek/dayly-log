import { ScrapWithContent } from '@/types/my/database'
import { ScrapsFilters } from '@/types/my/ui';
import { useCallback, useEffect, useState } from 'react'

export const useMyScraps = () => {
  const [scraps, setScraps] = useState<ScrapWithContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ScrapsFilters>({
    search: '',
    sort: 'recent',
  });

  const fetchScraps = useCallback(async (loadMore = false) => {
    try {
      setLoading(true);

      const mockScraps: ScrapWithContent[] = [
        {
          id: '1',
          user_id: 'user1',
          content_type: 'reflection',
          scraped_st: '2024-12-19T14:30:00Z',
          author: {
            id: 'author1',
            name: '김지은',
            nickname: 'jieun_kim',
          },
          content: {
            id: 'reflection_1',
            title: '오늘의 깨달음',
            content: '실패는 성공의 어머니라는 말이 오늘 정말 와닿았다. 프로젝트에서 실수를 했지만, 그 과정에서 많은 것을 배울 수 있었다.',
            category: 'reflection',
            date: '2024-12-18',
            keywords: [
              { id: '1', name: '성장', color: '#4ecdc4' },
              { id: '2', name: '깨달음', color: '#45b7d1' },
            ],
          },
        },
        {
          id: '2',
          user_id: 'user1',
          content_type: 'question',
          scraped_st: '2024-12-18T10:15:00Z',
          author: {
            id: 'author2',
            name: '박민수',
            nickname: 'minsu_park',
          },
          content: {
            id: 'question_1',
            title: '오늘 가장 의미있었던 순간은?',
            content: '하루를 돌아보며 가장 기억에 남는 순간을 찾아보세요.',
            category: 'daily',
            date: '2024-12-17',
            is_answered: true,
            answer: '친구와 나눈 진솔한 대화가 가장 의미있었다. 서로의 고민을 들어주며 위로받을 수 있었던 시간이었다.',
            keywords: [
              { id: '3', name: '일상', color: '#ff6b6b' },
              { id: '4', name: '소통', color: '#ffa726' },
            ],
          },
        },
        {
          id: '3',
          user_id: 'user1',
          content_type: 'reflection',
          scraped_st: '2024-12-17T16:45:00Z',
          author: {
            id: 'author3',
            name: '이현우',
            nickname: 'hyunwoo_lee',
          },
          content: {
            id: 'reflection_2',
            content: '감사한 마음으로 하루를 마무리한다. 작은 일상의 소중함을 다시 한번 느꼈다.',
            category: 'gratitude',
            date: '2024-12-16',
            keywords: [
              { id: '5', name: '감사', color: '#ffa726' },
              { id: '6', name: '일상', color: '#ff6b6b' },
            ],
          },
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 500));

      if (loadMore) {
        setScraps(prev => [...prev, ...mockScraps]);
      } else {
        setScraps(mockScraps);
      }

      setHasMore(false);
      setError(null);
    } catch (err) {
      setError('스크랩 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch scraps:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<ScrapsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchScraps(true);
    }
  }, [loading, hasMore, fetchScraps]);

  const removeScrap = useCallback(async (scrapId: string) => {
    try {
      console.log('Removing scrap:', scrapId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setScraps(prev => prev.filter(scrap => scrap.id !== scrapId));
    } catch (err) {
      setError('스크랩 삭제에 실패했습니다.');
      console.error('Failed to remove scrap:', err);
    }
  }, []);

  const viewOriginal = useCallback((contentType: string, contentId: string) => {
    console.log(`Viewing original ${contentType}:`, contentId);
    // TODO: 원본 글로 이동하는 로직 구현
  }, []);

  useEffect(() => {
    fetchScraps();
  }, [fetchScraps]);

  return {
    scraps,
    filters,
    loading,
    hasMore,
    error,
    actions: {
      updateFilters,
      loadMore,
      removeScrap,
      viewOriginal,
      refresh: () => fetchScraps(),
    },
  };
};