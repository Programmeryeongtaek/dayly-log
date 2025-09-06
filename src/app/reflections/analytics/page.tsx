'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/auth';
import { useKeywords } from '@/hooks/reflections/useKeywords';
import { useReflectionCategories } from '@/hooks/reflections/useReflectionCategories';
import { useReflections } from '@/hooks/reflections/useReflections';
import { format, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  BarChart3,
  Filter,
  Hash,
  Heart,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'all' | '1month' | '3months' | '6months' | '1year'
  >('3months');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'gratitude' | 'reflection'
  >('all');

  const { keywordStats, isLoading: keywordsLoading } = useKeywords(user?.id);
  const { reflections } = useReflections({ userId: user?.id });
  const { gratitudeCategory, reflectionCategory } = useReflectionCategories();

  // 기간별 필터링
  const filteredStats = useMemo(() => {
    const now = new Date();
    const cutoffDate =
      selectedPeriod === 'all'
        ? null
        : selectedPeriod === '1month'
          ? subMonths(now, 1)
          : selectedPeriod === '3months'
            ? subMonths(now, 3)
            : selectedPeriod === '6months'
              ? subMonths(now, 6)
              : subMonths(now, 12);

    return keywordStats
      .filter((stat) => {
        // 기간 필터
        if (cutoffDate && new Date(stat.lastUsedDate) < cutoffDate)
          return false;

        // 카테고리 필터
        if (selectedCategory === 'gratitude' && gratitudeCategory) {
          return stat.keyword.category_id === gratitudeCategory.id;
        }
        if (selectedCategory === 'reflection' && reflectionCategory) {
          return stat.keyword.category_id === reflectionCategory.id;
        }

        return true;
      })
      .slice(0, 20); // 상위 20개만
  }, [
    keywordStats,
    selectedPeriod,
    selectedCategory,
    gratitudeCategory,
    reflectionCategory,
  ]);

  // 기간별 회고 통계
  const periodStats = useMemo(() => {
    const now = new Date();
    const cutoffDate =
      selectedPeriod === 'all'
        ? null
        : selectedPeriod === '1month'
          ? subMonths(now, 1)
          : selectedPeriod === '3months'
            ? subMonths(now, 3)
            : selectedPeriod === '6months'
              ? subMonths(now, 6)
              : subMonths(now, 12);

    const filteredReflections = cutoffDate
      ? reflections.filter((r) => new Date(r.date) >= cutoffDate)
      : reflections;

    const gratitudeCount = filteredReflections.filter(
      (r) => r.category?.name === 'gratitude'
    ).length;
    const reflectionCount = filteredReflections.filter(
      (r) => r.category?.name === 'reflection'
    ).length;

    return {
      total: filteredReflections.length,
      gratitude: gratitudeCount,
      reflection: reflectionCount,
    };
  }, [reflections, selectedPeriod]);

  const maxUsage = Math.max(...filteredStats.map((stat) => stat.usageCount), 1);

  if (!user?.id) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4 text-center py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-500">
              키워드 분석을 보려면 먼저 로그인해주세요.
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link
                href="/reflections"
                className="flex items-center gap-1 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                회고 목록으로 돌아가기
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-accent-600" />
              키워드 분석
            </h1>
            <p className="text-gray-600 mt-1">
              키워드 사용 패턴을 통해 성장의 흔적을 확인해보세요
            </p>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">필터</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 기간 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                분석 기간
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) =>
                  setSelectedPeriod(
                    e.target.value as
                      | 'all'
                      | '1month'
                      | '3months'
                      | '6months'
                      | '1year'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">전체 기간</option>
                <option value="1month">최근 1개월</option>
                <option value="3months">최근 3개월</option>
                <option value="6months">최근 6개월</option>
                <option value="1year">최근 1년</option>
              </select>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회고 타입
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value as 'all' | 'gratitude' | 'reflection'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">전체</option>
                <option value="gratitude">감사</option>
                <option value="reflection">성찰</option>
              </select>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">기간 내 회고</p>
                <p className="text-2xl font-bold text-gray-900">
                  {periodStats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Heart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">감사 회고</p>
                <p className="text-2xl font-bold text-gray-900">
                  {periodStats.gratitude}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">성찰 회고</p>
                <p className="text-2xl font-bold text-gray-900">
                  {periodStats.reflection}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 키워드 차트 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-600" />
              인기 키워드 TOP 20
            </h3>
            <span className="text-sm text-gray-500">
              총 {filteredStats.length}개 키워드
            </span>
          </div>

          {keywordsLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredStats.length === 0 ? (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                분석할 키워드가 없습니다
              </h3>
              <p className="text-gray-500">
                선택한 조건에 맞는 키워드가 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStats.map((stat, index) => (
                <div key={stat.keyword.id} className="flex items-center gap-3">
                  {/* 순위 */}
                  <div className="w-8 text-center">
                    <span
                      className={`text-sm font-medium ${
                        index < 3 ? 'text-accent-600' : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* 키워드 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="font-medium text-sm"
                        style={{ color: stat.keyword.color }}
                      >
                        {stat.keyword.name}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{stat.usageCount}회 사용</span>
                        <span>•</span>
                        <span>
                          {format(new Date(stat.lastUsedDate), 'MM/dd', {
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* 사용량 바 */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(stat.usageCount / maxUsage) * 100}%`,
                          backgroundColor: stat.keyword.color + '80',
                        }}
                      />
                    </div>

                    {/* 카테고리별 분포 */}
                    <div className="flex gap-3 text-xs">
                      {stat.gratitudeCount > 0 && (
                        <span className="text-orange-600">
                          감사 {stat.gratitudeCount}회
                        </span>
                      )}
                      {stat.reflectionCount > 0 && (
                        <span className="text-blue-600">
                          성찰 {stat.reflectionCount}회
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 인사이트 */}
        {filteredStats.length > 0 && (
          <div className="bg-gradient-to-r from-accent-50 to-blue-50 rounded-lg p-6 border">
            <h3 className="font-medium text-gray-900 mb-3">💡 인사이트</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                • 가장 자주 사용한 키워드:{' '}
                <strong style={{ color: filteredStats[0]?.keyword.color }}>
                  {filteredStats[0]?.keyword.name}
                </strong>{' '}
                ({filteredStats[0]?.usageCount}회)
              </p>
              {periodStats.gratitude > periodStats.reflection ? (
                <p>
                  • 이 기간 동안 감사 회고를 더 많이 작성하셨네요 (
                  {periodStats.gratitude}회 vs {periodStats.reflection}회)
                </p>
              ) : periodStats.reflection > periodStats.gratitude ? (
                <p>
                  • 이 기간 동안 성찰 회고를 더 많이 작성하셨네요 (
                  {periodStats.reflection}회 vs {periodStats.gratitude}회)
                </p>
              ) : (
                <p>
                  • 감사와 성찰이 균형 잡혀 있습니다 ({periodStats.gratitude}
                  회씩)
                </p>
              )}
              <p>
                • 총 {filteredStats.length}개의 서로 다른 키워드를
                사용하셨습니다
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default AnalyticsPage;
