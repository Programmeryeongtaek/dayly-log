'use client';

import { Goal } from '@/types/goals';
import {
  getChallengeMode,
  getDaysLeft,
  getGoalProgress,
  getTypeText,
} from '@/utils/goals/goalsHelpers';
import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';
import { Calendar, CheckCircle, Star, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const GoalCard = ({ goal }: { goal: Goal }) => {
  const router = useRouter();
  const progress = getGoalProgress(goal);
  const daysLeft = getDaysLeft(goal.target_date);
  const isCompleted = goal.status === 'completed';

  const handleCardClick = () => {
    router.push(`/goals/${goal.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden hover:cursor-pointer hover:border-accent-400"
    >
      {/* 상태 배지 */}
      <div className="absolute top-4 right-4 z-10">
        <StatusBadge status={goal.status} targetDate={goal.target_date} />
      </div>

      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-blue-50 opacity-50" />

      <div className="relative p-6">
        {/* 제목과 설명 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <Target className="w-6 h-6 text-accent-500 flex-shrink-0" />
            )}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent-600 transition-colors line-clamp-2 select-none">
              {goal.title}
            </h3>
          </div>
          {goal.description && (
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed select-none">
              {goal.description}
            </p>
          )}
        </div>

        {/* 목표 정보 그리드 */}
        <div className="space-y-4">
          {/* 타입과 카테고리 */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
              {getTypeText(goal.type)}
            </span>
            {goal.category && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {goal.category.name}
              </span>
            )}
            {goal.challenge_mode && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {getChallengeMode(goal.challenge_mode)}
              </span>
            )}
          </div>

          {/* 목표 값들 */}
          <div className="grid grid-cols-1 gap-3">
            {goal.target_amount && (
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">목표 금액</p>
                  <p className="font-bold text-gray-900">
                    {goal.target_amount.toLocaleString()}원
                  </p>
                </div>
                {goal.current_amount !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">현재</p>
                    <p className="font-bold text-accent-600">
                      {goal.current_amount.toLocaleString()}원
                    </p>
                  </div>
                )}
              </div>
            )}

            {goal.target_count && (
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">목표 횟수</p>
                  <p className="font-bold text-gray-900">
                    {goal.target_count}회
                  </p>
                </div>
                {goal.current_count !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">현재</p>
                    <p className="font-bold text-accent-600">
                      {goal.current_count}회
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 진행률 바 */}
          {progress.overallProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">
                  진행률
                </span>
                <span className="text-sm font-bold text-accent-600">
                  {progress.overallProgress}%
                </span>
              </div>
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    progress.overallProgress >= 100
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-gradient-to-r from-accent-400 to-accent-500'
                  }`}
                  style={{
                    width: `${Math.min(progress.overallProgress, 100)}%`,
                  }}
                />
                {progress.overallProgress >= 100 && (
                  <Star className="absolute right-1 top-0.5 w-2 h-2 text-white animate-pulse" />
                )}
              </div>
            </div>
          )}

          {/* 날짜 정보 */}
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              시작: {format(new Date(goal.created_at), 'MM.dd', { locale: ko })}
            </span>
            {goal.target_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span
                  className={
                    daysLeft !== null && daysLeft <= 7
                      ? 'text-orange-600 font-medium'
                      : ''
                  }
                >
                  {daysLeft !== null && daysLeft > 0
                    ? `${daysLeft}일 남음`
                    : format(new Date(goal.target_date), 'MM.dd', {
                        locale: ko,
                      })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
