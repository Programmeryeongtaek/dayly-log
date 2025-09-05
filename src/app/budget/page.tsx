'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useChallenge } from '@/hooks/budget/useChallenge';
import ChallengeModal from '@/components/budget/ChallengeModal';
import { useBudget, useCategories } from '@/hooks/budget';
import { BudgetCalendar, BudgetChart } from '@/components/budget';

interface ChallengeFormData {
  title: string;
  description: string;
  reason: string;
  enableAmountGoal: boolean;
  enableCountGoal: boolean;
  targetAmount: string; // TODO: 카테고리에 따라 필요하지 않을 수도 있음. 검토바람
  targetCount: string;
  duration: string;
  targetDate: string;
}

interface ExpenseForChallenge {
  name: string;
  amount: number;
  category: string;
  count?: number;
  type: 'income' | 'expense';
}

const BudgetPage = () => {
  const { user } = useAuth();
  const { createChallenge, isCreatingChallenge } = useChallenge();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 month 파라미터 읽기
  const monthParam = searchParams.get('month');

  // 날짜 상태
  const [currentDate, setCurrentDate] = useState(() => {
    if (monthParam) {
      const [year, month] = monthParam.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, 1);
    }
    return new Date();
  });
  const [isFixedEnabled, setIsFixedEnabled] = useState(true);

  // 챌린지 모달 상태
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseForChallenge | null>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // 거래내역 상태
  const [isTransactionListOpen, setIsTransactionListOpen] = useState(false);

  // 현재 월 문자열 생성
  const currentMonth = format(currentDate, 'yyyy-MM');

  // 데이터 hooks - 사용자 인증 확인
  const shouldFetchData = !!user?.id;

  const {
    transactions,
    budgetItems,
    dailyTotals,
    chartData,
    statistics,
    isLoading: isLoadingBudget,
  } = useBudget({
    userId: shouldFetchData ? user.id : undefined,
    month: currentMonth,
  });

  const { categories, isLoading: isLoadingCategories } = useCategories(
    shouldFetchData ? user?.id : undefined
  );

  // 날짜 포맷 함수
  const formatDateString = (date: Date) => format(date, 'yyyy-MM-dd');

  // 캘린더 날짜 생성
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    const firstDayOfWeek = start.getDay();
    const emptyDays = Array.from({ length: firstDayOfWeek }, () => null);

    return [...emptyDays, ...days];
  }, [currentDate]);

  // 카테고리별 분류
  const categorizedData = useMemo(() => {
    const incomeFixed = categories.filter((cat) => cat.type === 'income_fixed');
    const incomeVariable = categories.filter(
      (cat) => cat.type === 'income_variable'
    );
    const expenseFixed = categories.filter(
      (cat) => cat.type === 'expense_fixed'
    );
    const expenseVariable = categories.filter(
      (cat) => cat.type === 'expense_variable'
    );

    return {
      incomeFixed: incomeFixed.map((cat) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
      })),
      incomeVariable: incomeVariable.map((cat) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
      })),
      expenseFixed: expenseFixed.map((cat) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
      })),
      expenseVariable: expenseVariable.map((cat) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
      })),
    };
  }, [categories]);

  // totals 계산 (statistics를 기반으로)
  const totals = useMemo(
    () => ({
      income: {
        fixed: isFixedEnabled ? statistics.income.fixed : 0,
        variable: statistics.income.variable,
        total:
          (isFixedEnabled ? statistics.income.fixed : 0) +
          statistics.income.variable,
      },
      expense: {
        fixed: isFixedEnabled ? statistics.expense.fixed : 0,
        variable: statistics.expense.variable,
        total:
          (isFixedEnabled ? statistics.expense.fixed : 0) +
          statistics.expense.variable,
      },
      net: statistics.net,
    }),
    [statistics, isFixedEnabled]
  );

  // 핸들러들
  const handleFixedToggle = (enabled: boolean) => {
    setIsFixedEnabled(enabled);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDateString(date);
    router.push(`/budget/${dateStr}`);
  };

  // 차트에서 챌린지 버튼 클릭
  const handleChartChallengeClick = (
    categoryName: string,
    amount: number,
    count: number,
    type: 'income' | 'expense'
  ) => {
    if (!user?.id) return;

    const expenseForChallenge: ExpenseForChallenge = {
      name: `${categoryName}`,
      amount: amount,
      category: categoryName,
      count: count,
      type: type,
    };

    setSelectedExpense(expenseForChallenge);
    setIsChallengeModalOpen(true);
  };

  // 챌린지 생성 핸들러
  const handleChallengeSubmit = (
    data: ChallengeFormData & {
      category: string;
      categoryType: 'income' | 'expense';
    }
  ) => {
    if (!user?.id) return;

    createChallenge({
      title: data.title,
      description: data.description,
      reason: data.reason,
      enableAmountGoal: data.enableAmountGoal,
      enableCountGoal: data.enableCountGoal,
      targetAmount: data.targetAmount,
      targetCount: data.targetCount,
      targetDate: data.targetDate,
      category: data.category,
      categoryType: data.categoryType,
      userId: user.id,
    });

    // 모달 닫기
    setIsChallengeModalOpen(false);
    setSelectedExpense(null);
  };

  // 챌린지 모달 닫기 핸들러
  const handleChallengeModalClose = () => {
    setIsChallengeModalOpen(false);
    setSelectedExpense(null);
  };

  // 사용자 인증 확인
  if (!user?.id) {
    return (
      <div className="max-w-7xl mx-auto p-2 text-center py-8">
        <div className="bg-white rounded-lg p-8 shadow-sm border">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            로그인이 필요합니다
          </h3>
          <p className="text-gray-500">
            가계부를 관리하려면 먼저 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (shouldFetchData && (isLoadingBudget || isLoadingCategories)) {
    return (
      <div className="max-w-7xl mx-auto p-2 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-2 space-y-4">
        {/* 월 네비게이션 헤더 */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h1>
            <div className="flex gap-1">
              <button
                onClick={() => handleMonthChange('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleMonthChange('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 차트와 통계 */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <BudgetChart
            incomeData={chartData.incomeData}
            expenseData={chartData.expenseData}
            isFixedEnabled={isFixedEnabled}
            onFixedToggle={handleFixedToggle}
            totals={totals}
            categories={categorizedData}
            transactions={transactions}
            onChallengeClick={handleChartChallengeClick}
          />
        </div>

        {/* 캘린더 */}
        <BudgetCalendar
          currentDate={currentDate}
          calendarDays={calendarDays}
          dailyTotals={dailyTotals}
          onMonthChange={handleMonthChange}
          onDateSelect={handleDateSelect}
          formatDateString={formatDateString}
        />

        {/* 월별 거래 목록 */}
        {budgetItems.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <button
              onClick={() => setIsTransactionListOpen(!isTransactionListOpen)}
              className="w-full flex items-center justify-between mb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">가계내역</h2>
                <div className="text-xs text-gray-500">
                  총 {budgetItems.length}건 • 합계: {totals.net >= 0 ? '+' : ''}
                  {totals.net.toLocaleString()}원
                </div>
              </div>
              {isTransactionListOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isTransactionListOpen && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {budgetItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => router.push(`/budget/${item.date}`)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {format(new Date(item.date), 'M/d', { locale: ko })}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          item.type === 'income'
                            ? item.categoryType === 'fixed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-green-50 text-green-600'
                            : item.categoryType === 'fixed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="font-medium text-sm truncate">
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`font-semibold text-sm flex-shrink-0 ${
                        item.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'}
                      {item.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 거래가 없을 때 안내 */}
        {budgetItems.length === 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {format(currentDate, 'M월', { locale: ko })}에는 아직 거래가
              없습니다
            </h3>
            <p className="text-gray-500">
              캘린더에서 날짜를 선택해서 수입과 지출을 추가해보세요
            </p>
          </div>
        )}
      </div>

      {/* 챌린지 생성 모달 */}
      {selectedExpense && (
        <ChallengeModal
          isOpen={isChallengeModalOpen}
          onClose={handleChallengeModalClose}
          onSubmit={handleChallengeSubmit}
          challengeData={selectedExpense}
          isSubmitting={isCreatingChallenge}
        />
      )}
    </>
  );
};

export default BudgetPage;
