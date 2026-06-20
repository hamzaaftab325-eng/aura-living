'use client';

import { useCallback } from 'react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'gold' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string;
}

export default function PremiumButton({
  children,
  onClick,
  variant = 'gold',
  size = 'md',
  className = '',
  fullWidth = false,
  type = 'button',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ariaLabel,
}: PremiumButtonProps) {
  const handleClick = useCallback(() => {
    if (disabled || loading) return;
    onClick?.();
  }, [onClick, disabled, loading]);

  const sizeClasses = {
    sm: 'px-5 py-2 text-xs',
    md: 'px-8 py-3.5 text-sm',
    lg: 'px-10 py-4 text-base',
  };

  const variantClasses = {
    gold: 'btn-gold',
    outline: 'btn-outline',
    dark: 'btn-dark',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
      className={`premium-btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!loading && leftIcon}
        <span>{children}</span>
        {!loading && rightIcon}
      </span>
    </button>
  );
}
