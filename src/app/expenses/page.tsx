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

// 인터페이스들
interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
}

export default function ExpensesPage() {
  const router = useRouter();

  // 기본 카테고리 (추후 Supabase에서 가져올 데이터)
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: '통신비', type: 'fixed' },
    { id: '2', name: '교통비', type: 'variable' },
  ]);

  // 모든 지출 항목 (추후 Supabase에서 가져올 데이터)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isFixedEnabled, setIsFixedEnabled] = useState(true);

  // 날짜 관련 상태
  const [currentDate, setCurrentDate] = useState(new Date());

  // 날짜 포맷 함수
  const formatDateString = (date: Date) => format(date, 'yyyy-MM-dd');

  // 월별 지출 필터링
  const monthlyExpenses = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthStartStr = formatDateString(monthStart);
    const monthEndStr = formatDateString(monthEnd);

    return expenses.filter(
      (expense) => expense.date >= monthStartStr && expense.date <= monthEndStr
    );
  }, [expenses, currentDate]);

  // 카테고리별 분류
  const fixedCategories = categories.filter((cat) => cat.type === 'fixed');
  const variableCategories = categories.filter(
    (cat) => cat.type === 'variable'
  );

  const fixedExpenses = monthlyExpenses.filter((expense) =>
    fixedCategories.some((cat) => cat.name === expense.category)
  );
  const variableExpenses = monthlyExpenses.filter((expense) =>
    variableCategories.some((cat) => cat.name === expense.category)
  );

  // 총액 계산
  const totals = useMemo(() => {
    const fixedTotal = fixedExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const variableTotal = variableExpenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    return {
      fixed: isFixedEnabled ? fixedTotal : 0,
      variable: variableTotal,
      total: (isFixedEnabled ? fixedTotal : 0) + variableTotal,
    };
  }, [fixedExpenses, variableExpenses, isFixedEnabled]);

  // 차트 데이터
  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};

    monthlyExpenses.forEach((expense) => {
      if (
        !isFixedEnabled &&
        fixedCategories.some((cat) => cat.name === expense.category)
      ) {
        return;
      }
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [monthlyExpenses, isFixedEnabled, fixedCategories]);

  // 캘린더 날짜 생성
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    const firstDayOfWeek = start.getDay();
    const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null);

    return [...emptyDays, ...days];
  }, [currentDate]);

  // 날짜별 지출 총액 계산
  const dailyTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    monthlyExpenses.forEach((expense) => {
      totals[expense.date] = (totals[expense.date] || 0) + expense.amount;
    });
    return totals;
  }, [monthlyExpenses]);

  // 핸들러 함수들
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

  // 날짜 선택 시 동적 라우팅으로 이동
  const handleDateSelect = (date: Date) => {
    const dateStr = formatDateString(date);
    router.push(`/expenses/${dateStr}`);
  };

  // 지출 삭제 (월별 보기에서)
  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-2 mobile:p-4 space-y-4 mobile:space-y-6">
      {/* 차트와 통계 */}
      <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
        <ExpenseChart
          chartData={chartData}
          isFixedEnabled={isFixedEnabled}
          onFixedToggle={handleFixedToggle}
          totals={totals}
          fixedCategories={fixedCategories}
          variableCategories={variableCategories}
          fixedExpenses={fixedExpenses}
          variableExpenses={variableExpenses}
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
      {monthlyExpenses.length > 0 && (
        <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-3 mobile:mb-4">
            <h2 className="text-base mobile:text-lg font-semibold">
              이번 달 지출 내역
            </h2>
            <div className="text-xs mobile:text-sm text-gray-500">
              총 {monthlyExpenses.length}건 • {totals.total.toLocaleString()}원
            </div>
          </div>

          {/* 간단한 월별 리스트 */}
          <div className="space-y-2">
            {monthlyExpenses
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 10) // 최근 10개만 미리보기
              .map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2 mobile:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/expenses/${expense.date}`)}
                >
                  <div className="flex items-center gap-2 mobile:gap-3 flex-1 min-w-0">
                    <span className="text-xs mobile:text-sm text-gray-500 flex-shrink-0">
                      {format(parseISO(expense.date), 'M/d', { locale: ko })}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        fixedCategories.some(
                          (cat) => cat.name === expense.category
                        )
                          ? 'bg-accent-100 text-accent-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {expense.category}
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

          {monthlyExpenses.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                {monthlyExpenses.length - 10}개 항목이 더 있습니다. 날짜를
                클릭해서 자세히 보세요.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 지출이 없을 때 안내 */}
      {monthlyExpenses.length === 0 && (
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
  );
}
