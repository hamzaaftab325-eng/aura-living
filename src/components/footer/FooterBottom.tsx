'use client';

/**
 * FooterBottom — the bottom bar of the footer.
 *
 * Renders: copyright, Terms/Privacy links, and payment methods list.
 *
 * All styling via CSS classes (.aura-footer-bottom, .aura-footer-bottom-copy,
 * .aura-footer-pay, .aura-footer-pay-chip). Zero inline styles.
 */

import Link from 'next/link';

interface FooterBottomProps {
  paymentMethods: string[];
}

export default function FooterBottom({ paymentMethods }: FooterBottomProps) {
  return (
    <div className="aura-footer-bottom">
      <p className="aura-footer-bottom-copy">
        &copy; {new Date().getFullYear()} Aura Living. All rights reserved.
      </p>
      <div className="aura-footer-bottom-links">
        <Link href="/terms" className="aura-footer-bottom-link">
          Terms of Service
        </Link>
        <Link href="/privacy" className="aura-footer-bottom-link">
          Privacy Policy
        </Link>
      </div>
      <div className="aura-footer-pay">
        <span className="aura-footer-pay-label">We accept:</span>
        {paymentMethods.map((method, i) => (
          <span key={method} className="aura-footer-pay-item">
            <span className="aura-footer-pay-chip">{method}</span>
            {i < paymentMethods.length - 1 && (
              <span className="aura-footer-pay-dot" aria-hidden="true">•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
