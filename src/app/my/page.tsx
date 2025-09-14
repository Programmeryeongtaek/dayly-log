'use client';

import Modal from '@/components/common/Modal';
import MenuCard from '@/components/my/MenuCard';
import QuickActionButton from '@/components/my/QuickActionButton';
import StatsCard from '@/components/my/StatsCard';
import QuestionForm from '@/components/questions/QuestionForm';
import { useAuth } from '@/hooks/auth';
import { useQuestions } from '@/hooks/questions/useQuestions';
import { supabase } from '@/lib/supabase';
import { QuestionFormData } from '@/types/questions';
import {
  Bookmark,
  BookOpen,
  Check,
  FileText,
  MessageCircleQuestion,
  Search,
  Settings,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NeighborStats {
  totalNeighbors: number;
  pendingRequests: number;
  newThisWeek: number;
  total_reflections: number;
  total_questions: number;
  total_posts: number;
  total_scraps: number;
  this_week_posts: number;
  this_week_scraps: number;
  this_week_new_neighbors: number;
}

const MyPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<NeighborStats>({
    totalNeighbors: 0,
    pendingRequests: 0,
    newThisWeek: 0,
    total_reflections: 0,
    total_questions: 0,
    total_posts: 0,
    total_scraps: 0,
    this_week_posts: 0,
    this_week_scraps: 0,
    this_week_new_neighbors: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { createQuestion, isCreatingQuestion } = useQuestions();

  const fetchAllStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoString = oneWeekAgo.toISOString().split('T')[0];

      // 병렬로 통계 데이터 가져오기
      const [
        totalNeighborsResult,
        pendingRequestsResult,
        newThisWeekResult,
        reflectionsResult,
        questionsResult,
        scrapsResult,
        weekReflectionsResult,
        weekQuestionsResult,
        weekScrapsResult,
      ] = await Promise.all([
        // 전체 이웃 수 (수락)
        supabase
          .from('neighbor_relationships')
          .select('id', { count: 'exact', head: true })
          .or(
            `and(requester_id.eq.${user.id},status.eq.accepted),and(recipient_id.eq.${user.id},status.eq.accepted)`
          ),

        // 대기 중인 요청 수
        supabase
          .from('neighbor_relationships')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('status', 'pending'),

        // 이번 주 새 이웃 수
        supabase
          .from('neighbor_relationships')
          .select('id', { count: 'exact', head: true })
          .or(
            `and(requester_id.eq.${user.id},status.eq.accepted),and(recipient_id.eq.${user.id},status.eq.accepted)`
          )
          .gte('updated_at', weekAgoString),

        supabase
          .from('reflections')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('scraps')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('reflections')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', weekAgoString),

        supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', weekAgoString),

        supabase
          .from('scraps')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', weekAgoString),
      ]);

      setStats({
        totalNeighbors: totalNeighborsResult.count || 0,
        pendingRequests: pendingRequestsResult.count || 0,
        newThisWeek: newThisWeekResult.count || 0,
        total_reflections: reflectionsResult.count || 0,
        total_questions: questionsResult.count || 0,
        total_posts:
          (reflectionsResult.count || 0) + (questionsResult.count || 0),
        total_scraps: scrapsResult.count || 0,
        this_week_posts:
          (weekReflectionsResult.count || 0) + (weekQuestionsResult.count || 0),
        this_week_scraps: weekScrapsResult.count || 0,
        this_week_new_neighbors: newThisWeekResult.count || 0,
      });
    } catch (err) {
      console.error('Failed to fetch neighbor stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, [user]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
      handleSearch();
    }
  };

  // 이웃 찾기 섹션용
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', searchTerm.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          alert('존재하지 않는 사용자입니다.');
        } else {
          throw error;
        }
        return;
      }

      router.push(`/my/neighbors/public/${data.nickname}`);
    } catch (err) {
      console.error('Search failed:', err);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setSearching(false);
    }
  };

  const copyToClipboard = async () => {
    const profileUrl = `${window.location.origin}/u/${user?.user_metadata?.nickname || ''}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 이동 핸들러
  const handleSettings = () => {
    router.push('/my/profile');
  };

  const handleCreateReflection = () => {
    router.push('/reflections/new');
  };

  const handleSubmitQuestion = (formData: QuestionFormData) => {
    if (!user?.id) return;

    createQuestion({
      ...formData,
      user_id: user.id,
    });
    setShowCreateModal(false);
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

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col gap-8 container mx-auto py-8 px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
          <div className="flex gap-2">
            {/* 프로필 공유 */}
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-200 hover:text-white rounded-lg hover:bg-accent-400 flex-1 justify-center hover:cursor-pointer"
              title="프로필 공유"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <QuickActionButton
              icon={<Settings className="w-4 h-4" />}
              label="설정"
              onClick={handleSettings}
            />
          </div>
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
            onClick={() => setShowCreateModal(true)}
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
                  <p className="text-sm text-gray-600">회고</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <MessageCircleQuestion className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex flex-col items-center text-2xl font-bold text-gray-900">
                  {stats.total_questions}
                  <p className="text-sm text-gray-600">질문</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 bg-accent-100 rounded-full">
                  <Users className="w-6 h-6 text-accent-600" />
                </div>
                <div className="flex flex-col items-center text-2xl font-bold text-gray-900">
                  {stats.total_questions}
                  <p className="text-sm text-gray-600">이웃</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이번 주 통계 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            이번 주 활동
          </h2>
          <div className="grid grid-cols-3 gap-4">
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
          </div>
        </div>

        {/* 이웃 찾기 섹션 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-900">이웃 찾기</h3>
          {/* 검색 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              placeholder="닉네임 검색..."
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500 hover:border-accent-300 transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-2 bg-accent-200 hover:text-white rounded-lg hover:bg-accent-400 hover:cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 메인 메뉴 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">활동 관리</h2>

          <MenuCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="이웃 관리"
            count={stats.totalNeighbors}
            badge={stats.pendingRequests}
            unit="명"
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

      {/* 질문 생성 모달 */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Header className="border-b-2 border-accent-400 pb-4">
          <div className="flex items-center justify-between">
            <Modal.Title>
              <p className="text-accent-400">질문 작성</p>
            </Modal.Title>
            <X
              className="w-5 h-5 hover:cursor-pointer"
              onClick={() => setShowCreateModal(false)}
            />
          </div>
        </Modal.Header>

        <Modal.Body>
          <QuestionForm
            onSubmit={handleSubmitQuestion}
            onCancel={() => setShowCreateModal(false)}
            isLoading={isCreatingQuestion}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyPage;
