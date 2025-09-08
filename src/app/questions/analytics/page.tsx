'use client';

import Modal from '@/components/common/Modal';
import QuestionCard from '@/components/questions/QuestionCard';
import { useAuth } from '@/hooks/auth';
import { useQuestionKeywords } from '@/hooks/questions/useQuestionKeywords';
import { useQuestions } from '@/hooks/questions/useQuestions';
import { QuestionKeyword, QuestionWithKeywords } from '@/types/questions';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  Hash,
  MessageCircle,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const QuestionsAnalyticsPage = () => {
  const { user } = useAuth();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<QuestionWithKeywords[]>(
    []
  );
  const [modalTitle, setModalTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const { questions, isLoading, statistics } = useQuestions({
    userId: user?.id,
  });

  const { keywords } = useQuestionKeywords({
    userId: user?.id,
  });

  // 카테고리별 분석
  const categoryAnalysis = useMemo(() => {
    const daily = questions.filter((q) => q.category?.name === 'daily');
    const growth = questions.filter((q) => q.category?.name === 'growth');
    const custom = questions.filter((q) => q.category?.name === 'custom');

    return [
      {
        name: '일상',
        count: daily.length,
        percentage:
          questions.length > 0
            ? Math.round((daily.length / questions.length) * 100)
            : 0,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        questions: daily,
      },
      {
        name: '성장',
        count: growth.length,
        percentage:
          questions.length > 0
            ? Math.round((growth.length / questions.length) * 100)
            : 0,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        questions: growth,
      },
      {
        name: '나만의 질문',
        count: custom.length,
        percentage:
          questions.length > 0
            ? Math.round((custom.length / questions.length) * 100)
            : 0,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        questions: custom,
      },
    ].sort((a, b) => b.count - a.count);
  }, [questions]);

  // 키워드별 분석
  const keywordAnalysis = useMemo(() => {
    const keywordMap = new Map<
      string,
      {
        keyword: QuestionKeyword;
        questions: QuestionWithKeywords[];
        count: number;
      }
    >();

    questions.forEach((question) => {
      question.keywords?.forEach((keyword) => {
        if (!keywordMap.has(keyword.name)) {
          keywordMap.set(keyword.name, {
            keyword,
            questions: [],
            count: 0,
          });
        }
        const item = keywordMap.get(keyword.name)!;
        item.questions.push(question);
        item.count++;
      });
    });

    return Array.from(keywordMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [questions, keywords]);

  // 월별 질문 수 분석
  const monthlyAnalysis = useMemo(() => {
    const monthMap = new Map<
      string,
      { month: string; count: number; questions: QuestionWithKeywords[] }
    >();

    questions.forEach((question) => {
      const date = new Date(question.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          month: monthLabel,
          count: 0,
          questions: [],
        });
      }
      const item = monthMap.get(monthKey)!;
      item.count++;
      item.questions.push(question);
    });

    return Array.from(monthMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // 최근 6개월
  }, [questions]);

  // 답변률 분석
  const answerRateAnalysis = useMemo(() => {
    const answered = questions.filter((q) => q.is_answered);
    const unanswered = questions.filter((q) => !q.is_answered);

    return [
      {
        label: '답변 완료',
        count: answered.length,
        percentage:
          questions.length > 0
            ? Math.round((answered.length / questions.length) * 100)
            : 0,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        questions: answered,
      },
      {
        label: '답변 대기',
        count: unanswered.length,
        percentage:
          questions.length > 0
            ? Math.round((unanswered.length / questions.length) * 100)
            : 0,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        questions: unanswered,
      },
    ];
  }, [questions]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(selectedItems.length - 1, prev + 1));
  };

  const handleShowDetail = (items: QuestionWithKeywords[], title: string) => {
    setSelectedItems(items);
    setModalTitle(title);
    setCurrentIndex(0);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedItems([]);
    setModalTitle('');
    setCurrentIndex(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/questions"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                질문 목록
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                질문 분석
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 전체 통계 */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">전체 통계</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">총 질문</span>
                <span className="font-semibold">{statistics.total}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">답변 완료</span>
                <span className="font-semibold text-green-600">
                  {statistics.answered}개
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">답변 대기</span>
                <span className="font-semibold text-orange-600">
                  {statistics.unanswered}개
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">답변률</span>
                <span className="font-semibold text-blue-600">
                  {statistics.answerRate.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* 카테고리별 분석 */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                카테고리별 분석
              </h2>
            </div>
            <div className="space-y-3">
              {categoryAnalysis.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.count}개
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">
                      {category.percentage}%
                    </span>
                  </div>
                  {category.count > 0 && (
                    <button
                      onClick={() =>
                        handleShowDetail(
                          category.questions,
                          `${category.name} 질문`
                        )
                      }
                      className={`mt-1 text-xs ${category.textColor} hover:underline`}
                    >
                      질문 보기
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 답변률 분석 */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">답변 현황</h2>
            </div>
            <div className="space-y-3">
              {answerRateAnalysis.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.count}개
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">
                      {item.percentage}%
                    </span>
                  </div>
                  {item.count > 0 && (
                    <button
                      onClick={() =>
                        handleShowDetail(item.questions, item.label)
                      }
                      className={`mt-1 text-xs ${item.textColor} hover:underline`}
                    >
                      질문 보기
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 인기 키워드 */}
          {keywordAnalysis.length > 0 && (
            <div className="bg-white rounded-lg border p-6 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <Hash className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  인기 키워드
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keywordAnalysis.map((item, index) => (
                  <div
                    key={item.keyword.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() =>
                      handleShowDetail(
                        item.questions,
                        `"${item.keyword.name}" 키워드`
                      )
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="px-2 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${item.keyword.color}20`,
                          color: item.keyword.color,
                        }}
                      >
                        #{item.keyword.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {item.count}회 사용
                    </div>
                    <div className="text-sm text-gray-600">
                      클릭하여 질문 보기
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 월별 활동 */}
          {monthlyAnalysis.length > 0 && (
            <div className="bg-white rounded-lg border p-6 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  월별 활동
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {monthlyAnalysis.map((month) => (
                  <div
                    key={month.month}
                    className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() =>
                      handleShowDetail(month.questions, month.month)
                    }
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {month.month}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {month.count}
                    </div>
                    <div className="text-xs text-gray-500">질문</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 상세 모달 */}
      <Modal isOpen={showDetailModal} onClose={handleCloseModal} size="xl">
        <Modal.Header>
          <div className="flex items-center justify-between">
            <Modal.Title>{modalTitle}</Modal.Title>
            <button
              onClick={handleCloseModal}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {selectedItems.length > 0 ? (
            <div>
              {/* 네비게이션 헤더 */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="text-sm text-gray-600">
                  {currentIndex + 1} / {selectedItems.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="이전 질문"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === selectedItems.length - 1}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="다음 질문"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 현재 질문 표시 */}
              <div className="max-h-96 overflow-y-auto">
                <QuestionCard
                  key={selectedItems[currentIndex].id}
                  question={selectedItems[currentIndex]}
                  showActions={false}
                />
              </div>

              {/* 페이지 인디케이터 */}
              {selectedItems.length > 1 && (
                <div className="flex justify-center mt-4 pt-3 border-t">
                  <div className="flex gap-1">
                    {selectedItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex
                            ? 'bg-blue-500'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              표시할 질문이 없습니다.
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QuestionsAnalyticsPage;
