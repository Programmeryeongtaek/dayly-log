'use client';

import { useAuth } from '@/hooks/auth';
import { useGoalChecker } from '@/hooks/goals/useGoalChecker';
import { AlertTriangle, Edit3, X } from 'lucide-react';
import { useState } from 'react';
import GoalEditModal from './GoalEditModal';

interface GoalUpdateNotificationProps {
  categoryName: string;
  onClose: () => void;
}

const GoalUpdateNotification = ({
  categoryName,
  onClose,
}: GoalUpdateNotificationProps) => {
  const { user } = useAuth();
  const { affectedGoals, hasAffectedGoals } = useGoalChecker(
    user?.id,
    categoryName
  );
  const [currentEditIndex, setCurrentEditIndex] = useState(-1);

  // 편집할 목표들 준비
  const editableGoals = affectedGoals.map((goalData) => ({
    goal: goalData,
    currentAmount: goalData.currentMonthAmount,
    currentCount: goalData.currentMonthCount,
  }));

  if (!hasAffectedGoals) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 bg-white border border-amber-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {categoryName} 챌린지 업데이트 필요
            </p>
            <p className="text-xs text-gray-600 mt-1">
              내역이 변경되어 {affectedGoals.length}개의 챌린지를 수정해야
              합니다.
            </p>

            {affectedGoals.length === 1 ? (
              <button
                onClick={() => setCurrentEditIndex(0)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                챌린지 수정
              </button>
            ) : (
              <button
                onClick={() => setCurrentEditIndex(0)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                챌린지 수정 (1/{affectedGoals.length})
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {currentEditIndex >= 0 && (
        <GoalEditModal
          isOpen={true}
          onClose={() => {
            if (currentEditIndex + 1 < editableGoals.length) {
              setCurrentEditIndex((prev) => prev + 1);
            } else {
              setCurrentEditIndex(-1);
              onClose();
            }
          }}
          goals={editableGoals}
          currentIndex={currentEditIndex}
          totalCount={editableGoals.length}
        />
      )}
    </>
  );
};

export default GoalUpdateNotification;
