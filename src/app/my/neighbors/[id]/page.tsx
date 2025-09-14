"use client";

import NeighborPostCard from "@/components/my/neighbor/NeighborPostCard";
import NeighborProfileStats from "@/components/my/neighbor/NeighborProfileStats";
import { useNeighborDetailProfile } from "@/hooks/my/useNeighborDetailProfile";
import { AlertCircle, ArrowLeft, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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
  } = useNeighborDetailProfile(neighborId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
                className="px-6 py-2 bg-accent-400 text-white rounded-lg hover:bg-accent-500 transition-colors hover:cursor-pointer"
              >
                재시도
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors hover:cursor-pointer"
              >
                돌아가기
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
      <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8 px-4">
        {/* 헤더 */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 hover:cursor-pointer hover:text-accent-400" />
          </button>
        </div>

        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-accent-500 to-accent-700 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-accent-700" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">{data.profile.name}</h1>
                <p className="text-white text-lg font-semibold">
                  @{data.profile.nickname}
                </p>
                <div className="text-sm">
                  <p>이웃: {formatDate(data.profile.accepted_at)}</p>
                  <p>마지막 활동: {formatDate(data.profile.last_active)}</p>
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
            <div className="px-6 py-4 border-b border-accent-400">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">게시글</h2>
                <span className="text-sm text-accent-500">
                  {currentPosts.length}개
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {currentPosts.map((post) => (
                  <NeighborPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeighborDetailPage;
