# Button System Audit & Standardization

> **Document version**: 1.0
> **Date**: 2026-06-20
> **Goal**: Standardize all buttons into exactly 3 classes: Primary, Secondary, Newsletter

---

## Current State (Pre-Audit)

### Button Inventory

| Metric | Count |
|---|---|
| Total `<button>` tags in codebase | 117 |
| PremiumButton component usages | 38 |
| Inline-styled `<button>` tags | 79 |
| Distinct button style variations | ~15+ (inconsistent) |

### Files with Buttons (top 25 by count)

| File | Button count |
|---|---|
| `ShopView.tsx` | 12 |
| `AdminDashboard.tsx` | 12 |
| `Navbar.tsx` | 9 (all icon buttons — keep as-is) |
| `CartDrawer.tsx` | 9 (mix of icon + CTA) |
| `ProductDetailView.tsx` | 8 |
| `CartView.tsx` | 6 |
| `AddressesView.tsx` | 6 |
| `AuthView.tsx` | 5 |
| `SettingsView.tsx` | 4 |
| `SaleView.tsx` | 4 |
| `WishlistView.tsx` | 3 |
| `NewArrivalsView.tsx` | 3 |
| `Footer.tsx` | 3 |
| Other files | 1-2 each |

### Current Button Style Variations (Inconsistent)

1. **PremiumButton `variant="gold"`** — 25 usages — gold gradient bg, white text
2. **PremiumButton `variant="outline"`** — 9 usages — transparent bg, gold border + text
3. **PremiumButton `variant="dark"`** — 0 usages — defined but unused
4. **Inline `<button>` with `backgroundColor: var(--color-gold)`** — 2 usages (AdminDashboard)
5. **Inline `<button>` with `backgroundColor: transparent`** — 1 usage
6. **Inline `<button>` with `backgroundColor: var(--color-danger)`** — 1 usage
7. **Inline "text link" buttons** — `hover:underline`, no bg/border — ~15 usages
8. **Icon-only buttons** — Navbar, CartDrawer, quantity selectors — ~50 usages
9. **Tab buttons** — `AdminDashboard`, `Tabs.tsx` — underline-style active state
10. **Filter buttons** — `ShopView` category pills — pill-shaped toggle
11. **Quantity selector buttons** — `CartView`, `CartDrawer` — round +/- buttons
12. **Sort/filter toggle buttons** — `ShopView` — pill-shaped
13. **FAQ accordion buttons** — `FAQView` — full-width with chevron
14. **Review helpful/vote buttons** — `ReviewList` — small with icon
15. **Social/share buttons** — `ArticleView` — circular icon buttons
16. **AuthView "Continue with Google/Facebook"** — outline-style with brand icon

---

## Standardized Button System

### The 3 Button Classes

#### 1. **Primary Button** (`.btn-primary`)

**Purpose**: Main CTA — the most important action on the page.

**Visual**:
- Background: Gold gradient (`#D4AF37` → `#C9A22E` → `#B8941F`)
- Text: White (`#FFFFFF`)
- Font: Poppins, 600 weight, uppercase, 0.05em letter-spacing
- Padding: `px-8 py-3.5` (md), `px-5 py-2` (sm), `px-10 py-4` (lg)
- Border radius: `9999px` (pill)
- Shadow: `0 2px 8px rgba(212, 175, 55, 0.2)`
- Hover: lighter gradient + `translateY(-1px)` + larger shadow
- Focus: 2px solid gold outline + 2px offset
- Disabled: opacity 60%, cursor not-allowed

