'use client';

import Modal from '@/components/common/Modal';
import QuestionFiltersComponent from '@/components/questions/QuestionFiltersComponent';
import QuestionForm from '@/components/questions/QuestionForm';
import QuestionList from '@/components/questions/QuestionList';
import QuestionStatistics from '@/components/questions/QuestionStatistics';
import { useAuth } from '@/hooks/auth';
import { useQuestionKeywords } from '@/hooks/questions/useQuestionKeywords';
import { useQuestions } from '@/hooks/questions/useQuestions';
import {
  DateRangePeriod,
  QuestionFilters,
  QuestionFormData,
  QuestionWithKeywords,
} from '@/types/questions';
import { Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const QuestionsPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('전체');

  // 기간 프리셋
  const periodPresets: DateRangePeriod[] = useMemo(() => {
    const today = new Date();
    const getDateString = (date: Date) => date.toISOString().split('T')[0];

    return [
      { label: '전체', startDate: '', endDate: '' },
      {
        label: '최근 1주',
        startDate: getDateString(
          new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        ),
        endDate: getDateString(today),
      },
      {
        label: '최근 1개월',
        startDate: getDateString(
          new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        ),
        endDate: getDateString(today),
      },
      {
        label: '최근 3개월',
        startDate: getDateString(
          new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
        ),
        endDate: getDateString(today),
      },
      {
        label: '최근 6개월',
        startDate: getDateString(
          new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)
        ),
        endDate: getDateString(today),
      },
    ];
  }, []);

  // 질문 데이터 (헤더 통계용)
  const {
    questions,
    statistics,
    isLoading,
    error,
    createQuestion,
    isCreatingQuestion,
  } = useQuestions({
    userId: user?.id,
  });

  // 키워드 데이터 가져오기
  const { keywords } = useQuestionKeywords({
    userId: user?.id,
  });

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: Partial<QuestionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 기간 변경 핸들러
  const handlePeriodChange = (periodLabel: string) => {
    setSelectedPeriod(periodLabel);
    const period = periodPresets.find((p) => p.label === periodLabel);

    if (period) {
      if (period.label === '전체') {
        handleFiltersChange({ dateFrom: undefined, dateTo: undefined });
      } else {
        handleFiltersChange({
          dateFrom: period.startDate,
          dateTo: period.endDate,
        });
      }
    }
  };

  // 질문 생성 핸들러
  const handleCreateQuestion = (formData: QuestionFormData) => {
    if (!user?.id) return;

    createQuestion({
      ...formData,
      user_id: user.id,
    });
    setShowCreateModal(false);
  };

  // 질문 편집 핸들러
  const handleEditQuestion = (question: QuestionWithKeywords) => {
    // TODO: 편집 모달 구현
    console.log('Edit question:', question);
  };

  // 질문 삭제 핸들러
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('정말로 이 질문을 삭제하시겠습니까?')) {
      handleDeleteQuestion(questionId);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😵</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            문제가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-4">
            질문을 불러오는 중 오류가 발생했습니다.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b-2 border-accent-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">질문</h1>
            <div className="flex gap-2">
              <Link
                href="/questions/analytics"
                className="flex items-center gap-1 p-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                분석
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                추가
              </button>
            </div>
          </div>

          {/* 통계 요약 */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.total}
              </div>
              <div className="text-sm text-blue-800">총 질문</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics.answered}
              </div>
              <div className="text-sm text-green-800">답변 완료</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.unanswered}
              </div>
              <div className="text-sm text-orange-800">답변 대기</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.answerRate.toFixed(0)}%
              </div>
              <div className="text-sm text-purple-800">답변률</div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 질문 목록 및 필터 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 필터 컴포넌트 */}
            <QuestionFiltersComponent
              filters={filters}
              keywords={keywords}
              periodPresets={periodPresets}
              onFiltersChange={handleFiltersChange}
              onPeriodChange={handlePeriodChange}
            />

            {/* 질문 목록 */}
            <QuestionList
              questions={questions}
              filters={filters}
              keywords={keywords}
              periodPresets={periodPresets}
              isLoading={isLoading}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
            />

            {/* 빈 상태일 때 액션 가이드 */}
            {!isLoading &&
              questions.length === 0 &&
              !Object.keys(filters).length && (
                <div className="bg-white rounded-lg border p-8 text-center">
                  <div className="text-6xl mb-4">🤔</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    첫 번째 질문을 작성해보세요!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    스스로에게 던지는 질문은 성장의 시작입니다.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    질문 작성
                  </button>
                </div>
              )}
          </div>

          {/* 사이드바 - 통계 */}
          <div className="space-y-6">
            <QuestionStatistics questions={questions} />

            {/* 빠른 액션 */}
            <div className="bg-white mobile:hidden tablet:block rounded-lg border p-4">
              <h3 className="font-semibold text-gray-800 mb-4">빠른 액션</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  질문 작성
                </button>

                <Link
                  href="/questions/analytics"
                  className="w-full flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  질문 분석
                </Link>
              </div>
            </div>

            {/* 미답변 질문 알림 */}
            {statistics.unanswered > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">
                  답변을 기다리는 질문들
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  {statistics.unanswered}개의 질문이 답변을 기다리고 있어요.
                </p>
                <button
                  onClick={() => handleFiltersChange({ isAnswered: false })}
                  className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
                >
                  질문 확인
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 질문 생성 모달 */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Header>
          <Modal.Title>질문 작성</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <QuestionForm
            onSubmit={handleCreateQuestion}
            onCancel={() => setShowCreateModal(false)}
            isLoading={isCreatingQuestion}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QuestionsPage;
