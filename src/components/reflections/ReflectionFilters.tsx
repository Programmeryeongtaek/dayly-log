import { useReflectionCategories } from "@/hooks/reflections/useReflectionCategories";
import { DateRangePeriod, Keyword } from "@/types/reflections";
import { ReflectionFilters } from "@/types/reflections/ui";
import { Filter, X } from "lucide-react";
import { useMemo } from "react";

interface ReflectionFiltersComponentProps {
  filters: ReflectionFilters;
  keywords: Keyword[];
  onFiltersChange: (filters: Partial<ReflectionFilters>) => void;
  onPeriodChange: (period: string) => void;
  periodPresets: DateRangePeriod[];
}

const ReflectionFiltersComponent = ({
  filters,
  keywords,
  periodPresets,
  onFiltersChange,
  onPeriodChange,
}: ReflectionFiltersComponentProps) => {
  const { gratitudeCategory, reflectionCategory } = useReflectionCategories();

  // 카테고리별 키워드 분류
  const { gratitudeKeywords, reflectionKeywords } = useMemo(() => {
    const gratitude = keywords.filter(
      (k) => gratitudeCategory && k.category_id === gratitudeCategory.id,
    );
    const reflection = keywords.filter(
      (k) => reflectionCategory && k.category_id === reflectionCategory.id,
    );

    return { gratitudeKeywords: gratitude, reflectionKeywords: reflection };
  }, [keywords, gratitudeCategory, reflectionCategory]);

  const handleKeywordToggle = (keywordName: string) => {
    const currentKeywords = filters.keywords || [];
    const newKeywords = currentKeywords.includes(keywordName)
      ? currentKeywords.filter((k) => k !== keywordName)
      : [...currentKeywords, keywordName];

    onFiltersChange({ keywords: newKeywords });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: "all",
      keywords: [],
      startDate: undefined,
      endDate: undefined,
      searchTerm: "",
      visibility: "all",
    });
  };

  const hasActiveFilters =
    filters.type !== "all" ||
    (filters.keywords && filters.keywords.length > 0) ||
    filters.startDate ||
    filters.endDate ||
    filters.searchTerm ||
    filters.visibility !== "all";

  return (
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
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            초기화
          </button>
        )}
      </div>

      {/* 기본 필터들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 타입 필터 */}
        <select
          value={filters.type || "all"}
          onChange={(e) =>
            onFiltersChange({
              type: e.target.value as ReflectionFilters["type"],
            })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
        >
          <option value="all">전체</option>
          <option value="gratitude">감사</option>
          <option value="reflection">성찰</option>
        </select>

        {/* 가시성 필터 */}
        <select
          value={filters.visibility || "all"}
          onChange={(e) =>
            onFiltersChange({
              visibility: e.target.value as ReflectionFilters["visibility"],
            })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
        >
          <option value="public">전체 공개</option>
          <option value="neighbors">이웃 공개</option>
          <option value="private">비공개</option>
        </select>

        {/* 기간 프리셋 */}
        <select
          onChange={(e) => onPeriodChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
          defaultValue=""
        >
          <option value="">기간 선택</option>
          {periodPresets.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>

        {/* 검색어 */}
        <input
          type="text"
          placeholder="제목, 내용, 키워드 검색..."
          value={filters.searchTerm || ""}
          onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
        />
      </div>

      {/* 날짜 범위 선택 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            시작
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onFiltersChange({ startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            종료
          </label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => onFiltersChange({ endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm"
          />
        </div>
      </div>

      {/* 키워드 필터 */}
      {keywords.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">키워드</h4>

          {/* 감사 키워드 */}
          {gratitudeKeywords.length > 0 && (
            <div>
              <p className="text-xs text-orange-600 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                감사
              </p>
              <div className="flex flex-wrap gap-2">
                {gratitudeKeywords.map((keyword) => (
                  <button
                    key={keyword.id}
                    onClick={() => handleKeywordToggle(keyword.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.keywords?.includes(keyword.name)
                        ? "bg-orange-100 text-orange-700 border-orange-300"
                        : "bg-gray-100 text-gray-600 hover:bg-orange-50 border-gray-300"
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

          {/* 성찰 키워드 */}
          {reflectionKeywords.length > 0 && (
            <div>
              <p className="text-xs text-blue-600 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                성찰
              </p>
              <div className="flex flex-wrap gap-2">
                {reflectionKeywords.map((keyword) => (
                  <button
                    key={keyword.id}
                    onClick={() => handleKeywordToggle(keyword.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
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

      {/* 활성 필터 표시 */}
      {hasActiveFilters && (
        <div className="pt-3 border-t">
          <div className="flex flex-wrap gap-2">
            {filters.type !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                타입: {filters.type === "gratitude" ? "감사" : "성찰"}
                <button
                  onClick={() => onFiltersChange({ type: "all" })}
                  className="hover:bg-blue-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.keywords?.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {keyword}
                <button
                  onClick={() => handleKeywordToggle(keyword)}
                  className="hover:bg-gray-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionFiltersComponent;
