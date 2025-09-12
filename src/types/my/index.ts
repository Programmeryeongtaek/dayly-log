// Database types
export type {
  Profile,
  NeighborRelationship,
  NeighborRequest,
  NeighborInfo,
  ReflectionItem,
  ReflectionCategory,
  ReflectionKeyword,
  ReflectionKeywordRelation,
  QuestionItem,
  QuestionCategory,
  QuestionKeyword,
  QuestionKeywordRelation,
  ScrapItem,
  ScrapWithContent,
  MyStats,
  PostsResponse,
  NeighborsResponse,
  ScrapsResponse,
  ReflectionWithKeywords,
  QuestionWithKeywords,
  NeighborRequestData,
  NeighborActionData,
  ScrapCreateData,
  SearchParams,
  NeighborProfile,
  DomainStats,
  NeighborPost,
} from './database';

// UI types
export type {
  MyPageType,
  PostsTabType,
  PostsSortType,
  ScrapsSortType,
  PostsFilters,
  ScrapsFilters,
  NeighborFilters,
  PostCardProps,
  NeighborRequestCardProps,
  NeighborCardProps,
  ScrapCardProps,
  SearchBarProps,
  FilterBarProps,
  PostsFilterBarProps,
  ScrapsFilterBarProps,
  PostsTabNavigationProps,
  StatsCardProps,
  EmptyStateProps,
  PaginationProps,
  ActionState,
  ActionStates,
  ConfirmModalProps,
  KeywordChipProps,
  VisibilityIndicatorProps,
  DateDisplayProps,
  UserAvatarProps,
  BreadcrumbProps,
  ActivitySummaryProps,
  NeighborProfileData,
  NeighborProfileModalProps,
  DomainTabProps,
  NeighborPostCardProps,
  NeighborProfileStatsProps,
} from './ui';

// 유틸리티 타입들
export type MyPageContentType = 'reflection' | 'question';
export type MyPageVisibilityType = 'public' | 'neighbors' | 'private';
export type MyPageNeighborStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type MyPageActionType = 'edit' | 'delete' | 'scrap' | 'share' | 'view';
export type DomainType = 'gratitude' | 'reflection' | 'daily' | 'growth' | 'custom';

// 타입 가드 함수들
export const isMyPageContentType = (type: string): type is MyPageContentType =>
  ['reflection', 'question'].includes(type);

export const isMyPageVisibilityType = (
  visibility: string,
): visibility is MyPageVisibilityType =>
  ['public', 'neighbors', 'private'].includes(visibility);

export const isMyPageNeighborStatus = (
  status: string,
): status is MyPageNeighborStatus =>
  ['pending', 'accepted', 'declined', 'blocked'].includes(status);

export const isMyPageActionType = (action: string): action is MyPageActionType =>
  ['edit', 'delete', 'scrap', 'share', 'view'].includes(action);