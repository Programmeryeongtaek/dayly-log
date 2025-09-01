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
  <p className={`text-sm mobile:text-base text-gray-600 mt-1 ${className}`}>
    {children}
  </p>
);

export default ModalDescription;
