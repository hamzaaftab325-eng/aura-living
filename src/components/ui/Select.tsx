'use client';

import { forwardRef, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      required,
      options,
      placeholder,
      wrapperClassName = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const hintId = `${selectId}-hint`;
    const errorId = `${selectId}-error`;
    const describedBy =
      [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        <label
          htmlFor={selectId}
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-danger)' }} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          required={required}
          className={`w-full px-4 py-3 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 ${className}`}
          style={{
            backgroundColor: 'var(--surface-card)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-default)'}`,
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && (
          <p
            id={hintId}
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
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

Select.displayName = 'Select';
export default Select;
