'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/auth';
import { useBudget, useCategories } from '@/hooks/budget';

import { format, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const DashboardPage = () => {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const [currentDate] = useState(new Date());

  // 현재 월과 이전 월 데이터
  const currentMonth = format(currentDate, 'yyyy-MM');
  const previousMonth = format(subMonths(currentDate, 1), 'yyyy-MM');

  // 사용자 ID가 있을 때만 데이터 쿼리 활성화
  const shouldFetchData = !isAuthLoading && !!user?.id;

  // 현재 월 데이터
  const {
    budgetItems: currentItems,
    statistics: currentStats,
    isLoading: isCurrentLoading,
  } = useBudget({
    userId: shouldFetchData ? user.id : undefined,
    month: currentMonth,
  });

  // 이전 월 데이터 (비교용)
  const { statistics: previousStats } = useBudget({
    userId: shouldFetchData ? user.id : undefined,
    month: previousMonth,
  });

  // 카테고리 데이터
  const { isLoading: isCategoriesLoading } = useCategories(
    shouldFetchData ? user.id : undefined
  );

  // 통계 계산
  const dashboardStats = useMemo(() => {
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

    // 최근 7일 계산
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentItems = currentItems.filter(
      (item) => new Date(item.date) >= sevenDaysAgo
    );
    const recentIncome = recentItems
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);
    const recentExpense = recentItems
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    // 일평균 계산
    const currentDay = currentDate.getDate();
    const dailyAverageIncome = currentDay > 0 ? currentIncome / currentDay : 0;
    const dailyAverageExpense =
      currentDay > 0 ? currentExpense / currentDay : 0;

    return {
      // 수입
      currentIncome,
      incomeChange,
      recentIncome,
      dailyAverageIncome,
      incomeCount: currentItems.filter((item) => item.type === 'income').length,

      // 지출
      currentExpense,
      expenseChange,
      recentExpense,
      dailyAverageExpense,
      expenseCount: currentItems.filter((item) => item.type === 'expense')
        .length,

      // 통합
      netAmount: currentIncome - currentExpense,
      fixedIncome: currentStats.income.fixed,
      variableIncome: currentStats.income.variable,
      fixedExpense: currentStats.expense.fixed,
      variableExpense: currentStats.expense.variable,
    };
  }, [currentStats, previousStats, currentItems, currentDate]);

  // 최근 지출 항목 (상위 5개)
  const recentTransactions = useMemo(() => {
    return currentItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [currentItems]);

  // 카테고리별 상위 지출 (상위 3개)
  const topExpenseCategories = useMemo(() => {
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

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, amount]) => ({ name, amount }));
  }, [currentItems]);

  // 인증 로딩 상태만 확인 - 데이터 로딩은 별도 처리
  if (isAuthLoading) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const isDataLoading =
    shouldFetchData && (isCurrentLoading || isCategoriesLoading);

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* 환영 메시지 - 항상 표시 */}
        <div className="bg-gradient-to-r from-accent-600 to-accent-500 text-white rounded-xl p-6">
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                안녕하세요, {profile?.name || profile?.nickname || '사용자'}님!
                👋
              </h1>
              <p className="text-accent-100 text-lg">
                {format(currentDate, 'yyyy년 M월', { locale: ko })}의 가계 현황
              </p>
            </div>
            <div className="mt-4">
              <Link
                href="/budget"
                className="inline-flex items-center px-4 py-2 bg-white text-accent-600 rounded-lg hover:bg-accent-50 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                내역 추가
              </Link>
            </div>
          </div>
        </div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 gap-4">
          {/* 이번 달 총 수입 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  이번 달 총 수입
                </p>
                {isDataLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-24 mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.currentIncome.toLocaleString()}원
                    </p>
                    {dashboardStats.incomeChange !== 0 && (
                      <div className="flex items-center mt-1">
                        {dashboardStats.incomeChange > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            dashboardStats.incomeChange > 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {Math.abs(dashboardStats.incomeChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* 이번 달 총 지출 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  이번 달 총 지출
                </p>
                {isDataLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-24 mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardStats.currentExpense.toLocaleString()}원
                    </p>
                    {dashboardStats.expenseChange !== 0 && (
                      <div className="flex items-center mt-1">
                        {dashboardStats.expenseChange > 0 ? (
                          <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            dashboardStats.expenseChange > 0
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`}
                        >
                          {Math.abs(dashboardStats.expenseChange).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* 순자산 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  이번 달 현황
                </p>
                {isDataLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-20 mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 mt-2"></div>
                  </div>
                ) : (
                  <>
                    <p
                      className={`text-2xl font-bold ${
                        dashboardStats.netAmount >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {dashboardStats.netAmount >= 0 ? '+' : ''}
                      {dashboardStats.netAmount.toLocaleString()}원
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      총{' '}
                      {dashboardStats.incomeCount + dashboardStats.expenseCount}
                      건
                    </p>
                  </>
                )}
              </div>
              <div
                className={`p-3 rounded-full ${
                  dashboardStats.netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <Wallet
                  className={`w-6 h-6 ${
                    dashboardStats.netAmount >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 하단 콘텐츠 그리드 */}
        <div className="grid grid-cols-1 gap-6">
          {/* 최근 거래 내역 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">최근 내역</h2>
              <Link
                href="/budget"
                className="text-accent-600 hover:text-accent-700 text-sm font-medium flex items-center"
              >
                전체보기
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {isDataLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                      <div className="space-y-1 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'income'
                              ? transaction.categoryType === 'fixed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-green-50 text-green-600'
                              : transaction.categoryType === 'fixed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {transaction.category}
                        </span>
                        <p className="text-xs text-gray-500">
                          {format(new Date(transaction.date), 'M월 d일', {
                            locale: ko,
                          })}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        {transaction.name}
                      </p>
                    </div>
                    <span
                      className={`font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">아직 거래 내역이 없습니다</p>
                <Link
                  href="/budget" // 변경
                  className="text-accent-600 hover:text-accent-700 text-sm font-medium mt-2 inline-block"
                >
                  첫 거래를 기록해보세요
                </Link>
              </div>
            )}
          </div>

          {/* 카테고리별 지출 현황 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                카테고리별 지출
              </h2>
              <Link
                href="/budget" // 변경
                className="text-accent-600 hover:text-accent-700 text-sm font-medium flex items-center"
              >
                상세분석
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {isDataLoading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2"></div>
                  </div>
                ))}
              </div>
            ) : topExpenseCategories.length > 0 ? (
              <div className="space-y-4">
                {topExpenseCategories.map((category, index) => {
                  const percentage =
                    dashboardStats.currentExpense > 0
                      ? (category.amount / dashboardStats.currentExpense) * 100
                      : 0;

                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {index + 1}. {category.name}
                        </span>
                        <span className="text-gray-600">
                          {category.amount.toLocaleString()}원
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-accent-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">카테고리별 데이터가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 빠른 액션 버튼들 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            빠른 액션
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/budget"
              className="flex flex-col items-center p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors group"
            >
              <div className="p-3 bg-accent-500 rounded-full group-hover:bg-accent-600 transition-colors">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                내약 추가
              </span>
            </Link>

            <Link
              href="/goals"
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="p-3 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                목표 설정
              </span>
            </Link>

            <Link
              href="/questions"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="p-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                성찰 질문
              </span>
            </Link>

            <Link
              href="/reflections"
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <div className="p-3 bg-purple-500 rounded-full group-hover:bg-purple-600 transition-colors">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                일상 회고
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
