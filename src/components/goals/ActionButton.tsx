import { Edit, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  goalStatus: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const ActionButtons = ({
  goalStatus,
  onEdit,
  onDelete,
  isDeleting,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      {goalStatus === 'active' && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl hover:cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          수정
        </button>
      )}

      <button
        onClick={onDelete}
        disabled={isDeleting}
        className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all duration-200 transform shadow-lg ${
          isDeleting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 text-white hover:-translate-y-1 hover:shadow-xl hover:cursor-pointer'
        }`}
      >
        <Trash2 className="w-4 h-4" />
        {isDeleting ? '삭제 중...' : '삭제'}
      </button>
    </div>
  );
};

export default ActionButtons;
