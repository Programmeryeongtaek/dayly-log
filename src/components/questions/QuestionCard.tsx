'use client';

import { QuestionWithKeywords } from '@/types/questions';
import {
  getAnswerStatus,
  getAnswerStatusLabel,
} from '@/utils/questions/helpers';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface QuestionCardProps {
  question: QuestionWithKeywords;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const QuestionCard = ({
  question,
  showActions = true,
  onEdit,
  onDelete,
}: QuestionCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Link
      href={`/questions/${question.id}`}
      className="block bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 p-4"
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between border-b pb-2 border-accent-500 mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            {/* 답변 상태 */}
            <span
              title={getAnswerStatusLabel(question.is_answered)}
              className="text-sm"
            >
              {getAnswerStatus(question.is_answered)}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {format(new Date(question.date), 'yyyy. M. d.')}
              </span>
            </div>
          </div>

          {/* 카테고리 배지 */}
          <span
            className={`py-1 px-3 rounded-full text-xs font-medium ${
              question.category
                ? `bg-accent-200 text-black`
                : 'text-gray-500 bg-gray-100'
            }`}
          >
            {question.category?.display_name || '알 수 없음'}
          </span>
        </div>

        {showActions && question.is_own && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors hover:cursor-pointer"
              title="편집"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 제목 */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {question.title}
      </h3>

      {/* 내용 */}
      {question.content && (
        <p className="text-gray-700 min-h-50 text-sm leading-relaxed mb-4 line-clamp-2">
          {question.content}
        </p>
      )}

      {/* 답변 미리보기 */}
      {question.answer && (
        <div className="bg-accent-50 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm leading-relaxed line-clamp-2">
            <span className="font-medium">답변: </span>
            {question.answer}
          </p>
        </div>
      )}

      {/* 키워드 */}
      {question.keywords && question.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {question.keywords.map((keyword) => (
            <span
              key={keyword.id}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent-100"
            >
              {keyword.name}
            </span>
          ))}
        </div>
      )}

      {/* 작성자 정보 (다른 사용자 질문인 경우) */}
      {!question.is_own && question.author_name && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
          <span>
            작성자: {question.author_nickname || question.author_name}
          </span>
        </div>
      )}
    </Link>
  );
};

export default QuestionCard;
