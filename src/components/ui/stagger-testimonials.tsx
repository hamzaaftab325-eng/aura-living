"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

/** Local initials-based avatar — no external pravatar.cc dependency. */
function InitialsAvatar({ name, size = 56 }: { name: string; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true" className="bg-[var(--color-gold-pale)]">
      <circle cx="28" cy="28" r="27" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
      <text
        x="28"
        y="28"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-playfair), serif"
        fontSize="24"
        fontWeight="600"
        fill="var(--color-gold-text)"
      >
        {initial}
      </text>
    </svg>
  );
}

const testimonials = [
  {
    tempId: 0,
    testimonial: "The Golden Aura Table Lamp completely transformed my bedroom! Exceptional quality and magical warm glow.",
    by: "Ayesha Khan, Lahore",
    rating: 5
  },
  {
    tempId: 1,
    testimonial: "Every brass piece I've ordered arrives with the kind of hand-finishing you can actually feel. The artisan craftsmanship is visible in every detail.",
    by: "Omar Farooq, Karachi",
    rating: 4
  },
  {
    tempId: 2,
    testimonial: "The Scented Candle fills my entire living room with the most calming vanilla scent. Absolutely love it!",
    by: "Sara Malik, Islamabad",
    rating: 5
  },
  {
    tempId: 3,
    testimonial: "The Pendant Lamp is a showstopper! Every guest asks where I got it. Looks even better in person.",
    by: "Hassan Ali, Rawalpindi",
    rating: 5
  },
  {
    tempId: 4,
    testimonial: "Love the Monstera planter — gold rim detail is so elegant. My living room finally feels complete!",
    by: "Fatima Noor, Faisalabad",
    rating: 4
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND AURA LIVING! The Ceramic Vase Set was the perfect housewarming gift. Will definitely shop again.",
    by: "Zainab Ahmed, Lahore",
    rating: 5
  },
  {
    tempId: 6,
    testimonial: "Took some convincing to order online, but now that we've decorated with Aura pieces, we're never going back to mass-market decor.",
    by: "Bilal Raza, Karachi",
    rating: 4
  },
  {
    tempId: 7,
    testimonial: "The brass lamp has become the centerpiece of our drawing room. Every visitor comments on it — best decor purchase we've made in years.",
    by: "Nadia Sheikh, Islamabad",
    rating: 5
  },
  {
    tempId: 8,
    testimonial: "Honestly the best home decor store in Pakistan. The pieces feel curated, not mass-produced.",
    by: "Usman Tariq, Multan",
    rating: 5
  },
  {
    tempId: 9,
    testimonial: "I've been a customer for 2 years now and the quality has never dipped. Each piece feels like an heirloom.",
    by: "Amina Butt, Lahore",
    rating: 4
  },
  {
    tempId: 10,
    testimonial: "I'd been searching for Pakistani-made home decor that actually feels modern and well-crafted for years. So glad I finally found Aura Living!",
    by: "Imran Shah, Peshawar",
    rating: 5
  },
  {
    tempId: 11,
    testimonial: "Their curated collection made it easy to find complementary pieces — I styled my entire lounge in one afternoon of browsing.",
    by: "Marina Khan, Karachi",
    rating: 4
  },
  {
    tempId: 12,
    testimonial: "Aura Living's customer support helped me pick the right size lamp for my space. They actually care about getting it right.",
    by: "Olivia Shah, Lahore",
    rating: 5
  },
  {
    tempId: 13,
    testimonial: "Delivery to Islamabad was quicker than expected, and every piece arrived in perfect condition with secure packaging.",
    by: "Raj Patel, Islamabad",
    rating: 5
  },
  {
    tempId: 14,
    testimonial: "Aura Living has completely changed how I think about decorating our home. Every piece tells a story.",
    by: "Lila Hashmi, Karachi",
    rating: 4
  },
  {
    tempId: 15,
    testimonial: "The range of styles means I can always find something that fits — whether I'm decorating a reading nook or the formal living room.",
    by: "Trevor Ali, Lahore",
    rating: 5
  },
  {
    tempId: 16,
    testimonial: "I love that Aura Living keeps adding new pieces each season without dropping the classics. Always something fresh to discover.",
    by: "Naomi Rizvi, Islamabad",
    rating: 4
  },
  {
    tempId: 17,
    testimonial: "The value for the craftsmanship you get is incredible. These pieces would cost three times as much imported, with none of the local character.",
    by: "Victor Khan, Karachi",
    rating: 5
  },
  {
    tempId: 18,
    testimonial: "Beautiful pieces, easy ordering, quick delivery. The perfect balance of luxury and accessibility for the Pakistani home.",
    by: "Yuki Tanaka, Lahore",
    rating: 5
  },
  {
    tempId: 19,
    testimonial: "We've shopped at many places, but Aura Living stands out for the consistency of quality and the thoughtful curation.",
    by: "Zoe Ahmed, Islamabad",
    rating: 4
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;
  const [isHovered, setIsHovered] = useState(false);

  // Proportional values based on cardSize (desktop=365 is the reference)
  const scale = cardSize / 365;
  const clipNotch = Math.round(50 * scale);
  const imgClipNotch = Math.round(25 * scale);
  const padding = Math.round(32 * scale);
  const imgH = Math.round(56 * scale);
  const imgW = Math.round(48 * scale);
  const titleSize = Math.max(14, Math.round(18 * scale));
  const authorSize = Math.max(11, Math.round(14 * scale));
  const authorBottom = Math.round(32 * scale);
  const authorSide = Math.round(32 * scale);
  const accentTop = Math.round(48 * scale);
  const starSize = Math.max(10, Math.round(14 * scale));

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 border-[var(--color-gold)] bg-[var(--surface-dark)] text-[var(--surface-card)]" 
          : "z-0 border-[var(--color-gold)]/20 bg-[var(--surface-page)] aura-text-primary hover:border-[var(--color-gold)]/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        padding: padding,
        clipPath: `polygon(${clipNotch}px 0%, calc(100% - ${clipNotch}px) 0%, 100% ${clipNotch}px, 100% 100%, calc(100% - ${clipNotch}px) 100%, ${clipNotch}px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${cardSize / 1.5 * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(212,175,55,0.3)" : "0px 0px 0px 0px transparent"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gold accent line — same on all screen sizes */}
      <span
        className="absolute block origin-top-right rotate-45 bg-[var(--color-gold)]/30"
        style={{
          right: -2,
          top: accentTop,
          width: SQRT_5000 * scale,
          height: 2
        }}
      />

      {/* Gold left border that grows on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 rounded-l-sm transition-all duration-400 z-20"
        style={{
          width: isHovered ? '4px' : '0px',
          backgroundColor: 'var(--color-gold)',
          boxShadow: isHovered ? '0 0 8px rgba(212,175,55,0.5)' : 'none',
          transformOrigin: 'bottom' }}
      />

      <div
        className="bg-[var(--color-gold-pale)] mb-3 flex items-center justify-center"
        style={{
          width: imgW,
          height: imgH,
          boxShadow: isCenter ? "3px 3px 0px var(--surface-dark)" : "3px 3px 0px var(--surface-page)",
          clipPath: `polygon(${imgClipNotch}px 0%, calc(100% - ${imgClipNotch}px) 0%, 100% ${imgClipNotch}px, 100% 100%, calc(100% - ${imgClipNotch}px) 100%, ${imgClipNotch}px 100%, 0 100%, 0 0)`
        }}
      >
        <InitialsAvatar name={testimonial.by.split(',')[0]} size={Math.min(imgW, imgH) - 4} />
      </div>

      {/* Animated quote marks — scale up on hover */}
      <div
        className="absolute transition-transform duration-300"
        style={{
          top: padding,
          right: padding,
          fontSize: titleSize * 2,
          lineHeight: 1,
          
          color: isCenter ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.12)',
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
          transformOrigin: 'top right' }}
      >
        &ldquo;
      </div>

      <h3
        className="font-medium leading-snug"
        style={{
          
          fontSize: titleSize,
          color: isCenter ? 'var(--surface-card)' : 'var(--surface-dark)'
        }}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>

      {/* Star rating with shimmer on hover */}
      <div
        className="flex items-center gap-0.5 mt-2"
        style={{
          animation: isHovered ? 'starShimmer 1.5s ease-in-out infinite' : 'none' }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "transition-all duration-300",
              i < (testimonial.rating ?? 5)
                ? "aura-text-gold fill-[var(--color-gold)]"
                : isCenter
                ? "text-[var(--color-gold-soft)]/30"
                : "text-[var(--color-gold-soft)]/50"
            )}
            style={{ width: starSize, height: starSize }}
          />
        ))}
      </div>

      <p
        className="absolute mt-2 italic"
        style={{
          
          fontSize: authorSize,
          bottom: authorBottom,
          left: authorSide,
          right: authorSide,
          color: isCenter ? 'var(--color-gold-soft)' : 'var(--color-muted-gray)'
        }}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  // Initialize cardSize with a function that runs only on the client AFTER mount.
  // SSR + first client render use a stable default; useLayoutEffect updates before paint
  // so the user never sees the 240px → 365px jump that useEffect caused.
  const [cardSize, setCardSize] = useState(240);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  // ─── Touch swipe handlers ─────────────────────────────────
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) handleMove(-1);
      else handleMove(1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // useLayoutEffect runs synchronously after DOM mutation but before paint,
  // so the user never sees the un-mounted state. This eliminates the CLS that
  // useEffect caused (where the container would visibly jump from 240px to 365px).
  React.useLayoutEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCardSize(365);
      else if (w >= 768) setCardSize(300);
      else if (w >= 640) setCardSize(270);
      else setCardSize(240);
    };

    updateSize();
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSize, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  // All sizes show center ± 2 cards for consistent look
  const visibleRange = 2;

  // Container height scales proportionally — desktop is 560 for 365px card
  const containerHeight = Math.round(560 * (cardSize / 365));

  return (
    <div
      className="relative w-full overflow-hidden bg-[var(--surface-page)]"
      style={{ height: containerHeight }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        if (Math.abs(position) > visibleRange) return null;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 sm:gap-4 z-20">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center text-base sm:text-2xl transition-all duration-300 rounded-full",
            "bg-[var(--surface-dark)] border-2 border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-white hover:border-[var(--color-gold)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2",
            "aura-text-gold"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center text-base sm:text-2xl transition-all duration-300 rounded-full",
            "bg-[var(--surface-dark)] border-2 border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-white hover:border-[var(--color-gold)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2",
            "aura-text-gold"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
