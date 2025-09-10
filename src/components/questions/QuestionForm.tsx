"use client";

import { useAuth } from "@/hooks/auth";
import { useQuestionsCategories } from "@/hooks/questions/useQuestionCategories";
import { useQuestionKeywords } from "@/hooks/questions/useQuestionKeywords";
import { QuestionFormData } from "@/types/questions";
import { X } from "lucide-react";
import { useState } from "react";

interface QuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  isLoading?: boolean;
  onSubmit: (data: QuestionFormData) => void;
  onCancel: () => void;
}

const QuestionForm = ({
  initialData,
  isLoading = false,
  onSubmit,
  onCancel,
}: QuestionFormProps) => {
  const { user } = useAuth();
  const { categories } = useQuestionsCategories();
  const [formData, setFormData] = useState<QuestionFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    answer: initialData?.answer || "",
    category_id: initialData?.category_id || categories[0]?.id || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    is_public: initialData?.is_public ?? true,
    is_neighbor_visible: initialData?.is_neighbor_visible ?? true,
    is_answered: initialData?.is_answered ?? false,
    keywords: initialData?.keywords || [],
  });

  const { keywords } = useQuestionKeywords({
    userId: user?.id,
    categoryId: formData.category_id,
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    initialData?.keywords || [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      keywords: selectedKeywords,
    });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !selectedKeywords.includes(newKeyword.trim())) {
      setSelectedKeywords((prev) => [...prev, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleKeywordClick = (keywordName: string) => {
    if (!selectedKeywords.includes(keywordName)) {
      setSelectedKeywords((prev) => [...prev, keywordName]);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category_id: categoryId }));
    // 카테고리 변경 시 기존 키워드 초기화
    setSelectedKeywords([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 카테고리 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategorySelect(category.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border hover:cursor-pointer ${
                formData.category_id === category.id
                  ? "bg-accent-100 text-black-700 border-accent-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {category.display_name}
            </button>
          ))}
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목 <strong className="text-red-500">*</strong>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="질문을 입력하세요."
          required
        />
      </div>

      {/* 내용 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설명 (선택)
        </label>
        <textarea
          value={formData.content || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="질문에 대한 추가 설명을 입력하세요."
        />
      </div>

      {/* 답변 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          답변
        </label>
        <textarea
          value={formData.answer || ""}
          onChange={(e) => {
            const answer = e.target.value;
            setFormData((prev) => ({
              ...prev,
              answer,
              is_answered: answer.trim().length > 0,
            }));
          }}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="질문에 대한 답변을 작성하세요."
        />
      </div>

      {/* 날짜 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          날짜
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          className="w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
          required
        />
      </div>

      {/* 키워드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          키워드
        </label>

        {/* 새 키워드 추가 */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddKeyword())
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="새 키워드 추가"
          />
          <button
            type="button"
            onClick={handleAddKeyword}
            className="px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-accent-600 hover:cursor-pointer"
          >
            추가
          </button>
        </div>

        {/* 기존 키워드 선택 */}
        {keywords.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">기존 키워드:</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword.id}
                  type="button"
                  onClick={() => handleKeywordClick(keyword.name)}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    selectedKeywords.includes(keyword.name)
                      ? "bg-accent-200 text-black-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {keyword.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 선택된 키워드 */}
        {selectedKeywords.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">선택 키워드:</p>
            <div className="flex flex-wrap gap-2">
              {selectedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-accent-300 text-black-600 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="text-blue-600 hover:text-black-800"
                  >
                    <X className="w-3 h-3 cursor-pointer" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 공개 설정 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          공개 범위
        </label>

        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="visibility"
              checked={formData.is_public && formData.is_neighbor_visible}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  is_public: true,
                  is_neighbor_visible: true,
                }))
              }
              className="text-accent-300 focus:ring-accent-200"
            />
            <span className="ml-2 text-sm text-gray-600">🌍 전체</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="visibility"
              checked={formData.is_public && !formData.is_neighbor_visible}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  is_public: true,
                  is_neighbor_visible: false,
                }))
              }
              className="text-accent-300 focus:ring-accent-200"
            />
            <span className="ml-2 text-sm text-gray-600">👤 이웃</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="visibility"
              checked={!formData.is_public}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  is_public: false,
                  is_neighbor_visible: false,
                }))
              }
              className="text-accent-300 focus:ring-accent-200"
            />
            <span className="ml-2 text-sm text-gray-600">🔒 비공개</span>
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-accent-500 text-white py-2 px-4 rounded-md hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "저장 중..." : "저장"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default QuestionForm;
