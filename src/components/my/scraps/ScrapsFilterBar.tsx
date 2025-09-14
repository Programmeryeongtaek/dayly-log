import { ScrapsFilters } from "@/types/my";
import { Search } from "lucide-react";

const ScrapsFilterBar = ({
  filters,
  onFiltersChange,
}: {
  filters: ScrapsFilters;
  onFiltersChange: (filters: Partial<ScrapsFilters>) => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-4">
    {/* 검색 */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="스크랩한 글 검색..."
        value={filters.search}
        onChange={(e) => onFiltersChange({ search: e.target.value })}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 hover:border-accent-400"
      />
    </div>
    <div className="flex justify-end gap-2">
      {/* 콘텐츠 타입 필터 */}
      <select
        value={filters.content_type || "all"}
        onChange={(e) =>
          onFiltersChange({
            content_type:
              e.target.value === "all"
                ? undefined
                : (e.target.value as "reflections" | "questions"),
          })
        }
        className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 hover:border-accent-400 hover:cursor-pointer"
      >
        <option value="all">전체</option>
        <option value="reflections">회고</option>
        <option value="questions">질문</option>
      </select>

      {/* 정렬 */}
      <select
        value={filters.sort}
        onChange={(e) =>
          onFiltersChange({
            sort: e.target.value as "recent" | "oldest",
          })
        }
        className="pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 hover:border-accent-400 hover:cursor-pointer"
      >
        <option value="recent">최신 순</option>
        <option value="oldest">오래된 순</option>
      </select>
    </div>
  </div>
);

export default ScrapsFilterBar;
