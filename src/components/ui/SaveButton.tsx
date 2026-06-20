'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Loader2, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const { useGSAP: useGSAPHook } = { useGSAP };

interface SaveButtonProps {
  text?: {
    idle?: string;
    saving?: string;
    saved?: string;
  };
  className?: string;
  onSave?: () => Promise<void> | void;
}

/**
 * SaveButton — Premium button with GSAP-powered state animations.
 *
 * Features:
 * - Idle → Saving → Saved state transitions
 * - GSAP bounce + scale animation on save success
 * - GSAP sparkle animation
 * - Canvas confetti burst on success
 * - Text reveal animation between states
 *
 * Uses GSAP instead of framer-motion for consistency with the rest of the app.
 * Uses `@gsap/react`'s `useGSAP()` for automatic cleanup.
 *
 * @param text - Custom text for each state
 * @param className - Additional classes
 * @param onSave - Async callback executed during "saving" state
 *
 * @example
 * <SaveButton
 *   text={{ idle: 'Save', saving: 'Saving...', saved: 'Saved!' }}
 *   onSave={async () => { await api.save(); }}
 * />
 */
export function SaveButton({
  text = {
    idle: 'Save',
    saving: 'Saving...',
    saved: 'Saved!' },
  className = '',
  onSave }: SaveButtonProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleSave = useCallback(async () => {
    if (status !== 'idle') return;
    setStatus('saving');
    try {
      if (onSave) {
        await onSave();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setStatus('saved');
    } catch (error) {
      console.error('Save failed:', error);
      setStatus('idle');
    }
  }, [status, onSave]);

  // GSAP animation for state changes — auto-cleaned by useGSAP
  useGSAPHook(
    () => {
      if (status === 'saved' && buttonRef.current) {
        // Bounce animation on the button
        gsap
          .timeline()
          .to(buttonRef.current, { scale: 1.08, duration: 0.15, ease: 'power2.out' })
          .to(buttonRef.current, { scale: 1, duration: 0.2, ease: 'power2.inOut' });

        // Sparkle animation
        if (sparkleRef.current) {
          gsap.fromTo(
            sparkleRef.current,
            { opacity: 0, scale: 0, rotation: -180 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' }
          );
        }

        // Confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#D4AF37', '#C9A22E', '#B8941F', '#E8D5A3', '#F5EDDA'],
          shapes: ['circle'],
          scalar: 0.8 });

        // Reset to idle after 2 seconds
        const timeout = setTimeout(() => {
          setStatus('idle');
        }, 2000);
        return () => clearTimeout(timeout);
      }

      // Text animation on any state change
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      }
    },
    { dependencies: [status], scope: buttonRef }
  );

  const bgColor =
    status === 'saving'
      ? 'var(--color-info)'
      : status === 'saved'
        ? 'var(--color-success)'
        : 'var(--color-gold)';

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleSave}
        disabled={status !== 'idle'}
        className={`premium-btn btn-primary relative flex items-center justify-center gap-2 min-w-[150px] ${status !== 'idle' ? 'cursor-wait' : ''} ${className}`}
        style={{ backgroundColor: bgColor, transition: 'background-color 0.3s ease' }}
        aria-busy={status === 'saving'}
        aria-live="polite"
      >
        {/* Loading spinner */}
        {status === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}

        {/* Check icon */}
        {status === 'saved' && <Check className="w-4 h-4" />}

        {/* Text with GSAP reveal */}
        <span ref={textRef}>
          {status === 'idle' ? text.idle : status === 'saving' ? text.saving : text.saved}
        </span>
      </button>

      {/* Sparkle decoration (shown on saved) */}
      {status === 'saved' && (
        <div
          ref={sparkleRef}
          className="absolute -top-1 -right-1 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <Sparkles className="w-5 h-5"  />
        </div>
      )}
    </div>
  );
}

export default SaveButton;
