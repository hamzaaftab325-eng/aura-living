'use client';

import { formatPKR } from '@/data/products';
import type { Product } from '@/types';

interface PriceTagProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * PriceTag — Displays product price with optional original price strikethrough.
 *
 * Shows the current price in PKR format. If the product has an originalPrice
 * (indicating a sale), shows the original price with a strikethrough above.
 *
 * @param product - The product to display the price for
 * @param size - Font size variant (sm=14px, md=16px, lg=20px)
 *
 * @example
 * <PriceTag product={product} size="md" />
 */
export default function PriceTag({ product, size = 'md', className = '' }: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`${sizeClasses[size]} font-bold aura-text-primary`}>
        {formatPKR(product.price)}
      </span>
      {product.originalPrice && (
        <span className={`text-xs line-through aura-text-muted`}>
          {formatPKR(product.originalPrice)}
        </span>
      )}
    </div>
  );
}
