'use client';

/**
 * Testimonial Demos — 5 modern testimonial designs for preview.
 *
 * Designs:
 * 1. Minimal Grid — 3-col clean cards on light bg (Apple-style)
 * 2. Featured Carousel — single large dark card + arrows + dots (premium)
 * 3. Masonry — Pinterest-style varying heights + gold accents (editorial)
 * 4. Glass Cards — glassmorphic on gradient bg (modern/Linear-style)
 * 5. Editorial Quote — single huge quote, magazine-style (Aesop-style)
 *
 * Visit /testimonial-demos to preview all 5.
 */

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';

// ── Shared testimonial data (same as production) ──

const testimonials = [
  { quote: "The Golden Aura Table Lamp completely transformed my bedroom! Exceptional quality and magical warm glow.", name: "Ayesha Khan", location: "Lahore", rating: 5 },
  { quote: "Every brass piece I've ordered arrives with the kind of hand-finishing you can actually feel. The artisan craftsmanship is visible in every detail.", name: "Omar Farooq", location: "Karachi", rating: 4 },
  { quote: "The Scented Candle fills my entire living room with the most calming vanilla scent. Absolutely love it!", name: "Sara Malik", location: "Islamabad", rating: 5 },
  { quote: "The Pendant Lamp is a showstopper! Every guest asks where I got it. Looks even better in person.", name: "Hassan Ali", location: "Rawalpindi", rating: 5 },
  { quote: "Love the Monstera planter — gold rim detail is so elegant. My living room finally feels complete!", name: "Fatima Noor", location: "Faisalabad", rating: 4 },
  { quote: "The brass lamp has become the centerpiece of our drawing room. Every visitor comments on it — best decor purchase we've made in years.", name: "Nadia Sheikh", location: "Islamabad", rating: 5 },
  { quote: "Honestly the best home decor store in Pakistan. The pieces feel curated, not mass-produced.", name: "Usman Tariq", location: "Multan", rating: 5 },
  { quote: "I've been a customer for 2 years now and the quality has never dipped. Each piece feels like an heirloom.", name: "Amina Butt", location: "Lahore", rating: 4 },
];

// ── Initials avatar (reused) ──

function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="td-avatar" style={{ width: size, height: size }}>
      <span className="td-avatar-text">{initial}</span>
    </div>
  );
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="td-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? 'td-star td-star-filled' : 'td-star td-star-empty'}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DESIGN 1 — Minimal Grid (Apple-style)
// ═══════════════════════════════════════════════════════════

