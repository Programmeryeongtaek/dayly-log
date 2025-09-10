"use client";

import { useQuestionsCategories } from "@/hooks/questions/useQuestionCategories";
import {
  DateRangePeriod,
  QuestionFilters,
  QuestionKeyword,
} from "@/types/questions";
import { Filter, RefreshCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface QuestionFiltersComponentProps {
  filters: QuestionFilters;
  keywords: QuestionKeyword[];
  onFiltersChange: (filters: Partial<QuestionFilters>) => void;
  onPeriodChange: (period: string) => void;
  periodPresets: DateRangePeriod[];
}

const QuestionFiltersComponent = ({
  filters,
  keywords,
  periodPresets,
  onFiltersChange,
  onPeriodChange,
}: QuestionFiltersComponentProps) => {
  const { dailyCategory, growthCategory, customCategory } =
    useQuestionsCategories();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("전체");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  // 카테고리별 키워드 분류
  const { dailyKeywords, growthKeywords, customKeywords } = useMemo(() => {
    const daily = keywords.filter(
      (k) => dailyCategory && k.category_id === dailyCategory.id,
    );
    const growth = keywords.filter(
      (k) => growthCategory && k.category_id === growthCategory.id,
    );
    const custom = keywords.filter(
      (k) => customCategory && k.category_id === customCategory.id,
    );

    return {
      dailyKeywords: daily,
      growthKeywords: growth,
      customKeywords: custom,
    };
  }, [keywords, dailyCategory, growthCategory, customCategory]);

  const handleKeywordToggle = (keywordName: string) => {
    const currentKeywords = filters.keywords || [];
    const newKeywords = currentKeywords.includes(keywordName)
      ? currentKeywords.filter((k) => k !== keywordName)
      : [...currentKeywords, keywordName];

    onFiltersChange({ keywords: newKeywords });
  };

  const handleCategoryToggle = (category: "daily" | "growth" | "custom") => {
    const currentCategories = filters.categories || [];
    const isSelected = currentCategories.includes(category);

    if (isSelected) {
      // 이미 선택된 카테고리 클릭 시 제거
      onFiltersChange({ categories: [] });
    } else {
      // 새 카테고리 선택 (단일 선택)
      onFiltersChange({ categories: [category] });
    }
  };

  const handleVisibilityToggle = (
    visibility: "public" | "neighbors" | "private",
  ) => {
    const currentVisibility = filters.visibility || [];
    const newVisibility = currentVisibility.includes(visibility)
      ? currentVisibility.filter((v) => v !== visibility)
      : [...currentVisibility, visibility];

    onFiltersChange({ visibility: newVisibility });
  };

  const handlePeriodToggle = (periodLabel: string) => {
    if (selectedPeriod === periodLabel) {
      // 같은 기간 클릭 시 '전체'로 변경
      setSelectedPeriod("전체");
      setShowCustomDateRange(false);
      onFiltersChange({ dateFrom: undefined, dateTo: undefined });
    } else {
      // 다른 기간 선택
      setSelectedPeriod(periodLabel);
      if (periodLabel === "임의 기간") {
        setShowCustomDateRange(true);
        // 임의 기간 선택 시 날짜 리셋 (시작일: undefined, 종료일: 오늘)
        const today = new Date().toISOString().split("T")[0];
        onFiltersChange({ dateFrom: undefined, dateTo: today });
      } else if (periodLabel === "전체") {
        setShowCustomDateRange(false);
        onFiltersChange({ dateFrom: undefined, dateTo: undefined });
      } else {
        setShowCustomDateRange(false);
        onPeriodChange(periodLabel);
      }
    }
  };

  const clearFilters = () => {
    setSelectedPeriod("전체");
    setShowCustomDateRange(false);
    onFiltersChange({
      categories: [],
      keywords: [],
      dateFrom: undefined,
      dateTo: undefined,
      isAnswered: undefined,
      visibility: [],
      searchQuery: undefined,
    });
  };

  const hasActiveFilters =
    (filters.categories && filters.categories.length > 0) ||
    (filters.keywords && filters.keywords.length > 0) ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.isAnswered !== undefined ||
    (filters.visibility && filters.visibility.length > 0) ||
    filters.searchQuery;

  return (
    <>
      {/* 검색어 */}
      <div className="relative">
        <input
          type="text"
          placeholder="질문 제목, 내용, 답변 검색..."
          value={filters.searchQuery || ""}
          onChange={(e) =>
            onFiltersChange({ searchQuery: e.target.value || undefined })
          }
          className="w-full pl-10 py-2 border-2 rounded-lg focus:outline-none border-accent-300 focus:ring-accent-500 text-sm"
        />
        <Search className="w-5 h-5 absolute left-4 top-[10px]" />
      </div>
      <div className="bg-white rounded-lg border p-4 space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">필터</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-base cursor-pointer font-medium text-gray-500 hover:text-accent-500 flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3 font-medium" />
              초기화
            </button>
          )}
        </div>

        {/* 기본 필터들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 카테고리 필터 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">카테고리</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "daily" as const, label: "일상", color: "green" },
                { key: "growth" as const, label: "성장", color: "purple" },
                { key: "custom" as const, label: "나만의 질문", color: "blue" },
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryToggle(category.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer  ${
                    filters.categories?.includes(category.key)
                      ? `bg-${category.color}-100 text-${category.color}-700 border-${category.color}-300`
                      : `bg-gray-100 text-gray-600 hover:bg-${category.color}-100 border-gray-300`
                  } border`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* 답변 상태 필터 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              답변 상태
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onFiltersChange({
                    isAnswered: filters.isAnswered === true ? undefined : true,
                  })
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                  filters.isAnswered === true
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-accent-100 border-gray-300"
                } border`}
              >
                완료
              </button>
              <button
                onClick={() =>
                  onFiltersChange({
                    isAnswered:
                      filters.isAnswered === false ? undefined : false,
                  })
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                  filters.isAnswered === false
                    ? "bg-orange-100 text-orange-700 border-orange-300"
                    : "bg-gray-100 text-gray-600 hover:bg-orange-100 border-gray-300"
                } border`}
              >
                대기
              </button>
            </div>
          </div>

          {/* 공개 범위 필터 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              공개 범위
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "public" as const, label: "전체", icon: "🌍" },
                { key: "neighbors" as const, label: "이웃", icon: "👤" },
                { key: "private" as const, label: "비공개", icon: "🔒" },
              ].map((visibility) => (
                <button
                  key={visibility.key}
                  onClick={() => handleVisibilityToggle(visibility.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                    filters.visibility?.includes(visibility.key)
                      ? "bg-accent-100 text-gray-700 border-accent-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                  } border`}
                >
                  {visibility.icon} {visibility.label}
                </button>
              ))}
            </div>
          </div>

          {/* 기간 필터 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">기간</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => handlePeriodToggle("전체")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                  selectedPeriod === "전체"
                    ? "bg-accent-100 text-gray-700 border-accent-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                } border`}
              >
                전체
              </button>
              {periodPresets
                .filter((p) => p.label !== "전체")
                .map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePeriodToggle(preset.label)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                      selectedPeriod === preset.label
                        ? "bg-accent-100 text-gray-700 border-accent-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                    } border`}
                  >
                    {preset.label}
                  </button>
                ))}
              <button
                onClick={() => handlePeriodToggle("임의 기간")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors hover:cursor-pointer ${
                  selectedPeriod === "임의 기간"
                    ? "bg-accent-100 text-gray-700 border-accent-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
                } border`}
              >
                임의 기간
              </button>
            </div>
          </div>
        </div>

        {/* 날짜 범위 선택 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              시작일
            </label>
            <input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) =>
                onFiltersChange({ dateFrom: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-accent-300 rounded-lg hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              종료일
            </label>
            <input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) =>
                onFiltersChange({ dateTo: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-accent-300 rounded-lg hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
            />
          </div>
        </div>

        {/* 키워드 필터 */}
        {keywords.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">키워드</h4>

            {/* 일상 키워드 */}
            {dailyKeywords.length > 0 && (
              <div>
                <p className="text-xs text-green-600 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  일상
                </p>
                <div className="flex flex-wrap gap-2">
                  {dailyKeywords.map((keyword) => (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordToggle(keyword.name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:cursor-pointer hover:border-accent-100 ${
                        filters.keywords?.includes(keyword.name)
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-gray-100 text-gray-600 hover:bg-green-50 border-gray-300"
                      } border`}
                    >
                      {keyword.name}
                      {keyword.usage_count && (
                        <span className="ml-1 text-xs opacity-75">
                          ({keyword.usage_count})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 성장 키워드 */}
            {growthKeywords.length > 0 && (
              <div>
                <p className="text-xs text-purple-600 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  성장
                </p>
                <div className="flex flex-wrap gap-2">
                  {growthKeywords.map((keyword) => (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordToggle(keyword.name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:cursor-pointer hover:border-accent-100 ${
                        filters.keywords?.includes(keyword.name)
                          ? "bg-purple-100 text-purple-700 border-purple-300"
                          : "bg-gray-100 text-gray-600 hover:bg-purple-50 border-gray-300"
                      } border`}
                    >
                      {keyword.name}
                      {keyword.usage_count && (
                        <span className="ml-1 text-xs opacity-75">
                          ({keyword.usage_count})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 나만의 질문 키워드 */}
            {customKeywords.length > 0 && (
              <div>
                <p className="text-xs text-blue-600 mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  나만의 질문
                </p>
                <div className="flex flex-wrap gap-2">
                  {customKeywords.map((keyword) => (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordToggle(keyword.name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:cursor-pointer hover:border-accent-100 ${
                        filters.keywords?.includes(keyword.name)
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50 border-gray-300"
                      } border`}
                    >
                      {keyword.name}
                      {keyword.usage_count && (
                        <span className="ml-1 text-xs opacity-75">
                          ({keyword.usage_count})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionFiltersComponent;
