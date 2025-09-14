"use client";

import { X } from "lucide-react";
import { useRef, useState } from "react";

interface KeywordInputProps {
  keywords: string[];
  onChange: (keyword: string[]) => void;
  placeholder?: string;
  maxKeywords?: number;
}

const KeywordInput = ({
  keywords,
  onChange,
  placeholder = "키워드를 입력하고 Enter를 누르세요.",
  maxKeywords = 10,
}: KeywordInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      keywords.length > 0
    ) {
      // 빈 입력에서 백스페이스 시 마지막 키워드 제거
      removeKeyword(keywords.length - 1);
    }
  };

  const addKeyword = () => {
    const trimmed = inputValue.trim();
    if (
      trimmed &&
      !keywords.includes(trimmed) &&
      keywords.length < maxKeywords
    ) {
      onChange([...keywords, trimmed]);
      setInputValue("");
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    onChange(newKeywords);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const isMaxReached = keywords.length >= maxKeywords;

  return (
    <div className="flex flex-col gap-2">
      {/* 입력창 */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onClick={handleContainerClick}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={
          isMaxReached
            ? `최대 ${maxKeywords}개의 키워드를 작성할 수 있습니다.`
            : placeholder
        }
        disabled={isMaxReached}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm disabled:placeholder-red-500"
      />

      {/* 키워드 목록 */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent-100 text-accent-700 rounded-md text-sm"
            >
              {keyword}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeKeyword(index);
                }}
                className="hover:bg-accent-200 rounded-full p-0.5 transition-colors hover:cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordInput;
