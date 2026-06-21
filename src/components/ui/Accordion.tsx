'use client';

import { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion — Accessible collapsible section.
 *
 * Used in FAQ pages and any content that needs expand/collapse behavior.
 * Implements WAI-ARIA accordion pattern with keyboard support.
 *
 * @param title - The clickable header text
 * @param children - Content shown when expanded
 * @param defaultOpen - Whether the section starts expanded
 *
 * @example
 * <Accordion title="What is your return policy?" defaultOpen={false}>
 *   <p>We offer 14-day returns on all items...</p>
 * </Accordion>
 */
export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="aura-border-bottom-subtle">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:opacity-80"
      >
        <span className="aura-body font-medium aura-text-primary pr-4">{title}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-transform duration-300 aura-text-gold ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="pb-5 pr-8"
        >
          <div className="aura-body aura-text-secondary">{children}</div>
        </div>
      )}
    </div>
  );
}
