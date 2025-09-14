import { useNeighborProfile } from '@/hooks/my/useNeighborProfile';
import { usePublicProfile } from '@/hooks/my/usePublicProfile';
import {
  BookOpen,
  Calendar,
  Info,
  MessageCircleQuestion,
  Pencil,
  User,
  Users,
  X,
} from 'lucide-react';
import { useEffect } from 'react';

interface NeighborProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborId: string;
  neighborNickname?: string;
  neighborName?: string;
  isNeighbor?: boolean;
}

const NeighborProfileModal = ({
  isOpen,
  onClose,
  neighborId,
  isNeighbor = true,
}: NeighborProfileModalProps) => {
  const neighborProfileResult = useNeighborProfile({
    neighborId: isOpen && isNeighbor ? neighborId : null,
    enabled: isOpen && isNeighbor,
  });

  const publicProfileResult = usePublicProfile(
    neighborId,
    isOpen && !isNeighbor
  );

  // 현재 상태에 맞는 결과 선택
  const { profile, loading, error, refetch } =
    isNeighbor === true
      ? neighborProfileResult
      : ({
          profile: publicProfileResult.profile,
          loading: publicProfileResult.loading,
          error: publicProfileResult.error,
          refetch: publicProfileResult.refetch,
        } as typeof neighborProfileResult);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 모달 배경 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-accent-500">
          <h2 className="text-lg font-semibold text-gray-900">
            {isNeighbor ? '이웃 프로필' : '프로필 미리보기'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-100 rounded-full transition-colors hover:cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5 text-accent-500" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mb-4" />
              <p className="text-gray-600">프로필을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                프로필을 불러올 수 없습니다.
              </h3>
              <p className="text-gray-600 text-center mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                type="button"
              >
                재시도
              </button>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* 공개 프로필 안내 */}
              {!isNeighbor && (
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-accent-800">
                    <span className="font-semibold">
                      이웃이 되면 공개된 게시물을 볼 수 있습니다. <br />
                    </span>
                    (단, 가계부는 공개되지 않습니다.)
                  </p>
                </div>
              )}

              {/* 프로필 정보 */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profile.name}
                  </h3>
                  <p className="text-gray-600">@{profile.nickname}</p>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(profile.created_at).toLocaleDateString('ko-KR')}{' '}
                      가입
                    </span>
                  </div>
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="w-5 h-5 text-accent-600" />
                  </div>
                  <div className="text-2xl font-bold text-accent-600">
                    {profile.stats.total_reflections}
                  </div>
                  <div className="text-sm text-gray-600">회고</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircleQuestion className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.stats.total_questions}
                  </div>
                  <div className="text-sm text-gray-600">질문</div>
                </div>

                {/* 이웃 수는 이웃일 때만 표시 */}
                {profile.stats && (
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {profile.stats.neighbor_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">이웃</div>
                  </div>
                )}
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Pencil className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {profile.stats.answered_questions}
                  </div>
                  <div className="text-sm text-gray-600">질문답변</div>
                </div>
              </div>

              {/* 최근 활동 */}
              {profile.recent_activity.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    최근 활동
                  </h4>
                  <div className="space-y-3">
                    {profile.recent_activity.map((activity, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {activity.type === 'reflection' ? (
                              <BookOpen className="w-4 h-4 text-accent-600 mt-1" />
                            ) : (
                              <MessageCircleQuestion className="w-4 h-4 text-blue-600 mt-1" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 truncate">
                              {activity.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {activity.content_preview}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(activity.date).toLocaleDateString(
                                  'ko-KR'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.recent_activity.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    {isNeighbor
                      ? '아직 활동이 없습니다.'
                      : '아직 공개된 활동이 없습니다.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">프로필 정보가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeighborProfileModal;
