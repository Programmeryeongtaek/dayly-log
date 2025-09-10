export type {
  // Database types
  QuestionNeighbor,
  Question,
  QuestionKeyword,
  QuestionKeywordRelation,
  QuestionCategory,
  QuestionFormData,
  QuestionKeywordFormData,
  QuestionNeighborRequestData,
  QuestionPrivacySettingsData,
  QuestionKeywordAnalysis,
  PeriodQuestionKeywordStats,
  QuestionKeywordNavigationData,
  QuestionSearchResult,
} from './database';

export type {
  // UI types
  QuestionWithKeywords,
  QuestionKeywordUsageStats,
  QuestionFilters,
  DateRangePeriod,
  QuestionNeighborListItem,
  UseQuestionKeywordAnalysisReturn,
  UseQuestionKeywordSearchReturn,
  UseQuestionKeywordNavigationReturn,
} from './ui';

export type {
  // Summary types
  QuestionSummary,
  QuestionKeywordTrendData,
  QuestionSocialStats,
  PeriodQuestionSummary,
} from './summary';

// 유틸리티 타입들
export type QuestionType = 'daily' | 'growth' | 'custom';
export type QuestionVisibilityType = 'public' | 'neighbors' | 'private';
export type QuestionNeighborStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type PeriodType = '1week' | '1month' | '3months' | '6months' | '1year' | 'custom';

// 타입 가드 함수들
export const isQuestionType = (type: string): type is QuestionType => 
  ['daily', 'growth', 'custom'].includes(type);

export const isQuestionVisibilityType = (visibility: string): visibility is QuestionVisibilityType =>
  ['public', 'neighbors', 'private'].includes(visibility);

export const isQuestionNeighborStatus = (status: string): status is QuestionNeighborStatus =>
  ['pending', 'accepted', 'declined', 'blocked'].includes(status);

export const isPeriodType = (period: string): period is PeriodType =>
  ['1week', '1month', '3months', '6months', '1year', 'custom'].includes(period);