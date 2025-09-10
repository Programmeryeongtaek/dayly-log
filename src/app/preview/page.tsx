import Link from "next/link";
import { useMemo } from "react";
import {
  BarChart3,
  Target,
  MessageSquare,
  BookOpen,
  Plus,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Calendar,
  Wallet,
  Clock,
  Star,
  Eye,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const DashboardPreview = () => {
  // 샘플 데이터
  const sampleBudgetData = useMemo(
    () => ({
      totalIncome: 3200000,
      totalExpense: 2450000,
      netAmount: 750000,
      savingsRate: 23.4,
      topCategories: [
        { name: "식비", amount: 580000, percentage: 23.7 },
        { name: "교통비", amount: 420000, percentage: 17.1 },
        { name: "생활용품", amount: 380000, percentage: 15.5 },
      ],
      recentTransactions: [
        {
          id: 1,
          type: "expense",
          amount: 25000,
          category: "식비",
          description: "점심 식사",
          date: "2025-09-09",
        },
        {
          id: 2,
          type: "income",
          amount: 50000,
          category: "용돈",
          description: "부모님 용돈",
          date: "2025-09-08",
        },
        {
          id: 3,
          type: "expense",
          amount: 15000,
          category: "교통비",
          description: "지하철 요금",
          date: "2025-09-08",
        },
      ],
    }),
    [],
  );

  const sampleGoals = useMemo(
    () => [
      {
        id: 1,
        title: "카페 지출 줄이기",
        type: "reduce_expense",
        currentAmount: 85000,
        targetAmount: 100000,
        progress: 85,
        isComplete: false,
        daysLeft: 22,
      },
      {
        id: 2,
        title: "적금 늘리기",
        type: "increase_saving",
        currentAmount: 750000,
        targetAmount: 1000000,
        progress: 75,
        isComplete: false,
        daysLeft: 15,
      },
      {
        id: 3,
        title: "운동 주 3회 하기",
        type: "habit",
        currentCount: 10,
        targetCount: 12,
        progress: 83,
        isComplete: false,
        daysLeft: 5,
      },
    ],
    [],
  );

  const sampleQuestions = useMemo(
    () => [
      {
        id: 1,
        question: "오늘 가장 감사했던 순간은 무엇인가요?",
        answer: "동료가 도움을 줬을 때 정말 감사했습니다.",
        category: "daily",
        keywords: ["감사", "동료", "도움"],
        date: "2025-09-09",
      },
      {
        id: 2,
        question: "이번 주 가장 성장한 부분은?",
        answer: "새로운 기술을 배우며 한계를 극복했습니다.",
        category: "growth",
        keywords: ["성장", "기술", "극복"],
        date: "2025-09-07",
      },
    ],
    [],
  );

  const sampleReflections = useMemo(
    () => [
      {
        id: 1,
        gratefulMoment: "가족과 함께한 저녁 시간",
        memorableMoment: "프로젝트가 성공적으로 완료됨",
        improvementPoint: "더 체계적인 시간 관리가 필요",
        keywords: ["가족", "성공", "시간관리"],
        date: "2025-09-09",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-accent-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-accent-700">DaylyLog</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Eye className="w-4 h-4" />
                미리보기 모드
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium"
              >
                회원가입
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* 환영 메시지 */}
        <div className="bg-gradient-to-r from-accent-600 to-accent-500 text-white rounded-xl p-6">
          <div className="flex flex-col justify-between">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              DaylyLog 미리보기
            </h1>
            <p className="text-accent-100 text-lg">
              DaylyLog의 모든 기능을 미리 확인해보세요.
            </p>
          </div>
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
              가계부 내역
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
              목표 설정
            </span>
          </Link>

          <Link
            href="/questions/new"
            className="flex flex-col items-center p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors group"
          >
            <div className="p-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              성찰 질문
            </span>
          </Link>

          <Link
            href="/reflections/new"
            className="flex flex-col items-center p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors group"
          >
            <div className="p-3 bg-purple-500 rounded-full group-hover:bg-purple-600 transition-colors">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700">
              일상 회고
            </span>
          </Link>
        </div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 가계부 현황 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  이번 달 수익
                </p>
                <p className="text-2xl font-bold text-green-600">
                  +{sampleBudgetData.netAmount.toLocaleString()}원
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  저축률 {sampleBudgetData.savingsRate}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* 목표 현황 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">활성 목표</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sampleGoals.length}개
                </p>
                <p className="text-xs text-gray-500 mt-1">평균 달성률 81%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* 질문 통계 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">성찰 질문</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sampleQuestions.length}개
                </p>
                <p className="text-xs text-gray-500 mt-1">답변률 100%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 위젯 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 가계부 위젯 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-600" />
                스마트 가계부
              </h2>
              <span className="text-sm text-gray-500">9월 현황</span>
            </div>

            {/* 수입/지출 요약 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    수입
                  </span>
                </div>
                <p className="text-xl font-bold text-green-700">
                  {sampleBudgetData.totalIncome.toLocaleString()}원
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">지출</span>
                </div>
                <p className="text-xl font-bold text-red-700">
                  {sampleBudgetData.totalExpense.toLocaleString()}원
                </p>
              </div>
            </div>

            {/* 카테고리별 지출 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                지출 카테고리
              </h3>
              <div className="space-y-3">
                {sampleBudgetData.topCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {category.amount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="flex gap-2 mt-auto">
              <Link
                href="/auth/signup"
                className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-center text-sm font-medium"
              >
                가계부 시작
              </Link>
            </div>
          </div>

          {/* 목표 위젯 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                목표 관리
              </h2>
              <span className="text-sm text-gray-500">진행 중</span>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              {sampleGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1 rounded ${
                          goal.type === "increase_saving"
                            ? "bg-green-100 text-green-600"
                            : goal.type === "habit"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {goal.type === "increase_saving" ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : goal.type === "habit" ? (
                          <Calendar className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {goal.title}
                      </span>
                      {goal.isComplete && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, goal.progress)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {goal.targetAmount
                        ? `${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}원`
                        : `${goal.currentCount} / ${goal.targetCount}회`}
                    </span>
                    <span>{goal.daysLeft}일 남음</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 빠른 액션 */}
            <div className="flex gap-2 mt-auto">
              <Link
                href="/auth/signup"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
              >
                목표 설정
              </Link>
            </div>
          </div>

          {/* 질문 위젯 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                성찰 질문
              </h2>
              <span className="text-sm text-gray-500">최근 답변</span>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              {sampleQuestions.map((question) => (
                <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {question.question}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {question.answer}
                  </p>
                  <div className="flex items-center gap-2">
                    {question.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 빠른 액션 */}
            <div className="flex gap-2 mt-auto">
              <Link
                href="/auth/signup"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
              >
                질문 시작
              </Link>
            </div>
          </div>

          {/* 회고 위젯 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                일상 회고
              </h2>
              <span className="text-sm text-gray-500">오늘의 기록</span>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              {sampleReflections.map((reflection) => (
                <div key={reflection.id} className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      감사한 순간
                    </h3>
                    <p className="text-sm text-green-700">
                      {reflection.gratefulMoment}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      기억할 순간
                    </h3>
                    <p className="text-sm text-blue-700">
                      {reflection.memorableMoment}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                    <h3 className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      개선할 점
                    </h3>
                    <p className="text-sm text-purple-700">
                      {reflection.improvementPoint}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {reflection.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 빠른 액션 */}
            <div className="flex gap-2 mt-auto">
              <Link
                href="/auth/signup"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center text-sm font-medium"
              >
                회고 시작
              </Link>
            </div>
          </div>
        </div>

        {/* 체험 완료 CTA */}
        <div className="bg-gradient-to-r from-accent-600 to-accent-500 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">DaylyLog를 경험해보세요!</h2>
          <p className="text-xl text-accent-100 mb-6">
            지금 바로 당신만의 성장 스토리를 만들어가세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-accent-600 text-lg font-semibold rounded-2xl hover:bg-accent-50 transform hover:-translate-y-1 transition-all duration-300"
            >
              <Plus className="mr-2 w-5 h-5" />
              시작하기
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white text-lg font-semibold rounded-2xl border border-white/30 hover:bg-white/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
