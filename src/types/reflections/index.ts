export type {
  // Database types
  Neighbor,
  UserPrivacySettings,
  Reflection,
  Keyword,
  ReflectionKeyword,
  ReflectionCategory,
  ReflectionFormData,
  KeywordFormData,
  NeighborRequestData,
  PrivacySettingsData,
  KeywordAnalysis,
  PeriodKeywordStats,
  KeywordNavigationData,
  SearchResult,
} from "./database";

export type {
  // UI types
  ReflectionWithKeywords,
  KeywordUsageStats,
  ReflectionFilters,
  DateRangePeriod,
  NeighborListItem,
  UseKeywordAnalysisReturn,
  UseKeywordSearchReturn,
  UseKeywordNavigationReturn,
} from "./ui";

export type {
  // Summary types
  ReflectionSummary,
  KeywordTrendData,
  SocialStats,
  PeriodReflectionSummary,
} from "./summary";

// 유틸리티 타입들
export type ReflectionType = "gratitude" | "reflection";
export type VisibilityType = "public" | "neighbors" | "private";
export type NeighborStatus = "pending" | "accepted" | "declined" | "blocked";
export type PeriodType =
  | "1week"
  | "1month"
  | "3months"
  | "6months"
  | "1year"
  | "custom";

// 타입 가드 함수들
export const isReflectionType = (type: string): type is ReflectionType =>
  ["gratitude", "reflection"].includes(type);

export const isVisibilityType = (
  visibility: string,
): visibility is VisibilityType =>
  ["public", "neighbors", "private"].includes(visibility);

export const isPeriodType = (period: string): period is PeriodType =>
  ["1week", "1month", "3months", "6months", "1year", "custom"].includes(period);
