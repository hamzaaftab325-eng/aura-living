'use client';

/**
 * Focus trap utility for modals, drawers, and menus.
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
    ).filter((el) => el.offsetParent !== null);

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
