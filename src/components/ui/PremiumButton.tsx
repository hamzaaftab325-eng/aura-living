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
}: PremiumButtonProps) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [onClick, disabled]);

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
      disabled={disabled}
      className={`premium-btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      
    >
      <span className="flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
