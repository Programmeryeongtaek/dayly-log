"use client";

import { useGoals } from "@/hooks/goals/useGoals";
import { Goal } from "@/types/goals";
import { useState } from "react";
import Modal from "../common/Modal";
import { Target, TrendingDown, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface GoalEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Array<{ goal: Goal; currentAmount: number; currentCount: number }>;
  currentIndex: number;
  totalCount: number;
}

const GoalEditModal = ({
  isOpen,
  onClose,
  goals,
  currentIndex,
  totalCount,
}: GoalEditModalProps) => {
  const { updateGoal, isUpdatingGoal } = useGoals();

  const currentGoalData = goals[currentIndex];
  const { goal, currentAmount, currentCount } = currentGoalData;

  const [formData, setFormData] = useState({
    target_amount: goal.target_amount?.toString() || "",
    target_count: goal.target_count?.toString() || "",
    target_date: goal.target_date?.toString() || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateGoal({
      id: goal.id,
      target_amount: formData.target_amount
        ? Number(formData.target_amount)
        : null,
      target_count: formData.target_count
        ? Number(formData.target_count)
        : null,
      target_date: formData.target_date || null,
    });

    // 다음 목표로 이동 또는 완료
    if (currentIndex + 1 < totalCount) {
      // 다음 목표의 데이터로 폼 초기화
      const nextGoal = goals[currentIndex + 1].goal;
      setFormData({
        target_amount: nextGoal.target_amount?.toString() || "",
        target_count: nextGoal.target_count?.toString() || "",
        target_date: nextGoal.target_date?.toString() || "",
      });
    }

    onClose(); // 부모 컴포넌트에서 다음 목표 처리
  };

  const isIncome = goal.type === "increase_income";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Target className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <Modal.Title>
              챌린지 수정 ({currentIndex + 1}/{totalCount})
            </Modal.Title>
            <Modal.Description>
              거래 내역 변경으로 인해 목표를 조정하세요.
            </Modal.Description>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-6">
          {/* 현재 상황 표시 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              {isIncome ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              {goal.title}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">현재 실제:</span>
                <div className="font-medium">
                  {currentAmount.toLocaleString()}원 ({currentCount}건)
                </div>
              </div>
              <div>
                <span className="text-gray-600">기존 목표:</span>
                <div className="font-medium">
                  {goal.target_amount?.toLocaleString() || 0}원 (
                  {goal.target_count || 0}건)
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 목표 금액 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 금액
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.target_amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      target_amount: e.target.value,
                    }))
                  }
                  placeholder={currentAmount.toString()}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  원
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                현재 실제 금액: {currentAmount.toLocaleString()}원
              </p>
            </div>

            {/* 목표 횟수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 횟수
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.target_count}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      target_count: e.target.value,
                    }))
                  }
                  placeholder={currentCount.toString()}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  회
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                현재 실제 횟수: {currentCount}회
              </p>
            </div>

            {/* 마감일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                마감일
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    target_date: e.target.value,
                  }))
                }
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </form>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Modal.CloseButton>취소</Modal.CloseButton>
        <Modal.Button
          type="submit"
          form="goal-edit-form"
          loading={isUpdatingGoal}
          onClick={handleSubmit}
        >
          수정하기
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GoalEditModal;
