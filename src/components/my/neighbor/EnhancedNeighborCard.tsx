import { NeighborInfo } from '@/types/my';
import { Eye, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

import NeighborProfileModal from './NeighborProfileModal';

interface EnhancedNeighborCardProps {
  neighbor: NeighborInfo;
  onRemove: () => void;
  onSendMessage: () => void;
  loading: boolean;
}

const EnhancedNeighborCard = ({
  neighbor,
  onRemove,
  loading,
}: EnhancedNeighborCardProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <>
      <div className="group p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent-500 transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between">
          {/* 프로필 영역 - 클릭 가능 */}
          <div
            className="flex items-center space-x-3 flex-1 mr-4"
            onClick={handleProfileClick}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-blue-600" />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 transition-colors mb-1">
                @{neighbor.nickname}
              </h3>
              <span>공통 이웃: {neighbor.mutual_friends_count}명</span>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-1 px-3 py-2 bg-accent-100 text-gray-700 rounded-lg hover:bg-accent-100 transition-colors group-hover:bg-accent-100 group-hover:text-accent-700 hover:cursor-pointer"
              title="프로필 보기"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleRemoveClick}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors hover:cursor-pointer"
              title="이웃 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 프로필 모달 */}
      <NeighborProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        neighborId={neighbor.user_id}
      />
    </>
  );
};

export default EnhancedNeighborCard;
