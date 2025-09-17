import {
  getDaysLeft,
  getStatusColorClass,
  getStatusText,
} from '@/utils/goals/goalsHelpers';
import { CheckCircle, Clock, Pause, X, Target } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  targetDate?: string | null;
  className?: string;
}

const StatusBadge = ({ status, targetDate, className }: StatusBadgeProps) => {
  const statusText = getStatusText(status);
  const statusColor = getStatusColorClass(status);
  const daysLeft = getDaysLeft(targetDate);

  // 아이콘 선택
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Target className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  // 긴급도에 따른 추가 배지
  const getUrgencyBadge = () => {
    if (status !== 'active' || !daysLeft) return null;

    if (daysLeft <= 3 && daysLeft > 0) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
          <Clock className="w-3 h-3" />
          {daysLeft}일 남음
        </span>
      );
    } else if (daysLeft <= 7 && daysLeft > 3) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          <Clock className="w-3 h-3" />
          {daysLeft}일 남음
        </span>
      );
    }

    return null;
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${statusColor} ${className}`}
      >
        {getStatusIcon()}
        {statusText}
      </span>
      {getUrgencyBadge()}
    </div>
  );
};

export default StatusBadge;
