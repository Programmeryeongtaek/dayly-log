import { NeighborRequest } from "@/types/my";
import { Check, Eye, Users, X } from "lucide-react";
import { useState } from "react";
import NeighborProfileModal from "./NeighborProfileModal";

interface EnhancedNeighborRequestCardProps {
  request: NeighborRequest;
  onAccept: () => void;
  onDecline: () => void;
  loading: boolean;
}

const EnhancedNeighborRequestCard = ({
  request,
  onAccept,
  onDecline,
  loading,
}: EnhancedNeighborRequestCardProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileModalOpen(true);
  };

  const handleAcceptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAccept();
  };

  const handleDeclineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDecline();
  };

  const handleModalClose = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <>
      <div className="group p-4 bg-white border-l-4 border-l-accent-400 border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent-400 transition-all duration-200">
        <div className="flex items-center justify-between">
          {/* 요청자 정보 */}
          <div className="flex items-center space-x-3 flex-1 mr-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-50 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              {/* 새로운 요청 표시 */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 border-2 border-white rounded-full animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col items-start gap-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-accent-600 transition-colors">
                  @{request.requester_nickname}
                </h3>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-1 px-3 py-2 bg-accent-100 text-gray-700 rounded-lg hover:bg-accent-200 transition-colors group-hover:text-accent-700 hover:cursor-pointer"
                  title="프로필 미리보기"
                  type="button"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">미리보기</span>
                </button>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-2">
            {request.status === "pending" && (
              <>
                <button
                  onClick={handleAcceptClick}
                  disabled={loading}
                  className="flex items-center space-x-1 px-3 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 disabled:opacity-50 transition-colors hover:cursor-pointer"
                  title="이웃 요청 수락"
                  type="button"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm">수락</span>
                </button>

                <button
                  onClick={handleDeclineClick}
                  disabled={loading}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors hover:cursor-pointer"
                  title="이웃 요청 거절"
                  type="button"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">거절</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 프로필 모달 */}
      {isProfileModalOpen && (
        <NeighborProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleModalClose}
          neighborId={request.requester_id}
          neighborNickname={request.requester_nickname}
          neighborName={request.requester_name}
          isNeighbor={false}
        />
      )}
    </>
  );
};

export default EnhancedNeighborRequestCard;
