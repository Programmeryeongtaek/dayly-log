import { DomainType, NeighborProfileStatsProps } from '@/types/my';
import { Brain, Coffee, Heart, Star, TrendingUp } from 'lucide-react';

const NeighborProfileStats = ({
  stats,
  onDomainClick,
  activeDomain,
}: NeighborProfileStatsProps) => {
  const domainConfigs = [
    {
      key: 'gratitude' as DomainType,
      label: '감사',
      icon: <Heart className="w-5 h-5" />,
      color: 'orange',
      description: '감사한 순간들',
    },
    {
      key: 'reflection' as DomainType,
      label: '성찰',
      icon: <Brain className="w-5 h-5" />,
      color: 'blue',
      description: '깊은 성찰과 생각',
    },
    {
      key: 'daily' as DomainType,
      label: '일상',
      icon: <Coffee className="w-5 h-5" />,
      color: 'green',
      description: '일상의 질문들',
    },
    {
      key: 'growth' as DomainType,
      label: '성장',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'purple',
      description: '성장을 위한 질문',
    },
    {
      key: 'custom' as DomainType,
      label: '나만의 질문',
      icon: <Star className="w-5 h-5" />,
      color: 'indigo',
      description: '개인적인 질문들',
    },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      orange: isActive
        ? 'bg-orange-100 border-orange-500 text-orange-700 hover:cursor-pointer '
        : 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50 hover:cursor-pointer',
      blue: isActive
        ? 'bg-blue-100 border-blue-500 text-blue-700 hover:cursor-pointer'
        : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:cursor-pointer',
      green: isActive
        ? 'bg-green-100 border-green-500 text-green-700 hover:cursor-pointer'
        : 'bg-white border-green-200 text-green-600 hover:bg-green-50 hover:cursor-pointer',
      purple: isActive
        ? 'bg-purple-100 border-purple-500 text-purple-700 hover:cursor-pointer'
        : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:cursor-pointer',
      indigo: isActive
        ? 'bg-indigo-100 border-indigo-500 text-indigo-700 hover:cursor-pointer'
        : 'bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:cursor-pointer',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const totalCount = Object.values(stats).reduce(
    (sum, count) => sum + count,
    0
  );

  if (totalCount === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">공개된 게시글이 없습니다.</p>
          <p className="text-sm">아직 공개 설정한 게시글이 없어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">공개된 게시글</h3>
        <span className="text-sm text-accent-500">총 {totalCount}개</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {domainConfigs.map((domain) => {
          const count = stats[domain.key];
          const isActive = activeDomain === domain.key;
          const isDisabled = count === 0;

          return (
            <button
              key={domain.key}
              onClick={() => !isDisabled && onDomainClick(domain.key)}
              disabled={isDisabled}
              className={`
                relative p-4 border-2 rounded-lg transition-all duration-200 text-left
                ${
                  isDisabled
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : getColorClasses(domain.color, isActive)
                }
                ${!isDisabled && 'hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              <div className="flex items-center space-x-2 mb-2">
                {domain.icon}
                <span className="font-medium text-sm">{domain.label}</span>
              </div>

              <div className="mb-1">
                <span className="text-2xl font-bold">{count}</span>
                <span className="text-xs ml-1">개</span>
              </div>

              <p className="text-xs opacity-75 line-clamp-1">
                {domain.description}
              </p>

              {isActive && !isDisabled && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NeighborProfileStats;
