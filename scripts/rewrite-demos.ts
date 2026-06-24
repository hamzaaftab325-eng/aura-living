// Script: rewrite the Nav1-4 + Footer1-4 component block in bento-demos/page.tsx
// Replaces lines 696-1053 (from `const navLinks =` to the closing `}` of Footer4)
// with new premium 10/10 designs.

import * as fs from 'fs';

const FILE = '/home/z/my-project/src/app/bento-demos/page.tsx';
const src = fs.readFileSync(FILE, 'utf8');

// Find the start marker (the NAV DEMOS comment block) and the end marker (the MAIN PAGE comment block)
const startMarker = '// ═══════════════════════════════════════════════════════════\n// NAV DEMOS (4) — 10/10 navigation designs\n// ═══════════════════════════════════════════════════════════\n\n';
const endMarker = '\n// ═══════════════════════════════════════════════════════════\n// MAIN PAGE\n// ═══════════════════════════════════════════════════════════\n';

const startIdx = src.indexOf(startMarker);
const endIdx = src.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found', { startIdx, endIdx });
  process.exit(1);
}

console.log(`Replacing bytes ${startIdx}..${endIdx + endMarker.length} (length ${endIdx + endMarker.length - startIdx})`);

const NEW_BLOCK = `// ═══════════════════════════════════════════════════════════
// NAV DEMOS (4) — Premium 10/10 designs (Aesop / MR PORTER / SSENSE inspired)
// ═══════════════════════════════════════════════════════════

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function Nav1() {
  // Editorial Center Split — Aesop-style. Logo centered, links split L/R.
  // Slim gold baseline animates width on scroll. Icons at far right with cart count badge.
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const onScroll = () => {
      if (!ref.current) return;
      if (window.scrollY > 40) ref.current.classList.add('demo-nav1-scrolled');
      else ref.current.classList.remove('demo-nav1-scrolled');
      // Animate the gold baseline width based on scroll
      const baseline = ref.current.querySelector('.demo-nav1-baseline');
      if (baseline) {
        const w = Math.min(100, window.scrollY / 4);
        (baseline as HTMLElement).style.width = w + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, { scope: ref });

  const leftLinks = navLinks.slice(0, 2);
  const rightLinks = navLinks.slice(2);

  return (
    <div ref={ref} className="demo-nav1">
      <div className="demo-nav1-baseline" />
      <div className="demo-nav1-inner">
        <nav className="demo-nav1-side demo-nav1-left">
          {leftLinks.map((l, i) => (
            <Link key={l.href} href={l.href} className={\`demo-nav1-link \${i === 0 ? 'demo-nav1-link-active' : ''}\`}>
              <span className="demo-nav1-link-num">0{i + 1}</span>
              <span className="demo-nav1-link-text">{l.label}</span>
            </Link>
          ))}
        </nav>
        <Link href="/" className="demo-nav1-logo">
          <span className="demo-nav1-logo-aura">Aura</span>
          <span className="demo-nav1-logo-dot">.</span>
          <span className="demo-nav1-logo-sub">Living</span>
        </Link>
        <nav className="demo-nav1-side demo-nav1-right">
          {rightLinks.map((l) => (
            <Link key={l.href} href={l.href} className="demo-nav1-link">
              <span className="demo-nav1-link-text">{l.label}</span>
            </Link>
          ))}
          <div className="demo-nav1-icons">
            <button className="demo-nav1-icon-btn" aria-label="Search"><Search className="demo-nav1-icon" /></button>
            <button className="demo-nav1-icon-btn" aria-label="Account"><User className="demo-nav1-icon" /></button>
            <button className="demo-nav1-icon-btn demo-nav1-cart" aria-label="Cart">
              <ShoppingBag className="demo-nav1-icon" />
              <span className="demo-nav1-cart-count">3</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

function Nav2() {
  // Floating Glass Bar — Apple Store-style. Frosted glass bar with category mega-dropdowns.
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  return (
    <div className="demo-nav2" onMouseLeave={() => setOpenMenu(null)}>
      <div className="demo-nav2-glow" />
      <div className="demo-nav2-inner">
        <Link href="/" className="demo-nav2-logo">
          <span className="demo-nav2-logo-mark">A</span>
          <span className="demo-nav2-logo-text">Aura Living</span>
        </Link>
        <nav className="demo-nav2-links">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={\`demo-nav2-link \${openMenu === i ? 'demo-nav2-link-open' : ''}\`}
              onMouseEnter={() => setOpenMenu(i === 1 ? i : null)}
            >
              {l.label}
              {i === 1 && <ChevronDown className="demo-nav2-chev" />}
            </Link>
          ))}
        </nav>
        <div className="demo-nav2-actions">
          <button className="demo-nav2-icon-btn" aria-label="Search"><Search className="demo-nav2-icon" /></button>
          <button className="demo-nav2-icon-btn" aria-label="Cart"><ShoppingBag className="demo-nav2-icon" /><span className="demo-nav2-badge">3</span></button>
          <button className="demo-nav2-cta">Shop Now <ArrowRight className="demo-nav2-cta-arrow" /></button>
        </div>
      </div>
      {openMenu === 1 && (
        <div className="demo-nav2-mega" onMouseEnter={() => setOpenMenu(1)} onMouseLeave={() => setOpenMenu(null)}>
          <div className="demo-nav2-mega-inner">
            <div className="demo-nav2-mega-col">
              <span className="demo-nav2-mega-h">Categories</span>
              {['Lighting', 'Plants & Pots', 'Vases & Decor', 'Candles & Fragrance', 'Wall Art & Mirrors', 'Kitchen & Dining'].map((c) => (
                <Link key={c} href="/shop" className="demo-nav2-mega-link">
                  <span>{c}</span>
                  <ArrowUpRight className="demo-nav2-mega-arrow" />
                </Link>
              ))}
            </div>
            <div className="demo-nav2-mega-col">
              <span className="demo-nav2-mega-h">Featured</span>
              <Link href="/shop" className="demo-nav2-mega-feature">
                <Image src="/images/categories/lighting-category.webp" alt="Featured" fill className="demo-nav2-mega-img" />
                <div className="demo-nav2-mega-feature-overlay" />
                <div className="demo-nav2-mega-feature-content">
                  <span className="demo-nav2-mega-feature-eyebrow">New Collection</span>
                  <p className="demo-nav2-mega-feature-title">Lighting 2026</p>
                  <span className="demo-nav2-mega-feature-cta">Discover <ArrowRight className="demo-nav2-mega-arrow" /></span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Nav3() {
  // Full-Screen Takeover — SSENSE / Off-White-style. Minimal top bar, hamburger opens full-screen menu
  // with HUGE editorial typography (8vw), image preview on right, staggered GSAP reveal.
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current || !open) return;
    const tl = gsap.timeline();
    tl.fromTo('.demo-nav3-line', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power4.out' });
    tl.fromTo('.demo-nav3-item', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' }, '-=0.3');
    tl.fromTo('.demo-nav3-foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref, dependencies: [open] });

  return (
    <div ref={ref} className="demo-nav3">
      <div className="demo-nav3-bar">
        <Link href="/" className="demo-nav3-logo">
          <span className="demo-nav3-logo-aura">Aura</span>
          <span className="demo-nav3-logo-dot">.</span>
        </Link>
        <button className="demo-nav3-trigger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="demo-nav3-trigger-label">{open ? 'Close' : 'Menu'}</span>
          <span className="demo-nav3-trigger-icon">
            <span className={\`demo-nav3-trigger-line \${open ? 'demo-nav3-trigger-line-1' : ''}\`} />
            <span className={\`demo-nav3-trigger-line \${open ? 'demo-nav3-trigger-line-2' : ''}\`} />
          </span>
        </button>
      </div>
      {open && (
        <div className="demo-nav3-overlay">
          <div className="demo-nav3-overlay-inner">
            <nav className="demo-nav3-list">
              {navLinks.map((l, i) => (
                <Link key={l.href} href={l.href} className="demo-nav3-item" onClick={() => setOpen(false)}>
                  <span className="demo-nav3-item-num">0{i + 1}</span>
                  <span className="demo-nav3-item-text">{l.label}</span>
                  <ArrowRight className="demo-nav3-item-arrow" />
                </Link>
              ))}
            </nav>
            <div className="demo-nav3-foot">
              <div className="demo-nav3-foot-left">
                <span className="demo-nav3-foot-h">Get in touch</span>
                <a href="mailto:hello@aura-living.pk" className="demo-nav3-foot-mail">hello@aura-living.pk</a>
                <span className="demo-nav3-foot-loc">Lahore, Pakistan</span>
              </div>
              <div className="demo-nav3-foot-right">
                <span className="demo-nav3-foot-h">Follow</span>
                <div className="demo-nav3-foot-socials">
                  <Instagram className="demo-nav3-foot-social" />
                  <Facebook className="demo-nav3-foot-social" />
                  <Twitter className="demo-nav3-foot-social" />
                </div>
              </div>
            </div>
            <span className="demo-nav3-line demo-nav3-line-1" />
            <span className="demo-nav3-line demo-nav3-line-2" />
          </div>
        </div>
      )}
    </div>
  );
}

function Nav4() {
  // Sticky Mega Grid — MR PORTER-style. Refined sticky bar with editorial mega dropdown.
  // Mega menu has 3 cols: category list / featured product / new arrivals mini-list.
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-nav4" onMouseLeave={() => setOpen(false)}>
      <div className="demo-nav4-inner">
        <div className="demo-nav4-left">
          <Link href="/" className="demo-nav4-logo">
            <span className="demo-nav4-logo-aura">Aura</span>
            <span className="demo-nav4-logo-dot">.</span>
            <span className="demo-nav4-logo-sub">Living</span>
          </Link>
        </div>
        <nav className="demo-nav4-links">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={\`demo-nav4-link \${i === 1 ? 'demo-nav4-link-active' : ''}\`}
              onMouseEnter={() => setOpen(i === 1)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="demo-nav4-right">
          <button className="demo-nav4-icon-btn" aria-label="Search"><Search className="demo-nav4-icon" /></button>
          <button className="demo-nav4-icon-btn" aria-label="Account"><User className="demo-nav4-icon" /></button>
          <button className="demo-nav4-icon-btn demo-nav4-cart" aria-label="Cart">
            <ShoppingBag className="demo-nav4-icon" />
            <span className="demo-nav4-cart-count">3</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="demo-nav4-mega" onMouseEnter={() => setOpen(true)}>
          <div className="demo-nav4-mega-inner">
            <div className="demo-nav4-mega-col demo-nav4-mega-col-list">
              <span className="demo-nav4-mega-h">Shop by Category</span>
              {[
                { name: 'Lighting', desc: 'Lamps, pendants & sconces' },
                { name: 'Plants & Pots', desc: 'Indoor greenery & planters' },
                { name: 'Vases & Decor', desc: 'Artisan ceramics & accents' },
                { name: 'Candles & Fragrance', desc: 'Scented candles & holders' },
                { name: 'Wall Art & Mirrors', desc: 'Framed art & mirrors' },
                { name: 'Kitchen & Dining', desc: 'Tableware & serving' },
              ].map((c) => (
                <Link key={c.name} href="/shop" className="demo-nav4-mega-cat">
                  <div>
                    <span className="demo-nav4-mega-cat-name">{c.name}</span>
                    <span className="demo-nav4-mega-cat-desc">{c.desc}</span>
                  </div>
                  <ArrowRight className="demo-nav4-mega-cat-arrow" />
                </Link>
              ))}
            </div>
            <div className="demo-nav4-mega-col demo-nav4-mega-col-feature">
              <Link href="/shop" className="demo-nav4-mega-feature">
                <Image src="/images/categories/lighting-category.webp" alt="Featured" fill className="demo-nav4-mega-img" />
                <div className="demo-nav4-mega-feature-overlay" />
                <div className="demo-nav4-mega-feature-content">
                  <span className="demo-nav4-mega-feature-eyebrow">Featured Collection</span>
                  <p className="demo-nav4-mega-feature-title">The Lighting Edit 2026</p>
                  <span className="demo-nav4-mega-feature-cta">Discover Now <ArrowRight className="demo-nav4-mega-arrow" /></span>
                </div>
              </Link>
            </div>
            <div className="demo-nav4-mega-col demo-nav4-mega-col-new">
              <span className="demo-nav4-mega-h">New Arrivals</span>
              {[
                { name: 'Brass Table Lamp', price: 'Rs. 9,999' },
                { name: 'Smoked Glass Pendant', price: 'Rs. 14,499' },
                { name: 'Terracotta Herb Pot', price: 'Rs. 2,499' },
                { name: 'Marble Vase', price: 'Rs. 5,999' },
              ].map((p) => (
                <Link key={p.name} href="/shop" className="demo-nav4-mega-new">
                  <span className="demo-nav4-mega-new-name">{p.name}</span>
                  <span className="demo-nav4-mega-new-price">{p.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FOOTER DEMOS (4) — Premium 10/10 designs (SSENSE / MR PORTER / Aesop / COS inspired)
// ═══════════════════════════════════════════════════════════

function Footer1() {
  // Editorial Big Type — SSENSE-style. Massive wordmark filling top half.
  // Gold gradient text fill. 4 link columns. Inline newsletter. Atmospheric dark bg.
  return (
    <footer className="demo-footer1">
      <div className="demo-footer1-glow" />
      <div className="demo-footer1-inner">
        <div className="demo-footer1-mega-row">
          <span className="demo-footer1-mega-eyebrow">
            <span className="demo-footer1-line" /> Handcrafted in Pakistan <span className="demo-footer1-line" />
          </span>
          <h2 className="demo-footer1-mega" aria-label="Aura Living">
            AURA LIVING
          </h2>
          <p className="demo-footer1-mega-tag">
            Modern Pakistani home decor, handcrafted one piece at a time.
          </p>
        </div>
        <div className="demo-footer1-grid">
          <div className="demo-footer1-col">
            <span className="demo-footer1-h">Shop</span>
            <Link href="/shop">All Products</Link>
            <Link href="/shop?category=lighting">Lighting</Link>
            <Link href="/shop?category=plants">Plants & Pots</Link>
            <Link href="/shop?category=vases">Vases & Decor</Link>
            <Link href="/sale">Sale</Link>
          </div>
          <div className="demo-footer1-col">
            <span className="demo-footer1-h">Company</span>
            <Link href="/about">About Us</Link>
            <Link href="/blog">Journal</Link>
            <Link href="/care-guide">Care Guide</Link>
            <Link href="/lookbook">Lookbook</Link>
          </div>
          <div className="demo-footer1-col">
            <span className="demo-footer1-h">Help</span>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="demo-footer1-col demo-footer1-col-news">
            <span className="demo-footer1-h">Newsletter</span>
            <p className="demo-footer1-news-sub">10% off your first order. New arrivals every week.</p>
            <form className="demo-footer1-news-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" required className="demo-footer1-news-input" />
              <button type="submit" className="demo-footer1-news-btn" aria-label="Subscribe">
                <ArrowRight className="demo-footer1-news-arrow" />
              </button>
            </form>
          </div>
        </div>
        <div className="demo-footer1-bottom">
          <span className="demo-footer1-copy">© 2026 Aura Living — Lahore, Pakistan</span>
          <div className="demo-footer1-socials">
            <Instagram className="demo-footer1-social" />
            <Facebook className="demo-footer1-social" />
            <Twitter className="demo-footer1-social" />
          </div>
          <div className="demo-footer1-pay">
            <span className="demo-footer1-pay-chip">COD</span>
            <span className="demo-footer1-pay-chip">VISA</span>
            <span className="demo-footer1-pay-chip">MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer2() {
  // Asymmetric Magazine — Aesop-style. 60/40 split: brand mark + tagline left, 3 link cols right.
  // Atmospheric cream→gold gradient bg. Big social circles. Refined editorial typography.
  return (
    <footer className="demo-footer2">
      <div className="demo-footer2-inner">
        <div className="demo-footer2-top">
          <div className="demo-footer2-brand">
            <span className="demo-footer2-eyebrow">
              <span className="demo-footer2-line" /> Aura Living <span className="demo-footer2-line" />
            </span>
            <h2 className="demo-footer2-brand-mark">Made with<br />love, in<br />Lahore.</h2>
            <p className="demo-footer2-brand-tag">
              Handcrafted decor for the modern Pakistani home. Each piece is made by skilled artisans using
              time-honored techniques and premium materials.
            </p>
            <div className="demo-footer2-socials">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="demo-footer2-social" aria-label="Social">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div className="demo-footer2-cols">
            <div className="demo-footer2-col">
              <span className="demo-footer2-h">Shop</span>
              <Link href="/shop">All Products</Link>
              <Link href="/new-arrivals">New Arrivals</Link>
              <Link href="/sale">Sale</Link>
              <Link href="/lookbook">Lookbook</Link>
            </div>
            <div className="demo-footer2-col">
              <span className="demo-footer2-h">Company</span>
              <Link href="/about">Our Story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/care-guide">Care Guide</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="demo-footer2-col">
              <span className="demo-footer2-h">Help</span>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="demo-footer2-news-strip">
          <div>
            <span className="demo-footer2-news-h">Stay in the loop</span>
            <p className="demo-footer2-news-sub">Get 10% off your first order + early access to new arrivals.</p>
          </div>
          <form className="demo-footer2-news-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required className="demo-footer2-news-input" />
            <button type="submit" className="demo-footer2-news-btn">Subscribe <ArrowRight className="demo-footer2-news-arrow" /></button>
          </form>
        </div>
        <div className="demo-footer2-bottom">
          <span>© 2026 Aura Living</span>
          <span className="demo-footer2-bottom-mid">Lahore · Karachi · Islamabad — Nationwide COD</span>
          <div className="demo-footer2-pay">
            <span className="demo-footer2-pay-chip">COD</span>
            <span className="demo-footer2-pay-chip">VISA</span>
            <span className="demo-footer2-pay-chip">MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer3() {
  // Stacked CTA Dark — Apple-style. Top: massive "Stay Connected" CTA + newsletter.
  // Middle: 3 col links + brand col. Bottom: condensed link row + socials + copyright.
  // Dark bg with floating ambient gold orbs.
  return (
    <footer className="demo-footer3">
      <div className="demo-footer3-orb demo-footer3-orb-1" />
      <div className="demo-footer3-orb demo-footer3-orb-2" />
      <div className="demo-footer3-inner">
        <div className="demo-footer3-cta">
          <span className="demo-footer3-eyebrow">
            <span className="demo-footer3-line" /> Stay Connected <span className="demo-footer3-line" />
          </span>
          <h2 className="demo-footer3-cta-title">Be the first to<br /><span className="demo-footer3-cta-accent">know.</span></h2>
          <p className="demo-footer3-cta-sub">New arrivals, sales, and styling tips — straight to your inbox.</p>
          <form className="demo-footer3-cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" required className="demo-footer3-cta-input" />
            <button type="submit" className="demo-footer3-cta-btn">Subscribe <ArrowRight className="demo-footer3-cta-arrow" /></button>
          </form>
        </div>
        <div className="demo-footer3-divider" />
        <div className="demo-footer3-grid">
          <div className="demo-footer3-brand-col">
            <Link href="/" className="demo-footer3-logo">
              <span className="demo-footer3-logo-aura">Aura</span>
              <span className="demo-footer3-logo-dot">.</span>
              <span className="demo-footer3-logo-sub">Living</span>
            </Link>
            <p className="demo-footer3-brand-tag">Handcrafted decor for the modern Pakistani home.</p>
            <div className="demo-footer3-socials">
              <Instagram className="demo-footer3-social" />
              <Facebook className="demo-footer3-social" />
              <Twitter className="demo-footer3-social" />
            </div>
          </div>
          <div className="demo-footer3-cols">
            <div className="demo-footer3-col">
              <span className="demo-footer3-h">Shop</span>
              <Link href="/shop">All Products</Link>
              <Link href="/new-arrivals">New Arrivals</Link>
              <Link href="/sale">Sale</Link>
              <Link href="/lookbook">Lookbook</Link>
            </div>
            <div className="demo-footer3-col">
              <span className="demo-footer3-h">Help</span>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="demo-footer3-col">
              <span className="demo-footer3-h">Company</span>
              <Link href="/about">Our Story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/care-guide">Care Guide</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="demo-footer3-bottom">
          <span>© 2026 Aura Living — Handcrafted in Pakistan</span>
          <div className="demo-footer3-bottom-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer4() {
  // Minimal Grid Light — COS-style. Clean cream bg, asymmetric grid.
  // Brand statement + 2 link cols + minimal newsletter. Lots of whitespace.
  // Subtle hover animations, refined typography, thin gold dividers.
  return (
    <footer className="demo-footer4">
      <div className="demo-footer4-inner">
        <div className="demo-footer4-grid">
          <div className="demo-footer4-brand-col">
            <Link href="/" className="demo-footer4-logo">
              <span className="demo-footer4-logo-aura">Aura</span>
              <span className="demo-footer4-logo-dot">.</span>
            </Link>
            <p className="demo-footer4-tag">Handcrafted decor, made in Pakistan.</p>
            <form className="demo-footer4-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email for 10% off" required className="demo-footer4-input" />
              <button type="submit" className="demo-footer4-submit" aria-label="Subscribe">
                <ArrowRight className="demo-footer4-submit-icon" />
              </button>
            </form>
          </div>
          <div className="demo-footer4-cols">
            <div className="demo-footer4-col">
              <span className="demo-footer4-h">Shop</span>
              <Link href="/shop">All</Link>
              <Link href="/new-arrivals">New</Link>
              <Link href="/sale">Sale</Link>
              <Link href="/lookbook">Lookbook</Link>
            </div>
            <div className="demo-footer4-col">
              <span className="demo-footer4-h">About</span>
              <Link href="/about">Story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/care-guide">Care</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="demo-footer4-col">
              <span className="demo-footer4-h">Help</span>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="demo-footer4-strip">
          <div className="demo-footer4-socials">
            <Instagram className="demo-footer4-social" />
            <Facebook className="demo-footer4-social" />
            <Twitter className="demo-footer4-social" />
          </div>
          <span className="demo-footer4-copy">© 2026 Aura Living</span>
          <div className="demo-footer4-pay">
            <span className="demo-footer4-pay-chip">COD</span>
            <span className="demo-footer4-pay-chip">VISA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
`;

const newSrc = src.slice(0, startIdx) + NEW_BLOCK + src.slice(endIdx + endMarker.length);
fs.writeFileSync(FILE, newSrc);
console.log(`Wrote ${newSrc.length} bytes`);
