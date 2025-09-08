import { Question, QuestionKeyword, QuestionKeywordAnalysis, QuestionKeywordNavigationData, QuestionSearchResult } from './database';

export interface QuestionWithKeywords extends Question {
  keywords: QuestionKeyword[];
  category: {
    id: string;
    name: 'daily' | 'growth' | 'custom';
    display_name: string;
    description?: string;
  };
}

export interface QuestionKeywordUsageStats {
  keyword: QuestionKeyword;
  totalUsage: number;
  dailyUsage: number;
  growthUsage: number;
  customUsage: number;
  recentUsageCount: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface QuestionFilters {
  categories?: ('daily' | 'growth' | 'custom')[];
  keywords?: string[];
  dateFrom?: string;
  dateTo?: string;
  isAnswered?: boolean;
  visibility?: ('public' | 'neighbors' | 'private')[];
  searchQuery?: string;
}

export interface DateRangePeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export interface QuestionNeighborListItem {
  id: string;
  name: string;
  nickname?: string;
  avatar_url?: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  relationship_created_at: string;
  is_requester: boolean;
  recent_questions_count: number;
  shared_keywords_count: number;
}

export interface UseQuestionKeywordAnalysisReturn {
  keywordAnalysis: QuestionKeywordAnalysis | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseQuestionKeywordSearchReturn {
  searchResults: QuestionSearchResult | null;
  isLoading: boolean;
  isSearching: boolean;
  error: Error | null;
  search: (query: string, filters?: QuestionFilters) => Promise<void>;
  clearSearch: () => void;
}

export interface UseQuestionKeywordNavigationReturn {
  navigationData: QuestionKeywordNavigationData | null;
  currentQuestion: Question | null;
  isLoading: boolean;
  error: Error | null;
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}
