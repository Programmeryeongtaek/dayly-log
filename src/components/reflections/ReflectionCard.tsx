'use client';

import { ReflectionWithKeywords } from '@/types/reflections/ui';
import {
  getReflectionTypeBgColor,
  getReflectionTypeColor,
  getReflectionTypeLabel,
  getVisibilityLabel,
  getVisibilityStatus,
} from '@/utils/reflections/helpers';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, Edit, Heart, Lightbulb, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ReflectionCardProps {
  reflection: ReflectionWithKeywords;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReflectionCard = ({
  reflection,
  onEdit,
  onDelete,
}: ReflectionCardProps) => {
  const isGratitude = reflection.category?.name === 'gratitude';
  const TypeIcon = isGratitude ? Heart : Lightbulb;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(reflection.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(reflection.id);
  };

  return (
    <Link
      href={`/reflections/${reflection.id}`}
      className="block bg-white rounded-lg p-2 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex flex-col mb-3">
        <div className="flex justify-between">
          <span
            title={getVisibilityLabel(
              reflection.is_public,
              reflection.is_neighbor_visible
            )}
          >
            {getVisibilityStatus(
              reflection.is_public,
              reflection.is_neighbor_visible
            )}
          </span>
          {reflection.is_own && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="편집"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg ${getReflectionTypeBgColor(reflection.category?.name || 'gratitude')}`}
          >
            <TypeIcon
              className={`w-4 h-4 ${getReflectionTypeColor(reflection.category?.name || 'gratitude')}`}
            />
          </div>
          <div>
            <span
              className={`text-sm font-medium ${getReflectionTypeColor(reflection.category?.name || 'gratitude')}`}
            >
              {reflection.category?.display_name ||
                getReflectionTypeLabel(
                  reflection.category?.name || 'gratitude'
                )}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {format(new Date(reflection.date), 'yyyy. M. d.', {
                locale: ko,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 제목 */}
      {reflection.title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {reflection.title}
        </h3>
      )}

      {/* 내용 */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
        {reflection.content}
      </p>

      {/* 키워드 */}
      {reflection.keywords && reflection.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {reflection.keywords.map((keyword) => (
            <span
              key={keyword.id}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: `${keyword.color}20`,
                color: keyword.color,
              }}
            >
              {keyword.name}
            </span>
          ))}
        </div>
      )}

      {/* 작성자 정보 (다른 사용자 회고인 경우) */}
      {!reflection.is_own && reflection.author_name && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
          <span>
            작성자: {reflection.author_nickname || reflection.author_name}
          </span>
        </div>
      )}
    </Link>
  );
};

export default ReflectionCard;
