'use client';

import { useId, useState } from 'react';
import Input from './Input';

/**
 * FormField — Complete form field wrapper with label, input, error, and hint.
 *
 * Combines label + input + error message + hint text into a single component.
 * Handles aria-invalid, aria-describedby, and role="alert" automatically.
 *
 * Replaces inline form field patterns in CheckoutView, AddressesView, SettingsView.
 *
 * @param label - Field label text
 * @param error - Error message (when present, field shows error state)
 * @param hint - Helper text below the field
 * @param required - Whether the field is required
 * @param type - Input type (text, email, password, tel, etc.)
 * @param value - Current field value
 * @param onChange - Change handler
 * @param placeholder - Placeholder text
 *
 * @example
 * <FormField
 *   label="Full Name"
 *   required
 *   type="text"
 *   value={name}
 *   onChange={setName}
 *   error={errors.name}
 *   placeholder="John Doe"
 * />
 */
export default function FormField({
  label,
  error,
  hint,
  required,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
}) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium aura-text-secondary"
      >
        {label}
        {required && <span className="aura-text-danger"> *</span>}
      </label>
      <input
        id={fieldId}
        name={name || fieldId}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className="w-full px-4 py-3 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 aura-surface-card aura-text-primary"
        style={{
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-gold-soft)'}`,
        }}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs aura-text-muted">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium aura-text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
