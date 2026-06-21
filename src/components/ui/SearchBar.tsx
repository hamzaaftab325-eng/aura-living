'use client';

import { Search, X } from 'lucide-react';

/**
 * SearchBar — Accessible search input with icon and clear button.
 *
 * Replaces inline search inputs in Navbar and Search pages.
 *
 * @param value - Current search query
 * @param onChange - Callback when search text changes
 * @param onSubmit - Callback when search is submitted (Enter key)
 * @param placeholder - Placeholder text
 * @param autoFocus - Whether to auto-focus on mount
 *
 * @example
 * <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} placeholder="Search products..." />
 */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  autoFocus,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
}) {
  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-4 w-5 h-5 aura-text-gold pointer-events-none" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) onSubmit();
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel || 'Search'}
        className="w-full pl-12 pr-10 py-3 text-sm bg-transparent outline-none aura-text-primary placeholder:aura-text-muted"
        style={{ borderBottom: '1px solid var(--color-gold-soft)' }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 p-1 rounded-full hover:bg-white/10 transition-colors aura-text-muted"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
