'use client';

import { useReflections } from '@/hooks/reflections/useReflections';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../common/Modal';
import {
  ChevronLeft,
  ChevronRight,
  Hash,
  Heart,
  Lightbulb,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface KeywordReflectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  keywordName: string;
  userId: string;
}

const KeywordReflectionsModal = ({
  isOpen,
  onClose,
  keywordName,
  userId,
}: KeywordReflectionsModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 해당 키워드가 포함된 회고들 조회
  const { reflections } = useReflections({
    userId,
    filters: {
      keywords: [keywordName],
    },
  });

  // 키워드별 회고 분류
  const { keywordReflections, gratitudeReflections, reflectionReflections } =
    useMemo(() => {
      const filtered = reflections.filter((reflection) =>
        reflection.keywords?.some((keyword) => keyword.name === keywordName)
      );

      const gratitude = filtered.filter(
        (r) => r.category?.name === 'gratitude'
      );
      const reflection = filtered.filter(
        (r) => r.category?.name === 'reflection'
      );

      return {
        keywordReflections: filtered,
        gratitudeReflections: gratitude,
        reflectionReflections: reflection,
      };
    }, [reflections, keywordName]);

  // 현재 회고
  const currentReflection = keywordReflections[currentIndex];

  // 네비게이션 핸들러
  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? keywordReflections.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === keywordReflections.length - 1 ? 0 : prev + 1
    );
  };

  const handleClose = () => {
    setCurrentIndex(0);
    onClose();
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // 모달이 열릴 때 인덱스 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, keywordName]);

  if (!currentReflection) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* 헤더 */}
          <div className="flex flex-col p-4 border-b border-gray-200">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                {/* 카테고리 통계 */}
                <div className="flex items-center gap-3 mr-4">
                  {gratitudeReflections.length > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-600 font-medium">
                        {gratitudeReflections.length}
                      </span>
                    </div>
                  )}
                  {reflectionReflections.length > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">
                        {reflectionReflections.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {/* 네비게이션 버튼 */}
                <button
                  onClick={handlePrevious}
                  disabled={keywordReflections.length <= 1}
                  className="hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center">
                  <Hash className="w-5 h-5 text-accent-600" />
                  <span className="font-medium text-gray-900">
                    {keywordName}
                  </span>
                </div>
                <button
                  onClick={handleNext}
                  disabled={keywordReflections.length <= 1}
                  className="hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} / {keywordReflections.length}
                </span>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* 회고 타입과 날짜 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {currentReflection.category?.name === 'gratitude' ? (
                  <>
                    <Heart className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600 font-medium">감사</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-600 font-medium">성찰</span>
                  </>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(currentReflection.date), 'yyyy. MM. dd.', {
                  locale: ko,
                })}
              </span>
            </div>

            {/* 제목 */}
            {currentReflection.title && (
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {currentReflection.title}
              </h3>
            )}

            {/* 내용 */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {currentReflection.content}
              </p>
            </div>

            {/* 키워드 */}
            {currentReflection.keywords &&
              currentReflection.keywords.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {currentReflection.keywords.map((keyword) => (
                      <span
                        key={keyword.id}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          keyword.name === keywordName
                            ? 'ring-2 ring-accent-500'
                            : ''
                        }`}
                        style={{
                          backgroundColor: `${keyword.color}20`,
                          color: keyword.color,
                          border: `1px solid ${keyword.color}40`,
                        }}
                      >
                        {keyword.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* 하단 네비게이션 */}
          {keywordReflections.length > 1 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </button>

                {/* 인디케이터 */}
                <div className="flex items-center gap-2">
                  {keywordReflections.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex
                          ? 'bg-accent-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default KeywordReflectionsModal;
