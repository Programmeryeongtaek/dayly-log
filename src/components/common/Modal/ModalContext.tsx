'use client';

import { createContext, useContext } from 'react';

export interface ModalContextType {
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within a Modal');
  }
  return context;
};
