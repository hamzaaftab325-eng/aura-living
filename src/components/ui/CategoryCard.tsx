'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';

/**
 * CategoryCard — Displays a single product category in grid layouts.
 *
 * Used in: CategoriesSection (homepage), ShopView (sidebar filters)
 *
 * @param category - The category data to display
 * @param href - Link URL (default: `/shop?category=${category.id}`)
 *
 * @example
 * <CategoryCard category={category} />
 */
export default function CategoryCard({
  category,
  href,
  className = '',
}: {
  category: Category;
  href?: string;
  className?: string;
}) {
  const linkHref = href || `/shop?category=${encodeURIComponent(category.id)}`;

  return (
    <Link
      href={linkHref}
      className={`group relative block overflow-hidden rounded-xl aura-border-gold-soft transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>
          {category.name}
        </h3>
        <p className="text-xs text-white/70">{category.description}</p>
      </div>
    </Link>
  );
}
