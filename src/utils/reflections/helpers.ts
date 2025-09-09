import { PeriodType } from '@/types/reflections';

export type ReflectionType = 'gratitude' | 'reflection';

export const getReflectionTypeLabel = (type: ReflectionType): string =>
  type === 'gratitude' ? '감사' : '성찰';

export const getReflectionTypeColor = (type: ReflectionType): string =>
  type === 'gratitude' ? 'text-orange-600' : 'text-blue-600';

export const getReflectionTypeBgColor = (type: ReflectionType): string =>
  type === 'gratitude' ? 'bg-orange-100' : 'bg-blue-100';

export const getVisibilityStatus = (is_public: boolean, is_neighbor_visible: boolean): string => {
  if (is_public && is_neighbor_visible) return '🌍';
  if (is_public && !is_neighbor_visible) return '👤';
  return '🔒';
};

export const getVisibilityLabel = (is_public: boolean, is_neighbor_visible: boolean): string => {
  if (is_public && is_neighbor_visible) return '전체 공개';
  if (is_public && !is_neighbor_visible) return '이웃 공개';
  return '비공개';
};

export const formatPeriodLabel = (period: PeriodType): string => {
  const labels = {
    '1week': '최근 1주',
    '1month': '최근 1개월',
    '3months': '최근 3개월',
    '6months': '최근 6개월',
    '1year': '최근 1년',
    'custom': '사용자 지정'
  };
  return labels[period];
};