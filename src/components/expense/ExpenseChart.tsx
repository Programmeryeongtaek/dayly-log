'use client';

import { Calendar } from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface ExpenseChartProps {
  chartData: ChartData[];
  isFixedEnabled: boolean;
  onFixedToggle: (enabled: boolean) => void;
  totals: {
    fixed: number;
    variable: number;
    total: number;
  };
  fixedCategories: Array<{ id: string; name: string; type: string }>;
  variableCategories: Array<{ id: string; name: string; type: string }>;
  fixedExpenses: Array<{ category: string; amount: number }>;
  variableExpenses: Array<{ category: string; amount: number }>;
}

const CHART_COLORS = [
  '#14b8a6',
  '#0d9488',
  '#0f766e',
  '#115e59',
  '#134e4a',
  '#f59e0b',
]; // 그런데 항목 갯수가 많아지면 더 추가되어야 하지 않을까?

export default function ExpenseChart({
  chartData,
  isFixedEnabled,
  onFixedToggle,
  totals,
  fixedCategories,
  variableCategories,
  fixedExpenses,
  variableExpenses,
}: ExpenseChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mobile:gap-6">
      {/* 차트 영역 */}
      <div className="flex flex-col items-center">
        {chartData.length > 0 ? (
          <div className="w-full h-48 mobile:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
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
          <div className="w-full h-48 mobile:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-8 h-8 mobile:w-12 mobile:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm mobile:text-base text-gray-500">
                지출 데이터가 없습니다
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 통계 영역 */}
      <div className="space-y-3 mobile:space-y-4">
        <div className="flex items-center gap-2 mb-3 mobile:mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isFixedEnabled}
              onChange={(e) => onFixedToggle(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 mobile:w-12 mobile:h-6 rounded-full transition-colors ${isFixedEnabled ? 'bg-accent-500' : 'bg-gray-300'}`}
            >
              <div
                className={`w-4 h-4 mobile:w-5 mobile:h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${isFixedEnabled ? 'translate-x-5 mobile:translate-x-6 ml-0.5' : 'translate-x-0.5'}`}
              />
            </div>
            <span className="ml-2 text-xs mobile:text-sm font-medium">
              고정지출 포함
            </span>
          </label>
        </div>

        {/* 고정지출 통계 */}
        {isFixedEnabled && totals.fixed > 0 && (
          <div>
            <h3 className="font-semibold text-accent-700 mb-2 text-sm mobile:text-base">
              고정지출: {totals.fixed.toLocaleString()}원
            </h3>
            <div className="space-y-1 text-xs mobile:text-sm">
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
            <h3 className="font-semibold text-accent-600 mb-2 text-sm mobile:text-base">
              변동지출: {totals.variable.toLocaleString()}원
            </h3>
            <div className="space-y-1 text-xs mobile:text-sm">
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
          <div className="flex justify-between font-bold text-base mobile:text-lg">
            <span>총 지출:</span>
            <span className="text-accent-600">
              {totals.total.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
