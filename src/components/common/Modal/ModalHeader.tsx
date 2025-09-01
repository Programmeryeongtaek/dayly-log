'use client';

import { ReactNode } from 'react';
import { useModalContext } from './ModalContext';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

const ModalHeader = ({
  children,
  showCloseButton,
  className = '',
}: ModalHeaderProps) => {
  const { onClose } = useModalContext();

  return (
    <div
      className={`flex items-center justify-between p-4 mobile:p-6 border-b border-gray-200 ${className}`}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          aria-label="모달 닫기"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ModalHeader;
