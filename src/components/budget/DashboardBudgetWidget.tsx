'use client';

import { useMemo } from 'react';
import { useAuth } from '@/hooks/auth';
import { useBudget } from '@/hooks/budget';
import { format, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowRight,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

const DashboardBudgetWidget = () => {
  const { user } = useAuth();
  const currentDate = new Date();

  // 현재 월과 이전 월 데이터
  const currentMonth = format(currentDate, 'yyyy-MM');
  const previousMonth = format(subMonths(currentDate, 1), 'yyyy-MM');

  // 현재 월 데이터
  const {
    budgetItems: currentItems,
    statistics: currentStats,
    isLoading,
  } = useBudget({
    userId: user?.id,
    month: currentMonth,
  });

  // 이전 월 데이터 (비교용)
  const { statistics: previousStats } = useBudget({
    userId: user?.id,
    month: previousMonth,
  });

  // 통계 계산
  const budgetStats = useMemo(() => {
    const currentIncome = currentStats.income.total;
    const currentExpense = currentStats.expense.total;
    const previousIncome = previousStats.income.total;
    const previousExpense = previousStats.expense.total;

    const incomeChange =
      previousIncome > 0
        ? ((currentIncome - previousIncome) / previousIncome) * 100
        : 0;
    const expenseChange =
      previousExpense > 0
        ? ((currentExpense - previousExpense) / previousExpense) * 100
        : 0;

    // 최근 7일 내역
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentItems = currentItems.filter(
      (item) => new Date(item.date) >= sevenDaysAgo
    );

    const netAmount = currentIncome - currentExpense;
    const totalTransactions = currentItems.length;

    // 상위 지출 카테고리 (상위 3개)
    const categoryTotals = currentItems
      .filter((item) => item.type === 'expense')
      .reduce(
        (acc, item) => {
          const categoryName = item.category;
          acc[categoryName] = (acc[categoryName] || 0) + item.amount;
          return acc;
        },
        {} as Record<string, number>
      );

    const topExpenseCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, amount]) => ({ name, amount }));

    return {
      currentIncome,
      currentExpense,
      netAmount,
      incomeChange,
      expenseChange,
      totalTransactions,
      recentItemsCount: recentItems.length,
      topExpenseCategories,
    };
  }, [currentStats, previousStats, currentItems]);

  // 최근 거래 내역 (상위 3개)
  const recentTransactions = useMemo(() => {
    return currentItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [currentItems]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-accent-600" />
          가계부
        </h2>
        <Link
          href="/budget"
          className="text-sm text-accent-600 hover:text-accent-700 flex items-center gap-1"
        >
          모두 보기 <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 주요 통계 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {budgetStats.currentIncome.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">수입</div>
          {budgetStats.incomeChange !== 0 && (
            <div className="flex items-center justify-center mt-1">
              {budgetStats.incomeChange > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span
                className={`text-xs font-medium ${
                  budgetStats.incomeChange > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {Math.abs(budgetStats.incomeChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {budgetStats.currentExpense.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">지출</div>
          {budgetStats.expenseChange !== 0 && (
            <div className="flex items-center justify-center mt-1">
              {budgetStats.expenseChange > 0 ? (
                <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
              )}
              <span
                className={`text-xs font-medium ${
                  budgetStats.expenseChange > 0
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {Math.abs(budgetStats.expenseChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 순자산 현황 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            이번 달 현황
          </span>
          <span className="text-xs text-gray-500">
            총 {budgetStats.totalTransactions}건
          </span>
        </div>
        <div
          className={`text-center p-3 rounded-lg ${
            budgetStats.netAmount >= 0 ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div
            className={`text-xl font-bold ${
              budgetStats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {budgetStats.netAmount >= 0 ? '+' : ''}
            {budgetStats.netAmount.toLocaleString()}원
          </div>
          <div className="text-xs text-gray-600">
            {budgetStats.netAmount >= 0 ? '흑자' : '적자'}
          </div>
        </div>
      </div>

      {/* 최근 거래 내역 */}
      {recentTransactions.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            최근 거래 내역
          </h3>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(transaction.date), 'M/d', {
                        locale: ko,
                      })}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {transaction.name}
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {transaction.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 상위 지출 카테고리 */}
      {budgetStats.topExpenseCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            주요 지출 카테고리
          </h3>
          <div className="space-y-2">
            {budgetStats.topExpenseCategories.map((category, index) => {
              const percentage =
                budgetStats.currentExpense > 0
                  ? (category.amount / budgetStats.currentExpense) * 100
                  : 0;

              return (
                <div
                  key={category.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 w-4">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {category.amount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {budgetStats.totalTransactions === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            첫 내역을 기록해보세요
          </h3>
          <p className="text-gray-500 mb-4">
            수입과 지출을 기록하여 가계 현황을 파악하세요
          </p>
          <Link
            href="/budget"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Plus className="w-4 h-4" />첫 내역 추가하기
          </Link>
        </div>
      )}

      {/* 빠른 액션 */}
      <div className="flex gap-2">
        <Link
          href="/budget"
          className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-center text-sm font-medium"
        >
          내역 추가
        </Link>
        <Link
          href="/budget/analytics"
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
        >
          분석 보기
        </Link>
      </div>
    </div>
  );
};

export default DashboardBudgetWidget;
