import { PeriodType } from '../reflections';
import { QuestionKeyword } from './database';

export interface QuestionSummary {
  period: string;
  totalQuestions: number;
  dailyCount: number;
  growthCount: number;
  customCount: number;
  answeredCount: number;
  unansweredCount: number;
  uniqueKeywordsCount: number;
  topKeywords: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  ownQuestions: number;
  neighborsQuestions: number;
}

export interface QuestionKeywordTrendData {
  keyword: string;
  data: Array<{
    date: string;
    count: number;
  }>;
}

export interface QuestionSocialStats {
  neighbors_count: number;
  pending_requests_count: number;
  public_questions_count: number;
  neighbor_only_questions_count: number;
  private_questions_count: number;
}

// 기간별 통계를 위한 추가 인터페이스
export interface PeriodQuestionSummary {
  period: PeriodType;
  startDate: string;
  endDate: string;
  summary: QuestionSummary;
  keywordTrends: QuestionKeywordTrendData[];
  comparisonWithPreviousPeriod: {
    questionCountChange: number;
    keywordUsageChange: number;
    newKeywords: QuestionKeyword[];
    answeredRateChange: number;
  };
}