function Design1() {
  return (
    <section className="td-1">
      <div className="td-1-inner">
        <div className="td-1-head">
          <span className="td-1-eyebrow">Reviews</span>
          <h2 className="td-1-title">What Our Customers Say</h2>
          <p className="td-1-sub">Real reviews from real Pakistani homes</p>
        </div>
        <div className="td-1-grid">
          {testimonials.slice(0, 6).map((t, i) => (
            <div key={i} className="td-1-card">
              <Stars rating={t.rating} />
              <p className="td-1-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="td-1-author">
                <Avatar name={t.name} size={40} />
                <div>
                  <p className="td-1-name">{t.name}</p>
                  <p className="td-1-loc">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DESIGN 2 — Featured Carousel (premium dark)
// ═══════════════════════════════════════════════════════════

function Design2() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[active];

  return (
    <section className="td-2">
      <div className="td-2-inner">
        <div className="td-2-head">
          <span className="td-2-eyebrow">Testimonials</span>
          <h2 className="td-2-title">Loved Across Pakistan</h2>
        </div>
        <div className="td-2-card" key={active}>
          <Quote className="td-2-quote-icon" />
          <p className="td-2-quote">{t.quote}</p>
          <Stars rating={t.rating} size={18} />
          <div className="td-2-author">
            <Avatar name={t.name} size={56} />
            <div>
              <p className="td-2-name">{t.name}</p>
              <p className="td-2-loc">{t.location}</p>
            </div>
          </div>
        </div>
        <div className="td-2-nav">
          <button onClick={prev} className="td-2-arrow" aria-label="Previous"><ChevronLeft /></button>
          <div className="td-2-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`td-2-dot ${i === active ? 'td-2-dot-active' : ''}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className="td-2-arrow" aria-label="Next"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DESIGN 3 — Masonry (Pinterest-style editorial)
// ═══════════════════════════════════════════════════════════

function Design3() {
  // Varying heights for masonry effect
  const heightClasses = ['td-3-card--sm', 'td-3-card--md', 'td-3-card--lg', 'td-3-card--md', 'td-3-card--lg', 'td-3-card--sm'];

  return (
    <section className="td-3">
      <div className="td-3-inner">
        <div className="td-3-head">
          <span className="td-3-eyebrow">Customer Stories</span>
          <h2 className="td-3-title">From Real Homes</h2>
        </div>
        <div className="td-3-masonry">
          {testimonials.slice(0, 6).map((t, i) => (
            <div key={i} className={`td-3-card ${heightClasses[i]}`}>
              <div className="td-3-card-accent" />
              <Quote className="td-3-quote-icon" />
              <p className="td-3-quote">{t.quote}</p>
              <Stars rating={t.rating} size={13} />
              <div className="td-3-author">
                <Avatar name={t.name} size={36} />
                <div>
                  <p className="td-3-name">{t.name}</p>
                  <p className="td-3-loc">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DESIGN 4 — Glass Cards (modern/Linear-style)
// ═══════════════════════════════════════════════════════════

function Design4() {
  return (
    <section className="td-4">
      <div className="td-4-blob td-4-blob-1" />
      <div className="td-4-blob td-4-blob-2" />
      <div className="td-4-inner">
        <div className="td-4-head">
          <span className="td-4-eyebrow">Reviews</span>
          <h2 className="td-4-title">What People Are Saying</h2>
        </div>
        <div className="td-4-grid">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={i} className="td-4-card">
              <div className="td-4-card-glow" />
              <Stars rating={t.rating} size={16} />
              <p className="td-4-quote">{t.quote}</p>
              <div className="td-4-author">
                <Avatar name={t.name} size={44} />
                <div>
                  <p className="td-4-name">{t.name}</p>
                  <p className="td-4-loc">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DESIGN 5 — Editorial Quote (Aesop-style magazine)
// ═══════════════════════════════════════════════════════════

function Design5() {
  const [active, setActive] = useState(0);
  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[active];

  return (
    <section className="td-5">
      <div className="td-5-inner">
        <span className="td-5-eyebrow">Customer Voice</span>
        <Quote className="td-5-quote-mark" />
        <blockquote className="td-5-quote" key={active}>
          {t.quote}
        </blockquote>
        <div className="td-5-author">
          <div className="td-5-author-line" />
          <div className="td-5-author-info">
            <p className="td-5-name">{t.name}</p>
            <p className="td-5-loc">{t.location}</p>
            <Stars rating={t.rating} size={14} />
          </div>
        </div>
        <div className="td-5-nav">
          <button onClick={prev} className="td-5-arrow" aria-label="Previous"><ChevronLeft /></button>
          <span className="td-5-counter">0{active + 1} <span className="td-5-counter-sep">/</span> 0{testimonials.length}</span>
          <button onClick={next} className="td-5-arrow" aria-label="Next"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE — Tabbed
// ═══════════════════════════════════════════════════════════

const tabs = [
  { id: 0, label: 'Minimal Grid', desc: '3-col clean cards on light bg · Apple-style · 6 testimonials visible', inspir: 'Apple, Linear' },
  { id: 1, label: 'Featured Carousel', desc: 'Single large dark card · auto-rotate · arrows + dots · premium', inspir: 'Stripe, Vercel' },
  { id: 2, label: 'Masonry', desc: 'Pinterest-style varying heights · gold accent bar · editorial', inspir: 'Pinterest, Medium' },
  { id: 3, label: 'Glass Cards', desc: 'Glassmorphic cards on animated gradient bg · 3 testimonials · modern', inspir: 'Linear, Framer' },
  { id: 4, label: 'Editorial Quote', desc: 'Single huge quote · magazine-style · minimal · arrows + counter', inspir: 'Aesop, MR PORTER' },
];

export default function TestimonialDemosPage() {
  const [activeTab, setActiveTab] = useState(0);
  const designs = [Design1, Design2, Design3, Design4, Design5];
  const ActiveDesign = designs[activeTab];

  return (
    <div className="w-full">
      {/* Tab selector */}
      <header className="td-chrome">
        <div className="td-chrome-inner">
          <div className="td-chrome-row1">
            <span className="td-chrome-brand">
              Aura<span className="td-chrome-brand-dot">.</span>
              <span className="td-chrome-brand-sub">Testimonial Lab</span>
            </span>
            <div className="td-chrome-sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`td-chrome-section ${activeTab === tab.id ? 'td-chrome-section-active' : ''}`}
                >
                  {tab.id + 1}. {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Active design */}
      <div key={activeTab}>
        <ActiveDesign />
      </div>

      {/* Info bar */}
      <footer className="td-chrome-info">
        <div className="td-chrome-info-inner">
          <span className="td-chrome-info-section">Design {activeTab + 1}</span>
          <span className="td-chrome-info-sep">·</span>
          <span className="td-chrome-info-variant">{tabs[activeTab].label}</span>
          <p className="td-chrome-info-desc">{tabs[activeTab].desc}</p>
          <p className="td-chrome-info-inspir">Inspired by: {tabs[activeTab].inspir}</p>
          <div className="td-chrome-info-pill">
            <span className="td-chrome-info-pill-text">
              Reply with number {activeTab + 1} if you like this design
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
