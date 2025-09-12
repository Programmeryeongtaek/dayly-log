'use client';

import EnhancedNeighborCard from '@/components/my/neighbor/EnhancedNeighborCard';
import EnhancedNeighborRequestCard from '@/components/my/neighbor/EnhancedNeighborRequestCard';
import { useMyNeighbors } from '@/hooks/my/useMyNeighbors';
import { ArrowLeft, Clock, Search, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MyNeighborsPage = () => {
  const router = useRouter();
  const {
    neighbors: { requests, list: neighborsList },
    filters,
    loading,
    error,
    actions: {
      updateFilters,
      acceptRequest,
      declineRequest,
      removeNeighbor,
      sendMessage,
      refresh,
    },
  } = useMyNeighbors();

  const [activeTab, setActiveTab] = useState<'requests' | 'neighbors'>(
    'requests'
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleAcceptRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await acceptRequest(requestId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await declineRequest(requestId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveNeighbor = async (neighborId: string) => {
    if (confirm('정말로 이 이웃을 삭제하시겠습니까?')) {
      setActionLoading(neighborId);
      try {
        await removeNeighbor(neighborId);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleSendMessage = (neighborId: string) => {
    sendMessage(neighborId);
  };

  // 검색 필터링
  const filteredNeighbors = neighborsList.filter(
    (neighbor) =>
      neighbor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      neighbor.nickname.toLowerCase().includes(filters.search.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-6 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8 px-4">
        {/* 헤더 */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/my')}
            className="flex items-center text-gray-600 hover:text-accent-500 transition-colors w-fit hover:cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">이웃 관리</h1>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-accent-50 rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex bg-white">
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors hover:cursor-pointer ${
                  activeTab === 'requests'
                    ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>요청</span>
                  {requests.length > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {requests.length}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveTab('neighbors')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors hover:cursor-pointer ${
                  activeTab === 'neighbors'
                    ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>이웃</span>
                  {neighborsList.length > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      {neighborsList.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* 검색바 (이웃 탭일 때만) */}
          {activeTab === 'neighbors' && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="이름이나 닉네임으로 검색..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-accent-500 border hover:border-accent-300"
                />
              </div>
            </div>
          )}

          {/* 컨텐츠 */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" />
                <span className="ml-3 text-gray-600">
                  데이터를 불러오는 중...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'requests' ? (
                  // 이웃 요청 목록
                  requests.length === 0 ? (
                    <div className="text-center py-12">
                      <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        새로운 이웃 요청이 없습니다.
                      </h3>
                      <p className="text-gray-500">
                        이웃이 되어 서로의 회고와 성찰을 공유해보세요.
                      </p>
                    </div>
                  ) : (
                    requests.map((request) => (
                      <EnhancedNeighborRequestCard
                        key={request.id}
                        request={request}
                        onAccept={() => handleAcceptRequest(request.id)}
                        onDecline={() => handleDeclineRequest(request.id)}
                        loading={actionLoading === request.id}
                      />
                    ))
                  )
                ) : // 이웃 목록
                filteredNeighbors.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {filters.search
                        ? '검색 결과가 없습니다.'
                        : '아직 이웃이 없습니다.'}
                    </h3>
                    <p className="text-gray-500">
                      {filters.search
                        ? '다른 검색어를 시도해보세요.'
                        : '다른 사용자들과 이웃이 되어 소중한 순간들을 공유해보세요.'}
                    </p>
                  </div>
                ) : (
                  filteredNeighbors.map((neighbor) => (
                    <EnhancedNeighborCard
                      key={neighbor.id}
                      neighbor={neighbor}
                      onRemove={() => handleRemoveNeighbor(neighbor.id)}
                      onSendMessage={() => handleSendMessage(neighbor.user_id)}
                      loading={actionLoading === neighbor.id}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNeighborsPage;
