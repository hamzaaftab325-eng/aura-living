'use client';

/**
 * Focus trap utility for modals, drawers, and menus.
 *
 * Usage:
 *   import { trapFocus, releaseFocus } from '@/lib/focusTrap';
 *   useEffect(() => {
 *     if (!open) return;
 *     const release = trapFocus(containerRef.current);
 *     return release;
 *   }, [open]);
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Trap focus inside the given container element.
 * Returns a cleanup function that removes the listener.
 */
export function trapFocus(container: HTMLElement | null): () => void {
  if (!container) return () => {};

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null); // visible only

    if (focusables.length === 0) {
      e.preventDefault();
      container.focus();
      return;
    }

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

  container.addEventListener('keydown', handleKeydown);

  // Make container programmatically focusable
  if (!container.hasAttribute('tabindex')) {
    container.setAttribute('tabindex', '-1');
  }

  return () => {
    container.removeEventListener('keydown', handleKeydown);
  };
}

/**
 * Move focus to the first focusable element inside a container.
 */
export function focusFirst(container: HTMLElement | null): void {
  if (!container) return;
  const focusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  focusable?.focus();
}
