import Modal from '@/components/common/Modal';
import { useNeighborProfile } from '@/hooks/my/useNeighborProfile';
import { NeighborProfileModalProps } from '@/types/my';
import { AlertCircle, Calendar, Users } from 'lucide-react';
import { useEffect } from 'react';
import NeighborProfileStats from './NeighborProfileStats';
import NeighborPostCard from './NeighborPostCatd';

const NeighborProfileModal = ({
  isOpen,
  onClose,
  neighborId,
}: NeighborProfileModalProps) => {
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

  useEffect(() => {
    if (isOpen && neighborId) {
      fetchNeighborProfile();
    }
  }, [isOpen, neighborId, fetchNeighborProfile]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header showCloseButton>
        <Modal.Title>이웃 프로필</Modal.Title>
      </Modal.Header>

      <Modal.Body className="max-h-[80vh] overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" />
            <span className="ml-3 text-gray-600">프로필을 불러오는 중...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">
                오류가 발생했습니다.
              </span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchNeighborProfile}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors hover:cursor-pointer"
            >
              재시도
            </button>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* 프로필 정보 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {data.profile.name}
                  </h2>
                  <p className="text-gray-600">@{data.profile.nickname}</p>

                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(data.profile.accepted_at)} 이웃됨
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 도메인별 통계 */}
            <NeighborProfileStats
              stats={data.domainStats}
              onDomainClick={setActiveDomain}
              activeDomain={activeDomain}
            />

            {/* 게시글 목록 */}
            {totalPosts > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">
                    게시글 ({currentPosts.length}개)
                  </h4>
                </div>

                {currentPosts.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium mb-1">
                        게시글이 없습니다.
                      </p>
                      <p className="text-sm">
                        선택한 도메인에 공개된 게시글이 없어요.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
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
            )}
          </div>
        )}
      </Modal.Body>
    </Modal.Root>
  );
};

export default NeighborProfileModal;
