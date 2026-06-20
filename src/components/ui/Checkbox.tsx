'use client';

import { forwardRef, useId } from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, hint, wrapperClassName = '', className = '', id, ...props },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;

    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        <div className="flex items-start gap-2.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            className="mt-0.5 w-4 h-4 rounded cursor-pointer focus:ring-2"
            style={{
              accentColor: 'var(--color-gold)' }}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className="text-sm leading-relaxed cursor-pointer"
            
          >
            {label}
          </label>
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium ml-6"
            
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            className="text-xs ml-6"
            
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
