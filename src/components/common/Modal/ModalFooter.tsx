'use client';

import { ReactNode } from 'react';

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const ModalFooter = ({ children, className = '' }: ModalFooterProps) => (
  <div
    className={`flex flex-col mobile:flex-row gap-3 mobile:gap-2 mobile:justify-end p-4 mobile:p-6 border-t border-gray-200 bg-gray-50 ${className}`}
  >
    {children}
  </div>
);

export default ModalFooter;
