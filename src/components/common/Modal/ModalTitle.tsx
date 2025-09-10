"use client";

import { HTMLAttributes, ReactNode } from "react";

interface ModalTitleProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, "children"> {
  children: ReactNode;
  id?: string;
}

const ModalTitle = ({
  children,
  className = "",
  id = "modal-title",
  ...rest
}: ModalTitleProps) => (
  <h2
    id={id}
    className={`text-lg font-semibold text-gray-900 ${className}`}
    {...rest}
  >
    {children}
  </h2>
);

export default ModalTitle;
