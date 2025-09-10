import { Goal, GoalProgressInfo } from "@/types/goals";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

interface GoalCardProps {
  goal: Goal & { progress: GoalProgressInfo };
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const { progress } = goal;

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-sm border transition-all hover:shadow-md ${
        progress.isComplete
          ? "border-green-200 bg-green-50/30"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              goal.type === "increase_income"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {goal.type === "increase_income" ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
            <p className="text-sm text-gray-600">{progress.progressText}</p>
          </div>
        </div>

        {progress.isComplete && (
          <CheckCircle className="w-6 h-6 text-green-600" />
        )}
      </div>

      {/* 진행률 바 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>진행률</span>
          <span>{Math.round(progress.overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progress.isComplete ? "bg-green-500" : "bg-accent-500"
            }`}
            style={{ width: `${Math.min(100, progress.overallProgress)}%` }}
          />
        </div>
      </div>

      {/* 목표 상세 정보 */}
      <div className="space-y-2 text-sm">
        {goal.target_amount && (
          <div className="flex justify-between">
            <span className="text-gray-600">금액 목표:</span>
            <span className="font-medium">
              {goal.current_amount.toLocaleString()} /{" "}
              {goal.target_amount.toLocaleString()}원
            </span>
          </div>
        )}

        {goal.target_count && (
          <div className="flex justify-between">
            <span className="text-gray-600">횟수 목표:</span>
            <span className="font-medium">
              {goal.current_count} / {goal.target_count}회
            </span>
          </div>
        )}

        {goal.target_date && (
          <div className="flex justify-between">
            <span className="text-gray-600">마감일:</span>
            <span className="font-medium">
              {format(new Date(goal.target_date), "yyyy년 M월 d일", {
                locale: ko,
              })}
            </span>
          </div>
        )}
      </div>

      {/* 이유 */}
      {goal.reason && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{goal.reason}</p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
