'use client';

import MenuCard from '@/components/my/MenuCard';
import QuickActionButton from '@/components/my/QuickActionButton';
import StatsCard from '@/components/my/StatsCard';
import { useMyPageStats } from '@/hooks/my/useMyPageStats';
import {
  Bookmark,
  BookOpen,
  FileText,
  MessageCircleQuestion,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const MyPage = () => {
  const router = useRouter();
  const { stats, loading, error, refresh } = useMyPageStats();

  const handleSettings = () => {
    router.push('/my/profile');
  };

  const handleCreateReflection = () => {
    router.push('/reflections/new');
  };

  const handleCreateQuestion = () => {
    router.push('/questions/new');
  };

  const handleNavigateToNeighbors = () => {
    router.push('/my/neighbors');
  };

  const handleNavigateToPosts = () => {
    router.push('/my/posts');
  };

  const handleNavigateToScraps = () => {
    router.push('/my/scraps');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            {error || '데이터를 불러올 수 없습니다.'}
          </p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-accent-400 text-white rounded hover:bg-accent-500"
          >
            재시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col gap-8 container mx-auto py-8 px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
          <QuickActionButton
            icon={<Settings className="w-4 h-4" />}
            label="설정"
            onClick={handleSettings}
          />
        </div>

        {/* 빠른 액션 */}
        <div className="flex gap-4">
          <QuickActionButton
            icon={<BookOpen className="w-4 h-4" />}
            label="회고 작성"
            onClick={handleCreateReflection}
          />
          <QuickActionButton
            icon={<MessageCircleQuestion className="w-4 h-4" />}
            label="질문 작성"
            onClick={handleCreateQuestion}
          />
        </div>

        {/* 세부 통계 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            전체 통계
          </h2>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-around gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex flex-col items-center font-bold text-2xl text-gray-900">
                  {stats.total_reflections}
                  <p className="text-sm text-gray-600">전체 회고</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <MessageCircleQuestion className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex flex-col items-center text-2xl font-bold text-gray-900">
                  {stats.total_questions}
                  <p className="text-sm text-gray-600">전체 질문</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이번 주 통계 */}
        <div className="">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            이번 주 활동
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon={<FileText className="w-5 h-5" />}
              label="새 글"
              value={stats.this_week_posts}
              color="blue"
            />
            <StatsCard
              icon={<Bookmark className="w-5 h-5" />}
              label="스크랩"
              value={stats.this_week_scraps}
              color="orange"
            />
            <StatsCard
              icon={<Users className="w-5 h-5" />}
              label="새 이웃"
              value={stats.this_week_new_neighbors}
              color="green"
            />
            <StatsCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="총 활동"
              value={
                stats.this_week_posts +
                stats.this_week_scraps +
                stats.this_week_new_neighbors
              }
              color="purple"
            />
          </div>
        </div>

        {/* 메인 메뉴 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">활동 관리</h2>

          <MenuCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="이웃 관리"
            count={stats.total_neighbors}
            badge={stats.pending_requests}
            onClick={handleNavigateToNeighbors}
          />

          <MenuCard
            icon={<FileText className="w-6 h-6 text-green-600" />}
            title="작성한 글"
            count={stats.total_posts}
            onClick={handleNavigateToPosts}
          />

          <MenuCard
            icon={<Bookmark className="w-6 h-6 text-orange-600" />}
            title="스크랩한 글"
            count={stats.total_scraps}
            onClick={handleNavigateToScraps}
          />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
