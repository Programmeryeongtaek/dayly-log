'use client';

import { useAuth } from '@/hooks/auth';
import { useGoals } from '@/hooks/goals/useGoals';
import {
  Target,
  Clock,
  TrendingUp,
  BarChart3,
  Plus,
  Zap,
  Trophy,
  ArrowRight,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import GoalCard from '@/components/goals/GoalCard';
import StatCard from '@/components/goals/StatCard';
import useGoalStatistics from '@/hooks/goals/useGoalStatistics';

const GoalsPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    activeGoals,
    completedGoals,
    goals,
    isLoading: isGoalsLoading,
  } = useGoals({
    userId: user?.id,
  });

  const statistics = useGoalStatistics(goals);

  // 로딩 상태
  if (isAuthLoading || isGoalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-accent-200 rounded-full animate-pulse" />
            <div className="absolute inset-0 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            목표를 불러오는 중
          </p>
          <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  // 사용자 인증 확인
  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md border border-gray-100">
          <div className="p-4 bg-gradient-to-br from-accent-500 to-accent-400 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">목표 관리</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            나만의 목표를 설정하고 달성 과정을 추적해보세요
          </p>
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            시작하기
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-accent-100">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-500 to-accent-700 bg-clip-text text-transparent">
              목표 관리
            </h1>
            <Link
              href="/goals/new"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              추가
            </Link>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            목표를 설정하고 꾸준히 달성해보세요 ✨
          </p>
        </div>

        {/* 목표가 없을 때 */}
        {statistics.total === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-2xl mx-auto border border-gray-100">
              <div className="p-6 bg-gradient-to-br from-accent-100 to-blue-100 rounded-2xl w-fit mx-auto">
                <Target className="w-16 h-16 text-accent-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                첫 번째 목표를 만들어보세요!
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                예산 페이지에서 챌린지를 생성하여 <br />
                목표 달성 여정을 시작하세요.
              </p>
              <Link
                href="/budget"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-400 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                목표 만들기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* 목표가 있을 때 */}
        {statistics.total > 0 && (
          <>
            {/* 통계 카드들 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="전체 목표"
                value={`${statistics.total}개`}
                color="accent"
              />
              <StatCard
                icon={<Zap className="w-6 h-6" />}
                title="진행 중"
                value={`${statistics.active}개`}
                color="purple"
              />
              <StatCard
                icon={<Trophy className="w-6 h-6" />}
                title="완료 목표"
                value={`${statistics.completed}개`}
                color="green"
              />
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                title="곧 마감"
                value={`${statistics.soonDue}개`}
                color={statistics.soonDue > 0 ? 'yellow' : 'accent'}
              />
            </div>

            {/* 완료율 표시 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  전체 달성률
                </h2>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-4xl font-bold bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                      {statistics.completionRate}%
                    </span>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-accent-500" />
                  </div>
                </div>
              </div>
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-400 via-accent-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${statistics.completionRate}%` }}
                />
                {statistics.completionRate >= 80 && (
                  <Star className="absolute right-2 top-1 w-2 h-2 text-white animate-bounce" />
                )}
              </div>
            </div>

            {/* 진행 중인 목표들 */}
            {activeGoals.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      진행 중인 목표
                    </h2>
                    <p className="text-gray-600">
                      {activeGoals.length}개의 목표가 진행 중입니다.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            )}

            {/* 완료된 목표들 */}
            {completedGoals.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      완료 목표
                    </h2>
                    <p className="text-gray-600">
                      {completedGoals.length}개의 목표를 달성했습니다.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {completedGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
