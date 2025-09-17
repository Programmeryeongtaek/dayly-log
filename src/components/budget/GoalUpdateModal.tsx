import { Goal } from "@/types/goals";
import Modal from "../common/Modal";
import { Target, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export interface CategoryChangeData {
  categoryName: string;
  newAmount: number;
  newCount: number;
  oldAmount: number;
  oldCount: number;
  type: "income" | "expense";
}

interface GoalUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  categoryChange: CategoryChangeData;
}

const GoalUpdateModal = ({
  isOpen,
  onClose,
  goals,
  categoryChange,
}: GoalUpdateModalProps) => {
  const router = useRouter();

  const handleGoalEdit = (goalId: string) => {
    router.push(`/goals/${goalId}/edit`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <Modal.Title>목표 업데이트</Modal.Title>
            <Modal.Description>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <strong>{categoryChange.categoryName}</strong> 카테고리의
                데이터가 변경되었습니다. 관련 목표들을 확인하고
                수정하시겠습니까?
              </div>
            </Modal.Description>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="space-y-4">
        {/* 변경사항 요약 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            {categoryChange.type === "income" ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            카테고리 변경사항
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">금액:</span>
              <span>
                {categoryChange.oldAmount.toLocaleString()}원 →{" "}
                {categoryChange.newAmount.toLocaleString()}원
                <span
                  className={`ml-1 ${
                    categoryChange.newAmount > categoryChange.oldAmount
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  (
                  {categoryChange.newAmount > categoryChange.oldAmount
                    ? "+"
                    : ""}
                  {(
                    ((categoryChange.newAmount - categoryChange.oldAmount) /
                      categoryChange.oldAmount) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">횟수:</span>
              <span>
                {categoryChange.oldCount}회 → {categoryChange.newCount}회
                <span
                  className={`ml-1 ${
                    categoryChange.newCount > categoryChange.oldCount
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  (
                  {categoryChange.newCount > categoryChange.oldCount ? "+" : ""}
                  {categoryChange.newCount - categoryChange.oldCount})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 관련 목표 리스트 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">관련 목표들</h4>
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleGoalEdit(goal.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800">{goal.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    {goal.description}
                  </p>

                  <div className="mt-2 flex gap-4 text-sm">
                    {goal.target_amount && (
                      <span className="text-gray-600">
                        목표 금액: {goal.target_amount.toLocaleString()}원
                      </span>
                    )}
                    {goal.target_count && (
                      <span className="text-gray-600">
                        목표 횟수: {goal.target_count}회
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {goal.challenge_mode === "both"
                      ? "금액 + 횟수"
                      : goal.challenge_mode === "amount"
                        ? "금액"
                        : "횟수"}
                  </span>
                  <span className="text-xs text-blue-600">클릭하여 수정</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Modal.CloseButton>나중에 수정</Modal.CloseButton>
      </Modal.Footer>
    </Modal>
  );
};

export default GoalUpdateModal;
