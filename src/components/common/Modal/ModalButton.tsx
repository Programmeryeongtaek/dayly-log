'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useModalContext } from './ModalContext';

interface ModalButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const ModalButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...rest
}: ModalButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          처리중...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Close Button Component
type ModalCloseButtonProps = {
  children: ReactNode;
  variant?: Exclude<ModalButtonProps['variant'], undefined>;
  size?: ModalButtonProps['size'];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: ModalButtonProps['type'];
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'type' | 'children'
>;

export const ModalCloseButton = ({
  children,
  ...props
}: ModalCloseButtonProps) => {
  const { onClose } = useModalContext();

  return (
    <ModalButton onClick={onClose} variant="secondary" {...props}>
      {children}
    </ModalButton>
  );
};

export default ModalButton;
