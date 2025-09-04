'use client';

import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { BudgetFormProps } from '@/types/budget';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

  // 삭제된 카테고리 관리
  const [showDeletedCategories, setShowDeletedCategories] = useState(false);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem();
  };

  // 카테고리 추가 핸들러
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.newCategoryName.trim()) {
      console.error('카테고리 이름이 비어있습니다');
      return;
    }

    // 삭제된 동일 이름 카테고리 확인
    const categoryType = `${newItem.type}_${newItem.categoryType}`;
    const existingCategory = getCurrentCategories().find(
      (cat) =>
        cat.name === newItem.newCategoryName.trim() &&
        cat.type === categoryType &&
        cat.is_deleted
    );

    if (existingCategory) {
      const shouldRestore = confirm(
        `'${newItem.newCategoryName.trim()}' 카테고리를 복원하시겠습니까?`
      );

      if (shouldRestore) {
        await handleRestoreCategory(existingCategory.id);
        onNewItemChange({
          newCategoryName: '',
          category: existingCategory.name,
          isCreatingCategory: false,
        });
        return;
      }
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

  // 카테고리 삭제
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_deleted: true })
        .eq('id', categoryId);

      if (error) throw error;

      // 카테고리 목록 새로고침을 위해 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['categories'] });

      // 현재 선택된 카테고리가 선택된 경우 선택 해제
      if (
        newItem.category ===
        getCurrentCategories().find((cat) => cat.id === categoryId)?.name
      ) {
        onNewItemChange({ category: '' });
      }
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
    }
  };

  // 카테고리 복구
  const handleRestoreCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_deleted: false })
        .eq('id', categoryId);

      if (error) throw error;

      // 카테고리 목록 새로고침을 위해 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (error) {
      console.error('카테고리 복구 실패:', error);
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
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="새 카테고리 이름"
                      value={newItem.newCategoryName}
                      onChange={(e) =>
                        onNewItemChange({ newCategoryName: e.target.value })
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 text-sm transition-colors"
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
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 활성 카테고리 태그들 */}
                  <div className="flex flex-wrap gap-2">
                    {getCurrentCategories()
                      .filter((cat) => !cat.is_deleted)
                      .map((category) => (
                        <div
                          key={category.id}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            newItem.category === category.name
                              ? newItem.type === 'income'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              onNewItemChange({ category: category.name })
                            }
                            className="flex-1 text-left"
                          >
                            {category.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category.id)}
                            className={`ml-1 w-4 h-4 flex items-center justify-center hover:opacity-70 ${
                              newItem.category === category.name
                                ? 'text-white'
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                            title="카테고리 삭제"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                    {/* 카테고리 추가 버튼 */}
                    <button
                      type="button"
                      onClick={() =>
                        onNewItemChange({ isCreatingCategory: true })
                      }
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-accent-100 text-accent-600 hover:bg-accent-200 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />새 카테고리
                    </button>
                  </div>

                  {/* 삭제된 카테고리 섹션 */}
                  {getCurrentCategories().filter((cat) => cat.is_deleted)
                    .length > 0 && (
                    <div className="border-t pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setShowDeletedCategories(!showDeletedCategories)
                        }
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {showDeletedCategories ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        삭제된 카테고리 (
                        {
                          getCurrentCategories().filter((cat) => cat.is_deleted)
                            .length
                        }
                        개)
                      </button>

                      {showDeletedCategories && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {getCurrentCategories()
                            .filter((cat) => cat.is_deleted)
                            .map((category) => (
                              <div
                                key={category.id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-full text-sm"
                              >
                                <span className="text-gray-600">
                                  {category.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  ({category.transactionCount || 0}건)
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRestoreCategory(category.id)
                                  }
                                  className="ml-1 text-accent-600 hover:text-accent-700 text-xs underline"
                                >
                                  복구
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 선택된 카테고리 표시 */}
                  {newItem.category && (
                    <div className="text-xs text-gray-600">
                      선택된 카테고리:{' '}
                      <span className="font-medium">{newItem.category}</span>
                    </div>
                  )}
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
