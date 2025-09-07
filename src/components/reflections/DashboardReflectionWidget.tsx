import { useAuth } from '@/hooks/auth';
import { useKeywords } from '@/hooks/reflections/useKeywords';
import { useReflections } from '@/hooks/reflections/useReflections';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowRight,
  BookOpen,
  Hash,
  Heart,
  Lightbulb,
  PencilIcon,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const DashboardReflectionWidget = () => {
  const { user } = useAuth();
  const { reflections, statistics, isLoading } = useReflections({
    userId: user?.id,
  });
  const { keywordStats } = useKeywords(user?.id);

  // 최근 7일간의 회고
  const recentReflections = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return reflections
      .filter((r) => new Date(r.date) >= sevenDaysAgo)
      .slice(0, 3);
  }, [reflections]);

  // 인기 키워드 (상위 3개)
  const topKeywords = useMemo(() => {
    return keywordStats.slice(0, 3).filter((stat) => stat.usageCount > 0);
  }, [keywordStats]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">회고</h2>
            <p className="text-sm text-gray-500">감사와 성찰을 기록하세요.</p>
          </div>
        </div>
        <Link
          href="/reflections"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          전체보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="p-6 space-y-6">
        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600">감사</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {statistics.gratitude}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">성찰</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {statistics.reflection}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Hash className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">키워드</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {statistics.uniqueKeywords}
            </p>
          </div>
        </div>

        {/* 최근 회고 */}
        {recentReflections.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <PencilIcon className="w-4 h-4 text-gray-600" />
              최근 회고
            </h3>
            <div className="space-y-3">
              {recentReflections.map((reflection) => (
                <Link
                  key={reflection.id}
                  href={`/reflections/${reflection.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {reflection.category?.name === 'gratitude' ? (
                        <Heart className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {reflection.category?.display_name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(reflection.date), 'MM/dd', {
                        locale: ko,
                      })}
                    </span>
                  </div>
                  {reflection.title && (
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">
                      {reflection.title}
                    </h4>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {reflection.content}
                  </p>
                  {reflection.keywords && reflection.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {reflection.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword.id}
                          className="inline-block px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: `${keyword.color}20`,
                            color: keyword.color,
                          }}
                        >
                          {keyword.name}
                        </span>
                      ))}
                      {reflection.keywords.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{reflection.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 인기 키워드 */}
        {topKeywords.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">인기 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {topKeywords.map((stat) => (
                <Link
                  key={stat.keyword.id}
                  href={`/reflections?keyword=${encodeURIComponent(stat.keyword.name)}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: `${stat.keyword.color}20`,
                    color: stat.keyword.color,
                    border: `1px solid ${stat.keyword.color}40`,
                  }}
                >
                  {stat.keyword.name}
                  <span className="text-xs opacity-75">{stat.usageCount}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {statistics.total === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              첫 회고를 작성해보세요
            </h3>
            <p className="text-gray-500 mb-4">
              감사한 마음과 성찰을 통해 성장의 여정을 시작하세요
            </p>
            <Link
              href="/reflections/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />첫 회고 작성하기
            </Link>
          </div>
        )}

        {/* 빠른 액션 */}
        <div className="flex gap-2">
          <Link
            href="/reflections/new"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
          >
            회고 작성
          </Link>
          <Link
            href="/reflections/analytics"
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
          >
            키워드 분석
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardReflectionWidget;
