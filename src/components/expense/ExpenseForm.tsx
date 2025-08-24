'use client';

import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
}

interface NewItemState {
  name: string;
  amount: string;
  category: string;
  type: 'fixed' | 'variable';
  newCategoryName: string;
  isCreatingCategory: boolean;
}

interface ExpenseFormProps {
  selectedDate: string;
  newItem: NewItemState;
  onNewItemChange: (updates: Partial<NewItemState>) => void;
  onBackToMonth: () => void;
  onAddExpense: () => void;
  onAddCategory: () => void;
  getCurrentCategories: () => Category[];
}

export default function ExpenseForm({
  selectedDate,
  newItem,
  onNewItemChange,
  onBackToMonth,
  onAddExpense,
  onAddCategory,
  getCurrentCategories,
}: ExpenseFormProps) {
  return (
    <div className="bg-white rounded-lg p-4 mobile:p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-3 mobile:mb-4">
        <h2 className="text-base mobile:text-lg font-semibold">
          {format(parseISO(selectedDate), 'M월 d일', { locale: ko })} 지출
        </h2>
        <button
          onClick={onBackToMonth}
          className="text-accent-600 hover:text-accent-700 px-2 mobile:px-4 py-1 mobile:py-2 border border-accent-300 rounded-lg text-sm mobile:text-base"
        >
          월별 보기
        </button>
      </div>

      {/* 단일 추가 폼 */}
      <div>
        <div className="flex items-center justify-between mb-3 mobile:mb-4">
          <h3 className="font-medium text-gray-700 text-sm mobile:text-base">
            항목 추가
          </h3>
        </div>

        {/* 타입 선택 */}
        <div className="flex mb-3 mobile:mb-4">
          <button
            type="button"
            onClick={() => onNewItemChange({ type: 'fixed', category: '' })}
            className={`flex-1 px-3 mobile:px-4 py-2 rounded-l-lg border text-sm mobile:text-base ${
              newItem.type === 'fixed'
                ? 'bg-accent-500 text-white border-accent-500'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            고정지출
          </button>
          <button
            type="button"
            onClick={() => onNewItemChange({ type: 'variable', category: '' })}
            className={`flex-1 px-3 mobile:px-4 py-2 rounded-r-lg border text-sm mobile:text-base ${
              newItem.type === 'variable'
                ? 'bg-accent-500 text-white border-accent-500'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            변동지출
          </button>
        </div>

        <div className="space-y-3 mobile:space-y-4">
          {/* 카테고리 선택/생성 */}
          <div className="space-y-3 mobile:space-y-0 mobile:grid mobile:grid-cols-2 mobile:gap-4">
            <div>
              <label className="block text-xs mobile:text-sm font-medium mb-1">
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
                    className="flex-1 border border-gray-300 rounded-lg px-2 mobile:px-3 py-1.5 mobile:py-2 text-sm mobile:text-base focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <button
                    onClick={onAddCategory}
                    className="bg-accent-500 text-white px-2 mobile:px-3 py-1.5 mobile:py-2 rounded-lg hover:bg-accent-600 text-sm"
                  >
                    추가
                  </button>
                  <button
                    onClick={() =>
                      onNewItemChange({
                        isCreatingCategory: false,
                        newCategoryName: '',
                      })
                    }
                    className="bg-gray-500 text-white px-2 mobile:px-3 py-1.5 mobile:py-2 rounded-lg hover:bg-gray-600 text-sm"
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
                    className="flex-1 border border-gray-300 rounded-lg px-2 mobile:px-3 py-1.5 mobile:py-2 text-sm mobile:text-base focus:outline-none focus:ring-2 focus:ring-accent-500"
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
                      onNewItemChange({ isCreatingCategory: true })
                    }
                    className="bg-gray-200 text-gray-700 px-2 mobile:px-3 py-1.5 mobile:py-2 rounded-lg hover:bg-gray-300"
                  >
                    <Plus className="w-3 h-3 mobile:w-4 mobile:h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs mobile:text-sm font-medium mb-1">
                항목명
              </label>
              <input
                type="text"
                placeholder="지출 항목명"
                value={newItem.name}
                onChange={(e) => onNewItemChange({ name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 mobile:px-3 py-1.5 mobile:py-2 text-sm mobile:text-base focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>

          <div className="space-y-3 mobile:space-y-0 mobile:grid mobile:grid-cols-2 mobile:gap-4">
            <div>
              <label className="block text-xs mobile:text-sm font-medium mb-1">
                금액
              </label>
              <input
                type="number"
                placeholder="금액"
                value={newItem.amount}
                onChange={(e) => onNewItemChange({ amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-2 mobile:px-3 py-1.5 mobile:py-2 text-sm mobile:text-base focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={onAddExpense}
                className="w-full bg-accent-500 text-white rounded-lg px-3 mobile:px-4 py-1.5 mobile:py-2 hover:bg-accent-600 flex items-center justify-center gap-2 text-sm mobile:text-base"
              >
                <Plus className="w-3 h-3 mobile:w-4 mobile:h-4" />
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
