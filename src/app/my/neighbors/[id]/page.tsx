'use client';

import NeighborPostCard from '@/components/my/neighbor/NeighborPostCatd';
import NeighborProfileStats from '@/components/my/neighbor/NeighborProfileStats';
import { useNeighborProfile } from '@/hooks/my/useNeighborProfile';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const NeighborDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const neighborId = params?.id as string;

  const {
    data,
    loading,
    error,
    activeDomain,
    currentPosts,
    totalPosts,
    setActiveDomain,
    fetchNeighborProfile,
  } = useNeighborProfile(neighborId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500" />
            <span className="ml-4 text-lg text-gray-600">
              프로필을 불러오는 중...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              오류가 발생했습니다.
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={fetchNeighborProfile}
                className="px-6 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 transition-colors"
              >
                재시도
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                뒤로 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        {/* 헤더 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            뒤로 가기
          </button>
        </div>

        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {data.profile.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{data.profile.name}</h1>
                <p className="text-blue-100 text-lg mb-3">
                  @{data.profile.nickname}
                </p>
                <div className="flex items-center space-x-4 text-blue-100 text-sm">
                  <span>{formatDate(data.profile.accepted_at)} 이웃됨</span>
                  <span>•</span>
                  <span>
                    마지막 활동: {formatDate(data.profile.last_active)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <NeighborProfileStats
              stats={data.domainStats}
              onDomainClick={setActiveDomain}
              activeDomain={activeDomain}
            />
          </div>
        </div>

        {/* 게시글 목록 */}
        {totalPosts > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">게시글</h2>
                <span className="text-sm text-gray-500">
                  {currentPosts.length}개의 게시글
                </span>
              </div>
            </div>

            <div className="p-6">
              {currentPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-lg font-medium mb-1">
                      게시글이 없습니다
                    </p>
                    <p className="text-sm">
                      선택한 도메인에 공개된 게시글이 없어요
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentPosts.map((post) => (
                    <NeighborPostCard
                      key={post.id}
                      post={post}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {totalPosts === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-xl font-medium mb-2">
                공개된 게시글이 없습니다
              </h3>
              <p className="text-gray-600">
                {data.profile.name}님이 아직 공개 설정한 회고나 성찰이 없어요.
                <br />
                이웃이 되어 서로의 소중한 순간들을 공유해보세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeighborDetailPage;
