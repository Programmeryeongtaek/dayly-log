'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import GoalCard from '@/components/goals/GoalCard';
import { useAuth } from '@/hooks/auth';
import { useGoals } from '@/hooks/goals/useGoals';
import {
  Calendar,
  Clock,
  Filter,
  Plus,
  Search,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const GoalsPage = () => {
  const { user } = useAuth();
  const { goals, activeGoals, completedGoals, isLoading } = useGoals({
    userId: user?.id,
  });

  // 필터 상태
  const [activeTab, setActiveTab] = useState<
    'active' | 'completed' | 'paused' | 'cancelled' | 'all'
  >('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>(
    'all'
  );

  // 필터링된 목표들
  const filteredGoals = useMemo(() => {
    let filtered = goals;

    if (activeTab !== 'all') {
      filtered = goals.filter((goal) => goal.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (goal) =>
          goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((goal) => {
        return typeFilter === 'income'
          ? goal.type === 'increase_income'
          : goal.type === 'reduce_expense';
      });
    }

    return filtered;
  }, [goals, activeTab, searchTerm, typeFilter]);

  // 통계 계산
  const statistics = {
    total: goals.length,
    active: activeGoals.length,
    completed: completedGoals.length,
    completionRate:
      goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
  };

  // 핸들러들
  const handleTypeFilterChange = (value: string) => {
    if (value === 'all' || value === 'income' || value === 'expense') {
      setTypeFilter(value);
    }
  };

  if (!user?.id) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4 text-center py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-gray-500">
              목표를 관리하려면 먼저 로그인해주세요.
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내 목표</h1>
            <p className="text-gray-600 mt-1">
              진행 중인 챌린지와 달성한 목표를 확인하세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
              <Plus className="w-4 h-4" />
              목표 추가
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">전체</p>
                <p className="text-xl font-bold text-gray-900">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">진행 중</p>
                <p className="text-xl font-bold text-gray-900">
                  {statistics.active}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">완료</p>
                <p className="text-xl font-bold text-gray-900">
                  {statistics.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">달성률</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(statistics.completionRate)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 탭 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'active'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                진행 ({statistics.active})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                완료 ({statistics.completed})
              </button>
              <button
                onClick={() => setActiveTab('paused')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                멈춤 ({statistics.completed})
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                취소 ({statistics.completed})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                전체 ({statistics.total})
              </button>
            </div>

            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="목표 제목이나 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            {/* 타입 필터 */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="all">전체</option>
                <option value="income">수입 증가</option>
                <option value="expense">지출 감소</option>
              </select>
            </div>
          </div>
        </div>

        {/* 목표 목록 */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <Target className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {activeTab === 'active'
                ? '진행 중인 목표가 없습니다.'
                : activeTab === 'completed'
                  ? '완료된 목표가 없습니다.'
                  : searchTerm
                    ? '검색 결과가 없습니다.'
                    : '아직 목표가 없습니다.'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'active'
                ? '가계부에서 챌린지를 시작하거나 새로운 목표를 만들어보세요.'
                : activeTab === 'completed'
                  ? '목표를 달성하면 여기에 표시됩니다.'
                  : searchTerm
                    ? '다른 검색어로 시도해보세요.'
                    : '첫 번째 목표를 만들어 성장을 시작해보세요.'}
            </p>
            {!searchTerm && (
              <div className="flex flex-col justify-center">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  목표 추가
                </button>
                <Link
                  href="/budget"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  가계부 챌린지
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default GoalsPage;
