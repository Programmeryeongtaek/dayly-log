"use client";

import { useKeywords } from "@/hooks/reflections/useKeywords";
import { useReflectionCategories } from "@/hooks/reflections/useReflectionCategories";
import { Keyword } from "@/types/reflections";
import { useMemo, useState } from "react";
import Modal from "../common/Modal";
import { Hash, Trash2, X } from "lucide-react";

interface KeywordManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const KeywordManagementModal = ({
  isOpen,
  onClose,
  userId,
}: KeywordManagementModalProps) => {
  const { keywords, keywordStats, deleteKeyword, isLoading } =
    useKeywords(userId);
  const { gratitudeCategory, reflectionCategory } = useReflectionCategories();
  const [selectedCategory] = useState<"all">("all");

  // 카테고리별 크워드 분ㅇ류 및 사용되지 않는 키워드 필터링
  const { unusedKeywords } = useMemo(() => {
    const statsMap = new Map(
      keywordStats.map((stat) => [stat.keyword.id, stat.usageCount]),
    );

    const unused = keywords.filter((keyword) => {
      const usageCount = statsMap.get(keyword.id) || 0;
      return usageCount === 0;
    });

    const categorized = {
      gratitude: unused.filter(
        (k) => gratitudeCategory && k.category_id === gratitudeCategory.id,
      ),
      reflection: unused.filter(
        (k) => reflectionCategory && k.category_id === reflectionCategory.id,
      ),
    };

    return { unusedKeywords: unused, categorizedKeywords: categorized };
  }, [keywords, keywordStats, gratitudeCategory, reflectionCategory]);

  // 현재 보여줄 키워드 목록
  const displayKeywords = useMemo(() => {
    return unusedKeywords;
  }, [unusedKeywords]);

  const handleDeleteKeyword = async (keyword: Keyword) => {
    if (confirm(`"${keyword.name}" 키워드를 삭제하시겠습니까?`)) {
      try {
        await deleteKeyword(keyword.id);
      } catch {
        alert("키워드 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col max-h-[80vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-accent-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Hash className="w-5 h-5 text-accent-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">키워드 삭제</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-100 rounded-full transition-colors hover:cursor-pointer"
          >
            <X className="w-5 h-5 text-accent-500" />
          </button>
        </div>

        {/* 키워드 목록 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : displayKeywords.length > 0 ? (
            <div className="space-y-3">
              {displayKeywords.map((keyword) => (
                <div
                  key={keyword.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2"
                      style={{
                        backgroundColor: `${keyword.color}20`,
                        borderColor: keyword.color,
                      }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: keyword.color }}
                    >
                      {keyword.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded ">
                      {gratitudeCategory &&
                      keyword.category_id === gratitudeCategory.id
                        ? "감사"
                        : "성찰"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteKeyword(keyword)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="키워드 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-accent-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                삭제할 수 있는 키워드가 없습니다.
              </h3>
              <p className="text-gray-500">
                {selectedCategory === "all"
                  ? "모든 키워드가 사용 중입니다."
                  : `${selectedCategory === "gratitude" ? "감사" : "성찰"} 카테고리에 사용되지 않은 키워드가 없습니다.`}
              </p>
            </div>
          )}
        </div>

        {/* 하단 안내 */}
        <div className="p-4 border-t border-gray-200 bg-yellow-50">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">삭제 조건</p>
              <ul className="space-y-1">
                <li>• 사용되지 않은 키워드만 삭제 가능</li>
                <li>• 삭제된 키워드는 복구할 수 없습니다.</li>
                <li>• 사용 중인 키워드는 목록에 표시되지 않습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default KeywordManagementModal;
