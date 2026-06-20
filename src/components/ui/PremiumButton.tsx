'use client';

import { useCallback } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'newsletter';
type ButtonSize = 'sm' | 'md' | 'lg';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  /**
   * Button variant — exactly 3 options:
   * - `primary` — Main CTA (gold gradient, white text)
   * - `secondary` — Supporting action (outline, gold text)
   * - `newsletter` — Newsletter form submit (enhanced primary)
   *
   * Legacy aliases (backward compat, mapped automatically):
   * - `gold` → `primary`
   * - `outline` → `secondary`
   * - `dark` → `secondary` (deprecated)
   */
  variant?: ButtonVariant | 'gold' | 'outline' | 'dark';
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string;
  /** Optional App Router href — when provided, renders a <Link> instead of a <button>. */
  href?: string;
}

/** Map legacy variant names to the new 3-class system. */
function normalizeVariant(variant: string | undefined): ButtonVariant {
  switch (variant) {
    case 'gold':
    case 'primary':
      return 'primary';
    case 'outline':
    case 'secondary':
      return 'secondary';
    case 'newsletter':
      return 'newsletter';
    case 'dark':
    default:
      return 'secondary';
  }
}

export default function PremiumButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  type = 'button',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ariaLabel,
  href }: PremiumButtonProps) {
  const handleClick = useCallback(() => {
    if (disabled || loading) return;
    onClick?.();
  }, [onClick, disabled, loading]);

  const normalizedVariant = normalizeVariant(variant);

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    newsletter: 'btn-newsletter' };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg' };

  const computedClassName = `premium-btn ${variantClasses[normalizedVariant]} ${sizeClasses[size]} ${
    fullWidth ? 'w-full' : ''
  } ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`;

  const inner = (
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
  );

  if (href && !disabled && !loading) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-busy={loading}
        className={computedClassName}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
      className={computedClassName}
    >
      {inner}
    </button>
  );
}
