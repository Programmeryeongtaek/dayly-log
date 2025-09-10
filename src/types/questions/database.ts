import { QuestionFilters } from './ui';

export interface QuestionNeighbor {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
  requester_name?: string;
  requester_nickname?: string;
  recipient_name?: string;
  recipient_nickname?: string;
}

export interface Question {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  content: string | null;
  answer: string | null;
  date: string;
  is_public: boolean;
  is_neighbor_visible: boolean;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
  keywords?: QuestionKeyword[];
  category?: {
    id: string;
    name: 'daily' | 'growth' | 'custom';
    display_name: string;
    description?: string;
    created_at?: string;
  };
  author_name?: string;
  author_nickname?: string;
  is_own?: boolean;
}

export interface QuestionKeyword {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  usage_count?: number;
  daily_count?: number;
  growth_count?: number;
  custom_count?: number;
  last_used_date?: string;
  first_used_date?: string;
}

export interface QuestionKeywordRelation {
  id: string;
  question_id: string;
  keyword_id: string;
  created_at: string;
}

export interface QuestionCategory {
  id: string;
  name: 'daily' | 'growth' | 'custom';
  display_name: string;
  description?: string;
  created_at: string;
}

export interface QuestionFormData {
  title: string;
  content?: string | null;
  answer?: string | null;
  category_id: string;
  date: string;
  is_public?: boolean;
  is_neighbor_visible?: boolean;
  is_answered?: boolean;
  keywords: string[];
}

export interface QuestionKeywordFormData {
  name: string;
  color?: string;
  category_id: string;
}

export interface QuestionNeighborRequestData {
  recipient_id: string;
}

export interface QuestionPrivacySettingsData {
  daily_default_visibility: 'public' | 'neighbors' | 'private';
  growth_default_visibility: 'public' | 'neighbors' | 'private';
  custom_default_visibility: 'public' | 'neighbors' | 'private';
  allow_neighbor_requests: boolean;
}

// 키워드 분석을 위한 추가 타입들
export interface QuestionKeywordAnalysis {
  keyword: QuestionKeyword;
  totalUsageCount: number;
  dailyUsageCount: number;
  growthUsageCount: number;
  customUsageCount: number;
  periodicUsage: Array<{
    period: string;
    count: number;
  }>;
  recentQuestions: Question[];
  firstUsedDate: string;
  lastUsedDate: string;
}

export interface PeriodQuestionKeywordStats {
  period: string;
  startDate: string;
  endDate: string;
  topKeywords: Array<{
    keyword: QuestionKeyword;
    count: number;
    dailyCount: number;
    growthCount: number;
    customCount: number;
    questions: Question[];
  }>;
  totalQuestions: number;
  totalUniqueKeywords: number;
}

export interface QuestionKeywordNavigationData {
  keyword: QuestionKeyword;
  questions: Array<Question & {
    sequenceNumber: number;
    totalCount: number;
  }>;
  currentIndex: number;
}

export interface QuestionSearchResult {
  questions: Question[];
  totalCount: number;
  matchedKeywords: QuestionKeyword[];
  searchMeta: {
    query: string;
    filters: QuestionFilters;
    executionTime: number;
  };
}
