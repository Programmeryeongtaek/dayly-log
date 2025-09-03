'use client';

import { ReactNode } from 'react';

interface ModalDescriptionProps {
  children: ReactNode;
  className?: string;
}

const ModalDescription = ({
  children,
  className = '',
}: ModalDescriptionProps) => (
  <div className={`text-sm mobile:text-base text-gray-600 mt-1 ${className}`}>
    {children}
  </div>
);

export default ModalDescription;
