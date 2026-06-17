"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "The Golden Aura Table Lamp completely transformed my bedroom! Exceptional quality and magical warm glow.",
    by: "Ayesha Khan, Lahore",
    imgSrc: "https://i.pravatar.cc/150?img=1",
    rating: 5
  },
  {
    tempId: 1,
    testimonial: "I'm confident my data is safe with Aura Living. The artisan craftsmanship is visible in every detail.",
    by: "Omar Farooq, Karachi",
    imgSrc: "https://i.pravatar.cc/150?img=2",
    rating: 4
  },
  {
    tempId: 2,
    testimonial: "The Scented Candle fills my entire living room with the most calming vanilla scent. Absolutely love it!",
    by: "Sara Malik, Islamabad",
    imgSrc: "https://i.pravatar.cc/150?img=3",
    rating: 5
  },
  {
    tempId: 3,
    testimonial: "The Pendant Lamp is a showstopper! Every guest asks where I got it. Looks even better in person.",
    by: "Hassan Ali, Rawalpindi",
    imgSrc: "https://i.pravatar.cc/150?img=4",
    rating: 5
  },
  {
    tempId: 4,
    testimonial: "Love the Monstera planter — gold rim detail is so elegant. My living room finally feels complete!",
    by: "Fatima Noor, Faisalabad",
    imgSrc: "https://i.pravatar.cc/150?img=5",
    rating: 4
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND AURA LIVING! The Ceramic Vase Set was the perfect gift. Will definitely shop again.",
    by: "Zainab Ahmed, Lahore",
    imgSrc: "https://i.pravatar.cc/150?img=6",
    rating: 5
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that we've decorated with Aura pieces, we're never going back.",
    by: "Bilal Raza, Karachi",
    imgSrc: "https://i.pravatar.cc/150?img=7",
    rating: 4
  },
  {
    tempId: 7,
    testimonial: "The ROI on these decor pieces is EASILY 100X. My home value and happiness both went up significantly.",
    by: "Nadia Sheikh, Islamabad",
    imgSrc: "https://i.pravatar.cc/150?img=8",
    rating: 5
  },
  {
    tempId: 8,
    testimonial: "It's just the best home decor store in Pakistan. Period.",
    by: "Usman Tariq, Multan",
    imgSrc: "https://i.pravatar.cc/150?img=9",
    rating: 5
  },
  {
    tempId: 9,
    testimonial: "I switched to Aura Living 2 years ago and never looked back. The quality is unmatched.",
    by: "Amina Butt, Lahore",
    imgSrc: "https://i.pravatar.cc/150?img=10",
    rating: 4
  },
  {
    tempId: 10,
    testimonial: "I've been searching for a solution like Aura Living for YEARS. So glad I finally found one!",
    by: "Imran Shah, Peshawar",
    imgSrc: "https://i.pravatar.cc/150?img=11",
    rating: 5
  },
  {
    tempId: 11,
    testimonial: "It's so simple and intuitive, we got our entire home styled in just 10 minutes of browsing.",
    by: "Marina Khan, Karachi",
    imgSrc: "https://i.pravatar.cc/150?img=12",
    rating: 4
  },
  {
    tempId: 12,
    testimonial: "Aura Living's customer support is unparalleled. They're always there when we need them.",
    by: "Olivia Shah, Lahore",
    imgSrc: "https://i.pravatar.cc/150?img=13",
    rating: 5
  },
  {
    tempId: 13,
    testimonial: "The efficiency of their delivery is off the charts! Every piece arrives in perfect condition.",
    by: "Raj Patel, Islamabad",
    imgSrc: "https://i.pravatar.cc/150?img=14",
    rating: 5
  },
  {
    tempId: 14,
    testimonial: "Aura Living has revolutionized how we think about home decoration. It's a game-changer!",
    by: "Lila Hashmi, Karachi",
    imgSrc: "https://i.pravatar.cc/150?img=15",
    rating: 4
  },
  {
    tempId: 15,
    testimonial: "The scalability of their collection is impressive. It grows with our taste seamlessly.",
    by: "Trevor Ali, Lahore",
    imgSrc: "https://i.pravatar.cc/150?img=16",
    rating: 5
  },
  {
    tempId: 16,
    testimonial: "I appreciate how Aura Living continually innovates. They're always one step ahead.",
    by: "Naomi Rizvi, Islamabad",
    imgSrc: "https://i.pravatar.cc/150?img=17",
    rating: 4
  },
  {
    tempId: 17,
    testimonial: "The value we've seen with Aura Living is incredible. It's paid for itself many times over.",
    by: "Victor Khan, Karachi",
    imgSrc: "https://i.pravatar.cc/150?img=18",
    rating: 5
  },
  {
    tempId: 18,
    testimonial: "Their platform is so robust, yet easy to use. The perfect balance of luxury and accessibility.",
    by: "Yuki Tanaka, Lahore",
    imgSrc: "https://i.pravatar.cc/150?img=19",
    rating: 5
  },
  {
    tempId: 19,
    testimonial: "We've tried many stores, but Aura Living stands out in terms of reliability and performance.",
    by: "Zoe Ahmed, Islamabad",
    imgSrc: "https://i.pravatar.cc/150?img=20",
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
          ? "z-10 border-[#D4AF37] bg-[#2C2C2C] text-[#FFFDF7]" 
          : "z-0 border-[#D4AF37]/20 bg-[#FAF8F5] text-[#2C2C2C] hover:border-[#D4AF37]/50"
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
        className="absolute block origin-top-right rotate-45 bg-[#D4AF37]/30"
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
          backgroundColor: '#D4AF37',
          boxShadow: isHovered ? '0 0 8px rgba(212,175,55,0.5)' : 'none',
          transformOrigin: 'bottom',
        }}
      />

      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="bg-[#F5EDDA] object-cover object-top mb-3"
        style={{
          width: imgW,
          height: imgH,
          boxShadow: isCenter ? "3px 3px 0px #2C2C2C" : "3px 3px 0px #FAF8F5",
          clipPath: `polygon(${imgClipNotch}px 0%, calc(100% - ${imgClipNotch}px) 0%, 100% ${imgClipNotch}px, 100% 100%, calc(100% - ${imgClipNotch}px) 100%, ${imgClipNotch}px 100%, 0 100%, 0 0)`
        }}
      />

      {/* Animated quote marks — scale up on hover */}
      <div
        className="absolute transition-transform duration-300"
        style={{
          top: padding,
          right: padding,
          fontSize: titleSize * 2,
          lineHeight: 1,
          fontFamily: "'Playfair Display', serif",
          color: isCenter ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.12)',
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
          transformOrigin: 'top right',
        }}
      >
        &ldquo;
      </div>

      <h3
        className="font-medium leading-snug"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: titleSize,
          color: isCenter ? '#FFFDF7' : '#2C2C2C'
        }}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>

      {/* Star rating with shimmer on hover */}
      <div
        className="flex items-center gap-0.5 mt-2"
        style={{
          animation: isHovered ? 'starShimmer 1.5s ease-in-out infinite' : 'none',
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "transition-all duration-300",
              i < (testimonial.rating ?? 5)
                ? "text-[#D4AF37] fill-[#D4AF37]"
                : isCenter
                ? "text-[#E8D5A3]/30"
                : "text-[#E8D5A3]/50"
            )}
            style={{ width: starSize, height: starSize }}
          />
        ))}
      </div>

      <p
        className="absolute mt-2 italic"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: authorSize,
          bottom: authorBottom,
          left: authorSide,
          right: authorSide,
          color: isCenter ? '#E8D5A3' : '#8A8A8A'
        }}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(240);
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCardSize(365);
      else if (w >= 768) setCardSize(300);
      else if (w >= 640) setCardSize(270);
      else setCardSize(240);
    };

    updateSize();
    setMounted(true);
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
      className="relative w-full overflow-hidden bg-[#FAF8F5]"
      style={{ height: containerHeight }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
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
            "flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center text-base sm:text-2xl transition-all duration-300 rounded-full",
            "bg-[#2C2C2C] border-2 border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2",
            "text-[#D4AF37]"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center text-base sm:text-2xl transition-all duration-300 rounded-full",
            "bg-[#2C2C2C] border-2 border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2",
            "text-[#D4AF37]"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
