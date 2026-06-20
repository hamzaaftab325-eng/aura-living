'use client';

import { useState } from 'react';
import {
  useGsapFadeIn,
  useGsapStagger,
  useGsapBlurText,
  useGsapScaleIn,
} from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  MapPin,
  ChevronRight,
  ChevronDown,
  Search,
  Box,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PremiumButton from '@/components/ui/PremiumButton';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';

/* ═══════════════════════════════════════════════════════════
   AnimatedSection — staggered children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%',
  });
  return <div ref={ref} className={className}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════
   Mock order data with detailed tracking timeline
   ═══════════════════════════════════════════════════════════ */
interface TrackingStage {
  label: string;
  date: string;
  done: boolean;
  icon: typeof CheckCircle;
}

interface TrackedOrder {
  id: string;
  date: string;
  status: 'Delivered' | 'Shipped' | 'Processing';
  total: string;
  items: number;
  eta: string;
  stages: TrackingStage[];
}

const trackedOrders: TrackedOrder[] = [
  {
    id: 'AL-2026-001',
    date: 'Jan 15, 2026',
    status: 'Delivered',
    total: 'PKR 12,498',
    items: 3,
    eta: 'Delivered on Jan 19, 2026',
    stages: [
      { label: 'Order Placed', date: 'Jan 15, 10:32 AM', done: true, icon: CheckCircle },
      { label: 'Packed', date: 'Jan 15, 04:18 PM', done: true, icon: Box },
      { label: 'Shipped', date: 'Jan 16, 09:45 AM', done: true, icon: Truck },
      { label: 'Out for Delivery', date: 'Jan 19, 11:20 AM', done: true, icon: MapPin },
      { label: 'Delivered', date: 'Jan 19, 03:48 PM', done: true, icon: CheckCircle },
    ],
  },
  {
    id: 'AL-2026-002',
    date: 'Feb 28, 2026',
    status: 'Shipped',
    total: 'PKR 8,999',
    items: 2,
    eta: 'Arriving Mar 04, 2026',
    stages: [
      { label: 'Order Placed', date: 'Feb 28, 02:14 PM', done: true, icon: CheckCircle },
      { label: 'Packed', date: 'Feb 28, 06:42 PM', done: true, icon: Box },
      { label: 'Shipped', date: 'Mar 01, 08:30 AM', done: true, icon: Truck },
      { label: 'Out for Delivery', date: 'Pending', done: false, icon: MapPin },
      { label: 'Delivered', date: 'Pending', done: false, icon: CheckCircle },
    ],
  },
  {
    id: 'AL-2026-003',
    date: 'Mar 10, 2026',
    status: 'Processing',
    total: 'PKR 5,499',
    items: 1,
    eta: 'Ships by Mar 12, 2026',
    stages: [
      { label: 'Order Placed', date: 'Mar 10, 11:08 AM', done: true, icon: CheckCircle },
      { label: 'Packed', date: 'In progress', done: false, icon: Box },
      { label: 'Shipped', date: 'Pending', done: false, icon: Truck },
      { label: 'Out for Delivery', date: 'Pending', done: false, icon: MapPin },
      { label: 'Delivered', date: 'Pending', done: false, icon: CheckCircle },
    ],
  },
];

const statusConfig: Record<TrackedOrder['status'], { color: string; bg: string; icon: typeof CheckCircle }> = {
  Delivered: { color: 'var(--color-success)', bg: 'rgba(34, 197, 94, 0.1)', icon: CheckCircle },
  Shipped: { color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)', icon: Truck },
  Processing: { color: 'var(--color-gold)', bg: 'rgba(212, 175, 55, 0.1)', icon: Clock },
};

