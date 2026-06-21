'use client';

import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  /** Optional App Router href — when provided, renders a <Link> instead of a <button>. */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Optional product ID for BreadcrumbList JSON-LD */
  productName?: string;
  productId?: string;
}

/**
 * Reusable breadcrumb strip.
 * - Accessible: <nav aria-label="Breadcrumb"> + <ol> semantic markup.
 * - SEO: injects BreadcrumbList JSON-LD.
 * - Design-system compliant: uses tokens (no inline hex).
 */
export default function Breadcrumb({ items, productName, productId }: BreadcrumbProps) {
  // Inject BreadcrumbList JSON-LD for SEO
  useEffect(() => {
    const baseUrl = 'https://auraliving.pk';
    const itemListElement = items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: idx === 0
        ? `${baseUrl}/`
        : item.href
          ? `${baseUrl}${item.href}`
          : `${baseUrl}/#${item.label.toLowerCase().replace(/\s+/g, '-')}` }));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.setAttribute('data-breadcrumb-jsonld', 'true');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [items, productName, productId]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate"
      style={{ borderBottom: '1px solid var(--border-default)' }}
    >
      <ol className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const interactive = !isLast && (item.href || item.onClick);
          return (
            <li key={idx} className="flex items-center gap-2">
              {idx > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                />
              )}
              {!interactive ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="text-sm font-medium"
                  
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  onClick={item.onClick}
                  className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                  
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-sm transition-colors duration-200 hover:opacity-80 cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
