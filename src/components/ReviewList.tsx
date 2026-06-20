'use client';

import { useMemo, useState } from 'react';
import { Star, ThumbsUp, CheckCircle2, ChevronDown, MessageSquare } from 'lucide-react';
import type { Review } from '@/data/reviews';

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
}

type SortBy = 'recent' | 'helpful' | 'highest' | 'lowest';

const PAGE_SIZE = 5;
const INITIAL_VISIBLE = 3;

function formatDate(iso: string): string {
  // Render as "15 May 2025" — robust across browsers (Safari rejects "YYYY-MM-DD"
  // without a time component when passed directly to new Date()).
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value)
              ? 'fill-[var(--color-gold)] aura-text-gold'
              : 'text-[var(--color-gold-soft)]'
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (voted) return;
    setVoted(true);
    setHelpful((n) => n + 1);
  };

  return (
    <article
      className="p-5 sm:p-6 rounded-md"
      style={{ border: '1px solid rgba(232,213,163,0.4)' }}
    >
      {/* Header: author + verified + date */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
        <span className="text-sm font-semibold" >
          {review.author}
        </span>
        {review.location && (
          <>
            <span className="text-xs"  aria-hidden="true">
              •
            </span>
            <span className="text-xs" >
              {review.location}
            </span>
          </>
        )}
        {review.verified && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: 'rgba(34,197,94,0.1)',
              color: '#15803d' }}
          >
            <CheckCircle2 size={11} aria-hidden="true" />
            Verified Purchase
          </span>
        )}
      </div>

      {/* Date + stars */}
      <div className="flex items-center gap-3 mb-3">
        <Stars value={review.rating} />
        <span className="text-xs" >
          {formatDate(review.date)}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold mb-1.5" >
        {review.title}
      </h4>

      {/* Body */}
      <p
        className="text-sm leading-relaxed mb-4"
        
      >
        {review.body}
      </p>

      {/* Helpful button */}
      <button
        type="button"
        onClick={handleHelpful}
        disabled={voted}
        className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 disabled:cursor-default"
        style={{
          color: voted ? 'var(--color-gold)' : 'var(--color-muted-gray)' }}
        aria-pressed={voted}
        aria-label={voted ? 'Marked as helpful' : 'Mark this review as helpful'}
      >
        <ThumbsUp size={13} className={voted ? 'fill-current' : ''} aria-hidden="true" />
        Helpful ({helpful})
      </button>
    </article>
  );
}

export default function ReviewList({ reviews, averageRating }: ReviewListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [sortBy, setSortBy] = useState<SortBy>('helpful');

  // Sort reviews based on the current sort selection.
  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    switch (sortBy) {
      case 'recent':
        return copy.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'helpful':
        return copy.sort((a, b) => b.helpful - a.helpful);
      case 'highest':
        return copy.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return copy.sort((a, b) => a.rating - b.rating);
    }
  }, [reviews, sortBy]);

  // Rating distribution (5 stars down to 1 star).
  const distribution = useMemo(() => {
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((r) => r.rating === rating).length;
      return {
        rating,
        count,
        percentage: (count / total) * 100,
      };
    });
  }, [reviews]);

  // Empty state — product has no written reviews yet.
  if (reviews.length === 0) {
    return (
      <div
        className="text-center py-12 px-6 rounded-md"
        style={{ border: '1px solid rgba(232,213,163,0.4)' }}
      >
        <MessageSquare
          size={36}
          className="mx-auto mb-3"
          style={{ color: 'var(--color-gold-soft)' }}
          aria-hidden="true"
        />
        <p
          className="text-sm font-medium mb-1"
          
        >
          No reviews yet
        </p>
        <p className="text-xs" >
          Be the first to share your experience with this product.
        </p>
      </div>
    );
  }

  const roundedAverage = (Math.round(averageRating * 10) / 10).toFixed(1);

  return (
    <div>
      {/* Summary header */}
      <div
        className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 p-5 sm:p-6 rounded-md mb-6"
        style={{ border: '1px solid rgba(232,213,163,0.4)' }}
      >
        {/* Average rating block */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
          <div className="flex items-baseline gap-1">
            <span
              className="text-4xl font-bold leading-none"
              
            >
              {roundedAverage}
            </span>
            <span
              className="text-sm font-medium"
              
            >
              / 5
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Stars value={averageRating} size={16} />
            <span
              className="text-xs"
              
            >
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Distribution bars */}
        <div className="flex flex-col gap-1.5">
          {distribution.map((row) => (
            <div key={row.rating} className="flex items-center gap-3">
              <span
                className="text-xs font-medium w-3 text-right"
                
              >
                {row.rating}
              </span>
              <Star
                size={11}
                className="fill-[var(--color-gold)] aura-text-gold"
                aria-hidden="true"
              />
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-gold-pale)' }}
                role="progressbar"
                aria-valuenow={Math.round(row.percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${row.rating} star: ${row.count} ${row.count === 1 ? 'review' : 'reviews'}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${row.percentage}%`,
                    backgroundColor: 'var(--color-gold)' }}
                />
              </div>
              <span
                className="text-xs tabular-nums w-8 text-right"
                
              >
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center justify-between mb-5">
        <h3
          className="text-base font-semibold"
          
        >
          Customer Reviews
        </h3>
        <label className="flex items-center gap-2 text-xs" >
          <span className="font-medium">Sort by:</span>
          <span className="relative inline-flex">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortBy);
                setVisibleCount(INITIAL_VISIBLE);
              }}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-md text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
              
              aria-label="Sort reviews"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-gold)' }}
              aria-hidden="true"
            />
          </span>
        </label>
      </div>

      {/* Review cards */}
      <div className="flex flex-col gap-4">
        {sortedReviews.slice(0, visibleCount).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load more button */}
      {visibleCount < sortedReviews.length && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--color-gold-pale)] active:scale-[0.97]"
            style={{
              border: '1px solid var(--color-gold)',
              backgroundColor: 'transparent' }}
          >
            Show more reviews
            <span >
              ({sortedReviews.length - visibleCount} remaining)
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
