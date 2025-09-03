'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import AuthGuard from '@/components/auth/AuthGuard';
import { useBudget, useCategories } from '@/hooks/budget';
import { CategoryType } from '@/types/budget';
import { BudgetForm, BudgetList } from '@/components/budget';

const BudgetDatePage = () => {
  const params = useParams();
  const router = useRouter();
  const dateParam = params.date as string;
  const { user, isLoading: isAuthLoading } = useAuth();

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
    type: 'expense' as 'income' | 'expense',
    categoryType: 'variable' as 'fixed' | 'variable',
    newCategoryName: '',
    isCreatingCategory: false,
  });

  // 데이터 hooks
  const {
    budgetItems,
    addTransaction,
    deleteTransaction,
    isAddingTransaction,
    isLoading: isLoadingBudget,
  } = useBudget({
    userId: user?.id,
    date: selectedDate || undefined,
  });

  const {
    categories,
    addCategory,
    isAddingCategory,
    isLoading: isLoadingCategories,
  } = useCategories(user?.id);

  // 선택된 날짜의 항목만 필터링
  const selectedDateItems = useMemo(() => {
    if (!selectedDate) return [];
    return budgetItems.filter((item) => item.date === selectedDate);
  }, [budgetItems, selectedDate]);

  // 수입/지출별로 분리
  const incomeItems = useMemo(
    () => selectedDateItems.filter((item) => item.type === 'income'),
    [selectedDateItems]
  );

  const expenseItems = useMemo(
    () => selectedDateItems.filter((item) => item.type === 'expense'),
    [selectedDateItems]
  );

  // 잘못된 날짜 URL인 경우 월별 페이지로 리디렉트
  if (!selectedDate) {
    router.push('/budget');
    return null;
  }

  // 인증 확인 및 로딩 상태
  if (isAuthLoading || !user) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-2space-y-4 ">
          <div className="bg-white rounded-lg p-4  shadow-sm border animate-pulse">
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // 핸들러 함수들
  const handleNewItemChange = (updates: Partial<typeof newItem>) => {
    setNewItem((prev) => ({ ...prev, ...updates }));
  };

  const handleBackToMonth = () => {
    router.push('/budget');
  };

  const getCurrentCategories = () => {
    // 현재 선택된 타입과 카테고리 타입에 맞는 카테고리들 반환
    const targetType: CategoryType =
      `${newItem.type}_${newItem.categoryType}` as CategoryType;
    const filteredCategories = categories.filter(
      (cat) => cat.type === targetType
    );

    return filteredCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
    }));
  };

  const handleAddCategory = () => {
    if (!newItem.newCategoryName.trim() || !user?.id) return;

    const categoryType: CategoryType =
      `${newItem.type}_${newItem.categoryType}` as CategoryType;

    addCategory({
      user_id: user.id,
      name: newItem.newCategoryName.trim(),
      type: categoryType,
    });

    // 카테고리 추가 후 상태 초기화
    setNewItem((prev) => ({
      ...prev,
      newCategoryName: '',
      category: newItem.newCategoryName.trim(),
      isCreatingCategory: false,
    }));
  };

  const handleAddItem = () => {
    if (
      !newItem.name.trim() ||
      !newItem.amount ||
      !newItem.category ||
      !user?.id
    )
      return;

    // 선택된 카테고리의 ID 찾기
    const selectedCategory = getCurrentCategories().find(
      (cat) => cat.name === newItem.category
    );
    if (!selectedCategory) return;

    addTransaction({
      user_id: user.id,
      category_id: selectedCategory.id,
      name: newItem.name.trim(),
      amount: Number(newItem.amount),
      date: selectedDate,
      type: newItem.type,
      description: null,
    });

    // 항목명과 금액만 초기화 (카테고리와 타입은 유지)
    setNewItem((prev) => ({
      ...prev,
      name: '',
      amount: '',
    }));
  };

  const handleDeleteItem = (id: string, type: 'income' | 'expense') => {
    deleteTransaction({ id, type });
  };

  // 로딩 상태
  if (isLoadingBudget || isLoadingCategories) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-2  space-y-4 ">
          <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto p-2 space-y-4 ">
        {/* 가계부 항목 추가 폼 */}
        <BudgetForm
          selectedDate={selectedDate}
          newItem={newItem}
          onNewItemChange={handleNewItemChange}
          onBackToMonth={handleBackToMonth}
          onAddItem={handleAddItem}
          onAddCategory={handleAddCategory}
          getCurrentCategories={getCurrentCategories}
        />

        {/* 수입 목록 */}
        {incomeItems.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <BudgetList
              items={incomeItems}
              onDeleteItem={(id) => handleDeleteItem(id, 'income')}
              title="수입 내역"
              type="income"
            />
          </div>
        )}

        {/* 지출 목록 */}
        {expenseItems.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <BudgetList
              items={expenseItems}
              onDeleteItem={(id) => handleDeleteItem(id, 'expense')}
              title="지출 내역"
              type="expense"
            />
          </div>
        )}

        {/* 거래가 없을 때 안내 */}
        {selectedDateItems.length === 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {format(parseISO(selectedDate), 'M월 d일', { locale: ko })} 내역이
              없습니다.
            </h3>
          </div>
        )}

        {/* 로딩 표시 */}
        {(isAddingTransaction || isAddingCategory) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500"></div>
              <span className="text-gray-700">
                {isAddingTransaction
                  ? '항목을 추가하는 중...'
                  : '카테고리를 추가하는 중...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default BudgetDatePage;
