import {
  DateRangePeriod,
  QuestionFilters,
  QuestionKeyword,
  QuestionWithKeywords,
} from "@/types/questions";
import QuestionCard from "./QuestionCard";
import { Loader2, Search } from "lucide-react";
import { useMemo } from "react";

interface QuestionListProps {
  questions: QuestionWithKeywords[];
  filters: QuestionFilters;
  keywords: QuestionKeyword[];
  periodPresets: DateRangePeriod[];
  isLoading?: boolean;
  onEdit?: (question: QuestionWithKeywords) => void;
  onDelete?: (questionId: string) => void;
}

const QuestionList = ({
  questions,
  filters,
  keywords,
  periodPresets,
  isLoading = false,
  onEdit,
  onDelete,
}: QuestionListProps) => {
  // 활성 필터 확인
  const hasActiveFilters =
    (filters.categories && filters.categories.length > 0) ||
    (filters.keywords && filters.keywords.length > 0) ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.isAnswered !== undefined ||
    (filters.visibility && filters.visibility.length > 0) ||
    filters.searchQuery;

  // 현재 기간 라벨 가져오기
  const getCurrentPeriodLabel = () => {
    if (filters.dateFrom && filters.dateTo) {
      // 프리셋 기간과 매치하는지 확인
      const matchingPreset = periodPresets.find(
        (preset) =>
          preset.startDate === filters.dateFrom &&
          preset.endDate === filters.dateTo,
      );

      if (matchingPreset) {
        return matchingPreset.label;
      }

      // 매치하는 프리셋이 없으면 날짜 범위 표시
      return "임의기간";
    }
    return "";
  };

  // 필터링된 키워드 통계
  const filteredKeywordStats = useMemo(() => {
    if (!filters.keywords || filters.keywords.length === 0) return [];

    return filters.keywords
      .map((keywordName) => {
        const keyword = keywords.find((k) => k.name === keywordName);
        const usageCount = questions.filter((q) =>
          q.keywords?.some((k) => k.name === keywordName),
        ).length;

        return {
          keyword: keyword || {
            id: keywordName,
            name: keywordName,
            color: "#3b82f6",
          },
          usageCount,
        };
      })
      .filter((stat) => stat.usageCount > 0);
  }, [questions, keywords, filters.keywords]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-accent-500" />
        <span className="ml-2 text-gray-600">질문을 불러오는 중...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">🤔</div>
        <p className="text-gray-600 mb-4">
          {hasActiveFilters
            ? "검색 조건에 맞는 질문이 없습니다."
            : "아직 질문이 없습니다."}
        </p>
        <p className="text-sm text-gray-500">
          {hasActiveFilters
            ? "다른 조건으로 검색해보세요."
            : "새로운 질문을 작성해보세요!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 구분선과 검색 결과 헤더 */}
      <div className="border-t-2 border-accent-200 pt-4">
        <div className="flex flex-col mb-2">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-accent-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {hasActiveFilters ? "검색 결과" : "전체"}
            </h2>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>•</span>
              <span>{questions.length}개</span>
              {filters.searchQuery && (
                <>
                  <span>•</span>
                  <span>{filters.searchQuery} 검색</span>
                </>
              )}
              {(filters.dateFrom || filters.dateTo) && (
                <>
                  <span>•</span>
                  <span>{getCurrentPeriodLabel()}</span>
                </>
              )}
              {filters.categories && filters.categories.length > 0 && (
                <>
                  <span>•</span>
                  <span>
                    {filters.categories
                      .map((cat) =>
                        cat === "daily"
                          ? "일상"
                          : cat === "growth"
                            ? "성장"
                            : "나만의 질문",
                      )
                      .join(", ")}
                  </span>
                </>
              )}
              {filters.isAnswered !== undefined && (
                <>
                  <span>•</span>
                  <span>{filters.isAnswered ? "완료" : "대기"}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* 키워드 분석 결과 */}
        {questions.length > 0 && filteredKeywordStats.length > 0 && (
          <div className="rounded-lg mb-6">
            <div className="flex flex-wrap gap-2 ">
              {filteredKeywordStats.map((stat) => (
                <span
                  key={stat.keyword.id}
                  className="inline-flex bg-accent-200 items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {stat.keyword.name}
                  <span className="text-xs opacity-75">
                    {stat.usageCount}회
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 질문 목록 */}
      <div className="space-y-4 mt-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onEdit={() => onEdit?.(question)}
            onDelete={() => onDelete?.(question.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
