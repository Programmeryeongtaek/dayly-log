import { BudgetChartProps } from '@/types/budget';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const INCOME_COLORS = [
  '#22c55e',
  '#16a34a',
  '#15803d',
  '#166534',
  '#14532d',
] as const;
const EXPENSE_COLORS = [
  '#ef4444',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d',
] as const;

export default function BudgetChart({
  incomeData,
  expenseData,
  isFixedEnabled,
  onFixedToggle,
  totals,
  transactions,
  onChallengeClick,
}: BudgetChartProps) {
  const categoryDetails = useMemo(() => {
    if (!transactions) return [];

    const categoryMap = new Map<
      string,
      {
        name: string;
        incomeAmount: number;
        expenseAmount: number;
        incomeCount: number;
        expenseCount: number;
      }
    >();

    // 실제 transactions를 순회하면서 건수 계산
    transactions.forEach((transaction) => {
      const categoryName = transaction.category?.name || 'Unknown';
      const existing = categoryMap.get(categoryName) || {
        name: categoryName,
        incomeAmount: 0,
        expenseAmount: 0,
        incomeCount: 0,
        expenseCount: 0,
      };

      if (transaction.type === 'income') {
        existing.incomeAmount += transaction.amount;
        existing.incomeCount += 1;
      } else {
        existing.expenseAmount += transaction.amount;
        existing.expenseCount += 1;
      }

      categoryMap.set(categoryName, existing);
    });

    return Array.from(categoryMap.values()).filter(
      (category) => category.incomeAmount > 0 || category.expenseAmount > 0
    );
  }, [transactions]);

  const handleChallengeClick = (
    categoryName: string,
    amount: number,
    count: number,
    type: 'income' | 'expense'
  ) => {
    if (onChallengeClick) {
      onChallengeClick(categoryName, amount, count, type);
    }
  };

  return (
    <div className="space-y-6">
      {/* 컨트롤 및 요약 영역 */}
      <div className="flex items-center justify-between">
        {/* 고정항목 토글 */}
        <div className="flex items-center gap-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isFixedEnabled}
              onChange={(e) => onFixedToggle(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors ${
                isFixedEnabled ? 'bg-accent-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                  isFixedEnabled ? 'translate-x-5  ml-0.5' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="ml-2 text-xs font-medium">고정항목 포함</span>
          </label>
        </div>

        {/* 순자산 표시 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">합계:</span>
          <span
            className={`font-bold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {totals.net >= 0 ? '+' : ''}
            {totals.net.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 gap-6">
        {/* 수입 파이 차트 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            수입 구조 ({totals.income.total.toLocaleString()}원)
          </h3>
          {incomeData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${((percent as number) * 100).toFixed(0)}%`
                    }
                  >
                    {incomeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={INCOME_COLORS[index % INCOME_COLORS.length]}
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
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>수입 데이터가 없습니다</p>
              </div>
            </div>
          )}
        </div>

        {/* 지출 파이 차트 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            지출 구조 ({totals.expense.total.toLocaleString()}원)
          </h3>
          {expenseData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${((percent as number) * 100).toFixed(0)}%`
                    }
                  >
                    {expenseData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
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
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>지출 데이터가 없습니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 카테고리별 상세 정보 */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">카테고리 내역</h3>

        {/* 수입 카테고리 */}
        {incomeData.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              수입
            </h4>
            <div className="space-y-3">
              {categoryDetails
                .filter((cat) => cat.incomeAmount > 0)
                .map((category) => (
                  <div
                    key={`income-${category.name}`}
                    className="border border-green-200 rounded-lg p-4 bg-green-50/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h5 className="font-medium text-gray-900">
                          {category.name}
                        </h5>
                        <span className="text-sm text-green-600 font-semibold">
                          +{category.incomeAmount.toLocaleString()}원
                        </span>
                        {category.incomeCount > 1 && (
                          <span className="text-xs text-gray-500">
                            ({category.incomeCount}건)
                          </span>
                        )}
                      </div>

                      {onChallengeClick && (
                        <button
                          onClick={() =>
                            handleChallengeClick(
                              category.name,
                              category.incomeAmount,
                              category.incomeCount,
                              'income'
                            )
                          }
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-md transition-colors group"
                          title="수입 늘리기 챌린지"
                        >
                          <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 지출 카테고리 */}
        {expenseData.length > 0 && (
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              지출
            </h4>
            <div className="space-y-3">
              {categoryDetails
                .filter((cat) => cat.expenseAmount > 0)
                .map((category) => (
                  <div
                    key={`expense-${category.name}`}
                    className="border border-red-200 rounded-lg p-4 bg-red-50/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h5 className="font-medium text-gray-900">
                          {category.name}
                        </h5>
                        <span className="text-sm text-red-600 font-semibold">
                          -{category.expenseAmount.toLocaleString()}원
                        </span>
                        {category.expenseCount > 1 && (
                          <span className="text-xs text-gray-500">
                            ({category.expenseCount}건)
                          </span>
                        )}
                      </div>

                      {onChallengeClick && (
                        <button
                          onClick={() =>
                            handleChallengeClick(
                              category.name,
                              category.expenseAmount,
                              category.expenseCount,
                              'expense'
                            )
                          }
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors group"
                          title="지출 줄이기 챌린지"
                        >
                          <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 데이터가 없을 때 */}
        {incomeData.length === 0 && expenseData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>카테고리별 데이터가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
