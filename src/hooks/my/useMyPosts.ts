import { supabase } from '@/lib/supabase';
import { PostsFilters, QuestionWithKeywords, ReflectionWithKeywords } from '@/types/my';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type PostItem = (ReflectionWithKeywords | QuestionWithKeywords) & {
  type: 'reflection' | 'question';
};

export const useMyPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [allPosts, setAllPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<PostsFilters>({
    tab: 'all',
    search: '',
    sort: 'latest',
  });

  const ITEMS_PER_PAGE = 20;

  const fetchPosts = useCallback(async (loadMore = false) => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('인증이 필요합니다.');

      const offset = loadMore ? (currentPage + 1) * ITEMS_PER_PAGE : 0;
      const limit = ITEMS_PER_PAGE;

      // 회고 데이터 가져오기
      const { data: reflectionsData, error: reflectionsError } = await supabase
        .from('reflections_with_keywords')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: filters.sort === 'oldest' })
        .range(offset, offset + limit - 1);

      if (reflectionsError) throw reflectionsError;

      // 질문 데이터 가져오기
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions_with_keywords')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: filters.sort === 'oldest' })
        .range(offset, offset + limit - 1);

      if (questionsError) throw questionsError;

      // 데이터 변환
      const reflections = (reflectionsData || []).map(r => ({...r, type: 'reflection' as const }));
      const questions = (questionsData || []).map(q => ({...q, type: 'question' as const }));
      await new Promise(resolve => setTimeout(resolve, 500));

      // 전체 데이터 결합 및 정렬
      const combinedPosts = [...reflections, ...questions];
      combinedPosts.sort((a, b) => {
        if (filters.sort === 'latest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });

      if (loadMore) {
        setAllPosts(prev => [...prev, ...combinedPosts]);
        setCurrentPage(prev => prev + 1);
      } else {
        setAllPosts(combinedPosts);
        setCurrentPage(0);
      }

      // 더 보기 가능 여부 확인
      setHasMore(combinedPosts.length === ITEMS_PER_PAGE);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다.');
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.sort, currentPage]);

  // 필터링된 게시글 계산
  const filteredPosts = useCallback(() => {
    let filtered = allPosts;

    // 탭 필터링
    if (filters.tab === 'reflections') {
      filtered = allPosts.filter(post => post.type === 'reflection');
    } else if (filters.tab === 'questions') {
      filtered = allPosts.filter(post => post.type === 'question');
    }

    // 검색 필터링
if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(searchTerm) ||
        post.content?.toLowerCase().includes(searchTerm) ||
        post.keywords?.some(keyword => 
          keyword.name.toLowerCase().includes(searchTerm)
        )
      );
    }

    return filtered;
  }, [allPosts, filters.tab, filters.search]);
  
  // 필터 변경 시 게시글 업데이트
  useEffect(() => {
    setPosts(filteredPosts());
  }, [filteredPosts]);

  const totalCounts = {
    all: allPosts.length,
    reflections: allPosts.filter(post => post.type === 'reflection').length,
    questions: allPosts.filter(post => post.type === 'question').length,
  };

  const updateFilters = useCallback((newFilters: Partial<PostsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));

    // 검색어나 탭이 변경되면 다시 로드
    if (newFilters.search !== undefined || newFilters.tab !== undefined) {
      setCurrentPage(0);
      setAllPosts([]);
      setHasMore(true);
    }
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

      const tableName = type === 'reflection' ? 'reflections' : 'questions';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 로컬 상태에서도 제거
      setAllPosts(prev => prev.filter(post => !(post.type === type && post.id === id)));
      setPosts(prev => prev.filter(post => !(post.type === type && post.id === id)));

    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 삭제에 실패했습니다.');
      console.error('Failed to delete post:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setCurrentPage(0);
    setAllPosts([]);
    setHasMore(true);
    fetchPosts(false);
  }, [fetchPosts]);

  // 초기 로드 및 필터 변경시 데이터 가져오기
  useEffect(() => {
    if (filters.search === '' || filters.search.length >= 2) {
      // 검색어가 없어가 2글자 이상일 때만 검색
      refresh();
    }
  }, [filters.tab, filters.sort]); // 검색어는 제외한 탭과 정렬만 의존성에 포함

  // 검색어 변경시 디바운스 적용
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search === '' || filters.search.length >= 2) {
        refresh();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

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