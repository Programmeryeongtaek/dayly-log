import { QuestionWithKeywords, ReflectionWithKeywords } from '@/types/my/database'
import { PostsFilters } from '@/types/my/ui';
import { useCallback, useEffect, useState } from 'react'

export const useMyPosts = () => {
  const [reflections, setReflections] = useState<ReflectionWithKeywords[]>([]);
  const [questions, setQuestions] = useState<QuestionWithKeywords[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostsFilters>({
    tab: 'all',
    search: '',
    sort: 'latest',
  });

  const fetchPosts = useCallback(async (loadMore = false) => {
    try {
      setLoading(true);

      const mockReflections: ReflectionWithKeywords[] = [
        {
          is: '1',
          user_id: 'user1',
          category_id: 'cat1',
          title: '오늘의 감사',
          content: '가족과 함께한 저녁 시간이 너무 소중했다. 바쁜 일상 속에서도 이런 시간을 가질 수 있어서 정말 감사하다.',
          date: '2024-12-19',
          is_public: true,
          is_neighbor_visible: true,
          created_at: '2024-12-19T14:30:00Z',
          updated_at: '2024-12-19T14:30:00Z',
          category: {
            id: 'cat1',
            name: 'gratitude',
            display_name: '감사',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [
            { 
              is: '1',
              user_id: 'user1', 
              category_id: 'cat1', 
              name: '가족', 
              color: '#ff6b6b', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
            { 
              is: '2',
              user_id: 'user1', 
              category_id: 'cat1', 
              name: '감사', 
              color: '#4ecdc4', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
          ],
        },
        {
          is: '2',
          user_id: 'user1',
          category_id: 'cat2',
          content: '오늘 실수했던 일들을 돌아보며 어떻게 개선할 수 있을지 생각해봤다. 완벽하지 않아도 괜찮다는 것을 배웠다.',
          date: '2024-12-18',
          is_public: false,
          is_neighbor_visible: false,
          created_at: '2024-12-18T20:00:00Z',
          updated_at: '2024-12-18T20:00:00Z',
          category: {
            id: 'cat2',
            name: 'reflection',
            display_name: '성찰',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [
            { 
              is: '3',
              user_id: 'user1', 
              category_id: 'cat2', 
              name: '성찰', 
              color: '#45b7d1', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
          ],
        },
      ];

      const mockQuestions: QuestionWithKeywords[] = [
        {
          id: '1',
          user_id: 'user1',
          category_id: 'qcat1',
          title: '오늘 배운 것은?',
          content: '새로운 것을 배웠나요?',
          answer: 'React의 성능 최적화에 대해 배웠다. useMemo와 useCallback의 차이점을 제대로 이해했다.',
          date: '2024-12-19',
          is_public: true,
          is_neighbor_visible: false,
          is_answered: true,
          created_at: '2024-12-19T10:00:00Z',
          updated_at: '2024-12-19T15:00:00Z',
          category: {
            id: 'qcat1',
            name: 'growth',
            display_name: '성장',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [
            { 
              id: '3', 
              user_id: 'user1', 
              category_id: 'qcat1', 
              name: '학습', 
              color: '#4ecdc4', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
            { 
              id: '4', 
              user_id: 'user1', 
              category_id: 'qcat1', 
              name: 'React', 
              color: '#61dafb', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
          ],
        },
        {
          id: '2',
          user_id: 'user1',
          category_id: 'qcat2',
          title: '오늘의 기분은?',
          content: '하루를 마치며 어떤 기분인가요?',
          date: '2024-12-18',
          is_public: true,
          is_neighbor_visible: true,
          is_answered: false,
          created_at: '2024-12-18T18:00:00Z',
          updated_at: '2024-12-18T18:00:00Z',
          category: {
            id: 'qcat2',
            name: 'daily',
            display_name: '일상',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [],
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 500));

      if (loadMore) {
        setReflections(prev => [...prev, ...mockReflections]);
        setQuestions(prev => [...prev, ...mockQuestions]);
      } else {
        setReflections(mockReflections);
        setQuestions(mockQuestions);
      }

      setHasMore(false);
      setError(null);
    } catch (err) {
      setError('게시글을 불러오는데 실패헀습니다.');
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<PostsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(true);
    }
  }, [loading, hasMore, fetchPosts]);

  const deletePost = useCallback(async (type: 'reflection' | 'question', id: string) => {
    try {
      console.log(`Deleting ${type} post:`, id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (type === 'reflection') {
        setReflections(prev => prev.filter(item => item.is !== id));
      } else {
        setQuestions(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      setError('게시글 삭제에 실패했습니다.');
      console.error('Failed to delete post:', err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts: { reflections, questions },
    filters,
    loading,
    hasMore,
    error,
    actions: {
      updateFilters,
      loadMore,
      refresh: () => fetchPosts(),
      deletePost,
    },
  };
};