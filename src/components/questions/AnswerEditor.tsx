"use client";

import { Save, X } from "lucide-react";
import { useState } from "react";

interface AnswerEditorProps {
  initialAnswer?: string;
  onSave: (answer: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AnswerEditor = ({
  initialAnswer = "",
  onSave,
  onCancel,
  isLoading = false,
}: AnswerEditorProps) => {
  const [answer, setAnswer] = useState(initialAnswer);

  const handleSave = () => {
    if (answer.trim()) {
      onSave(answer.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          답변 작성
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          placeholder="질문에 대한 답변을 작성하세요...&#10;&#10;💡 팁: Ctrl + Enter로 빠르게 저장할 수 있습니다."
          disabled={isLoading}
        />
        <div className="mt-2 text-xs text-gray-500">
          {answer.length} / 2000자
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={!answer.trim() || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "저장 중..." : "저장"}
        </button>

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <X className="w-4 h-4" />
          취소
        </button>
      </div>

      {answer.trim() && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerEditor;
