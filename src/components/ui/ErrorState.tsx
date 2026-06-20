'use client';

import Link from 'next/link';
import { ArrowRight, Home, Search } from 'lucide-react';
import PremiumButton from './PremiumButton';

interface ErrorStateProps {
  /** Error code (404, 500, etc.) */
  code: string | number;
  /** Main heading */
  title: string;
  /** Description text */
  description: string;
  /** Show search bar (for 404) */
  showSearch?: boolean;
}

/**
 * Reusable error state — standardizes 404/500/general error pages.
 *
 * Design:
 * - Large error code in gold gradient
 * - Title in Playfair Display
 * - Description in muted body text
 * - Primary CTA: "Back to Home"
 * - Secondary CTA: "Browse Shop" (for 404)
 */
export default function ErrorState({
  code,
  title,
  description,
  showSearch = false,
}: ErrorStateProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-lg">
        {/* Error code */}
        <div
          className="text-8xl sm:text-9xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #C9A22E 50%, #B8941F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text' }}
        >
          {code}
        </div>

        {/* Title */}
        <h1 className="aura-h2 aura-text-primary mb-4">{title}</h1>

        {/* Description */}
        <p className="aura-body-large aura-text-secondary mb-8">
          {description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PremiumButton
            variant="primary"
            href="/"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Back to Home
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            href="/shop"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Browse Shop
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
