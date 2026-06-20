'use client';

import { useState, useId, type KeyboardEvent } from 'react';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import PremiumButton from '@/components/ui/PremiumButton';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmitted?: () => void;
}

const MIN_BODY_LENGTH = 20;
const STAR_LABELS: Record<number, string> = {
  0: 'No rating selected',
  1: '1 star — Poor',
  2: '2 stars — Fair',
  3: '3 stars — Good',
  4: '4 stars — Very Good',
  5: '5 stars — Excellent',
};

export default function ReviewForm({ productId, productName, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{
    rating?: string;
    title?: string;
    body?: string;
    name?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Stable unique id for the radiogroup.
  const ratingGroupId = useId();

  const validate = () => {
    const e: typeof errors = {};
    if (rating === 0) e.rating = 'Please select a star rating.';
    if (!title.trim()) e.title = 'Please add a review title.';
    if (!body.trim()) {
      e.body = 'Please write your review.';
    } else if (body.trim().length < MIN_BODY_LENGTH) {
      e.body = `Review must be at least ${MIN_BODY_LENGTH} characters (currently ${body.trim().length}).`;
    }
    if (!name.trim()) e.name = 'Please enter your name.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast({
        title: 'Please fix the errors',
        description: 'Some required fields are missing or incomplete.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app this would POST to an API. For now we simulate a brief
    // submission delay so the loading state on PremiumButton is visible.
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback on ' + productName + '.',
      });
      setRating(0);
      setHoveredRating(0);
      setTitle('');
      setBody('');
      setName('');
      setLocation('');
      setErrors({});
      onSubmitted?.();
      // productId is part of the eventual API payload — referenced here so
      // it is not flagged as unused by the linter when the POST is wired in.
      void productId;
    }, 600);
  };

  // Keyboard support for the star rating radiogroup.
  const handleRatingKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setRating((r) => Math.min(5, r + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setRating((r) => Math.max(0, r - 1));
    } else if (e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      setRating(Number(e.key));
    } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      setRating(0);
    }
  };

  const displayedRating = hoveredRating || rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-6 rounded-md"
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid rgba(232,213,163,0.4)',
      }}
      noValidate
    >
      <h4 className="text-base font-semibold mb-1" style={{ color: 'var(--surface-dark)' }}>
        Write a Review
      </h4>
      <p className="text-xs mb-5" style={{ color: 'var(--color-muted-gray)' }}>
        Share your experience with {productName}.
      </p>

      {/* Star rating input — accessible radiogroup */}
      <div className="mb-5">
        <span
          className="text-sm font-medium block mb-2"
          style={{ color: 'var(--surface-dark)' }}
        >
          Your Rating
          <span style={{ color: 'var(--color-danger)' }} aria-hidden="true">
            {' '}
            *
          </span>
        </span>
        <div
          role="radiogroup"
          aria-label="Star rating"
          aria-required="true"
          aria-invalid={errors.rating ? 'true' : 'false'}
          aria-describedby={errors.rating ? `${ratingGroupId}-error` : undefined}
          tabIndex={0}
          onKeyDown={handleRatingKey}
          className="flex items-center gap-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
          style={{ width: 'fit-content' }}
        >
          {[1, 2, 3, 4, 5].map((i) => {
            const active = i <= displayedRating;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={rating === i}
                aria-label={STAR_LABELS[i]}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoveredRating(i)}
                onMouseLeave={() => setHoveredRating(0)}
                onFocus={() => setHoveredRating(i)}
                onBlur={() => setHoveredRating(0)}
                className="p-1 transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 rounded"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <Star
                  size={28}
                  className={
                    active
                      ? 'fill-[var(--color-gold)] text-[var(--color-gold)]'
                      : 'text-[var(--color-gold-soft)]'
                  }
                  aria-hidden="true"
                />
              </button>
            );
          })}
          <span
            className="ml-3 text-xs font-medium"
            style={{ color: 'var(--color-warm-gray)' }}
            aria-live="polite"
          >
            {STAR_LABELS[displayedRating]}
          </span>
        </div>
        {errors.rating && (
          <p
            id={`${ratingGroupId}-error`}
            role="alert"
            className="text-xs font-medium mt-1.5"
            style={{ color: 'var(--color-danger)' }}
          >
            {errors.rating}
          </p>
        )}
      </div>

      {/* Title */}
      <div className="mb-5">
        <Input
          label="Review Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarise your experience in a few words"
          maxLength={120}
          error={errors.title}
          hint="Up to 120 characters."
        />
      </div>

      {/* Body */}
      <div className="mb-5">
        <Textarea
          label="Your Review"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Tell us about the build quality, how ${productName} fits your space, packaging, and delivery experience.`}
          maxLength={1500}
          rows={5}
          error={errors.body}
          hint={`Minimum ${MIN_BODY_LENGTH} characters. ${body.trim().length}/${MIN_BODY_LENGTH} so far.`}
        />
      </div>

      {/* Name + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Input
          label="Your Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ayesha Khan"
          maxLength={60}
          error={errors.name}
        />
        <Input
          label="City (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Lahore"
          maxLength={40}
          hint="Helps other customers in your area."
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <PremiumButton
          type="submit"
          variant="primary"
          size="md"
          loading={submitting}
          leftIcon={<Star size={14} className="fill-current" aria-hidden="true" />}
        >
          {submitting ? 'Submitting…' : 'Submit Review'}
        </PremiumButton>
        <p className="text-xs" style={{ color: 'var(--color-muted-gray)' }}>
          Your review will be visible after moderation.
        </p>
      </div>
    </form>
  );
}
