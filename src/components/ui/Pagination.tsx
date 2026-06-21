'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Base URL for links (page param appended as ?page=N) */
  href: string;
  /** Query param name for page (default: 'page') */
  paramName?: string;
}

/**
 * Reusable pagination component for shop, blog, and admin tables.
 * Uses <Link> for SEO (crawlers can follow pagination links).
 *
 * Shows: Previous | 1 | 2 | ... | N | Next
 * Collapses to compact view on mobile.
 */
export default function Pagination({
  currentPage,
  totalPages,
  href,
  paramName = 'page' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  const pageHref = (page: number) => {
    const separator = href.includes('?') ? '&' : '?';
    return page === 1 ? href : `${href}${separator}${paramName}=${page}`;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          aria-label="Previous page"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 aura-text-secondary"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="w-10 h-10 rounded-full flex items-center justify-center opacity-30 cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) => {
        if (page === 'ellipsis') {
          return (
            <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center aura-text-muted">
              …
            </span>
          );
        }
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={pageHref(page)}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              isActive
                ? 'bg-gold text-white shadow-md'
                : 'aura-text-secondary hover:bg-black/5'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          aria-label="Next page"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 aura-text-secondary"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="w-10 h-10 rounded-full flex items-center justify-center opacity-30 cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
