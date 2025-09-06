'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import ReflectionCard from '@/components/reflections/ReflectionCard';
import ReflectionFiltersComponent from '@/components/reflections/ReflectionFilters';
import { useAuth } from '@/hooks/auth';
import { useKeywords } from '@/hooks/reflections/useKeywords';
import { useReflections } from '@/hooks/reflections/useReflections';
import { DateRangePeriod, ReflectionFilters } from '@/types/reflections';
import { format, subMonths, subWeeks, subYears } from 'date-fns';
import { BookOpen, Calendar, Heart, Lightbulb, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const ReflectionsPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ReflectionFilters>({
    type: 'all',
    keywords: [],
    searchTerm: '',
    visibility: 'all',
  });

  const { reflections, statistics, isLoading, deleteReflection } =
    useReflections({
      userId: user?.id,
      filters,
    });

  const { keywords } = useKeywords(user?.id);

  // 기간 필터링을 위한 프리셋
  const periodPresets = useMemo((): DateRangePeriod[] => {
    const today = new Date();
    return [
      {
        label: '전체',
        value: 'all',
        startDate: '',
        endDate: '',
      },
      {
        label: '최근 1주일',
        value: '1week',
        startDate: format(subWeeks(today, 1), 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
      },
      {
        label: '최근 1개월',
        value: '1month',
        startDate: format(subMonths(today, 1), 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
      },
      {
        label: '최근 3개월',
        value: '3months',
        startDate: format(subMonths(today, 3), 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
      },
      {
        label: '최근 1년',
        value: '1year',
        startDate: format(subYears(today, 1), 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
      },
    ];
  }, []);

  const handleFiltersChange = (newFilters: Partial<ReflectionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePeriodChange = (period: string) => {
    const preset = periodPresets.find((p) => p.value === period);
    if (preset && preset.value !== 'all') {
      handleFiltersChange({
        startDate: preset.startDate,
        endDate: preset.endDate,
      });
    } else {
      handleFiltersChange({
        startDate: undefined,
        endDate: undefined,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteReflection(id);
    }
  };

  if (!user?.id) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4 text-center py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-500">
              회고를 관리하려면 먼저 로그인해주세요.
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">회고</h1>
            <p className="text-gray-600 mt-1">
              감사와 성찰을 통해 성장하는 하루를 만들어보세요
            </p>
          </div>

          <Link
            href="/reflections/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Plus className="w-4 h-4" />새 회고 작성
          </Link>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">전체 회고</p>
                <p className="text-xl font-bold text-gray-900">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Heart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">감사</p>
                <p className="text-xl font-bold text-gray-900">
                  {statistics.gratitude}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">성찰</p>
                <p className="text-xl font-bold text-gray-900">
                  {statistics.reflection}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">키워드</p>
                <p className="text-xl font-bold text-gray-900">
                  {statistics.uniqueKeywords}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 섹션 */}
        <ReflectionFiltersComponent
          filters={filters}
          keywords={keywords}
          onFiltersChange={handleFiltersChange}
          onPeriodChange={handlePeriodChange}
          periodPresets={periodPresets}
        />

        {/* 회고 목록 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 shadow-sm border animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reflections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reflections.map((reflection) => (
              <ReflectionCard
                key={reflection.id}
                reflection={reflection}
                onDelete={handleDelete}
                showActions={reflection.is_own}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {filters.searchTerm || filters.keywords?.length
                ? '검색 결과가 없습니다'
                : '아직 작성한 회고가 없습니다'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.searchTerm || filters.keywords?.length
                ? '다른 검색 조건으로 시도해보세요'
                : '첫 번째 회고를 작성해서 성장의 여정을 시작해보세요'}
            </p>

            {!filters.searchTerm && !filters.keywords?.length && (
              <Link
                href="/reflections/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Plus className="w-4 h-4" />첫 회고 작성하기
              </Link>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default ReflectionsPage;
