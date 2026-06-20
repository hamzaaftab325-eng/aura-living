import { ImageResponse } from 'next/og';

/**
 * Shared OG image layout for Aura Living.
 * Generates a 1200x630 branded thumbnail with:
 * - Dark charcoal background with gold gradient accents
 * - "Aura Living" logo text in gold
 * - Page title in large serif font
 * - Optional subtitle
 * - Gold decorative elements
 *
 * Usage:
 *   export const runtime = 'edge';
 *   export const alt = 'About | Aura Living';
 *   export const size = { width: 1200, height: 630 };
 *   export const contentType = 'image/png';
 *   export default async function Image() {
 *     return ogImageLayout({ title: 'Our Story', subtitle: '...' });
 *   }
 */
export function ogImageLayout({
  title,
  subtitle,
  category,
}: {
  title: string;
  subtitle?: string;
  category?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Gold top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 20%, #E0BD4A 50%, #D4AF37 80%, transparent 100%)',
          }}
        />

        {/* Gold corner decoration — top right */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '80px',
            height: '80px',
            borderTop: '2px solid rgba(212, 175, 55, 0.3)',
            borderRight: '2px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
          }}
        />

        {/* Gold corner decoration — bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '80px',
            height: '80px',
            borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
            borderLeft: '2px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
          }}
        />

        {/* ─── Header: Logo ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Gold circle logo mark */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: '#2C2C2C',
              fontFamily: 'serif',
            }}
          >
            A
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#D4AF37',
                letterSpacing: '0.02em',
                fontFamily: 'serif',
              }}
            >
              Aura Living
            </span>
            <span
              style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              Premium Home Decor
            </span>
          </div>
        </div>

        {/* ─── Center: Title + Subtitle ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
          {/* Category badge */}
          {category && (
            <div style={{ display: 'flex' }}>
              <span
                style={{
                  display: 'flex',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </span>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 40 ? '48px' : '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'serif',
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Gold divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37' }} />
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: '22px',
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {subtitle.length > 120 ? subtitle.substring(0, 117) + '...' : subtitle}
            </div>
          )}
        </div>

        {/* ─── Footer: URL ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.05em',
            }}
          >
            auraliving.com
          </span>
          <span
            style={{
              fontSize: '14px',
              color: 'rgba(212, 175, 55, 0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Where Comfort Meets Style
          </span>
        </div>

        {/* Gold bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 20%, #E0BD4A 50%, #D4AF37 80%, transparent 100%)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

/**
 * Product-specific OG image layout.
 * Includes product image, name, price, and brand.
 */
export function ogProductImage({
  name,
  price,
  category,
  image,
}: {
  name: string;
  price: string;
  category: string;
  image?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Gold top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, transparent, #D4AF37 50%, transparent)',
          }}
        />

        {/* Left side — product info */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 60px 60px 80px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: '#2C2C2C',
                fontFamily: 'serif',
              }}
            >
              A
            </div>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#D4AF37', fontFamily: 'serif' }}>
              Aura Living
            </span>
          </div>

          {/* Product details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span
              style={{
                display: 'flex',
                padding: '5px 14px',
                borderRadius: '16px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#D4AF37',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                width: 'fit-content',
              }}
            >
              {category}
            </span>
            <div
              style={{
                fontSize: name.length > 30 ? '40px' : '52px',
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'serif',
                lineHeight: 1.1,
              }}
            >
              {name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '2px', background: '#D4AF37' }} />
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#D4AF37' }}>{price}</div>
            </div>
          </div>

          {/* Footer */}
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>auraliving.com</span>
        </div>

        {/* Right side — gold accent panel */}
        <div
          style={{
            width: '380px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)',
            borderLeft: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div
            style={{
              fontSize: '120px',
              fontWeight: 700,
              color: 'rgba(212, 175, 55, 0.15)',
              fontFamily: 'serif',
            }}
          >
            AL
          </div>
        </div>

        {/* Gold bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, transparent, #D4AF37 50%, transparent)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
