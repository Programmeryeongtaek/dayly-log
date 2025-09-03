import { BudgetChartProps } from '@/types/budget';
import { Target, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
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
  onChallengeClick,
}: BudgetChartProps) {
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
              className={`w-10 h-5  rounded-full transition-colors ${
                isFixedEnabled ? 'bg-accent-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4  bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                  isFixedEnabled ? 'translate-x-5  ml-0.5' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="ml-2 text-xs  font-medium">고정항목 포함</span>
          </label>
        </div>

        {/* 순자산 표시 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
          <DollarSign className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">순자산:</span>
          <span
            className={`font-bold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {totals.net >= 0 ? '+' : ''}
            {totals.net.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 수입 파이 차트 */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            수입 구성 ({totals.income.total.toLocaleString()}원)
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
            지출 구성 ({totals.expense.total.toLocaleString()}원)
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
        <h3 className="text-lg font-semibold mb-4">카테고리별 상세</h3>

        {/* 수입 카테고리 */}
        {incomeData.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              수입 카테고리
            </h4>
            <div className="space-y-3">
              {incomeData.map((income) => (
                <div
                  key={`income-${income.name}`}
                  className="border border-green-200 rounded-lg p-4 bg-green-50/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium text-gray-900">
                        {income.name}
                      </h5>
                      <span className="text-sm text-green-600 font-semibold">
                        +{income.value.toLocaleString()}원
                      </span>
                    </div>

                    {/* 수입 늘리기 챌린지 버튼 */}
                    {onChallengeClick && (
                      <button
                        onClick={() =>
                          handleChallengeClick(
                            income.name,
                            income.value,
                            1,
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
              지출 카테고리
            </h4>
            <div className="space-y-3">
              {expenseData.map((expense) => (
                <div
                  key={`expense-${expense.name}`}
                  className="border border-red-200 rounded-lg p-4 bg-red-50/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium text-gray-900">
                        {expense.name}
                      </h5>
                      <span className="text-sm text-red-600 font-semibold">
                        -{expense.value.toLocaleString()}원
                      </span>
                    </div>

                    {/* 지출 줄이기 챌린지 버튼 */}
                    {onChallengeClick && (
                      <button
                        onClick={() =>
                          handleChallengeClick(
                            expense.name,
                            expense.value,
                            1,
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
