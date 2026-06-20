'use client';

import { forwardRef, useId } from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  wrapperClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      required,
      wrapperClassName = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;
    const describedBy =
      [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        <label
          htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          required={required}
          className={`w-full px-4 py-3 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 resize-vertical ${className}`}
          style={{
            backgroundColor: 'var(--surface-card)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-default)'}`,
            color: 'var(--text-primary)',
            minHeight: '120px',
          }}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
export default Textarea;
