'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

/**
 * RatingStars — Displays star rating with optional review count.
 *
 * Shows 5 stars with the appropriate number filled based on the rating.
 * Optionally shows the numeric rating and review count.
 *
 * @param rating - Rating value (0-5)
 * @param size - Star size (sm=12px, md=14px, lg=16px)
 * @param showNumber - Whether to show the numeric rating
 * @param reviewCount - Optional review count to display
 *
 * @example
 * <RatingStars rating={4.5} size="sm" showNumber reviewCount={127} />
 */
export default function RatingStars({
  rating,
  size = 'sm',
  showNumber = false,
  reviewCount,
  className = '',
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const halfFilled = star === Math.ceil(rating) && rating % 1 >= 0.5;
          return (
            <Star
              key={star}
              className={`${sizeClasses[size]} ${
                filled || halfFilled ? 'fill-current aura-text-gold' : 'aura-text-muted'
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showNumber && (
        <span className={`${textSizeClasses[size]} font-medium aura-text-secondary ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`${textSizeClasses[size]} aura-text-muted`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