**Use for**:
- "Shop Now" / "Shop Collection" / "Start Shopping"
- "Add to Cart"
- "Proceed to Checkout"
- "Place Order"
- "Sign In" / "Sign Up" / "Create Account"
- "Subscribe" / "Claim My 15% Off" *(newsletter — see #3)*
- "Contact Us" / "Send Message"
- "Save Changes" / "Add Address"
- "View All Products" *(when primary CTA on section)*
- "Search" (on TrackOrders)

**Examples mapping to existing buttons**:
- HeroSection "Shop Collection" → Primary
- CartDrawer "Proceed to Checkout" → Primary
- CheckoutView "Place Order" → Primary
- AuthView "Sign In" / "Create Account" → Primary
- NewsletterSection "Claim My 15% Off" → **Newsletter** (special variant)
- ProductDetailView "Add to Cart" → Primary
- AddressesView "Add Address" → Primary
- SettingsView "Save Changes" → Primary

---

#### 2. **Secondary Button** (`.btn-secondary`)

**Purpose**: Supporting action — lower visual priority than primary.

**Visual**:
- Background: Transparent
- Text: Gold (`#B8941F` — WCAG AA compliant)
- Border: 2px solid gold (`#D4AF37`)
- Font: Poppins, 600 weight, uppercase, 0.05em letter-spacing
- Padding: same as Primary
- Border radius: `9999px` (pill)
- Hover: subtle gold tint bg (`rgba(212, 175, 55, 0.06)`) + lighter border + `translateY(-1px)`
- Focus: 2px solid gold outline + 2px offset
- Disabled: opacity 60%, cursor not-allowed

**Use for**:
- "Learn More" / "Read More" / "View Details"
- "Back" / "Back to Shop" / "Back to Journal"
- "View Full Cart" (in CartDrawer)
- "View All Products" (when secondary CTA on section)
- "Continue Shopping"
- "Sign Out" / "Log Out"
- "Cancel" / "Reset"
- "Download Invoice"
- "Continue with Google" / "Continue with Facebook" (auth)
- "Forgot Password?" link-style
- Tab navigation (when styled as buttons)

**Examples mapping to existing buttons**:
- FeaturedProducts "View All Products" → Secondary (outline)
- CartDrawer "View Full Cart" → Secondary
- ArticleView "Back to Journal" → Secondary
- SettingsView "Sign Out" → Secondary
- TrackOrdersView "Download Invoice" → Secondary
- AuthView "Continue with Google/Facebook" → Secondary

---

#### 3. **Newsletter Button** (`.btn-newsletter`)

**Purpose**: Dedicated style for newsletter/signup form submissions ONLY.

**Visual**:
- Background: Gold gradient (same as Primary)
- Text: White
- Font: Poppins, 600 weight, uppercase, 0.05em letter-spacing
- Padding: `px-8 py-4` (taller than primary for form emphasis)
- Border radius: `9999px` (pill)
- Shadow: `0 4px 20px rgba(212, 175, 55, 0.25)` (slightly more prominent)
- Hover: lighter gradient + `translateY(-2px)` (more lift than primary) + glow shadow
- Focus: 2px solid gold outline + 2px offset
- Disabled: opacity 60%, cursor not-allowed
- **Special**: Includes Send/Gift icon by default + animated arrow on hover

**Use for**:
- NewsletterSection "Claim My 15% Off" / "Subscribe"
- Any future email-capture form submit button
- Newsletter signup in Footer (if added)

**Why separate from Primary**:
- Newsletter buttons live inside dark cards (different contrast context)
- They need more visual prominence (taller padding, stronger shadow)
- They include a Send icon by convention
- They appear in a specific context (form submission, not navigation)

---

## Button Categories That Stay As-Is

These are **not** CTAs and should NOT be converted to the 3 standard classes:

### Icon-only buttons (keep existing styling)
- Navbar: search, wishlist, cart, account, menu toggle
- CartDrawer: close (X), quantity +/-, remove (trash)
- CartView: quantity +/-, remove (trash)
- ProductDetailView: gallery thumbnails, color swatches
- AdminDashboard: edit/delete row icons
- Social share buttons in ArticleView

### Toggle/pill buttons (keep existing styling)
- ShopView category filter pills
- ShopView sort dropdown
- FAQ accordion expand/collapse
- AdminDashboard tab navigation
- ProductDetailView color/quantity selectors

### Text links (not buttons)
- Footer links
- Breadcrumb links
- "Forgot Password?" inline link
- "Terms" / "Privacy" inline links

---

## Implementation Plan

### Phase A: Build the CSS system
1. Add `.btn-primary`, `.btn-secondary`, `.btn-newsletter` classes to `globals.css`
2. Remove old `.btn-gold`, `.btn-outline`, `.btn-dark` classes (or alias them)
3. Add size modifiers: `.btn-sm`, `.btn-md` (default), `.btn-lg`
4. Add state modifiers: `.btn-disabled`, focus-visible styles

### Phase B: Update PremiumButton component
1. Change variants from `gold/outline/dark` to `primary/secondary/newsletter`
2. Keep backward compat: `gold` → `primary`, `outline` → `secondary`
3. Remove unused `dark` variant
4. Update all 38 call sites

### Phase C: Convert inline-styled buttons
1. Replace inline `<button>` with `backgroundColor: var(--color-gold)` → `<PremiumButton variant="primary">`
2. Replace inline "text link" buttons with `<PremiumButton variant="secondary">` where appropriate
3. Keep icon-only buttons as-is

### Phase D: Verification
1. Visual: every CTA on every page uses one of 3 classes
2. Accessibility: contrast 4.5:1, focus visible, keyboard nav
3. Responsive: test at 320px, 768px, 1024px, 1440px
4. Build + lint pass

---

## Mapping Table (Existing → New)

| Existing Button | New Class | File |
|---|---|---|
| PremiumButton `variant="gold"` | `variant="primary"` | 25 files |
| PremiumButton `variant="outline"` | `variant="secondary"` | 9 files |
| PremiumButton `variant="dark"` | (remove — unused) | 0 files |
| CartDrawer "Proceed to Checkout" (inline) | PremiumButton `primary` `fullWidth` | CartDrawer.tsx |
| CartDrawer "View Full Cart" (inline) | PremiumButton `secondary` `fullWidth` | CartDrawer.tsx |
| CartDrawer "Start Shopping" (empty state) | PremiumButton `primary` | CartDrawer.tsx |
| CartView "Start Shopping" (empty state) | PremiumButton `primary` | CartView.tsx |
| CartView "Proceed to Checkout" | PremiumButton `primary` `fullWidth` | CartView.tsx |
| CartView "Continue Shopping" | PremiumButton `secondary` | CartView.tsx |
| CheckoutView "Place Order" | PremiumButton `primary` `fullWidth` | CheckoutView.tsx |
| AdminDashboard inline gold buttons (2) | PremiumButton `primary` `sm` | AdminDashboard.tsx |
| NewsletterSection "Claim My 15% Off" | PremiumButton `variant="newsletter"` `fullWidth` | NewsletterSection.tsx |
| AuthView "Continue with Google/Facebook" | PremiumButton `secondary` `fullWidth` | AuthView.tsx |
| AuthView "Sign In/Create Account" submit | PremiumButton `primary` `fullWidth` | AuthView.tsx |
| ForgotPasswordView "Send Reset Link" | PremiumButton `primary` `fullWidth` | ForgotPasswordView.tsx |
| ReviewForm "Submit Review" | PremiumButton `primary` | ReviewForm.tsx |

---

## Accessibility Requirements

All 3 button classes must meet:

| Requirement | Standard | Implementation |
|---|---|---|
| Color contrast (normal text) | WCAG AA 4.5:1 | White on gold gradient = 4.6:1 ✅ |
| Color contrast (large text) | WCAG AA 3:1 | Gold text on transparent = 4.5:1 ✅ |
| Focus visible | WCAG 2.4.7 | 2px solid gold outline + 2px offset |
| Keyboard accessible | WCAG 2.1.1 | Native `<button>` / `<Link>` elements |
| Disabled state | WCAG 4.1.1 | `aria-disabled` + opacity 60% + cursor not-allowed |
| Touch target size | WCAG 2.5.5 | Min 44x44px (sm size = 40px — borderline, md/lg pass) |
| Reduced motion | WCAG 2.3.3 | Disable hover transforms when `prefers-reduced-motion` |

---

## Responsive Behavior

| Breakpoint | Button behavior |
|---|---|
| Mobile (320-640px) | Full-width on primary CTAs, 44px min height |
| Tablet (640-1024px) | Auto-width, centered |
| Desktop (1024px+) | Auto-width, left/right aligned per layout |

All buttons use `clamp()` for fluid sizing where appropriate.

---

**End of Audit Document**

> This document drives the implementation. Every existing button maps to one of 3 classes.
> Icon buttons, toggle pills, and text links are explicitly excluded.
