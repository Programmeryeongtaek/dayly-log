import { PostsFilters } from '@/types/my';
import { Search } from 'lucide-react';

const PostsFilterBar = ({
  filters,
  onFiltersChange,
}: {
  filters: PostsFilters;
  onFiltersChange: (filters: Partial<PostsFilters>) => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    {/* 검색 */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="글 제목이나 내용 검색..."
        value={filters.search}
        onChange={(e) => onFiltersChange({ search: e.target.value })}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* 정렬 */}
    <select
      value={filters.sort}
      onChange={(e) =>
        onFiltersChange({ sort: e.target.value as 'latest' | 'oldest' })
      }
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="latest">최신순</option>
      <option value="oldest">오래된순</option>
    </select>
  </div>
);

export default PostsFilterBar;
