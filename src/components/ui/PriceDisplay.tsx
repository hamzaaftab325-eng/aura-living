import { formatPKR } from '@/data/products';

/**
 * PriceDisplay — Product price with optional original price and discount badge.
 *
 * Shows the current price prominently with optional strikethrough original price
 * and discount percentage. Used in product cards and product detail pages.
 *
 * @param price - Current sale price
 * @param originalPrice - Original price (before discount)
 * @param size - Display size ('sm' | 'md' | 'lg')
 * @param showDiscount - Whether to show discount percentage
 *
 * @example
 * <PriceDisplay price={9999} originalPrice={14999} size="md" showDiscount />
 */
export default function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  showDiscount = false,
  className = '',
}: {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
  className?: string;
}) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`${sizeClasses[size]} font-bold aura-text-primary`}>
          {formatPKR(price)}
        </span>
        {hasDiscount && (
          <span className={`text-sm line-through aura-text-muted`}>
            {formatPKR(originalPrice!)}
          </span>
        )}
        {showDiscount && hasDiscount && (
          <span className="text-xs font-bold px-1.5 py-0.5 rounded aura-bg-danger aura-text-white">
            -{discountPercent}%
          </span>
        )}
      </div>
    </div>
  );
}
