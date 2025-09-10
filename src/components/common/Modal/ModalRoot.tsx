"use client";

import { ReactNode, useEffect } from "react";
import { ModalContext, ModalContextType } from "./ModalContext";

interface ModalRootProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const ModalRoot = ({
  children,
  isOpen,
  onClose,
  size = "md",
  className = "",
}: ModalRootProps) => {
  // 컨테이너 클릭 (이벤트 버블링 방지)
  const handleContainerClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    event.stopPropagation();
  };

  // 스크롤 방지 처리
  useEffect(() => {
    if (!isOpen) return;

    // 스크롤 방지
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // 스크롤바 너비 계산
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 사이즈별 스타일 정의
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  } as const;

  const contextValue: ModalContextType = {
    onClose,
    size,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {/* Backdrop - X 버튼으로만 */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center p-0 pt-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-hidden={!isOpen}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-gray bg-opacity-25 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div
          className={`
            relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-2xl
            animate-in fade-in-0 zoom-in-95 duration-200
            max-h-[95vh]
            overflow-hidden flex flex-col
            mx-2
            ${className}
          `}
          onClick={handleContainerClick}
          role="document"
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

export default ModalRoot;
