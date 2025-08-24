'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Calendar } from 'lucide-react';
import ExpenseForm from '@/components/expense/ExpenseForm';
import ExpenseList from '@/components/expense/ExpenseList';

// 인터페이스들 (기존과 동일)
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

type CategoryType = 'fixed' | 'variable';

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

  // 기본 카테고리 (추후 Supabase에서 가져올 데이터)
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: '통신비', type: 'fixed' },
    { id: '2', name: '교통비', type: 'variable' },
  ]);

  // 모든 지출 항목 (추후 Supabase에서 가져올 데이터)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // 새 항목 추가를 위한 상태
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    category: '',
    type: 'variable' as CategoryType,
    newCategoryName: '',
    isCreatingCategory: false,
  });

  // ID 생성 함수
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // 선택된 날짜의 지출만 필터링
  const selectedDateExpenses = useMemo(() => {
    if (!selectedDate) return [];
    return expenses.filter((expense) => expense.date === selectedDate);
  }, [expenses, selectedDate]);

  // 카테고리별 분류
  const fixedCategories = categories.filter((cat) => cat.type === 'fixed');
  const variableCategories = categories.filter(
    (cat) => cat.type === 'variable'
  );

  // 총액 계산
  const totalAmount = selectedDateExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
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

  const getCurrentCategories = () =>
    newItem.type === 'fixed' ? fixedCategories : variableCategories;

  const handleAddCategory = () => {
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

  const handleAddExpense = () => {
    if (!newItem.name.trim() || !newItem.amount || !newItem.category) return;

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
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

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
      {selectedDateExpenses.length > 0 && (
        <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
          <ExpenseList
            expenses={selectedDateExpenses}
            fixedCategories={fixedCategories}
            onDeleteExpense={handleDeleteExpense}
            title="내역"
          />
        </div>
      )}

      {/* 지출이 없을 때 안내 */}
      {selectedDateExpenses.length === 0 && (
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
    </div>
  );
}
