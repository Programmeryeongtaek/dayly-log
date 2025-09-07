'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import KeywordReflectionsModal from '@/components/reflections/KeywordReflectionsModal';
import { useAuth } from '@/hooks/auth';
import { useKeywords } from '@/hooks/reflections/useKeywords';
import { useReflectionCategories } from '@/hooks/reflections/useReflectionCategories';
import { useReflections } from '@/hooks/reflections/useReflections';
import { format, subMonths, subWeeks, subYears } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  BarChart3,
  Filter,
  Heart,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const AnalyticsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'all' | '1week' | '1month' | '3months' | '6months' | '1year'
  >('3months');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'gratitude' | 'reflection'
  >('all');
  const [showCustomPeriod, setShowCustomPeriod] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { keywordStats } = useKeywords(user?.id);
  const { reflections } = useReflections({ userId: user?.id });
  const { gratitudeCategory, reflectionCategory } = useReflectionCategories();

  // 기간 프리셋
  const periodPresets = useMemo(() => {
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
        label: '최근 6개월',
        value: '6months',
        startDate: format(subMonths(today, 6), 'yyyy-MM-dd'),
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

  // 기간별 필터링
  const filteredStats = useMemo(() => {
    let cutoffDate = null;

    if (customStartDate && customEndDate) {
      // 임의기간이 설정된 경우
      cutoffDate = new Date(customStartDate);
    } else if (selectedPeriod !== 'all') {
      // 프리셋 기간이 선택된 경우
      const preset = periodPresets.find((p) => p.value === selectedPeriod);
      if (preset && preset.startDate) {
        cutoffDate = new Date(preset.startDate);
      }
    }

    return keywordStats
      .filter((stat) => {
        // 기간 필터
        if (cutoffDate && new Date(stat.lastUsedDate) < cutoffDate)
          return false;
        if (customStartDate && customEndDate) {
          const lastUsed = new Date(stat.lastUsedDate);
          const endDate = new Date(customEndDate);
          if (lastUsed > endDate) return false;
        }

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
    customStartDate,
    customEndDate,
    periodPresets,
  ]);

  // 기간별 회고 통계
  const periodStats = useMemo(() => {
    let cutoffDate = null;
    let endDate = null;

    if (customStartDate && customEndDate) {
      cutoffDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else if (selectedPeriod !== 'all') {
      const preset = periodPresets.find((p) => p.value === selectedPeriod);
      if (preset && preset.startDate) {
        cutoffDate = new Date(preset.startDate);
        endDate = new Date(preset.endDate);
      }
    }

    let filteredReflections = reflections;
    if (cutoffDate) {
      filteredReflections = reflections.filter((r) => {
        const reflectionDate = new Date(r.date);
        const afterStart = reflectionDate >= cutoffDate;
        const beforeEnd = endDate ? reflectionDate <= endDate : true;
        return afterStart && beforeEnd;
      });
    }

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
  }, [
    reflections,
    selectedPeriod,
    customStartDate,
    customEndDate,
    periodPresets,
  ]);

  // 필터 핸들러
  const handlePeriodChange = (period: string) => {
    if (period === 'custom') {
      if (showCustomPeriod || customStartDate) {
        setShowCustomPeriod(false);
        setCustomStartDate('');
        setCustomEndDate('');
      } else {
        setShowCustomPeriod(true);
      }
      return;
    }

    // 같은 기간을 다시 클릭하면 전체로 변경
    if (selectedPeriod === period) {
      setSelectedPeriod('all');
    } else {
      setSelectedPeriod(period as typeof selectedPeriod);
    }

    // 임의기간 관련 상태 초기화
    setShowCustomPeriod(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const handleCategoryChange = (category: typeof selectedCategory) => {
    setSelectedCategory(category === selectedCategory ? 'all' : category);
  };

  const handleCustomPeriodApply = () => {
    if (customStartDate && customEndDate) {
      setShowCustomPeriod(false);
    }
  };

  const clearFilters = () => {
    setSelectedPeriod('all');
    setSelectedCategory('all');
    setShowCustomPeriod(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const hasActiveFilters =
    selectedPeriod !== 'all' ||
    selectedCategory !== 'all' ||
    customStartDate ||
    customEndDate;

  const handleKeywordClick = (keywordName: string) => {
    setSelectedKeyword(keywordName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKeyword(null);
  };

  if (!user?.id) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4 text-center py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              로그인이 필요합니다.
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
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-accent-600" />
              키워드 분석
            </h1>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">필터</h3>
            </div>
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
              분석 기간
            </label>
            <div className="flex flex-wrap gap-2">
              {periodPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePeriodChange(preset.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === preset.value &&
                    !customStartDate &&
                    !showCustomPeriod
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
                  showCustomPeriod || customStartDate
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
                <div className="flex justify-end gap-2">
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

          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회고 타입
            </label>
            <div className="flex gap-2">
              {[
                { value: 'all' as const, label: '전체' },
                { value: 'gratitude' as const, label: '감사' },
                { value: 'reflection' as const, label: '성찰' },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-accent-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Heart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">감사</p>
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
                <p className="text-sm text-gray-600">성찰</p>
                <p className="text-2xl font-bold text-gray-900">
                  {periodStats.reflection}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 인사이트 */}
        {filteredStats.length > 0 && (
          <div className="bg-gradient-to-r from-accent-50 to-blue-50 rounded-lg p-2 border">
            <h3 className="font-medium text-gray-900 mb-3">💡 인사이트</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                • 가장 많이 사용한 키워드:{' '}
                <strong
                  style={{ color: filteredStats[0]?.keyword.color }}
                  className="cursor-pointer hover:underline"
                  onClick={() =>
                    handleKeywordClick(filteredStats[0]?.keyword.name)
                  }
                >
                  {filteredStats[0]?.keyword.name}
                </strong>{' '}
                ({filteredStats[0]?.usageCount}회)
              </p>

              <p>• 총 {filteredStats.length}개의 키워드</p>
            </div>
          </div>
        )}

        {/* 키워드 차트 */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 w-16">
                  No
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-32">
                  키워드
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-32">
                  횟수
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-32">
                  최근 사용
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((stat, index) => (
                <tr
                  key={stat.keyword.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleKeywordClick(stat.keyword.name)}
                >
                  <td className="py-3 px-2">
                    <span
                      className={`text-sm font-bold ${index < 3 ? 'text-accent-600' : 'text-gray-500'}`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="font-medium text-sm hover:underline"
                      style={{ color: stat.keyword.color }}
                    >
                      {stat.keyword.name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900 min-w-8">
                      {stat.usageCount}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">
                      {format(new Date(stat.lastUsedDate), 'MM/dd', {
                        locale: ko,
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedKeyword && (
        <KeywordReflectionsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          keywordName={selectedKeyword}
          userId={user.id}
        />
      )}
    </AuthGuard>
  );
};

export default AnalyticsPage;
