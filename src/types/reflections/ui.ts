import { PeriodType } from '.';
import { Keyword, KeywordAnalysis, KeywordNavigationData, Neighbor, Reflection, SearchResult } from './database';

export interface ReflectionWithKeywords extends Reflection {
  keywords: Keyword[];
  effective_visibility: 'public' | 'neighbors' | 'private';
}

export interface KeywordUsageStats {
  keyword: Keyword;
  usageCount: number;
  gratitudeCount: number;
  reflectionCount: number;
  lastUsedDate: string;
  firstUsedDate: string;
}

export interface ReflectionFilters {
  type?: 'gratitude' | 'reflection' | 'all';
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  visibility?: 'public' | 'neighbors' | 'private' | 'all';
  author_id?: string;
}

export interface DateRangePeriod {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

export interface NeighborListItem {
  neighbor: Neighbor;
  is_requester: boolean;
  display_name: string;
  display_nickname: string;
}

// 키워드 관련 Hook 반환 타입들 (ui.ts에 추가)
export interface UseKeywordAnalysisReturn {
  keywordAnalysis: KeywordAnalysis[];
  isLoading: boolean;
  error: Error | null;
  getKeywordAnalysis: (keywordId: string, period?: PeriodType) => KeywordAnalysis | undefined;
  refreshAnalysis: () => Promise<void>;
}

export interface UseKeywordSearchReturn {
  searchResults: SearchResult | null;
  isLoading: boolean;
  error: Error | null;
  searchByKeyword: (keywordId: string, filters?: Partial<ReflectionFilters>) => Promise<void>;
  searchByText: (query: string, filters?: Partial<ReflectionFilters>) => Promise<void>;
  clearSearch: () => void;
}

export interface UseKeywordNavigationReturn {
  navigationData: KeywordNavigationData | null;
  isLoading: boolean;
  error: Error | null;
  navigateToKeyword: (keywordId: string, initialReflectionId?: string) => Promise<void>;
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}