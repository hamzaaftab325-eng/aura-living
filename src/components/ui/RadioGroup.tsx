'use client';

import { forwardRef, useId } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  wrapperClassName?: string;
}

const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      name,
      options,
      value,
      onChange,
      error,
      required,
      orientation = 'vertical',
      wrapperClassName = '' },
    _ref
  ) => {
    const groupId = useId();
    const errorId = `${groupId}-error`;

    return (
      <fieldset
        className={`flex flex-col gap-2 ${wrapperClassName}`}
        aria-describedby={error ? errorId : undefined}
      >
        <legend
          className="text-sm font-medium"
          
        >
          {label}
          {required && (
            <span  aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </legend>
        <div
          className={`flex gap-3 ${
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
          }`}
          role="radiogroup"
          aria-required={required || undefined}
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex items-start gap-2.5 cursor-pointer p-3 rounded-md border transition-all duration-200 ${
                  opt.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{
                  borderColor: isSelected ? 'var(--color-gold)' : 'var(--border-default)',
                  backgroundColor: isSelected ? 'var(--surface-accent)' : 'transparent' }}
              >
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                  className="mt-0.5 w-4 h-4 cursor-pointer focus:ring-2"
                />
                <div className="flex flex-col">
                  <span
                    className="text-sm font-medium"
                    
                  >
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span
                      className="text-xs mt-0.5"
                      
                    >
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium"
            
          >
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
