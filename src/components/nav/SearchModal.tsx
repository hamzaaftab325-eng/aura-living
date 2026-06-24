'use client';

/**
 * SearchModal — top sheet with live product search results.
 *
 * Renders a full-width sheet at the top of the viewport with a search input.
 * As the user types (debounced 300ms), fetches results from
 * /api/products/search and displays them as a list. Enter navigates to
 * /shop?search=<query>. Escape closes the modal.
 *
 * All styling via CSS classes (.aura-nav-search, .aura-nav-search-input,
 * .aura-nav-search-result, etc.). Zero inline styles.
 */

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

interface SearchModalProps {
  open: boolean;
  query: string;
  results: SearchResult[];
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  onResultClick: (slug: string) => void;
  onEnterSubmit: (q: string) => void;
  formatPrice: (n: number) => string;
}

export default function SearchModal({
  open,
  query,
  results,
  loading,
  inputRef,
  onQueryChange,
  onClose,
  onResultClick,
  onEnterSubmit,
  formatPrice,
}: SearchModalProps) {
  // Focus input when search opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, inputRef]);

  if (!open) return null;

  return (
    <>
      <div className="aura-nav-search-backdrop" onClick={onClose} />
      <div className="aura-nav-search">
        <div className="aura-nav-search-inner">
          <div className="aura-nav-search-row">
            <Search className="aura-nav-search-icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search products..."
              className="aura-nav-search-input"
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'Enter' && query.trim()) {
                  onEnterSubmit(query.trim());
                }
              }}
            />
            <button
              onClick={onClose}
              className="aura-nav-search-close"
              aria-label="Close search"
            >
              <X className="aura-nav-search-close-icon" />
            </button>
          </div>

          {query.trim().length > 1 && (
            <div className="aura-nav-search-results">
              {loading && (
                <p className="aura-nav-search-status">Searching...</p>
              )}
              {!loading &&
                results.map((p) => (
                  <button
                    key={p.id}
                    className="aura-nav-search-result"
                    onClick={() => onResultClick(p.slug)}
                  >
                    <div className="aura-nav-search-result-img">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="aura-nav-search-result-img-inner"
                        sizes="40px"
                      />
                    </div>
                    <div className="aura-nav-search-result-text">
                      <p className="aura-nav-search-result-name">{p.name}</p>
                      <p className="aura-nav-search-result-price">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </button>
                ))}
              {!loading && results.length === 0 && (
                <p className="aura-nav-search-status">
                  No products found for &quot;{query}&quot;
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
