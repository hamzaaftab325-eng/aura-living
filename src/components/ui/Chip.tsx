'use client';

import { X } from 'lucide-react';

/**
 * Chip — Compact filter/tag element with optional remove action.
 *
 * Used for active filter indicators, category tags, and removable labels.
 * Replaces inline filter pill markup in ShopView.
 *
 * @param label - Text to display
 * @param onRemove - When provided, shows an X button and calls this on click
 * @param active - Whether the chip is in an active/selected state
 * @param onClick - When provided (without onRemove), chip is clickable
 *
 * @example
 * <Chip label="Lighting" active onClick={() => selectCategory('lighting')} />
 * <Chip label="Sale" onRemove={() => clearFilter('sale')} />
 */
export default function Chip({
  label,
  onRemove,
  active = false,
  onClick,
  className = '',
}: {
  label: string;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const baseClass = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer';
  const stateClass = active
    ? 'aura-bg-gold aura-text-white'
    : 'aura-bg-accent-tint aura-text-secondary hover:aura-bg-gold-tint';

  const Tag = onClick ? 'button' : 'span';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`${baseClass} ${stateClass} ${className}`}
      aria-pressed={onClick ? active : undefined}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity"
          aria-label={`Remove ${label} filter`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Tag>
  );
}
