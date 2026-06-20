'use client';

import { useEffect, useRef } from 'react';
import { Home, ShoppingBag } from 'lucide-react';
import { gsap } from '@/hooks/useGsap';
import { useStore } from '@/store/useStore';

export default function NotFound() {
  const numberRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    if (numberRef.current) {
      gsap.set(numberRef.current, { opacity: 0, scale: 0.5, y: 40 });
      tl.to(numberRef.current, {
        opacity: 1, scale: 1, y: 0,
        duration: 0.8, ease: 'back.out(1.7)',
      });
    }

    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 30 });
      tl.to(textRef.current, {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power3.out',
      }, '-=0.3');
    }

    if (buttonsRef.current) {
      const btns = buttonsRef.current.children;
      gsap.set(btns, { opacity: 0, y: 20 });
      tl.to(btns, {
        opacity: 1, y: 0,
        duration: 0.5, stagger: 0.12, ease: 'power3.out',
      }, '-=0.2');
    }
  }, []);

  const setPage = useStore((s) => s.setPage);

  const handleGoHome = () => {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoShop = () => {
    setPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--surface-page)' }}
    >
      {/* Decorative background elements */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, top: '10%', right: '-5%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300, height: 300, bottom: '15%', left: '-3%',
          background: 'radial-gradient(circle, rgba(168,181,160,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }}
      />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[var(--color-gold)]/30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-[var(--color-gold)]/30 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* 404 Number */}
        <div ref={numberRef} className="mb-6">
          <span
            className="text-[120px] sm:text-[160px] md:text-[200px] font-bold leading-none"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--color-gold)', opacity: 0.9 }}
          >
            404
          </span>
        </div>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[var(--color-gold)]/60" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
          <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[var(--color-gold)]/60" />
        </div>

        {/* Text */}
        <div ref={textRef}>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--surface-dark)' }}
          >
            Page Not Found
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto"
            style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-muted-gray)' }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--color-gold-hover)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] active:scale-[0.97] cursor-pointer"
            style={{ backgroundColor: 'var(--color-gold)', color: 'var(--text-on-dark)', fontFamily: "'Poppins', sans-serif" }}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={handleGoShop}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--color-gold-pale)] hover:text-[var(--color-gold)] active:scale-[0.97] cursor-pointer"
            style={{ border: '2px solid var(--color-gold)', color: 'var(--color-gold)', fontFamily: "'Poppins', sans-serif", backgroundColor: 'transparent' }}
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Shop
          </button>
        </div>
      </div>
    </div>
  );
}
