'use client';

import { BudgetListProps } from '@/types/budget';
import { Trash2, TrendingDown, TrendingUp } from 'lucide-react';

export default function BudgetList({
  items,
  onDeleteItem,
  title,
  type,
}: BudgetListProps) {
  // 타입에 따라 필터링
  const filteredItems = items.filter((item) => {
    if (type === 'all') return true;
    return item.type === type;
  });

  if (filteredItems.length === 0) return null;

  // 카테고리가 고정인지 확인하는 함수
  const isFixedCategory = (categoryType: string) => categoryType === 'fixed';

  // 타입별 총합 계산
  const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mt-4 mobile:mt-6 pt-4 mobile:pt-6 border-t">
      <div className="flex items-center justify-between mb-2 mobile:mb-3">
        <h3 className="font-medium text-gray-700 text-sm mobile:text-base flex items-center gap-2">
          {type === 'income' && (
            <TrendingUp className="w-4 h-4 text-green-600" />
          )}
          {type === 'expense' && (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          {title} ({filteredItems.length}건)
        </h3>
        <div
          className={`text-sm font-semibold ${
            type === 'income'
              ? 'text-green-600'
              : type === 'expense'
                ? 'text-red-600'
                : 'text-gray-700'
          }`}
        >
          {type === 'income' ? '+' : type === 'expense' ? '-' : ''}
          {totalAmount.toLocaleString()}원
        </div>
      </div>

      <div className="space-y-2">
        {filteredItems
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 mobile:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 mobile:gap-3 flex-1 min-w-0">
                {/* 수입/지출 아이콘 */}
                <div
                  className={`p-1 rounded-full ${
                    item.type === 'income'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {item.type === 'income' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                </div>

                {/* 카테고리 태그 */}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    isFixedCategory(item.categoryType)
                      ? item.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      : item.type === 'income'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                  }`}
                >
                  {item.category}
                </span>

                {/* 항목명 */}
                <span className="font-medium text-sm mobile:text-base truncate">
                  {item.name}
                </span>

                {/* 금액 */}
                <span
                  className={`font-semibold text-sm mobile:text-base flex-shrink-0 ${
                    item.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.type === 'income' ? '+' : '-'}
                  {item.amount.toLocaleString()}원
                </span>
              </div>

              {/* 삭제 버튼 */}
              <button
                onClick={() => onDeleteItem(item.id)}
                className="text-red-500 hover:text-red-700 p-1 flex-shrink-0 transition-colors hover:bg-red-50 rounded"
                title="삭제"
              >
                <Trash2 className="w-3 h-3 mobile:w-4 mobile:h-4" />
              </button>
            </div>
          ))}
      </div>

      {/* 타입별 요약 */}
      <div
        className={`mt-2 mobile:mt-3 p-2 mobile:p-3 rounded-lg ${
          type === 'income'
            ? 'bg-green-50'
            : type === 'expense'
              ? 'bg-red-50'
              : 'bg-gray-50'
        }`}
      >
        <div
          className={`flex justify-between font-semibold text-sm mobile:text-base ${
            type === 'income'
              ? 'text-green-700'
              : type === 'expense'
                ? 'text-red-700'
                : 'text-gray-700'
          }`}
        >
          <span>
            {type === 'income'
              ? '총 수입:'
              : type === 'expense'
                ? '총 지출:'
                : '총 금액:'}
          </span>
          <span>
            {type === 'income' ? '+' : type === 'expense' ? '-' : ''}
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
