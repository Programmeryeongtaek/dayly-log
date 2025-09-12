import { PostsFilters, QuestionWithKeywords, ReflectionWithKeywords } from '@/types/my';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type PostItem = (ReflectionWithKeywords | QuestionWithKeywords) & {
  type: 'reflection' | 'question';
};

export const useMyPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostsFilters>({
    tab: 'all',
    search: '',
    sort: 'latest',
  });
  const [allPosts, setAllPosts] = useState<PostItem[]>([]);

  const fetchPosts = useCallback(async (loadMore = false) => {
    try {
      setLoading(true);
      
      // Mock 데이터 생성
      const mockReflections: (ReflectionWithKeywords & { type: 'reflection' })[] = [
        {
          id: '1',
          type: 'reflection',
          user_id: 'user1',
          category_id: 'cat1',
          title: '오늘의 깨달음',
          content: '실패는 성공의 어머니라는 말이 오늘 정말 와닿았다. 프로젝트에서 실수를 했지만, 그 과정에서 많은 것을 배울 수 있었다.',
          date: '2024-12-18',
          is_public: true,
          is_neighbor_visible: true,
          created_at: '2024-12-18T14:30:00Z',
          updated_at: '2024-12-18T14:30:00Z',
          category: {
            id: 'cat1',
            name: 'reflection',
            display_name: '일반 회고',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [
            { 
              id: '1', 
              user_id: 'user1', 
              category_id: 'cat1', 
              name: '성장', 
              color: '#4ecdc4', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
            { 
              id: '2', 
              user_id: 'user1', 
              category_id: 'cat1', 
              name: '깨달음', 
              color: '#45b7d1', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
          ],
        },
        {
          id: '2',
          type: 'reflection',
          user_id: 'user1',
          category_id: 'cat2',
          content: '감사한 마음으로 하루를 마무리한다. 작은 일상의 소중함을 다시 한번 느꼈다.',
          date: '2024-12-17',
          is_public: false,
          is_neighbor_visible: true,
          created_at: '2024-12-17T20:15:00Z',
          updated_at: '2024-12-17T20:15:00Z',
          category: {
            id: 'cat2',
            name: 'gratitude',
            display_name: '감사 회고',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [
            { 
              id: '3', 
              user_id: 'user1', 
              category_id: 'cat2', 
              name: '감사', 
              color: '#ffa726', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
          ],
        },
      ];

      const mockQuestions: (QuestionWithKeywords & { type: 'question' })[] = [
        {
          id: '1',
          type: 'question',
          user_id: 'user1',
          category_id: 'qcat1',
          title: '오늘 가장 의미있었던 순간은?',
          content: '하루를 돌아보며 가장 기억에 남는 순간을 찾아보세요.',
          answer: '친구와 나눈 진솔한 대화가 가장 의미있었다.',
          date: '2024-12-16',
          is_public: true,
          is_neighbor_visible: true,
          is_answered: true,
          created_at: '2024-12-16T09:30:00Z',
          updated_at: '2024-12-16T18:45:00Z',
          category: {
            id: 'qcat1',
            name: 'daily',
            display_name: '일상 질문',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [
            { 
              id: '4', 
              user_id: 'user1', 
              category_id: 'qcat1', 
              name: '일상', 
              color: '#ff6b6b', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
            { 
              id: '5', 
              user_id: 'user1', 
              category_id: 'qcat1', 
              name: '소통', 
              color: '#4ecdc4', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
          ],
        },
        {
          id: '2',
          type: 'question',
          user_id: 'user1',
          category_id: 'qcat2',
          title: '내가 가장 소중히 여기는 가치는?',
          content: '나만의 핵심 가치관에 대해 깊이 생각해보는 시간을 가져보세요.',
          date: '2024-12-15',
          is_public: true,
          is_neighbor_visible: true,
          is_answered: false,
          created_at: '2024-12-15T16:20:00Z',
          updated_at: '2024-12-15T16:20:00Z',
          category: {
            id: 'qcat2',
            name: 'growth',
            display_name: '성장 질문',
            created_at: '2024-01-01T00:00:00Z',
          },
          keywords: [
            { 
              id: '6', 
              user_id: 'user1', 
              category_id: 'qcat2', 
              name: '가치관', 
              color: '#9c88ff', 
              created_at: '2024-01-01T00:00:00Z', 
              updated_at: '2024-01-01T00:00:00Z' 
            },
          ],
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 500));

      // 전체 데이터 결합
      const allPostsData: PostItem[] = [...mockReflections, ...mockQuestions];

      // 전체 데이터 저장 (처음 로드시)
      if (!loadMore) {
        setAllPosts(allPostsData);
      }

      // 탭 필터링
      let filteredPosts = allPosts;
      if (filters.tab === 'reflections') {
        filteredPosts = allPosts.filter(post => post.type === 'reflection');
      } else if (filters.tab === 'questions') {
        filteredPosts = allPosts.filter(post => post.type === 'question');
      }

      // 검색 필터링
      if (filters.search) {
        filteredPosts = filteredPosts.filter(post => 
          post.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.content?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // 정렬
      filteredPosts.sort((a, b) => {
        if (filters.sort === 'latest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });

      if (loadMore) {
        setPosts(prev => [...prev, ...filteredPosts]);
      } else {
        setPosts(filteredPosts);
      }
      
      setHasMore(false); // Mock에서는 더 보기 없음
      setError(null);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const totalCounts = {
    all: allPosts.length,
    reflections: allPosts.filter(post => post.type === 'reflection').length,
    questions: allPosts.filter(post => post.type === 'question').length,
  };

  const updateFilters = useCallback((newFilters: Partial<PostsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(true);
    }
  }, [loading, hasMore, fetchPosts]);

  const editPost = useCallback((type: 'reflection' | 'question', id: string) => {
    router.push(`/${type === 'reflection' ? 'reflections' : 'questions'}/${id}/edit`);
  }, [router]);

  const deletePost = useCallback(async (type: 'reflection' | 'question', id: string) => {
    try {
      setLoading(true);
      console.log(`Deleting ${type}:`, id);
      
      // Mock 삭제 로직
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prev => prev.filter(post => !(post.type === type && post.id === id)));
    } catch (err) {
      setError('게시글 삭제에 실패했습니다.');
      console.error('Failed to delete post:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    filters,
    loading,
    hasMore,
    error,
    totalCounts,
    actions: {
      updateFilters,
      loadMore,
      editPost,
      deletePost,
      refresh,
    },
  };
};