'use client';

import { ReactNode, useEffect } from 'react';
import { ModalContext, ModalContextType } from './ModalContext';

interface ModalRootProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ModalRoot = ({
  children,
  isOpen,
  onClose,
  size = 'md',
  className = '',
}: ModalRootProps) => {
  // ESC 키 이벤트 핸들러
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 스크롤 방지
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 사이즈별 스타일 정의
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  } as const;

  const contextValue: ModalContextType = {
    onClose,
    size,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 mobile:p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

        {/* Modal Container */}
        <div
          className={`
            relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-2xl
            animate-in fade-in-0 zoom-in-95 duration-200
            max-h-[90vh] overflow-hidden
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

export default ModalRoot;
