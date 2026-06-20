'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Position variant: drawer (right slide-in) or center (zoom-in) */
  variant?: 'center' | 'drawer';
  /** Optional size for center variant */
  size?: 'sm' | 'md' | 'lg';
  labelledById?: string;
}

/**
 * Reusable accessible Modal.
 * - role="dialog" aria-modal="true"
 * - Focus trap (Tab cycles within dialog)
 * - ESC to close
 * - Click outside to close (center variant only)
 * - Restore focus to trigger on close
 * - body overflow hidden when open
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
  variant = 'center',
  size = 'md',
  labelledById,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Save previously focused element
    previouslyFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    // Move focus into dialog
    const t = setTimeout(() => {
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }, 50);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const titleId = labelledById || 'modal-title';

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && variant === 'center') onClose();
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(44, 44, 44, 0.5)', backdropFilter: 'blur(2px)' }}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`relative ${
          variant === 'center'
            ? `m-auto w-full ${sizeClass} rounded-2xl shadow-xl`
            : 'ml-auto h-full w-full max-w-md shadow-xl'
        } ${className}`}
        style={{ animation: variant === 'center' ? 'modalZoomIn 250ms var(--ease-out)' : 'drawerSlideIn 300ms var(--ease-out)' }}
      >
        {title && (
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderBottomColor: 'var(--border-default)' }}
          >
            <h2
              id={titleId}
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-md transition-colors hover:bg-black/5"
              
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>

      <style jsx>{`
        @keyframes modalZoomIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
