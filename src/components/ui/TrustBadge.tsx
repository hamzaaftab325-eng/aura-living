'use client';

import { Shield, Lock, Truck } from 'lucide-react';

interface TrustBadgeProps {
  variant?: 'secure' | 'returns' | 'shipping' | 'payments';
  className?: string;
}

/**
 * TrustBadge — Displays a trust indicator badge.
 *
 * Shows security/trust indicators in cart, checkout, and product pages.
 * Variants: secure (lock icon), returns (shield icon), shipping (truck icon),
 * payments (text only: COD · JazzCash · EasyPaisa).
 *
 * @param variant - Which trust badge to display
 *
 * @example
 * <TrustBadge variant="secure" />
 * <TrustBadge variant="payments" />
 */
export default function TrustBadge({ variant = 'secure', className = '' }: TrustBadgeProps) {
  const icons = {
    secure: <Lock className="w-3.5 h-3.5 aura-text-gold" />,
    returns: <Shield className="w-3.5 h-3.5 aura-text-gold" />,
    shipping: <Truck className="w-3.5 h-3.5 aura-text-gold" />,
    payments: null,
  };

  const labels = {
    secure: 'Secure Checkout',
    returns: 'Free Returns',
    shipping: 'Fast Delivery',
    payments: 'COD · JazzCash · EasyPaisa',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium aura-text-muted ${className}`}
    >
      {icons[variant]}
      {labels[variant]}
    </span>
  );
}
