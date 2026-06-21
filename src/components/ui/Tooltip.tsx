'use client';

import { useState, useRef, useId } from 'react';

/**
 * Tooltip — Accessible hover/focus tooltip.
 *
 * Displays contextual information on hover or keyboard focus.
 * Uses CSS-only positioning (no floating-ui dependency).
 *
 * @param content - Text content to display in the tooltip
 * @param position - Tooltip position relative to trigger ('top' | 'bottom' | 'left' | 'right')
 *
 * @example
 * <Tooltip content="Add to wishlist">
 *   <button aria-label="Wishlist"><Heart /></button>
 * </Tooltip>
 */
export default function Tooltip({
  children,
  content,
  position = 'top',
}: {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [isVisible, setIsVisible] = useState(false);
  const tipId = useId();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span aria-describedby={isVisible ? tipId : undefined}>{children}</span>
      {isVisible && (
        <span
          id={tipId}
          role="tooltip"
          className={`absolute z-[var(--z-tooltip)] ${positionClasses[position]} px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none transition-opacity duration-200 aura-bg-dark aura-text-white aura-shadow-md`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
