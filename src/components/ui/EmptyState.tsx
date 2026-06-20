'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PremiumButton from './PremiumButton';

interface EmptyStateProps {
  /** Icon to display (lucide-react icon component) */
  icon: React.ReactNode;
  /** Main heading */
  title: string;
  /** Description text */
  description: string;
  /** CTA button text */
  actionLabel?: string;
  /** CTA button href (renders Link) or onClick (renders button) */
  actionHref?: string;
  actionOnClick?: () => void;
  /** Optional secondary action */
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
}

/**
 * Reusable empty state — standardizes the "no items found" pattern
 * across Cart, Wishlist, Account, Search, and Blog.
 *
 * Design:
 * - Icon in gold-tinted circle with dashed border
 * - Title in Playfair Display (aura-h3)
 * - Description in muted body text
 * - Primary CTA button
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  secondaryActionLabel,
  secondaryActionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Icon circle */}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
          border: '2px dashed rgba(212,175,55,0.3)' }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="aura-h3 aura-text-primary mb-2">{title}</h3>

      {/* Description */}
      <p className="aura-body aura-text-muted max-w-sm mb-8">
        {description}
      </p>

      {/* Primary CTA */}
      {actionLabel && (actionHref || actionOnClick) && (
        <PremiumButton
          variant="primary"
          href={actionHref}
          onClick={actionOnClick}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {actionLabel}
        </PremiumButton>
      )}

      {/* Secondary action */}
      {secondaryActionLabel && secondaryActionHref && (
        <Link
          href={secondaryActionHref}
          className="mt-4 text-sm font-medium aura-text-secondary hover:underline"
        >
          {secondaryActionLabel}
        </Link>
      )}
    </div>
  );
}
