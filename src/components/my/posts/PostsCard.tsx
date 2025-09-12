import {
  BookOpen,
  Calendar,
  Edit,
  MessageCircleQuestion,
  Trash2,
} from 'lucide-react';
import VisibilityIcon from './VisibilityIcon';
import KeywordChip from './KeywordChip';

const PostCard = ({
  item,
  onEdit,
  onDelete,
}: {
  item: {
    id: string;
    type: 'reflection' | 'question';
    title?: string;
    content?: string;
    date: string;
    category: {
      display_name: string;
    };
    keywords: Array<{
      id: string;
      name: string;
      color: string;
    }>;
    is_answered?: boolean;
    answer?: string;
    is_public: boolean;
    is_neighbor_visible: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const safeKeywords = item.keywords || [];

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow hover:border-accent-500">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {item.type === 'reflection' ? (
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          ) : (
            <div className="p-2 bg-green-50 rounded-lg">
              <MessageCircleQuestion className="w-5 h-5 text-green-600" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(item.date).toLocaleDateString()}
              </span>
              <VisibilityIcon
                isPublic={item.is_public}
                isNeighborVisible={item.is_neighbor_visible}
              />
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 제목 */}
      {item.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {item.title}
        </h3>
      )}

      {/* 내용 */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {item.content || '내용이 없습니다.'}
      </p>

      {/* 답변 (질문인 경우) */}
      {item.type === 'question' && item.answer && (
        <div className="bg-accent-50 p-3 rounded-lg mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">답변:</p>
          <p className="text-gray-600 text-sm line-clamp-2">{item.answer}</p>
        </div>
      )}

      {/* 키워드 */}
      {safeKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.keywords.map((keyword) => (
            <KeywordChip key={keyword.id} keyword={keyword} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
