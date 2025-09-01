'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
} from 'date-fns';
import ExpenseChart from '@/components/expense/ExpenseChart';
import ExpenseCalendar from '@/components/expense/ExpenseCalendar';
import { ko } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useCategories, useExpenses } from '@/hooks/expenses';
import { useAuth } from '@/hooks/auth';
import { useChallenge } from '@/hooks/expenses/useChallenge';
import ChallengeModal from '@/components/expense/ChallengeModal';

interface ChallengeFormData {
  title: string;
  description: string;
  reason: string;
  targetAmount: string; // TODO: 카테고리에 따라 필요하지 않을 수도 있음. 검토바람
  duration: string;
  targetDate: string;
}

interface ExpenseForChallenge {
  name: string;
  amount: number;
  category: string;
}

const ExpensesPage = () => {
  const { user } = useAuth();
  const { createChallenge, isCreatingChallenge } = useChallenge();
  const router = useRouter();

  // 날짜 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFixedEnabled, setIsFixedEnabled] = useState(true);

  // 챌린지 모달 상태
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseForChallenge | null>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // 현재 월 문자열 생성
  const currentMonth = format(currentDate, 'yyyy-MM');

  // 데이터 hooks - 사용자 인증 확인
  const shouldFetchData = !!user?.id;

  const {
    expenses,
    statistics,
    categoryTotals,
    isLoading: isLoadingExpenses,
  } = useExpenses({
    userId: shouldFetchData ? user.id : undefined,
    month: currentMonth,
  });

  const {
    fixedCategories,
    variableCategories,
    isLoading: isLoadingCategories,
  } = useCategories(shouldFetchData ? user?.id : undefined);

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

  // 날짜별 지출 총액 계산
  const dailyTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    expenses.forEach((expense) => {
      const dateKey = expense.date;
      totals[dateKey] = (totals[dateKey] || 0) + expense.amount;
    });

    return totals;
  }, [expenses]);

  // 차트 데이터 생성 (UI 컴포넌트용)
  const chartData = useMemo(() => {
    return categoryTotals
      .filter((category) => {
        if (!isFixedEnabled && category.type === 'fixed') return false;
        return category.amount > 0;
      })
      .map((category) => ({
        name: category.name,
        value: category.amount,
      }));
  }, [categoryTotals, isFixedEnabled]);

  // ExpenseChart 컴포넌트용 props 준비
  const fixedExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.category?.type === 'fixed')
        .map((e) => ({ category: e.category?.name || '', amount: e.amount })),
    [expenses]
  );

  const variableExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.category?.type === 'variable')
        .map((e) => ({ category: e.category?.name || '', amount: e.amount })),
    [expenses]
  );

  // 통계 계산 (UI 용)
  const totals = useMemo(
    () => ({
      fixed: isFixedEnabled ? statistics.fixed : 0,
      variable: statistics.variable,
      total: (isFixedEnabled ? statistics.fixed : 0) + statistics.variable,
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
    router.push(`/expenses/${dateStr}`);
  };

  // 차트에서 챌린지 버튼 클릭
  const handleChartChallengeClick = (
    categoryName: string,
    amount: number,
    type: 'fixed' | 'variable'
  ) => {
    if (!user?.id) return;

    const expenseForChallenge: ExpenseForChallenge = {
      name: `${categoryName} 줄이기`,
      amount: amount,
      category: categoryName,
    };

    setSelectedExpense(expenseForChallenge);
    setIsChallengeModalOpen(true);
  };

  // 챌린지 버튼 클릭
  const handleChallengeClick = (expense: (typeof expenses)[0]) => {
    if (!user?.id) return;

    const expenseForChallenge: ExpenseForChallenge = {
      name: expense.name,
      amount: expense.amount,
      category: expense.category?.name || 'Unknown',
    };

    setSelectedExpense(expenseForChallenge);
    setIsChallengeModalOpen(true);
  };

  // 챌린지 생성 핸들러
  const handleChallengeSubmit = (
    data: ChallengeFormData & { category: string }
  ) => {
    if (!user?.id) return;

    createChallenge({
      title: data.title,
      description: data.description,
      reason: data.reason,
      targetAmount: data.targetAmount,
      targetDate: data.targetDate,
      category: data.category,
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
      <div className="max-w-7xl mx-auto p-2 mobile:p-4 text-center py-8">
        <div className="bg-white rounded-lg p-8 shadow-sm border">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            로그인이 필요합니다
          </h3>
          <p className="text-gray-500">
            지출을 관리하려면 먼저 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (shouldFetchData && (isLoadingExpenses || isLoadingCategories)) {
    return (
      <div className="max-w-7xl mx-auto p-2 mobile:p-4 space-y-4 mobile:space-y-6">
        <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border animate-pulse">
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-2 mobile:p-4 space-y-4 mobile:space-y-6">
        {/* 차트와 통계 - 챌린지 기능 포함 */}
        <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
          <ExpenseChart
            chartData={chartData}
            isFixedEnabled={isFixedEnabled}
            onFixedToggle={handleFixedToggle}
            totals={totals}
            fixedCategories={fixedCategories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              type: cat.type,
            }))}
            variableCategories={variableCategories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              type: cat.type,
            }))}
            fixedExpenses={fixedExpenses}
            variableExpenses={variableExpenses}
            onChallengeClick={handleChartChallengeClick}
            showChallengeButtons={true}
          />
        </div>

        {/* 캘린더 */}
        <ExpenseCalendar
          currentDate={currentDate}
          calendarDays={calendarDays}
          dailyTotals={dailyTotals}
          onMonthChange={handleMonthChange}
          onDateSelect={handleDateSelect}
          formatDateString={formatDateString}
        />

        {/* 월별 지출 목록 */}
        {expenses.length > 0 && (
          <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-3 mobile:mb-4">
              <h2 className="text-base mobile:text-lg font-semibold">
                이번 달 지출 내역
              </h2>
              <div className="text-xs mobile:text-sm text-gray-500">
                총 {expenses.length}건 • {totals.total.toLocaleString()}원
              </div>
            </div>

            <div className="space-y-2">
              {expenses.slice(0, 10).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2 mobile:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => router.push(`/expenses/${expense.date}`)}
                >
                  <div className="flex items-center gap-2 mobile:gap-3 flex-1 min-w-0">
                    <span className="text-xs mobile:text-sm text-gray-500 flex-shrink-0">
                      {format(parseISO(expense.date), 'M/d', { locale: ko })}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        expense.category?.type === 'fixed'
                          ? 'bg-accent-100 text-accent-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {expense.category?.name}
                    </span>
                    <span className="font-medium text-sm mobile:text-base truncate">
                      {expense.name}
                    </span>
                  </div>
                  <span className="text-accent-600 font-semibold text-sm mobile:text-base flex-shrink-0">
                    {expense.amount.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>

            {expenses.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  {expenses.length - 10}개 항목이 더 있습니다. 날짜를 클릭해서
                  자세히 보세요.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 지출이 없을 때 안내 */}
        {expenses.length === 0 && (
          <div className="bg-white rounded-lg p-8 mobile:p-12 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {format(currentDate, 'M월', { locale: ko })}에는 아직 지출이
              없습니다
            </h3>
            <p className="text-gray-500">
              캘린더에서 날짜를 선택해서 지출을 추가해보세요
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
          expenseData={selectedExpense}
          isSubmitting={isCreatingChallenge}
        />
      )}
    </>
  );
};

export default ExpensesPage;
