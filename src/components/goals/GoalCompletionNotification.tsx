'use client';

import { CheckCircle, Trophy, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GoalCompletionNotificationProps {
  goalTitle: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

const GoalCompletionNotification = ({
  goalTitle,
  onClose,
  autoCloseDelay = 5000,
}: GoalCompletionNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-2xl p-6 max-w-sm z-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-white/20 rounded-full">
          <Trophy className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-lg">목표 달성!</h3>
          </div>
          <p className="text-green-100 text-sm mb-2">
            {goalTitle} 챌린지를 성공적으로 완료했습니다!
          </p>
          <p className="text-green-200 text-xs">
            축하합니다! 꾸준한 노력이 결실을 맺었네요.
          </p>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GoalCompletionNotification;
