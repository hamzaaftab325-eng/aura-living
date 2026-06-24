'use client';

/**
 * WhyChooseUs — Trust badges section with premium hover effects.
 *
 * Features:
 * - 4 trust badges (Free Shipping, COD, Quality Guarantee, Artisan Made)
 * - Gold icon circles with hover lift
 * - Scroll-triggered stagger reveal
 */

import { Truck, Banknote, ShieldCheck, Hammer } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useAnimations';
import { GoldDivider } from '@/components/SVGDecorations';

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on all orders above Rs. 10,000 across Pakistan',
  },
  {
    icon: Banknote,
    title: 'Cash on Delivery',
    description: 'Pay when your order arrives — no advance payment needed',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guarantee',
    description: 'Every piece is inspected by hand. 7-day easy returns.',
  },
  {
    icon: Hammer,
    title: 'Artisan Made',
    description: 'Handcrafted by skilled Pakistani artisans with traditional techniques',
  },
];

export default function WhyChooseUs() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[var(--surface-accent)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <span className="text-xs tracking-[4px] uppercase font-semibold aura-text-gold mb-4 block">
            Why Aura Living
          </span>
          <h2 className="aura-h2 mb-4">The Aura Promise</h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p className="text-base aura-text-secondary max-w-xl mx-auto">
            We&apos;re committed to making luxury home decor accessible, reliable, and
            beautifully crafted — for every Pakistani home.
          </p>
        </div>

        {/* Trust badges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="aura-trust-badge">
                <div className="aura-trust-icon-circle">
                  <Icon className="w-7 h-7 aura-text-gold" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2">{badge.title}</h3>
                  <p className="text-sm aura-text-secondary leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
