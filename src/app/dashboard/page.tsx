"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/auth";
import { useGoals } from "@/hooks/goals/useGoals";
import { useQuestions } from "@/hooks/questions/useQuestions";
import { QuestionFormData, QuestionKeyword } from "@/types/questions";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Hash,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardReflectionWidget from "@/components/reflections/DashboardReflectionWidget";
import DashboardBudgetWidget from "@/components/budget/DashboardBudgetWidget";
import Modal from "@/components/common/Modal";
import QuestionForm from "@/components/questions/QuestionForm";

const DashboardPage = () => {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const { createQuestion, isCreatingQuestion } = useQuestions();
  const [currentDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 사용자 ID가 있을 때만 데이터 쿼리 활성화
  const shouldFetchData = !isAuthLoading && !!user?.id;

  // 목표 데이터
  const {
    activeGoals,
    completedGoals,
    goals,
    isLoading: isGoalsLoading,
  } = useGoals({
    userId: shouldFetchData ? user.id : undefined,
  });

  // 질문 데이터
  const {
    questions,
    statistics: questionStatistics,
    isLoading: isQuestionsLoading,
  } = useQuestions({
    userId: shouldFetchData ? user?.id : undefined,
    filters: {}, // 전체 기간
  });

  const handleSubmitQuestion = (formData: QuestionFormData) => {
    if (!user?.id) return;

    createQuestion({
      ...formData,
      user_id: user.id,
    });
    setShowCreateModal(false);
  };

  // 목표 통계
  const goalStats = useMemo(() => {
    const totalGoals = goals.length;
    const activeCount = activeGoals.length;
    const completedCount = completedGoals.length;

    // 곧 마감되는 목표들 (7일 이내)
    const soonDueGoals = activeGoals.filter((goal) => {
      if (!goal.target_date) return false;
      const daysLeft = goal.progress.daysLeft;
      return daysLeft <= 7 && daysLeft > 0;
    });

    // 달성률이 80% 이상인 목표들
    const nearCompletionGoals = activeGoals.filter(
      (goal) => goal.progress.overallProgress >= 80,
    );

    return {
      total: totalGoals,
      active: activeCount,
      completed: completedCount,
      soonDue: soonDueGoals.length,
      nearCompletion: nearCompletionGoals.length,
      completionRate: totalGoals > 0 ? (completedCount / totalGoals) * 100 : 0,
    };
  }, [goals, activeGoals, completedGoals]);

  // 질문 통계
  const questionStats = useMemo(() => {
    // 최근 1주일 키워드 분석
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentQuestions = questions.filter(
      (q) => new Date(q.date) >= oneWeekAgo,
    );

    const keywordMap = new Map<
      string,
      {
        keyword: QuestionKeyword;
        count: number;
      }
    >();

    recentQuestions.forEach((question) => {
      question.keywords?.forEach((keyword) => {
        if (!keywordMap.has(keyword.name)) {
          keywordMap.set(keyword.name, {
            keyword,
            count: 0,
          });
        }
        keywordMap.get(keyword.name)!.count++;
      });
    });

    const recentKeywordAnalysis = Array.from(keywordMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // 카테고리별 최근 통계
    const daily = recentQuestions.filter((q) => q.category?.name === "daily");
    const growth = recentQuestions.filter((q) => q.category?.name === "growth");
    const custom = recentQuestions.filter((q) => q.category?.name === "custom");

    const categoryStats = [
      { name: "일상", count: daily.length, color: "text-green-600" },
      { name: "성장", count: growth.length, color: "text-purple-600" },
      { name: "나만의", count: custom.length, color: "text-blue-600" },
    ];

    // 미답변 질문 수
    const unansweredCount = questions.filter((q) => !q.is_answered).length;

    return {
      total: questionStatistics.total,
      answered: questionStatistics.answered,
      unanswered: unansweredCount,
      answerRate: questionStatistics.answerRate,
      recentKeywords: recentKeywordAnalysis,
      categoryStats,
    };
  }, [questions, questionStatistics]);

  // 상위 목표들 (진행률 기준)
  const topProgressGoals = useMemo(() => {
    return activeGoals
      .sort((a, b) => b.progress.overallProgress - a.progress.overallProgress)
      .slice(0, 3);
  }, [activeGoals]);

  // 인증 로딩 상태만 확인
  if (isAuthLoading) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const isDataLoading =
    shouldFetchData && (isGoalsLoading || isQuestionsLoading);

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* 환영 메시지 */}
        <div className="bg-gradient-to-r flex flex-col gap-1 from-accent-600 to-accent-500 text-white rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-2">
            안녕하세요, {profile?.name || profile?.nickname || "사용자"}님!
          </h1>
          <p className="text-accent-100 text-lg">
            {format(currentDate, "yyyy년 M월", { locale: ko })} 현황
          </p>
        </div>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/budget"
            className="flex flex-col items-center p-4 bg-accent-100 rounded-lg hover:bg-accent-200 transition-colors group"
          >
            <div className="p-3 bg-accent-500 rounded-full group-hover:bg-accent-600 transition-colors">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              가계부 작성
            </span>
          </Link>

          <Link
            href="/goals/new"
            className="flex flex-col items-center p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors group"
          >
            <div className="p-3 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              목표 작성
            </span>
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors group hover:cursor-pointer"
          >
            <div className="p-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              질문 작성
            </span>
          </button>

          <Link
            href="/reflections/new"
            className="flex flex-col items-center p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors group"
          >
            <div className="p-3 bg-purple-500 rounded-full group-hover:bg-purple-600 transition-colors">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              회고 작성
            </span>
          </Link>
        </div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 목표 현황 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">활성 목표</p>
                {isDataLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16 mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {goalStats.active}개
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      완료율 {Math.round(goalStats.completionRate)}%
                    </p>
                  </>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* 질문 통계 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">성찰 질문</p>
                {isDataLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16 mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {questionStats.total}개
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      답변률 {Math.round(questionStats.answerRate)}%
                    </p>
                  </>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* 이번 주 활동 요약 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  이번 주 활동
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">질문 작성</span>
                    <span className="font-medium">3/5</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">회고 작성</span>
                    <span className="font-medium">2/7</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">목표 달성</span>
                    <span className="font-medium">1/3</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 위젯 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 가계부 위젯 */}
          <DashboardBudgetWidget />

          {/* 목표 위젯 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                목표 관리
              </h2>
              <Link
                href="/goals"
                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                모두 보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isDataLoading ? (
              <div className="space-y-4 animate-pulse flex-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2"></div>
                  </div>
                ))}
              </div>
            ) : topProgressGoals.length > 0 ? (
              <div className="flex flex-col flex-1">
                <div className="space-y-4 mb-6 flex-1">
                  {topProgressGoals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1 rounded ${
                              goal.type === "increase_income"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {goal.type === "increase_income" ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {goal.title}
                          </span>
                          {goal.progress.isComplete && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {Math.round(goal.progress.overallProgress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            goal.progress.isComplete
                              ? "bg-green-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(100, goal.progress.overallProgress)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{goal.progress.progressText}</span>
                        <span>
                          {goal.target_amount &&
                            `${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}원`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 빠른 액션 */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href="/goals/new"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                  >
                    목표 추가
                  </Link>
                  <Link
                    href="/goals"
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                  >
                    전체 보기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 justify-center items-center text-center">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  첫 목표를 설정해보세요
                </h3>
                <p className="text-gray-500 mb-4">
                  목표를 설정하고 달성해나가는 성취감을 느껴보세요
                </p>
                <Link
                  href="/goals/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />첫 목표 설정하기
                </Link>
              </div>
            )}
          </div>

          {/* 질문 위젯 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                성찰 질문
              </h2>
              <Link
                href="/questions"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                모두 보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isDataLoading ? (
              <div className="animate-pulse flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : questionStats.total === 0 ? (
              <div className="flex flex-col flex-1 justify-center items-center text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  첫 질문을 만들어보세요
                </h3>
                <p className="text-gray-500 mb-4">
                  스스로에게 던지는 질문은 성장의 시작입니다
                </p>
                <Link
                  href="/questions/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />첫 질문 작성하기
                </Link>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                {/* 답변 현황 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      답변 현황
                    </span>
                    <span className="text-xs text-gray-500">
                      {questionStats.answered} / {questionStats.total}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${questionStats.total > 0 ? (questionStats.answered / questionStats.total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      답변 {questionStats.answered}개
                    </div>
                    {questionStats.unanswered > 0 && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Clock className="w-3 h-3" />
                        대기 {questionStats.unanswered}개
                      </div>
                    )}
                  </div>
                </div>

                {/* 최근 1주일 카테고리 활동 */}
                {questionStats.categoryStats.some((cat) => cat.count > 0) && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      최근 1주일 활동
                    </h3>
                    <div className="space-y-2">
                      {questionStats.categoryStats.map((category) => (
                        <div
                          key={category.name}
                          className="flex items-center justify-between"
                        >
                          <span className={`text-sm ${category.color}`}>
                            {category.name}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {category.count}개
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 인기 키워드 (최근 1주일) */}
                {questionStats.recentKeywords.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      주간 인기 키워드
                    </h3>
                    <div className="space-y-2">
                      {questionStats.recentKeywords.map((item, index) => (
                        <div
                          key={item.keyword.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-400 w-4">
                              {index + 1}
                            </span>
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${item.keyword.color}20`,
                                color: item.keyword.color,
                              }}
                            >
                              #{item.keyword.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-900">
                            {item.count}회
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 빠른 액션 */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href="/questions/new"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                  >
                    질문 작성
                  </Link>
                  <Link
                    href="/questions/analytics"
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                  >
                    분석 보기
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 회고 위젯 */}
          <DashboardReflectionWidget />
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
    </AuthGuard>
  );
};

export default DashboardPage;
