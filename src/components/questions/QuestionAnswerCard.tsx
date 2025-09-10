"use client";

import { QuestionWithKeywords } from "@/types/questions";
import {
  getAnswerStatus,
  getAnswerStatusLabel,
} from "@/utils/questions/helpers";
import { format } from "date-fns";
import { Edit3, MessageCircle } from "lucide-react";

interface QuestionAnswerCardProps {
  question: QuestionWithKeywords;
  onAnswerEdit?: () => void;
  isOwner?: boolean;
}

const QuestionAnswerCard = ({
  question,
  onAnswerEdit,
  isOwner = false,
}: QuestionAnswerCardProps) => {
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
      {/* 질문 요약 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            title={getAnswerStatusLabel(question.is_answered)}
            className="text-sm"
          >
            {getAnswerStatus(question.is_answered)}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(question.date), "M월 d일")}
          </span>
        </div>

        <h3 className="font-medium text-gray-900 line-clamp-2">
          {question.title}
        </h3>
      </div>

      {/* 답변 섹션 */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">답변</span>
          </div>

          {isOwner && (
            <button
              onClick={onAnswerEdit}
              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
              title="답변 편집"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {question.answer ? (
          <div className="bg-blue-50 rounded p-3">
            <p className="text-blue-900 text-sm leading-relaxed line-clamp-3">
              {question.answer}
            </p>
            <div className="mt-2 text-xs text-blue-600">
              {format(new Date(question.updated_at), "M월 d일 HH:mm")}에 작성
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">답변을 기다리는 중...</p>
            {isOwner && (
              <button
                onClick={onAnswerEdit}
                className="mt-2 text-xs text-blue-500 hover:text-blue-600"
              >
                답변 작성하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionAnswerCard;
