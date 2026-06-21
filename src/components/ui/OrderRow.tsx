import Image from 'next/image';
import Badge from './Badge';

/**
 * OrderRow — Displays a single order in list/table layouts.
 *
 * Used in: TrackOrdersView, AccountView (recent orders)
 *
 * @param order - Order data (id, date, status, total, items)
 * @param onClick - Optional click handler for order detail navigation
 *
 * @example
 * <OrderRow order={order} onClick={() => navigateToDetail(order.id)} />
 */
export interface OrderRowData {
  id: string;
  date: string;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
  total: string;
  itemCount: number;
  firstItemImage?: string;
}

export default function OrderRow({
  order,
  onClick,
  className = '',
}: {
  order: OrderRowData;
  onClick?: () => void;
  className?: string;
}) {
  const statusVariant = {
    Delivered: 'BESTSELLER' as const,
    Shipped: 'NEW' as const,
    Processing: 'NEW' as const,
    Cancelled: 'SALE' as const,
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`flex items-center gap-4 p-4 rounded-xl aura-surface-card aura-border-subtle transition-all duration-200 hover:aura-shadow-sm ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''} ${className}`}
    >
      {/* Item image */}
      {order.firstItemImage && (
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 aura-surface-card aura-border-gold-soft">
          <Image
            src={order.firstItemImage}
            alt="Order item"
            fill
            className="object-contain p-1"
            sizes="56px"
          />
        </div>
      )}

      {/* Order info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold aura-text-primary">#{order.id}</span>
          <Badge variant={statusVariant[order.status]} className="text-[9px] px-2 py-0.5">
            {order.status}
          </Badge>
        </div>
        <p className="text-xs aura-text-muted">
          {order.date} • {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Total */}
      <div className="text-right shrink-0">
        <span className="text-sm font-bold aura-text-primary">{order.total}</span>
      </div>
    </div>
  );
}
