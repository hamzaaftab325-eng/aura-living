'use client';

import { GoldDivider } from '@/components/SVGDecorations';

interface SectionDividerProps {
  className?: string;
  width?: 'sm' | 'md' | 'lg';
}

/**
 * SectionDivider — Gold ornamental divider used between sections.
 *
 * Renders a centered GoldDivider with configurable width.
 * Used in 20+ places across the site to separate content sections.
 *
 * @param width - Divider width (sm=max-w-xs, md=max-w-sm, lg=max-w-md)
 *
 * @example
 * <SectionDivider width="md" />
 */
export default function SectionDivider({ className = '', width = 'sm' }: SectionDividerProps) {
  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-md',
  };

  return (
    <div className={`flex justify-center py-8 px-4 w-full ${className}`}>
      <div className={`w-full ${widthClasses[width]}`}>
        <GoldDivider />
      </div>
    </div>
  );
}
