'use client';

import EmptyState from '@/components/my/posts/EmptyState';
import PostCard from '@/components/my/posts/PostsCard';
import PostsFilterBar from '@/components/my/posts/PostsFilterBar';
import PostsTabNavigation from '@/components/my/posts/PostsTabNavigation';
import { useMyPosts } from '@/hooks/my/useMyPosts';
import { PostsTabType } from '@/types/my';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MyPostsPage = () => {
  const router = useRouter();
  const {
    posts,
    filters,
    loading,
    hasMore,
    error,
    actions: { updateFilters, loadMore, editPost, deletePost, refresh },
  } = useMyPosts();

  const handleTabChange = (tab: PostsTabType) => {
    updateFilters({ tab });
  };

  const handleEdit = (item: (typeof posts)[0]) => {
    editPost(item.type, item.id);
  };

  const handleDelete = (item: (typeof posts)[0]) => {
    if (
      confirm(
        `정말로 이 ${item.type === 'reflection' ? '회고' : '질문'}을 삭제하시겠습니까?`
      )
    ) {
      deletePost(item.type, item.id);
    }
  };

  // 카운트 계산
  const counts = {
    all: posts.length,
    reflections: posts.filter((p) => p.type === 'reflection').length,
    questions: posts.filter((p) => p.type === 'question').length,
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto py-8 p-4">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 items-start justify-start">
        <button onClick={() => router.push('/my')}>
          <ArrowLeft className="w-6 h-6 text-gray-500 hover:text-accent-400 hover:cursor-pointer" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">작성한 글</h1>
      </div>

      {/* 탭 네비게이션 */}
      <PostsTabNavigation
        activeTab={filters.tab}
        onTabChange={handleTabChange}
        counts={counts}
      />

      {/* 필터 바 */}
      <PostsFilterBar filters={filters} onFiltersChange={updateFilters} />

      {/* 로딩 상태 */}
      {loading && posts.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 콘텐츠 */}
      {!loading && posts.length === 0 ? (
        <EmptyState
          type={filters.search ? 'search' : 'posts'}
          title={
            filters.search
              ? '검색 결과가 없습니다'
              : '아직 작성한 글이 없습니다'
          }
          description={
            filters.search
              ? '다른 검색어로 시도해보세요'
              : '첫 번째 회고나 질문을 작성해보세요'
          }
        />
      ) : (
        <div className="space-y-4">
          {posts.map((item) => (
            <PostCard
              key={`${item.type}-${item.id}`}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          ))}

          {/* 더 보기 버튼 */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '불러오는 중...' : '더 보기'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
