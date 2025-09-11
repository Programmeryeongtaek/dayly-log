import { PostsTabType } from '@/types/my';

const PostsTabNavigation = ({
  activeTab,
  onTabChange,
  counts,
}: {
  activeTab: PostsTabType;
  onTabChange: (tab: PostsTabType) => void;
  counts: {
    all: number;
    reflections: number;
    questions: number;
  };
}) => (
  <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-6">
    <button
      onClick={() => onTabChange('all')}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
        activeTab === 'all'
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      전체 ({counts.all})
    </button>
    <button
      onClick={() => onTabChange('reflections')}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
        activeTab === 'reflections'
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      회고 ({counts.reflections})
    </button>
    <button
      onClick={() => onTabChange('questions')}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
        activeTab === 'questions'
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      질문 ({counts.questions})
    </button>
  </div>
);

export default PostsTabNavigation;
