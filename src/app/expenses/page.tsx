'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Target,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// 지출 항목 인터페이스
interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD 형식
}

// 카테고리 인터페이스
interface Category {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
}

// 카테고리 타입
type CategoryType = 'fixed' | 'variable';

export default function ExpensesPage() {
  // 기본 카테고리
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: '통신비', type: 'fixed' },
    { id: '2', name: '식비', type: 'variable' },
    { id: '3', name: '교통비', type: 'variable' },
  ]);

  // 모든 지출 항목을 하나의 배열로 관리
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isFixedEnabled, setIsFixedEnabled] = useState(true);

  // 날짜 관련 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 새 항목 추가를 위한 상태
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    category: '',
    type: 'variable' as CategoryType,
    newCategoryName: '',
    isCreatingCategory: false,
  });
  const [showItemForm, setShowItemForm] = useState(false);

  // 일괄 추가 상태
  const [bulkItems, setBulkItems] = useState<
    Array<{
      id: string;
      name: string;
      amount: string;
      category: string;
      type: CategoryType;
    }>
  >([]);

  // ID 생성 함수 (단순하므로 useCallback 없음)
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // 날짜 포맷 함수
  const formatDateString = (date: Date) => format(date, 'yyyy-MM-dd');

  // 월별 지출 필터링 (복잡한 계산이므로 useMemo 사용)
  const monthlyExpenses = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthStartStr = formatDateString(monthStart);
    const monthEndStr = formatDateString(monthEnd);

    return expenses.filter(
      (expense) => expense.date >= monthStartStr && expense.date <= monthEndStr
    );
  }, [expenses, currentDate]);

  // 선택된 날짜의 지출 필터링 (단순하므로 useMemo 제거)
  const selectedDateExpenses = selectedDate
    ? expenses.filter((expense) => expense.date === selectedDate)
    : [];

  // 표시할 지출 목록 결정
  const displayExpenses = selectedDate ? selectedDateExpenses : monthlyExpenses;

  // 카테고리별 분류
  const fixedCategories = categories.filter((cat) => cat.type === 'fixed');
  const variableCategories = categories.filter(
    (cat) => cat.type === 'variable'
  );

  const fixedExpenses = displayExpenses.filter((expense) =>
    fixedCategories.some((cat) => cat.name === expense.category)
  );
  const variableExpenses = displayExpenses.filter((expense) =>
    variableCategories.some((cat) => cat.name === expense.category)
  );

  // 총액 계산 (복잡한 집계이므로 useMemo)
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

  // 차트 데이터 (복잡한 데이터 변환이므로 useMemo)
  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};

    displayExpenses.forEach((expense) => {
      if (
        !isFixedEnabled &&
        fixedCategories.some((cat) => cat.name === expense.category)
      ) {
        return; // 고정지출 비활성화시 제외
      }
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: fixedCategories.some((cat) => cat.name === category)
        ? '#14b8a6' // 고정지출 색상
        : '#0d9488', // 변동지출 색상
    }));
  }, [displayExpenses, isFixedEnabled, fixedCategories]);

  // 캘린더 날짜 생성
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    // 첫 번째 주의 빈 칸들 추가
    const firstDayOfWeek = start.getDay();
    const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null);

    return [...emptyDays, ...days];
  }, [currentDate]);

  // 날짜별 지출 총액 계산 (복잡한 계산이므로 useMemo 사용)
  const dailyTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    monthlyExpenses.forEach((expense) => {
      totals[expense.date] = (totals[expense.date] || 0) + expense.amount;
    });
    return totals;
  }, [monthlyExpenses]);

  // 현재 타입별 카테고리 목록
  const getCurrentCategories = () =>
    newItem.type === 'fixed' ? fixedCategories : variableCategories;

  // 카테고리 추가 (단순하므로 useCallback 없음)
  const addCategory = () => {
    if (!newItem.newCategoryName.trim()) return;

    const newCategory: Category = {
      id: generateId(),
      name: newItem.newCategoryName.trim(),
      type: newItem.type,
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewItem((prev) => ({
      ...prev,
      newCategoryName: '',
      category: newCategory.name,
      isCreatingCategory: false,
    }));
  };

  // 일괄 항목 삭제
  const removeBulkItem = (id: string) => {
    setBulkItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 일괄 항목 업데이트
  const updateBulkItem = (
    id: string,
    field: string,
    value: string | CategoryType
  ) => {
    setBulkItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // 지출 항목 추가 (단일)
  const addExpenseItem = () => {
    if (!newItem.name.trim() || !newItem.amount || !newItem.category) return;
    if (!selectedDate) {
      alert('날짜를 먼저 선택해주세요.');
      return;
    }

    const item: ExpenseItem = {
      id: generateId(),
      name: newItem.name.trim(),
      amount: Number(newItem.amount),
      category: newItem.category,
      date: selectedDate,
    };

    setExpenses((prev) => [...prev, item]);

    // 항목명과 금액만 초기화 (카테고리와 타입은 유지)
    setNewItem((prev) => ({
      ...prev,
      name: '',
      amount: '',
    }));

    // 폼은 계속 열어두기 (showItemForm은 false로 변경 안 함)
  };

  // 지출 항목 삭제
  const deleteExpenseItem = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  // 월 변경
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null); // 월 변경시 선택 날짜 초기화
  };

  // 날짜 선택
  const selectDate = (date: Date) => {
    const dateStr = formatDateString(date);
    setSelectedDate(dateStr);
    setShowItemForm(true);
  };

  const CHART_COLORS = [
    '#14b8a6',
    '#0d9488',
    '#0f766e',
    '#115e59',
    '#134e4a',
    '#f59e0b',
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* 월별 보기에서만 차트와 통계 표시 */}
      {!selectedDate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 차트 영역 */}
          <div className="flex flex-col items-center">
            {chartData.length > 0 ? (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${((percent as number) * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toLocaleString()}원`,
                        '금액',
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">지출 데이터가 없습니다</p>
                </div>
              </div>
            )}
          </div>

          {/* 통계 영역 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFixedEnabled}
                  onChange={(e) => setIsFixedEnabled(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${isFixedEnabled ? 'bg-accent-500' : 'bg-gray-300'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${isFixedEnabled ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`}
                  />
                </div>
                <span className="ml-2 text-sm font-medium">고정지출 포함</span>
              </label>
            </div>

            {/* 고정지출 통계 */}
            {isFixedEnabled && totals.fixed > 0 && (
              <div>
                <h3 className="font-semibold text-accent-700 mb-2">
                  고정지출: {totals.fixed.toLocaleString()}원
                </h3>
                <div className="space-y-1 text-sm">
                  {fixedCategories.map((category) => {
                    const amount = fixedExpenses
                      .filter((item) => item.category === category.name)
                      .reduce((sum, item) => sum + item.amount, 0);
                    return amount > 0 ? (
                      <div key={category.id} className="flex justify-between">
                        <span>{category.name}:</span>
                        <span className="font-medium">
                          {amount.toLocaleString()}원
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* 변동지출 통계 */}
            {totals.variable > 0 && (
              <div>
                <h3 className="font-semibold text-accent-600 mb-2">
                  변동지출: {totals.variable.toLocaleString()}원
                </h3>
                <div className="space-y-1 text-sm">
                  {variableCategories.map((category) => {
                    const amount = variableExpenses
                      .filter((item) => item.category === category.name)
                      .reduce((sum, item) => sum + item.amount, 0);
                    return amount > 0 ? (
                      <div key={category.id} className="flex justify-between">
                        <span>{category.name}:</span>
                        <span className="font-medium">
                          {amount.toLocaleString()}원
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="flex justify-between font-bold text-lg">
                <span>총 지출:</span>
                <span className="text-accent-600">
                  {totals.total.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 캘린더 */}
      {!selectedDate && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 캘린더 날짜 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-16" />;
              }

              const dayStr = formatDateString(day);
              const dayTotal = dailyTotals[dayStr] || 0;
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={dayStr}
                  onClick={() => selectDate(day)}
                  className={`
                    h-16 p-2 text-left border rounded-lg transition-all hover:bg-accent-50
                    ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 text-gray-400'}
                    ${isTodayDate ? 'ring-2 ring-accent-500' : ''}
                    ${dayTotal > 0 ? 'bg-accent-50 border-accent-200' : ''}
                  `}
                >
                  <div className="text-sm font-medium">{format(day, 'd')}</div>
                  {dayTotal > 0 && (
                    <div className="text-xs text-accent-600 mt-1">
                      {dayTotal.toLocaleString()}원
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 지출 항목 추가 폼 */}
      {showItemForm && selectedDate && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {format(parseISO(selectedDate), 'M월 d일', { locale: ko })} 지출
            </h2>
            {selectedDate && (
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setShowItemForm(false);
                }}
                className="text-accent-600 hover:text-accent-700 px-4 py-2 border border-accent-300 rounded-lg"
              >
                월별 보기
              </button>
            )}
          </div>

          <div className="space-y-3">
            {bulkItems.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg"
              >
                {/* 타입 선택 */}
                <div>
                  <label className="block text-xs font-medium mb-1">타입</label>
                  <select
                    value={item.type}
                    onChange={(e) =>
                      updateBulkItem(
                        item.id,
                        'type',
                        e.target.value as CategoryType
                      )
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="variable">변동</option>
                    <option value="fixed">고정</option>
                  </select>
                </div>

                {/* 카테고리 선택 */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    카테고리
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) =>
                      updateBulkItem(item.id, 'category', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">선택</option>
                    {(item.type === 'fixed'
                      ? fixedCategories
                      : variableCategories
                    ).map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 항목명 */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    항목명
                  </label>
                  <input
                    type="text"
                    placeholder="예: 점심"
                    value={item.name}
                    onChange={(e) =>
                      updateBulkItem(item.id, 'name', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* 금액 */}
                <div>
                  <label className="block text-xs font-medium mb-1">금액</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={item.amount}
                    onChange={(e) =>
                      updateBulkItem(item.id, 'amount', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* 삭제 버튼 */}
                <div className="flex items-end">
                  <button
                    onClick={() => removeBulkItem(item.id)}
                    className="w-full bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 단일 추가 폼 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">항목 추가</h3>
            </div>
            {/* 타입 선택 */}
            <div className="flex mb-4">
              <button
                type="button"
                onClick={() =>
                  setNewItem((prev) => ({
                    ...prev,
                    type: 'fixed',
                    category: '',
                  }))
                }
                className={`px-4 py-2 rounded-l-lg border ${
                  newItem.type === 'fixed'
                    ? 'bg-accent-500 text-white border-accent-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                고정지출
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewItem((prev) => ({
                    ...prev,
                    type: 'variable',
                    category: '',
                  }))
                }
                className={`px-4 py-2 rounded-r-lg border ${
                  newItem.type === 'variable'
                    ? 'bg-accent-500 text-white border-accent-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                변동지출
              </button>
            </div>

            <div className="space-y-4">
              {/* 카테고리 선택/생성 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    카테고리
                  </label>
                  {newItem.isCreatingCategory ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="새 카테고리 이름"
                        value={newItem.newCategoryName}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            newCategoryName: e.target.value,
                          }))
                        }
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      />
                      <button
                        onClick={addCategory}
                        className="bg-accent-500 text-white px-3 py-2 rounded-lg hover:bg-accent-600"
                      >
                        추가
                      </button>
                      <button
                        onClick={() =>
                          setNewItem((prev) => ({
                            ...prev,
                            isCreatingCategory: false,
                            newCategoryName: '',
                          }))
                        }
                        className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">카테고리 선택</option>
                        {getCurrentCategories().map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          setNewItem((prev) => ({
                            ...prev,
                            isCreatingCategory: true,
                          }))
                        }
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    항목명
                  </label>
                  <input
                    type="text"
                    placeholder="지출 항목명"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">금액</label>
                  <input
                    type="number"
                    placeholder="금액"
                    value={newItem.amount}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={addExpenseItem}
                    className="w-full bg-accent-500 text-white rounded-lg px-4 py-2 hover:bg-accent-600 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 실시간 지출 목록 - 폼 아래에 표시 */}
          {selectedDateExpenses.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-700 mb-3">
                내역 ({selectedDateExpenses.length}건)
              </h3>
              <div className="space-y-2">
                {selectedDateExpenses
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            fixedCategories.some(
                              (cat) => cat.name === expense.category
                            )
                              ? 'bg-accent-100 text-accent-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {expense.category}
                        </span>
                        <span className="font-medium">{expense.name}</span>
                        <span className="text-accent-600 font-semibold">
                          {expense.amount.toLocaleString()}원
                        </span>
                      </div>
                      <button
                        onClick={() => deleteExpenseItem(expense.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="mt-3 p-3 bg-accent-50 rounded-lg">
                <div className="flex justify-between font-semibold text-accent-700">
                  <span>오늘 총 지출:</span>
                  <span>
                    {selectedDateExpenses
                      .reduce((sum, item) => sum + item.amount, 0)
                      .toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
