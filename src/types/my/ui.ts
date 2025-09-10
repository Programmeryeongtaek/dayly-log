// 마이페이지 UI 관련 타입

import { NeighborInfo, NeighborRequest, QuestionWithKeywords, ReflectionWithKeywords, ScrapWithContent } from './database';

// 타입
export type MyPageType = 'main' | 'posts' | 'neighbor' | 'scraps';

// 내 작성글 페이지의 탭 타입들
export type PostsTabType = 'all' | 'reflections' | 'questions';

// 정렬 타입들
export type PostsSortType = 'latest' | 'oldest';
export type ScrapsSortType = 'recent' | 'oldest' | 'content_date';

// 필터 타입
export interface PostsFilters {
  tab: PostsTabType;
  search: string;
  sort: PostsSortType;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface ScrapsFilters {
  search: string;
  sort: ScrapsSortType;
  content_type?: 'all' | 'reflections' | 'questions';
  date_range?: {
    start: string;
    end: string;
  };
}

export interface NeighborFilters {
  search: string;
}

// 카드
export interface PostCardProps {
  item: (ReflectionWithKeywords | QuestionWithKeywords) & {
    type: 'reflection' | 'question';
  };
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export interface NeighborRequestCardProps {
  request: NeighborRequest;
  onAccept: () => void;
  onDecline: () => void;
  loading: boolean;
}

export interface NeighborCardProps {
  neighbor: NeighborInfo;
  onRemove: () => void;
  onSendMessage: () => void;
  loading: boolean;
}

export interface ScrapCardProps {
  scrap: ScrapWithContent;
  onRemove: () => void;
  onViewOriginal: () => void;
  loading: boolean;
}

// 공통 컴포넌트
export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface FilterBarProps {
  totalCount: number;
  children?: React.ReactNode;
}

export interface PostsFilterBarProps extends FilterBarProps {
  filters: PostsFilters;
  onFiltersChange: (filters: Partial<PostsFilters>) => void;
}

export interface ScrapsFilterBarProps extends FilterBarProps {
  filters: ScrapsFilters;
  onFiltersChange: (filters: Partial<ScrapsFilters>) => void;
}

// 작성글 페이지 전용 탭 네비게이션
export interface PostsTabNavigationProps {
  activeTab: PostsTabType;
  onTabChange: (tab: PostsTabType) => void;
  counts: {
    all: number;
    reflections: number;
    questions: number;
  };
}

export interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  description: string;
  color?: string;
  onClick?: () => void;
}

export interface EmptyStateProps {
  type: 'posts' | 'neighbor' | 'scraps' | 'search';
  icon: React.ReactNode;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  loading: boolean;
}

// 액션 상태 타입
export interface ActionState {
  loading: boolean;
  error?: string;
  success?: boolean;
}

export interface ActionStates {
  acceptRequest: ActionState;
  declineRequest: ActionState;
  removeNeighbor: ActionState;
  removeScrap: ActionState;
  deletePost: ActionState;
}

// 모달
export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

// UI 요소
export interface KeywordChipProps {
  keyword: {
    id: string;
    name: string;
    color: string;
  };
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export interface VisibilityIndicatorProps {
  is_public: boolean;
  is_neighbor_visible: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface DateDisplayProps {
  date: string;
  format?: 'full' | 'short' | 'relative';
  showIcon?: boolean;
}

export interface UserAvatarProps {
  user: {
    name: string;
    nickname?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showNickname?: boolean;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

export interface ActivitySummaryProps {
  recentActivity: Array<{
    type: 'reflection' | 'question' | 'neighbor' | 'scrap';
    title: string;
    date: string;
    onClick?: () => void;
  }>;
}