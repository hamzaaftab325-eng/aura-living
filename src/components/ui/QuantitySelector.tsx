'use client';

import { Minus, Plus } from 'lucide-react';

/**
 * QuantitySelector — Accessible quantity input with +/- buttons.
 *
 * Replaces inline quantity controls in CartView, CartDrawer, and ProductDetailView.
 * Includes min/max validation and keyboard-accessible number input.
 *
 * @param value - Current quantity
 * @param onChange - Callback with new quantity value
 * @param min - Minimum allowed value (default: 1)
 * @param max - Maximum allowed value (default: 99)
 * @param size - Visual size ('sm' | 'md')
 *
 * @example
 * <QuantitySelector value={qty} onChange={setQty} size="sm" />
 */
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}) {
  const sizeClasses = {
    sm: { btn: 'w-8 h-8', input: 'w-10 text-sm', icon: 'h-3 w-3' },
    md: { btn: 'w-9 h-9', input: 'w-12 text-sm', icon: 'h-3.5 w-3.5' },
  };

  const s = sizeClasses[size];

  return (
    <div className="inline-flex items-center rounded-full aura-border-gold-soft aura-surface-card">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`flex items-center justify-center ${s.btn} rounded-full transition-colors hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed aura-text-secondary`}
        aria-label="Decrease quantity"
      >
        <Minus className={s.icon} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (Number.isFinite(v)) {
            onChange(Math.max(min, Math.min(max, v)));
          }
        }}
        onBlur={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!Number.isFinite(v) || v < min) onChange(min);
        }}
        className={`${s.input} text-center font-bold bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none aura-text-primary`}
        aria-label={ariaLabel || 'Quantity'}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`flex items-center justify-center ${s.btn} rounded-full transition-colors hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed aura-text-secondary`}
        aria-label="Increase quantity"
      >
        <Plus className={s.icon} />
      </button>
    </div>
  );
}
