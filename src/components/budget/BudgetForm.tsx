'use client';

import { BudgetFormProps } from '@/types/budget';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BudgetForm({
  selectedDate,
  newItem,
  onNewItemChange,
  onBackToMonth,
  onAddItem,
  onAddCategory,
  getCurrentCategories,
}: BudgetFormProps) {
  const router = useRouter();

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem();
  };

  // 카테고리 추가 핸들러
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.newCategoryName.trim()) {
      console.error('카테고리 이름이 비어있습니다');
      return;
    }

    onAddCategory();
  };

  // 날짜 네비게이션 핸들러 추가
  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDateObj = parseISO(selectedDate);
    const newDate = new Date(currentDateObj);

    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }

    const newDateString = format(newDate, 'yyyy-MM-dd');
    router.push(`/budget/${newDateString}`);
  };

  const handleDatePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      router.push(`/budget/${newDate}`);
    }
  };

  return (
    <div className="bg-white flex flex-col gap-2 rounded-lg p-4 shadow-sm border">
      <div className="flex justify-between">
        <div className="flex items-center">
          <button
            onClick={() => handleDateChange('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-semibold">
            {format(parseISO(selectedDate), 'M월 d일', { locale: ko })}
          </h2>

          <button
            onClick={() => handleDateChange('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <button
              onClick={onBackToMonth}
              className=" text-accent-600 hover:text-accent-700 px-2 py-1 border border-accent-300 rounded-lg text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 날짜 직접 선택 */}
          <input
            type="date"
            value={selectedDate}
            onChange={handleDatePicker}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>

      {/* 항목 추가 폼 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700 text-sm">항목 추가</h3>
        </div>

        {/* 수입/지출 타입 선택 */}
        <div className="flex mb-3 ">
          <button
            type="button"
            onClick={() =>
              onNewItemChange({
                type: 'income',
                categoryType: 'fixed',
                category: '',
              })
            }
            className={`flex-1 px-3 py-2 rounded-l-lg border text-sm transition-colors flex items-center justify-center gap-2 ${
              newItem.type === 'income'
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            수입
          </button>
          <button
            type="button"
            onClick={() =>
              onNewItemChange({
                type: 'expense',
                categoryType: 'variable',
                category: '',
              })
            }
            className={`flex-1 px-3 py-2 rounded-r-lg border text-sm transition-colors flex items-center justify-center gap-2 ${
              newItem.type === 'expense'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            지출
          </button>
        </div>

        {/* 고정/변동 타입 선택 */}
        <div className="flex mb-3">
          <button
            type="button"
            onClick={() =>
              onNewItemChange({ categoryType: 'fixed', category: '' })
            }
            className={`flex-1 px-3  py-2 rounded-l-lg border text-sm transition-colors ${
              newItem.categoryType === 'fixed'
                ? 'bg-accent-500 text-white border-accent-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            고정
          </button>
          <button
            type="button"
            onClick={() =>
              onNewItemChange({ categoryType: 'variable', category: '' })
            }
            className={`flex-1 px-3  py-2 rounded-r-lg border text-sm  transition-colors ${
              newItem.categoryType === 'variable'
                ? 'bg-accent-500 text-white border-accent-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            변동
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 ">
          {/* 카테고리 선택/생성 */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">
                카테고리
              </label>
              {newItem.isCreatingCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="새 카테고리 이름"
                    value={newItem.newCategoryName}
                    onChange={(e) =>
                      onNewItemChange({ newCategoryName: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-accent-500 text-white px-2 py-1.5 rounded-lg hover:bg-accent-600 text-sm transition-colors"
                  >
                    추가
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onNewItemChange({
                        isCreatingCategory: false,
                        newCategoryName: '',
                      })
                    }
                    className="bg-gray-500 text-white px-2 py-1.5 rounded-lg hover:bg-gray-600 text-sm transition-colors"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      onNewItemChange({ category: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  >
                    <option value="">카테고리 선택</option>
                    {getCurrentCategories().map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      onNewItemChange({ isCreatingCategory: true })
                    }
                    className="bg-gray-200 text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">
                항목명
              </label>
              <input
                type="text"
                placeholder="항목명"
                value={newItem.name}
                onChange={(e) => onNewItemChange({ name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">
                금액
              </label>
              <input
                type="number"
                placeholder="금액"
                value={newItem.amount}
                onChange={(e) => onNewItemChange({ amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className={`w-full rounded-lg px-3 py-1.5 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm transition-colors ${
                  newItem.type === 'income'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                disabled={
                  !newItem.name.trim() || !newItem.amount || !newItem.category
                }
              >
                <Plus className="w-3 h-3" />
                추가
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
