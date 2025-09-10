import { ReflectionFilters } from "./ui";
export interface Neighbor {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: "pending" | "accepted" | "declined" | "blocked";
  created_at: string;
  updated_at: string;
  requester_name?: string;
  requester_nickname?: string;
  recipient_name?: string;
  recipient_nickname?: string;
}

export interface UserPrivacySettings {
  id: string;
  user_id: string;
  gratitude_default_visibility: "public" | "neighbors" | "private";
  reflection_default_visibility: "public" | "neighbors" | "private";
  allow_neighbor_requests: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reflection {
  id: string;
  user_id: string;
  category_id: string;
  title: string | null;
  content: string;
  date: string;
  is_public: boolean;
  is_neighbor_visible: boolean;
  created_at: string;
  updated_at: string;
  keywords?: Keyword[];
  category?: {
    id: string;
    name: "gratitude" | "reflection";
    display_name: string;
    description?: string;
    created_at?: string;
  };
  author_name?: string;
  author_nickname?: string;
  is_own?: boolean;
}

export interface Keyword {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  usage_count?: number;
  gratitude_count?: number;
  reflection_count?: number;
  last_used_date?: string;
  first_used_date?: string;
}

export interface ReflectionKeyword {
  id: string;
  reflection_id: string;
  keyword_id: string;
  created_at: string;
}

export interface ReflectionCategory {
  id: string;
  name: "gratitude" | "reflection";
  display_name: string;
  description: string;
  created_at: string;
}

export interface ReflectionFormData {
  title?: string | null;
  content: string;
  category_id: string;
  date: string;
  is_public?: boolean;
  is_neighbor_visible?: boolean;
  keywords: string[];
}

export interface KeywordFormData {
  name: string;
  color?: string;
  category_id: string;
}

export interface NeighborRequestData {
  recipient_id: string;
}

export interface PrivacySettingsData {
  gratitude_default_visibility: "public" | "neighbors" | "private";
  reflection_default_visibility: "public" | "neighbors" | "private";
  allow_neighbor_requests: boolean;
}

// 키워드 분석을 위한 추가 타입들
export interface KeywordAnalysis {
  keyword: Keyword;
  totalUsageCount: number;
  gratitudeUsageCount: number;
  reflectionUsageCount: number;
  periodicUsage: Array<{
    period: string;
    count: number;
  }>;
  recentReflections: Reflection[];
  firstUsedDate: string;
  lastUsedDate: string;
}

export interface PeriodKeywordStats {
  period: string;
  startDate: string;
  endDate: string;
  topKeywords: Array<{
    keyword: Keyword;
    count: number;
    gratitudeCount: number;
    reflectionCount: number;
    reflections: Reflection[];
  }>;
  totalReflections: number;
  totalUniqueKeywords: number;
}

export interface KeywordNavigationData {
  keyword: Keyword;
  reflections: Array<
    Reflection & {
      sequenceNumber: number;
      totalCount: number;
    }
  >;
  currentIndex: number;
}

export interface SearchResult {
  reflections: Reflection[];
  totalCount: number;
  matchedKeywords: Keyword[];
  searchMeta: {
    query: string;
    filters: ReflectionFilters;
    executionTime: number;
  };
}
