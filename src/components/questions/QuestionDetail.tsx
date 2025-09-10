"use client";

import { QuestionWithKeywords } from "@/types/questions";
import {
  getAnswerStatus,
  getAnswerStatusLabel,
  getQuestionTypeColor,
  getQuestionVisibilityLabel,
  getQuestionVisibilityStatus,
} from "@/utils/questions/helpers";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Edit,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AnswerEditor from "./AnswerEditor";

interface QuestionDetailProps {
  question: QuestionWithKeywords;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onAnswerUpdate?: (answer: string) => void;
  isUpdatingAnswer?: boolean;
}

const QuestionDetail = ({
  question,
  isOwner = false,
  onEdit,
  onDelete,
  onAnswerUpdate,
  isUpdatingAnswer = false,
}: QuestionDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleAnswerSave = (answer: string) => {
    onAnswerUpdate?.(answer);
    setIsEditing(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: question.title,
        text: question.content || question.title,
        url: window.location.href,
      });
    } catch {
      // 공유 API를 지원하지 않는 경우 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link
          href="/questions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          질문 목록으로 돌아가기
        </Link>
      </div>

      {/* 질문 카드 */}
      <div className="bg-white rounded-lg border shadow-sm">
        {/* 헤더 */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              {/* 카테고리 배지 */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  question.category
                    ? `${getQuestionTypeColor(question.category.name)} bg-gray-100`
                    : "text-gray-500 bg-gray-100"
                }`}
              >
                {question.category?.display_name || "알 수 없음"}
              </span>

              {/* 답변 상태 */}
              <span
                title={getAnswerStatusLabel(question.is_answered)}
                className="text-lg"
              >
                {getAnswerStatus(question.is_answered)}
              </span>

              {/* 공개 설정 */}
              <span
                title={getQuestionVisibilityLabel(
                  question.is_public,
                  question.is_neighbor_visible,
                )}
                className="text-lg"
              >
                {getQuestionVisibilityStatus(
                  question.is_public,
                  question.is_neighbor_visible,
                )}
              </span>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="공유"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="편집"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {question.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(question.date), "yyyy년 M월 d일")}</span>
            </div>

            {!isOwner && question.author_name && (
              <div>
                작성자: {question.author_nickname || question.author_name}
              </div>
            )}
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {question.content && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                상세 내용
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {question.content}
                </p>
              </div>
            </div>
          )}

          {/* 키워드 */}
          {question.keywords && question.keywords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                키워드
              </h3>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword) => (
                  <span
                    key={keyword.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${keyword.color}20`,
                      color: keyword.color,
                    }}
                  >
                    {keyword.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 답변 섹션 */}
      <div className="mt-6 bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              답변
            </h2>

            {isOwner && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {question.answer ? "답변 수정" : "답변 작성"}
              </button>
            )}
          </div>

          {isEditing ? (
            <AnswerEditor
              initialAnswer={question.answer || ""}
              onSave={handleAnswerSave}
              onCancel={() => setIsEditing(false)}
              isLoading={isUpdatingAnswer}
            />
          ) : question.answer ? (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="prose prose-blue max-w-none">
                <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">
                  {question.answer}
                </p>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                {format(
                  new Date(question.updated_at),
                  "yyyy년 M월 d일 HH:mm에 작성",
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>아직 답변이 작성되지 않았습니다.</p>
              {isOwner && (
                <p className="text-sm mt-1">
                  위의 답변 작성 버튼을 눌러 답변을 작성해보세요.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
