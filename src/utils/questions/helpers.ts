import { PeriodType } from "@/types/questions";

export type QuestionType = "daily" | "growth" | "custom";

export const getQuestionTypeLabel = (type: QuestionType): string => {
  const labels = {
    daily: "일상",
    growth: "성장",
    custom: "나만의 질문",
  };
  return labels[type];
};

export const getQuestionTypeColor = (type: QuestionType): string => {
  const colors = {
    daily: "text-green-600",
    growth: "text-purple-600",
    custom: "text-blue-600",
  };
  return colors[type];
};

export const getQuestionTypeBgColor = (type: QuestionType): string => {
  const bgColors = {
    daily: "bg-green-100",
    growth: "bg-purple-100",
    custom: "bg-blue-100",
  };
  return bgColors[type];
};

export const getQuestionVisibilityStatus = (
  is_public: boolean,
  is_neighbor_visible: boolean,
): string => {
  if (is_public && is_neighbor_visible) return "🌍";
  if (is_public && !is_neighbor_visible) return "👤";
  return "🔒";
};

export const getQuestionVisibilityLabel = (
  is_public: boolean,
  is_neighbor_visible: boolean,
): string => {
  if (is_public && is_neighbor_visible) return "전체 공개";
  if (is_public && !is_neighbor_visible) return "이웃 공개";
  return "비공개";
};

export const getAnswerStatus = (is_answered: boolean): string =>
  is_answered ? "✅" : "❓";

export const getAnswerStatusLabel = (is_answered: boolean): string =>
  is_answered ? "답변 완료" : "답변 대기";

export const formatPeriodLabel = (period: PeriodType): string => {
  const labels = {
    "1week": "최근 1주",
    "1month": "최근 1개월",
    "3months": "최근 3개월",
    "6months": "최근 6개월",
    "1year": "최근 1년",
    custom: "사용자 지정",
  };
  return labels[period];
};
