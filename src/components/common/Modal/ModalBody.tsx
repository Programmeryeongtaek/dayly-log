'use client';

import { ReactNode } from 'react';

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

const ModalBody = ({ children, className = '' }: ModalBodyProps) => (
  <div className={`p-4 mobile:p-6 overflow-y-auto flex-1 min-h-0 ${className}`}>
    {children}
  </div>
);

export default ModalBody;
