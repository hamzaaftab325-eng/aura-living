'use client';

import { forwardRef, useId } from 'react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /** Optional adornment on the left (icon, prefix, etc.) */
  leftAdornment?: React.ReactNode;
  /** Optional adornment on the right (icon, button) */
  rightAdornment?: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * Accessible text input primitive.
 * - <label> with htmlFor
 * - aria-invalid when error present
 * - aria-describedby linking hint + error
 * - role="alert" on error span (screen reader announcement)
 * - design-system tokens only (no inline hex)
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      required,
      leftAdornment,
      rightAdornment,
      wrapperClassName = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const describedBy =
      [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-danger)' }} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        <div className="relative flex items-center">
          {leftAdornment && (
            <span
              className="absolute left-3 flex items-center pointer-events-none"
              
              aria-hidden="true"
            >
              {leftAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            required={required}
            className={`w-full px-4 py-3 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${
              leftAdornment ? 'pl-10' : ''
            } ${rightAdornment ? 'pr-10' : ''} ${className}`}
            style={{ border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-default)'}` }}
            {...props}
          />
          {rightAdornment && (
            <span className="absolute right-3 flex items-center">{rightAdornment}</span>
          )}
        </div>
        {hint && !error && (
          <p
            id={hintId}
            className="text-xs"
            
          >
            {hint}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium"
            style={{ color: 'var(--color-danger)' }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
