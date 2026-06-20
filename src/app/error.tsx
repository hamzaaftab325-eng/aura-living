'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--surface-page)' }}
    >
      {/* Decorative background */}
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
        {/* Error Icon */}
        <div
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
        >
          <AlertTriangle className="w-9 h-9" style={{ color: 'var(--color-gold)' }} />
        </div>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[var(--color-gold)]/60" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
          <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[var(--color-gold)]/60" />
        </div>

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--surface-dark)' }}
        >
          Something Went Wrong
        </h1>
        <p
          className="text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto"
          style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-muted-gray)' }}
        >
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>

        {/* Error details (dev only) */}
        {error.message && (
          <div
            className="mb-6 p-3 rounded-sm text-xs text-left"
            style={{ backgroundColor: 'rgba(232,206,193,0.2)', border: '1px solid rgba(232,206,193,0.4)', color: 'var(--color-muted-gray)', fontFamily: "'Poppins', sans-serif" }}
          >
            {error.message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--color-gold-hover)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)] active:scale-[0.97] cursor-pointer"
            style={{ backgroundColor: 'var(--color-gold)', color: 'var(--text-on-dark)', fontFamily: "'Poppins', sans-serif" }}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--color-gold-pale)] hover:text-[var(--color-gold)] active:scale-[0.97]"
            style={{ border: '2px solid var(--color-gold)', color: 'var(--color-gold)', fontFamily: "'Poppins', sans-serif", backgroundColor: 'transparent', textDecoration: 'none' }}
          >
            <Home className="w-4 h-4" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
