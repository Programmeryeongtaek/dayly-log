import {
  Bookmark,
  BookOpen,
  ExternalLink,
  MessageCircleQuestion,
  Trash2,
} from 'lucide-react';
import KeywordChip from './KeywordChip';

const ScrapCard = ({
  scrap,
  onRemove,
  onViewOriginal,
  loading,
}: {
  scrap: {
    id: string;
    content_type: 'reflection' | 'question';
    scraped_at: string;
    author: {
      id: string;
      name: string;
      nickname: string;
    };
    content: {
      id: string;
      title?: string;
      content: string;
      category: string;
      date: string;
      is_answered?: boolean;
      answer?: string;
      keywords: Array<{
        id: string;
        name: string;
        color: string;
      }>;
    };
  };
  onRemove: () => void;
  onViewOriginal: () => void;
  loading: boolean;
}) => (
  <div className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow hover:border-accent-500">
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-2 items-center">
        {scrap.content_type === 'reflection' ? (
          <div className="p-2 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
        ) : (
          <div className="p-2 bg-green-50 rounded-lg">
            <MessageCircleQuestion className="w-5 h-5 text-green-600" />
          </div>
        )}

        {/* 작성자 정보 */}
        {scrap.author.nickname ? (
          <span className="text-sm text-gray-600">{scrap.author.nickname}</span>
        ) : (
          <span className="text-sm text-gray-600">{scrap.author.name}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="flex gap-2 items-center text-sm text-gray-500">
          <Bookmark className="w-4 h-4 text-yellow-500" />
          {new Date(scrap.scraped_at).toLocaleDateString()}
        </span>
        <button
          onClick={onViewOriginal}
          className="p-1 text-gray-400 hover:text-blue-600"
          title="원글 보기"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          disabled={loading}
          className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
          title="스크랩 삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    {scrap.content.title && (
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {scrap.content.title}
      </h3>
    )}

    <p className="text-gray-700 mb-4 line-clamp-3">{scrap.content.content}</p>

    {scrap.content_type === 'question' && scrap.content.answer && (
      <div className="bg-accent-50 p-3 rounded mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">답변:</p>
        <p className="text-gray-600 line-clamp-2">{scrap.content.answer}</p>
      </div>
    )}

    {scrap.content.keywords.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {scrap.content.keywords.map((keyword) => (
          <KeywordChip key={keyword.id} keyword={keyword} />
        ))}
      </div>
    )}
  </div>
);

export default ScrapCard;
