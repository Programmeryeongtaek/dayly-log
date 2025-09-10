"use client";

import { ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const ModalFooter = ({ children, className = "" }: ModalFooterProps) => (
  <div
    className={`flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 ${className}`}
  >
    {children}
  </div>
);

export default ModalFooter;