export default function TrackOrdersView() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const { toast } = useToast();

  // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useState(() => { Promise.resolve().then(() => setHydrated(true)); });
  const safeUser = hydrated ? user : null;

  const [searchId, setSearchId] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(trackedOrders[0]?.id ?? null);

  // GSAP refs
  const headerRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });
  const heroTitleRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03, start: 'top 90%' });
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });
  const ordersRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 30,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power3.out',
    start: 'top 85%',
  });

  const handleSearch = () => {
    if (!searchId.trim()) {
      toast({
        title: 'Enter an order ID',
        description: 'Please type your order number (e.g. AL-2026-001) to track it.',
      });
      return;
    }
    const found = trackedOrders.find((o) => o.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) {
      setExpandedId(found.id);
      toast({
        title: 'Order found',
        description: `Showing tracking timeline for #${found.id}.`,
      });
      setSearchId('');
    } else {
      toast({
        title: 'Order not found',
        description: `We couldn't find an order with ID "${searchId}". Please double-check and try again.`,
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = searchId.trim()
    ? trackedOrders.filter((o) => o.id.toLowerCase().includes(searchId.trim().toLowerCase()))
    : trackedOrders;

  // Not-signed-in gate
  if (hydrated && !safeUser) {
    return (
      <div className="w-full page-transition" >
        <section className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'url(/images/pages/account-hero.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)' }}
          />
          <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4">
            <h1
              ref={heroTitleRef}
              className="aura-hero-title text-white"
              
            >
              Track Your Orders
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
              <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center rounded-xl p-8 sm:p-10" >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ border: '1px dashed rgba(212,175,55,0.4)' }}>
              <Package className="w-8 h-8" style={{ color: 'var(--color-gold-text)' }} />
            </div>
            <h2 className="aura-text-primary aura-h2 mb-3" >
              Sign in to track your orders
            </h2>
            <p className="aura-text-secondary text-sm sm:text-base mb-6" >
              Sign in to view live delivery status, ETA, and full tracking history for every order.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PremiumButton variant="primary" size="sm" href="/auth/login">Sign In</PremiumButton>
              <Link
                href="/auth/signup"
                className="text-xs sm:text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                style={{ color: 'var(--color-gold)', background: 'none' }}
              >
                Create a free account
              </Link>
            </div>
          </div>
        </section>
        <div ref={dividerRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="w-full page-transition" >
      {/* Hero */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/account-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)' }}
        />

        <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <h2
            ref={heroTitleRef}
            className="aura-hero-title text-white"
            
          >
            Track Your Orders
          </h2>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          <p
            className="text-white/80 text-base sm:text-lg max-w-md mx-auto mt-4 leading-relaxed"
            
          >
            Live status, ETAs, and step-by-step delivery timelines for every order.
          </p>
        </div>
      </section>

      {/* Breadcrumb strip (below hero) */}
      <Breadcrumb
        items={[
          { label: 'My Account', href: '/account' },
          { label: 'Track Orders' },
        ]}
      />

      {/* Search + Orders */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Search bar */}
          <AnimatedSection>
            <div
              className="rounded-xl p-5 sm:p-6 mb-8 sm:mb-10"
              
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div
                  className="flex items-center rounded-sm flex-1"
                  style={{ border: '1.5px solid var(--color-gold-soft)',
                    backgroundColor: 'rgba(255,255,255,0.7)' }}
                >
                  <div className="flex items-center justify-center pl-4" style={{ color: 'var(--color-taupe)' }}>
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    placeholder="Enter order ID (e.g. AL-2026-001)"
                    className="w-full px-3 py-3 text-sm bg-transparent outline-none"
                    
                  />
                </div>
                <PremiumButton variant="primary" size="sm" onClick={handleSearch}>
                  Track Order
                </PremiumButton>
              </div>
            </div>
          </AnimatedSection>

          {/* Orders list */}
          <div ref={ordersRef} className="flex flex-col gap-5 sm:gap-6">
            {filteredOrders.length === 0 ? (
              <div
                className="rounded-xl p-10 text-center"
                
              >
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-gold)' }} />
                <h3 className="aura-text-primary text-lg font-semibold mb-1" >
                  No orders found
                </h3>
                <p className="text-sm" >
                  Try a different order ID or clear the search to see all your orders.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const cfg = statusConfig[order.status];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedId === order.id;
                return (
                  <div
                    key={order.id}
                    className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                    
                  >
                    {/* Order header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="w-full flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cfg.bg }}
                        >
                          <StatusIcon className="w-5 h-5" style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold" >
                            #{order.id}
                          </p>
                          <p className="text-xs sm:text-sm" >
                            Placed {order.date} · {order.items} item{order.items !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {order.status}
                          </span>
                          <p className="text-xs mt-1.5" >
                            {order.eta}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold" >
                            {order.total}
                          </p>
                        </div>
                        <ChevronDown
                          className="w-5 h-5 transition-transform duration-300"
                          style={{ color: 'var(--color-gold)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </div>
                    </button>

                    {/* Tracking timeline (expandable) */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 sm:pb-8 pt-2" style={{ borderTop: '1px solid var(--color-gold-soft)' }}>
                        <div className="mb-5">
                          <GoldDivider />
                        </div>
                        <ol className="relative">
                          {/* Vertical connector */}
                          <div
                            className="absolute left-[19px] top-2 bottom-2 w-px"
                            style={{ background: 'linear-gradient(180deg, var(--color-gold) 0%, var(--color-gold) 50%, var(--color-gold-soft) 50%, var(--color-gold-soft) 100%)' }}
                          />
                          {order.stages.map((stage, i) => {
                            const StageIcon = stage.icon;
                            return (
                              <li key={i} className="relative flex items-center gap-4 py-3 pl-0">
                                <div
                                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                                  style={{ backgroundColor: stage.done ? 'var(--color-gold)' : 'var(--surface-card)',
                                    border: stage.done ? '2px solid var(--color-gold)' : '2px dashed var(--color-gold-soft)',
                                    color: stage.done ? 'var(--text-on-dark)' : 'var(--color-taupe)' }}
                                >
                                  <StageIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p
                                    className="text-sm font-semibold"
                                    style={{ color: stage.done ? 'var(--surface-dark)' : 'var(--color-muted-gray)' }}
                                  >
                                    {stage.label}
                                  </p>
                                  <p
                                    className="text-xs mt-0.5"
                                    
                                  >
                                    {stage.date}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ol>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <PremiumButton variant="secondary" size="sm" onClick={() => toast({ title: 'Invoice', description: `Invoice for #${order.id} downloaded.`, })}>
                            Download Invoice
                          </PremiumButton>
                          <PremiumButton variant="primary" size="sm" href="/contact">
                            Get Help with this Order
                          </PremiumButton>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Back to account */}
          <div className="text-center mt-10 sm:mt-14">
            <Link
              href="/account"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
              style={{ color: 'var(--color-gold)', background: 'none' }}
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              Back to My Account
            </Link>
          </div>
          <div ref={dividerRef} className="hidden" />
        </div>
      </section>
    </div>
  );
}
