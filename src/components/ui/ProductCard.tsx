'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { useStore, badgeColors } from '@/store/useStore';
import { useCartActions } from '@/hooks/useCartActions';
import { formatRupees as formatPKR } from '@/lib/currency-display';
import Badge from './Badge';
import RatingStars from './RatingStars';

/**
 * ProductCard — Displays a single product in grid layouts.
 *
 * The single source of truth for product display cards.
 * Used in: Shop, Sale, NewArrivals, Wishlist, FeaturedProducts
 *
 * @param product - The product data to display
 * @param showRating - Whether to show star rating (default: true)
 * @param showBadge - Whether to show NEW/SALE/BESTSELLER badge (default: true)
 * @param wishlistable - Whether to show wishlist toggle (default: true)
 *
 * @example
 * <ProductCard product={product} />
 * <ProductCard product={product} showRating={false} wishlistable={false} />
 */
export default function ProductCard({
  product,
  showRating = true,
  showBadge = true,
  wishlistable = true,
  className = '',
}: {
  product: Product;
  showRating?: boolean;
  showBadge?: boolean;
  wishlistable?: boolean;
  className?: string;
}) {
  const { isInWishlist } = useStore();
  const { handleAddToCart, handleToggleWishlist } = useCartActions();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className={`group relative flex flex-col transition-all duration-500 ${className}`}>
      {/* Image container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-xl aura-border-gold-soft aspect-square"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge */}
        {showBadge && product.badge && (
          <Badge variant={product.badge} position="absolute" className="top-3 left-3" />
        )}

        {/* Wishlist button */}
        {wishlistable && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist(product.id, product.name);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 aura-surface-card aura-shadow-sm hover:scale-110"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current aura-text-danger' : 'aura-text-muted'}`} />
          </button>
        )}

        {/* Quick add to cart bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product);
            }}
            className="premium-btn btn-primary btn-sm w-full"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Product info */}
      <div className="mt-3 flex flex-col gap-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold leading-tight aura-text-primary hover:aura-text-gold transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs aura-text-muted capitalize">{product.category.replace('-', ' ')}</p>

        {showRating && (
          <RatingStars rating={product.rating} size="sm" showNumber reviewCount={product.reviews} />
        )}

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold aura-text-primary">{formatPKR(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs line-through aura-text-muted">{formatPKR(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
