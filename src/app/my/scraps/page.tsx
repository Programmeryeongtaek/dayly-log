"use client";

import EmptyState from "@/components/my/scraps/EmptyState";
import ScrapCard from "@/components/my/scraps/ScrapCard";
import ScrapsFilterBar from "@/components/my/scraps/ScrapsFilterBar";
import { useMyScraps } from "@/hooks/my/useMyScraps";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  MessageCircleQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ScrapsPage = () => {
  const router = useRouter();
  const {
    scraps,
    filters,
    loading,
    hasMore,
    error,
    actions: { updateFilters, loadMore, removeScrap, viewOriginal, refresh },
  } = useMyScraps();

  const handleRemove = (scrapId: string) => {
    if (confirm("정말로 이 스크랩을 삭제하시겠습니까?")) {
      removeScrap(scrapId);
    }
  };

  const handleViewOriginal = (contentType: string, contentId: string) => {
    viewOriginal(contentType, contentId);
  };

  // 필터링된 스크랩
  const filteredScraps = scraps.filter((scrap) => {
    const matchesSearch =
      !filters.search ||
      scrap.content.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      scrap.content.content
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      scrap.author.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesContentType =
      !filters.content_type ||
      (filters.content_type === "reflections" &&
        scrap.content_type === "reflection") ||
      (filters.content_type === "questions" &&
        scrap.content_type === "question");

    return matchesSearch && matchesContentType;
  });

  // 정렬 적용
  const sortedScraps = [...filteredScraps].sort((a, b) => {
    switch (filters.sort) {
      case "recent":
        return (
          new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime()
        );
      case "oldest":
        return (
          new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime()
        );
      case "content_date":
        return (
          new Date(b.content.date).getTime() -
          new Date(a.content.date).getTime()
        );
      default:
        return 0;
    }
  });

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
        <button onClick={() => router.push("/my")}>
          <ArrowLeft className="w-6 h-6 text-gray-500 hover:text-accent-400 hover:cursor-pointer" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">내 스크랩</h1>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">전체</p>
              <p className="text-2xl font-bold text-blue-900">
                {scraps.length}
              </p>
            </div>
            <Bookmark className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">회고</p>
              <p className="text-2xl font-bold text-green-900">
                {scraps.filter((s) => s.content_type === "reflection").length}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">질문</p>
              <p className="text-2xl font-bold text-orange-900">
                {scraps.filter((s) => s.content_type === "question").length}
              </p>
            </div>
            <MessageCircleQuestion className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* 필터 바 */}
      <ScrapsFilterBar filters={filters} onFiltersChange={updateFilters} />

      {/* 로딩 상태 */}
      {loading && scraps.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
        </div>
      )}

      {/* 콘텐츠 */}
      {!loading && sortedScraps.length === 0 ? (
        <EmptyState
          type={filters.search || filters.content_type ? "search" : "scraps"}
          title={
            filters.search || filters.content_type
              ? "검색 결과가 없습니다"
              : "아직 스크랩한 글이 없습니다"
          }
          description={
            filters.search || filters.content_type
              ? "필터를 조정해서 다시 시도해보세요"
              : "마음에 드는 글을 스크랩해보세요"
          }
        />
      ) : (
        <div className="space-y-4">
          {sortedScraps.map((scrap) => (
            <ScrapCard
              key={scrap.id}
              scrap={scrap}
              onRemove={() => handleRemove(scrap.id)}
              onViewOriginal={() =>
                handleViewOriginal(scrap.content_type, scrap.content.id)
              }
              loading={loading}
            />
          ))}

          {/* 더 보기 버튼 */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-accent-400 text-white rounded-lg hover:bg-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "불러오는 중..." : "더 보기"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrapsPage;
