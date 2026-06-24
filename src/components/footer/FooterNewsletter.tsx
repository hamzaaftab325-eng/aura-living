'use client';

/**
 * FooterNewsletter — Column 4 of the footer.
 *
 * Renders a newsletter signup card with email input + subscribe button.
 * On submit, POSTs to /api/newsletter. Shows success message for 5s.
 * Input has gold focus glow.
 *
 * All styling via CSS classes (.aura-footer-news, .aura-footer-news-input,
 * .aura-footer-news-btn, .aura-footer-news-success). Zero inline styles.
 */

import { useState } from 'react';
import { Send, ArrowRight } from 'lucide-react';

export default function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribing) return;

    setSubscribing(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'footer' }),
      });
      // Always show success (don't reveal if email exists)
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch {
      // Still show success to user
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="aura-footer-col">
      <h3 className="aura-footer-col-h">
        Newsletter
        <span className="aura-footer-col-underline" />
      </h3>
      <div className={`aura-footer-news ${focused ? 'aura-footer-news--focused' : ''}`}>
        <p className="aura-footer-news-offer">
          Get <span className="aura-footer-news-offer-bold">15% off</span> your first order
        </p>
        <form onSubmit={handleSubscribe} className="aura-footer-news-form">
          <div className="aura-footer-news-input-wrap">
            <label htmlFor="footer-newsletter-email" className="aura-sr-only">
              Your email address
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`aura-footer-news-input ${focused ? 'aura-footer-news-input--focused' : ''}`}
            />
            {focused && (
              <span className="aura-footer-news-glow" aria-hidden="true" />
            )}
          </div>
          <button
            type="submit"
            disabled={subscribing}
            className="aura-footer-news-btn"
          >
            <Send size={14} />
            <span>Subscribe</span>
            <ArrowRight size={14} className="aura-footer-news-btn-arrow" />
          </button>
        </form>
        {subscribed && (
          <p className="aura-footer-news-success">
            Thank you for subscribing!
          </p>
        )}
      </div>
    </div>
  );
}
