'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import ReflectionCard from '@/components/reflections/ReflectionCard';
import { useAuth } from '@/hooks/auth';
import { useKeywords } from '@/hooks/reflections/useKeywords';
import { useReflections } from '@/hooks/reflections/useReflections';
import { DateRangePeriod, ReflectionFilters } from '@/types/reflections';
import { format, subMonths, subWeeks, subYears } from 'date-fns';
import {
  BarChart3,
  BookOpen,
  Hash,
  Heart,
  Lightbulb,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const ReflectionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // 기본 필터 상태
  const [filters, setFilters] = useState<ReflectionFilters>({
    type: 'all',
    keywords: [],
    searchTerm: '',
    visibility: 'all',
  });

  // 임의 기간 설정 상태
  const [showCustomPeriod, setShowCustomPeriod] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // 전체 통계용 (필터 없음)
  const { statistics: totalStats } = useReflections({
    userId: user?.id,
    filters: undefined, // 필터 없이 전체 데이터
  });

  // 필터링된 데이터용
  const { reflections, isLoading, deleteReflection } = useReflections({
    userId: user?.id,
    filters,
  });

  const { keywords, keywordStats } = useKeywords(user?.id);

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

  // 필터링된 키워드 분석
  const filteredKeywordStats = useMemo(() => {
    return keywordStats.slice(0, 5);
  }, [keywordStats]);

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: Partial<ReflectionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 현재 기간이 임의기간인지 확인
  const isCustomPeriod = () => {
    if (!filters.startDate) return false;
    return !periodPresets.some((p) => p.startDate === filters.startDate);
  };

  const handlePeriodChange = (period: string) => {
    if (period === 'custom') {
      // 임의기간 클릭 시
      if (showCustomPeriod || isCustomPeriod()) {
        // 이미 임의기간이 활성화되어 있으면 해제
        setShowCustomPeriod(false);
        handleFiltersChange({
          startDate: undefined,
          endDate: undefined,
        });
      } else {
        // 임의기간 활성화 (다른 모든 기간 버튼 비활성화)
        setShowCustomPeriod(true);
        handleFiltersChange({
          startDate: undefined,
          endDate: undefined,
        });
      }
      return;
    }

    // 다른 기간 버튼 클릭 시 임의기간 모드 해제
    setShowCustomPeriod(false);

    const preset = periodPresets.find((p) => p.value === period);
    if (preset && preset.value !== 'all') {
      // 같은 기간을 다시 클릭하면 해제
      if (filters.startDate === preset.startDate) {
        handleFiltersChange({
          startDate: undefined,
          endDate: undefined,
        });
      } else {
        handleFiltersChange({
          startDate: preset.startDate,
          endDate: preset.endDate,
        });
      }
    } else {
      // 전체 버튼 클릭 시
      if (!filters.startDate) {
        // 이미 전체가 선택된 상태에서 전체를 다시 클릭하면 아무 변화 없음 (전체는 해제 불가)
        return;
      } else {
        // 다른 기간이 선택된 상태에서 전체 클릭하면 초기화
        handleFiltersChange({
          startDate: undefined,
          endDate: undefined,
        });
      }
    }
  };

  const handleTypeChange = (type: 'all' | 'gratitude' | 'reflection') => {
    // 같은 타입을 다시 클릭하면 전체로 변경
    if (filters.type === type && type !== 'all') {
      handleFiltersChange({ type: 'all' });
    } else {
      handleFiltersChange({ type });
    }
  };

  const handleCustomPeriodApply = () => {
    if (customStartDate && customEndDate) {
      handleFiltersChange({
        startDate: customStartDate,
        endDate: customEndDate,
      });
      setShowCustomPeriod(false);
    }
  };

  const handleKeywordToggle = (keywordName: string) => {
    const newKeywords = filters.keywords?.includes(keywordName)
      ? filters.keywords.filter((k) => k !== keywordName)
      : [...(filters.keywords || []), keywordName];

    handleFiltersChange({ keywords: newKeywords });
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      keywords: [],
      searchTerm: '',
      visibility: 'all',
    });
    setShowCustomPeriod(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    (filters.keywords?.length ?? 0) > 0 ||
    filters.searchTerm ||
    filters.visibility !== 'all' ||
    filters.startDate ||
    filters.endDate;

  const handleEdit = (id: string) => {
    router.push(`/reflections/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteReflection(id);
    }
  };

  // 현재 선택된 기간 표시
  const getCurrentPeriodLabel = () => {
    if (!filters.startDate) return '전체';
    const preset = periodPresets.find((p) => p.startDate === filters.startDate);
    if (preset) return preset.label;
    return '임의기간';
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
              감사와 성찰을 통해 성장하는 하루를 기록해보세요.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/reflections/analytics"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              분석
            </Link>
            <Link
              href="/reflections/new"
              className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              작성
            </Link>
          </div>
        </div>

        {/* 전체 현황 */}
        <div className="bg-white border-b-2 pb-4 border-accent-200">
          <h3 className="text-md font-bold text-gray-700 mb-3">전체 현황</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Heart className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">감사</p>
                <p className="text-lg font-bold text-gray-900">
                  {totalStats.gratitude}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">성찰</p>
                <p className="text-lg font-bold text-gray-900">
                  {totalStats.reflection}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <Hash className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">키워드</p>
                <p className="text-lg font-bold text-gray-900">
                  {totalStats.uniqueKeywords}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 검색 섹션 */}
        <div className="bg-white rounded-lg border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.searchTerm || ''}
              onChange={(e) =>
                handleFiltersChange({ searchTerm: e.target.value })
              }
              placeholder="제목이나 내용으로 검색..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">필터</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                초기화
              </button>
            )}
          </div>

          {/* 기간 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기간
            </label>
            <div className="flex flex-wrap gap-2">
              {periodPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePeriodChange(preset.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    (preset.value === 'all' &&
                      !filters.startDate &&
                      !showCustomPeriod) ||
                    preset.startDate === filters.startDate
                      ? 'bg-accent-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                onClick={() => handlePeriodChange('custom')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  showCustomPeriod || isCustomPeriod()
                    ? 'bg-accent-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                임의기간
              </button>
            </div>

            {/* 임의 기간 설정 */}
            {showCustomPeriod && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      시작
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      종료
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCustomPeriodApply}
                    disabled={!customStartDate || !customEndDate}
                    className="px-3 py-1 bg-accent-600 text-white text-sm rounded hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    적용
                  </button>
                  <button
                    onClick={() => setShowCustomPeriod(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 타입 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              타입
            </label>
            <div className="flex gap-2">
              {[
                { value: 'all' as const, label: '전체' },
                { value: 'gratitude' as const, label: '감사' },
                { value: 'reflection' as const, label: '성찰' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filters.type === type.value
                      ? 'bg-accent-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 키워드 선택 */}
          {keywords.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                키워드
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {keywords.map((keyword) => (
                  <button
                    key={keyword.id}
                    onClick={() => handleKeywordToggle(keyword.name)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      filters.keywords?.includes(keyword.name)
                        ? 'text-white'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: filters.keywords?.includes(keyword.name)
                        ? keyword.color
                        : `${keyword.color}20`,
                      color: filters.keywords?.includes(keyword.name)
                        ? 'white'
                        : keyword.color,
                    }}
                  >
                    {keyword.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 구분선과 검색 결과 헤더 */}
        <div className="border-t-2 border-accent-200 pt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-accent-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {hasActiveFilters ? '검색 결과' : '전체'}
              </h2>
            </div>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>•</span>
                <span>{reflections.length}개</span>
                {filters.searchTerm && (
                  <>
                    <span>•</span>
                    <span>{filters.searchTerm} 검색</span>
                  </>
                )}
                {filters.startDate && (
                  <>
                    <span>•</span>
                    <span>{getCurrentPeriodLabel()}</span>
                  </>
                )}
                {filters.type !== 'all' && (
                  <>
                    <span>•</span>
                    <span>
                      {filters.type === 'gratitude' ? '감사' : '성찰'}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 키워드 분석 결과*/}
          {reflections.length > 0 &&
            filteredKeywordStats.filter((stat) => stat.usageCount > 0).length >
              0 && (
              <div className="bg-white rounded-lg mb-6">
                <div className="flex flex-wrap gap-2">
                  {filteredKeywordStats
                    .filter((stat) => stat.usageCount > 0)
                    .map((stat) => (
                      <span
                        key={stat.keyword.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${stat.keyword.color}20`,
                          color: stat.keyword.color,
                          border: `1px solid ${stat.keyword.color}40`,
                        }}
                      >
                        {stat.keyword.name}
                        <span className="text-xs opacity-75">
                          {stat.usageCount}회
                        </span>
                      </span>
                    ))}
                </div>
              </div>
            )}

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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 shadow-sm border text-center">
              <div className="text-gray-400 mb-4">
                <BookOpen className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {hasActiveFilters
                  ? '필터 조건에 맞는 회고가 없습니다.'
                  : '아직 작성한 회고가 없습니다.'}
              </h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters
                  ? '다른 필터 조건으로 시도해보세요.'
                  : '첫 번째 회고를 작성해서 성장의 여정을 시작해보세요.'}
              </p>

              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  필터 초기화
                </button>
              ) : (
                <Link
                  href="/reflections/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />첫 회고 작성
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default ReflectionsPage;
