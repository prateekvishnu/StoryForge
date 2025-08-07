'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'fun' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  ageGroup?: '7-10' | '11-16';
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  ageGroup = '7-10',
  icon,
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'touch-target font-bold rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-secondary text-white hover:bg-green-600 active:bg-green-700',
    accent: 'bg-accent text-white hover:bg-orange-600 active:bg-orange-700',
    fun: 'bg-fun text-white hover:bg-purple-600 active:bg-purple-700',
    success: 'bg-success text-white hover:bg-green-600 active:bg-green-700',
    warning: 'bg-warning text-white hover:bg-orange-600 active:bg-orange-700',
    danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700'
  };

  const sizeClasses = {
    small: ageGroup === '7-10' ? 'text-base px-4 py-2 min-h-[44px]' : 'text-sm px-3 py-2 min-h-[40px]',
    medium: ageGroup === '7-10' ? 'text-lg px-6 py-3 min-h-[52px]' : 'text-base px-5 py-2.5 min-h-[44px]',
    large: ageGroup === '7-10' ? 'text-xl px-8 py-4 min-h-[60px]' : 'text-lg px-7 py-3.5 min-h-[52px]'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    loading ? 'loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">Loading...</span>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}