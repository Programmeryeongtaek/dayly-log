'use client';

import { ReflectionFormData } from '@/types/reflections';
import { format } from 'date-fns';
import { Heart, Lightbulb, Save, X } from 'lucide-react';
import { useState } from 'react';
import KeywordInput from './KeywordInput';
import { useReflectionCategories } from '@/hooks/reflections/useReflectionCategories';

interface ReflectionFormProps {
  onSubmit: (data: ReflectionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ReflectionFormData>;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const ReflectionForm = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  mode = 'create',
}: ReflectionFormProps) => {
  const { categories, gratitudeCategory, reflectionCategory, isLoading } =
    useReflectionCategories();

  const [formData, setFormData] = useState<ReflectionFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    category_id: initialData?.category_id || gratitudeCategory?.id || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    is_public: initialData?.is_public ?? true,
    is_neighbor_visible: initialData?.is_neighbor_visible ?? true,
    keywords: initialData?.keywords || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit(formData);
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category_id: categoryId }));
  };

  const updateField = <K extends keyof ReflectionFormData>(
    field: K,
    value: ReflectionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.content.trim().length >= 10 && formData.category_id;

  const selectedCategory = categories.find(
    (c) => c.id === formData.category_id
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? '회고 작성' : '회고 수정'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 도움말 */}
        {mode === 'create' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <h3 className="font-medium text-accent-400 mb-2">Tip</h3>
            <ul className="text-sm text-accent-500 space-y-1">
              <li>
                • <strong>감사:</strong> 감사했던 순간, 사람, 경험을 적어보세요.
              </li>
              <li>
                • <strong>성찰:</strong> 배운 점, 아쉬웠던 점, 개선하고 싶은
                점들을 정리해보세요.
              </li>
              <li>
                • <strong>키워드:</strong> 쉽게 찾을 수 있도록 관련 키워드를
                추가해보세요.
              </li>
            </ul>
          </div>
        )}

        {/* 주의사항 */}
        {mode === 'edit' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              ⚠️ 주의사항
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 수정된 내용은 즉시 반영되며, 되돌릴 수 없습니다.</li>
              <li>
                • 키워드를 변경하면 기존 키워드 통계에 영향을 줄 수 있습니다.
              </li>
              <li>
                • 공개 설정을 변경하면 다른 사용자의 접근 권한이 달라집니다.
              </li>
            </ul>
          </div>
        )}

        {/* 카테고리 선택 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            타입 *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {gratitudeCategory && (
              <button
                type="button"
                onClick={() => handleCategoryChange(gratitudeCategory.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.category_id === gratitudeCategory.id
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Heart className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">
                      {gratitudeCategory.display_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {gratitudeCategory.description}
                    </p>
                  </div>
                </div>
              </button>
            )}

            {reflectionCategory && (
              <button
                type="button"
                onClick={() => handleCategoryChange(reflectionCategory.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.category_id === reflectionCategory.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">
                      {reflectionCategory.display_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {reflectionCategory.description}
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* 날짜 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            날짜 <strong className="text-red-500">*</strong>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => updateField('date', e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            required
          />
        </div>

        {/* 제목 (선택사항) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            제목 (선택사항)
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value || null)}
            placeholder={`오늘의 ${selectedCategory?.display_name || '회고'}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        {/* 내용 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            내용 <strong className="text-red-500">*</strong>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
            placeholder={
              selectedCategory?.name === 'gratitude'
                ? '오늘 감사했던 일들을 자유롭게 적어보세요...'
                : '오늘 느낀 것, 배운 것, 깨달은 것을 정리해보세요...'
            }
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 resize-none"
            required
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formData.content.length}자</span>
            <span
              className={formData.content.length < 10 ? 'text-red-500' : ''}
            >
              최소 10자 이상 작성해주세요.
            </span>
          </div>
        </div>

        {/* 키워드 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <label>키워드 (선택사항)</label>
            <span>최대 10개</span>
          </div>
          <KeywordInput
            keywords={formData.keywords}
            onChange={(keywords) => updateField('keywords', keywords)}
            placeholder="키워드를 입력하고 Enter를 누르세요."
            maxKeywords={10}
          />
        </div>

        {/* 공개 설정 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            공개 범위
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={formData.is_public && formData.is_neighbor_visible}
                onChange={() => {
                  updateField('is_public', true);
                  updateField('is_neighbor_visible', true);
                }}
                className="w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 focus:ring-accent-500"
              />
              <span className="text-sm">전체</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={!formData.is_public && formData.is_neighbor_visible}
                onChange={() => {
                  updateField('is_public', false);
                  updateField('is_neighbor_visible', true);
                }}
                className="w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 focus:ring-accent-500"
              />
              <span className="text-sm">이웃</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={!formData.is_public && !formData.is_neighbor_visible}
                onChange={() => {
                  updateField('is_public', false);
                  updateField('is_neighbor_visible', false);
                }}
                className="w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 focus:ring-accent-500"
              />
              <span className="text-sm">비공개</span>
            </label>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === 'create' ? '작성' : '수정'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReflectionForm;
