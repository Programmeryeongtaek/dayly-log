'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Calendar } from 'lucide-react';
import ExpenseForm from '@/components/expense/ExpenseForm';
import ExpenseList from '@/components/expense/ExpenseList';
import { CategoryType } from '@/types/expenses';
import { useCategories, useExpenses } from '@/hooks/expenses';

// 임시 사용자 ID (인증 구현 후 실제 사용자 ID로 교체 예정)
const TEMP_USER_ID = 'temp-user-1';

export default function ExpenseDatePage() {
  const params = useParams();
  const router = useRouter();
  const dateParam = params.date as string;

  // URL 날짜 유효성 검증
  const selectedDate = useMemo(() => {
    try {
      const date = parseISO(dateParam);
      return isValid(date) ? dateParam : null;
    } catch {
      return null;
    }
  }, [dateParam]);

  // 새 항목 추가를 위한 상태
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    category: '',
    type: 'variable' as CategoryType,
    newCategoryName: '',
    isCreatingCategory: false,
  });

  // 데이터 hooks
  const {
    expenses,
    addExpense,
    deleteExpense,
    isAddingExpense,
    isLoading: isLoadingExpenses,
  } = useExpenses({
    userId: TEMP_USER_ID,
    date: selectedDate || undefined,
  });

  const {
    fixedCategories,
    variableCategories,
    addCategory,
    isAddingCategory,
    isLoading: isLoadingCategories,
  } = useCategories(TEMP_USER_ID);

  // 선택된 날짜의 지출만 필터링
  const selectedDateExpenses = useMemo(() => {
    if (!selectedDate) return [];
    return expenses.filter((expense) => expense.date === selectedDate);
  }, [expenses, selectedDate]);

  // ExpenseList 컴포넌트용 데이터 변환
  const expenseListData = useMemo(
    () =>
      selectedDateExpenses.map((expense) => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        category: expense.category?.name || 'Unknown',
        date: expense.date,
      })),
    [selectedDateExpenses]
  );

  // 잘못된 날짜 URL인 경우 월별 페이지로 리다이렉트
  if (!selectedDate) {
    router.push('/expenses');
    return null;
  }

  // 핸들러 함수들
  const handleNewItemChange = (updates: Partial<typeof newItem>) => {
    setNewItem((prev) => ({ ...prev, ...updates }));
  };

  const handleBackToMonth = () => {
    router.push('/expenses');
  };

  const getCurrentCategories = () => {
    const categories =
      newItem.type === 'fixed' ? fixedCategories : variableCategories;
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
    }));
  };

  const handleAddCategory = () => {
    if (!newItem.newCategoryName.trim()) return;

    addCategory({
      user_id: TEMP_USER_ID,
      name: newItem.newCategoryName.trim(),
      type: newItem.type,
    });

    // 카테고리 추가 후 상태 초기화
    setNewItem((prev) => ({
      ...prev,
      newCategoryName: '',
      category: newItem.newCategoryName.trim(),
      isCreatingCategory: false,
    }));
  };

  const handleAddExpense = () => {
    if (!newItem.name.trim() || !newItem.amount || !newItem.category) return;

    // 선택된 카테고리의 ID 찾기
    const selectedCategory = getCurrentCategories().find(
      (cat) => cat.name === newItem.category
    );
    if (!selectedCategory) return;

    addExpense({
      user_id: TEMP_USER_ID,
      category_id: selectedCategory.id,
      name: newItem.name.trim(),
      amount: Number(newItem.amount),
      date: selectedDate,
      description: null,
    });

    // 항목명과 금액만 초기화 (카테고리와 타입은 유지)
    setNewItem((prev) => ({
      ...prev,
      name: '',
      amount: '',
    }));
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  };

  // 로딩 상태
  if (isLoadingExpenses || isLoadingCategories) {
    return (
      <div className="max-w-7xl mx-auto p-2 mobile:p-4 space-y-4 mobile:space-y-6">
        <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border animate-pulse">
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 mobile:p-4 space-y-4 mobile:space-y-6">
      {/* 지출 항목 추가 폼 */}
      <ExpenseForm
        selectedDate={selectedDate}
        newItem={newItem}
        onNewItemChange={handleNewItemChange}
        onBackToMonth={handleBackToMonth}
        onAddExpense={handleAddExpense}
        onAddCategory={handleAddCategory}
        getCurrentCategories={getCurrentCategories}
      />

      {/* 실시간 지출 목록 */}
      {expenseListData.length > 0 && (
        <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
          <ExpenseList
            expenses={expenseListData}
            fixedCategories={fixedCategories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              type: cat.type,
            }))}
            onDeleteExpense={handleDeleteExpense}
            title="내역"
          />
        </div>
      )}

      {/* 지출이 없을 때 안내 */}
      {expenseListData.length === 0 && (
        <div className="bg-white rounded-lg p-8 mobile:p-12 shadow-sm border text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {format(parseISO(selectedDate), 'M월 d일', { locale: ko })}에는 아직
            지출이 없습니다
          </h3>
          <p className="text-gray-500">
            위의 폼을 사용해서 지출을 추가해보세요
          </p>
        </div>
      )}

      {/* 로딩 표시 */}
      {(isAddingExpense || isAddingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500"></div>
            <span className="text-gray-700">
              {isAddingExpense
                ? '지출을 추가하는 중...'
                : '카테고리를 추가하는 중...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
