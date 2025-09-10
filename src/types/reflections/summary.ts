import { Keyword, PeriodType } from ".";

export interface ReflectionSummary {
  period: string;
  totalReflections: number;
  gratitudeCount: number;
  reflectionCount: number;
  uniqueKeywordsCount: number;
  topKeywords: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  ownReflections: number;
  neighborsReflections: number;
}

export interface KeywordTrendData {
  keyword: string;
  data: Array<{
    date: string;
    count: number;
  }>;
}

export interface SocialStats {
  neighbors_count: number;
  pending_requests_count: number;
  public_reflections_count: number;
  neighbor_only_reflections_count: number;
  private_reflections_count: number;
}

// 기간별 통계를 위한 추가 인터페이스
export interface PeriodReflectionSummary {
  period: PeriodType;
  startDate: string;
  endDate: string;
  summary: ReflectionSummary;
  keywordTrends: KeywordTrendData[];
  comparisonWithPreviousPeriod: {
    reflectionCountChange: number;
    keywordUsageChange: number;
    newKeywords: Keyword[];
  };
}
