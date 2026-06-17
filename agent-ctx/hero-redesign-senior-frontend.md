# Task: hero-redesign — Senior Frontend Design Agent

**File delivered:** `/home/z/my-project/src/components/HeroSection.tsx`
**Status:** ✅ Complete — lint clean, TypeScript clean (app), no runtime GSAP warnings.

## What was built
A completely new, modern, editorial hero slider for **Aura Living** (premium Pakistani
home-decor brand). Replaced the previous centered-text hero with an asymmetric,
glassmorphism-rich, GSAP-driven experience.

## Design decisions
- **Layout:** Asymmetric — content left-aligned with a vertical gold accent bar
  (`linear-gradient` gold → transparent) as the editorial signature on desktop.
  Mobile falls back to centered text (no bar) so it never crowds the side arrows.
- **Overlay (3 cinematic layers, never too dark):**
  1. Legibility — vertical gradient (dark top for navbar, dark bottom for text) +
     a left-side darken to anchor left-aligned content.
  2. Warmth — radial gold tint (~6–8% opacity) for brand warmth.
  3. Vignette — radial gradient deepening the corners.
- **Trust pill:** frosted-glass capsule top-left (top-center mobile) with 3 on-brand
  gradient avatar circles (gold / sage / taupe) — **no external image deps**, so it
  never breaks. Includes a 4.8★ gold star cluster on desktop.
- **Stats capsule:** frosted-glass rounded bar bottom-left (bottom-center mobile) with
  4 stats (5,000+ / 200+ / 50+ / 4.8★) separated by hairline dividers.
- **Arrows:** glassmorphism circles, `hidden sm:flex` (mobile uses swipe + dots).
- **Dots:** pill-shaped active dot (34px) vs 7px inactive, animated via GSAP width+color.
  Bottom-center mobile, bottom-right desktop.
- **Progress bar:** 3px gold→soft-gold gradient line at the very bottom, GSAP width tween.
- **CTA:** gold gradient pill with arrow, hover lift + glow + gap widen.

## GSAP animation stack (all `force3D: true`)
- **Background:** two-layer A/B crossfade (`power2.inOut`, 1.2s). Container oversized
  (`top:-30% / height:165%`) so the scroll-parallax translate never reveals an edge.
- **Content entrance:** timeline stagger — tag slides **down** (y:-26→0), heading slides
  **up** with fade (y:52→0), subtitle fades, CTA bounces in (`back.out(1.7)` + scale).
- **Content exit:** quick fade + lift (y:-34, 0.32s, stagger 0.04) before swap.
- **Scroll parallax (desktop only, `scrub:1.5`):** bg drifts down 100px (slower than
  page), content fades up (-70) over first 55%, stats drop (+36) over first 45%.
- **Progress bar:** `gsap.to(width:100%, duration:6s, ease:none)`.
- **Dots:** `gsap.to(width + backgroundColor)` on slide change.
- **Decor (trust/stats/arrows):** staggered fade-in (delay 1.1s) after content.

## Slider functionality
- 5 slides, 6s autoplay, full crossfade + content out→in choreography.
- Pause-on-hover (pauses both progress tween + timeout; resumes with remaining time).
- Touch swipe (>50px horizontal) for mobile.
- `prefers-reduced-motion` disables autoplay + parallax.
- Circular `goToSlide ↔ startAutoPlay` dependency broken cleanly via **refs**
  (`goToSlideRef` / `startAutoPlayRef` synced in a render effect) — no `eslint-disable`
  for `react-hooks/exhaustive-deps` needed in the hot paths.

## Technical notes
- `'use client'`; imports `gsap, ScrollTrigger` from `@/hooks/useGsap`; `useStore` for
  `setPage` navigation.
- Height via the project's `.dvh-fallback` class (`100vh` then `100dvh`) — avoids the
  TS1117 duplicate-property error that an inline `height`/`height` pair triggers under
  React 19 types.
- First `<img>` uses `loading="eager"` + `fetchPriority="high"` for fast LCP; rest `lazy`.
- All `<img>` tags (no `next/image`), `object-cover`, full-bleed.
- All GSAP target calls are null-safe (local non-null narrowing or `if (length)` guards)
  so no "GSAP target null not found" warnings, even during HMR.

## Verification
- `bun run lint` → **0 errors, 0 warnings**.
- `npx tsc --noEmit` → no errors in `src/` (only pre-existing unrelated errors in
  `scripts/generate-product-images.ts`).
- `dev.log` → after the final compiles (post null-safety + decor-guard edits) **no new
  GSAP warnings** appear; previous warnings were stale HMR artifacts from intermediate
  file versions.

## What was deliberately avoided (per spec)
No framer-motion, no marquee, no corner ornaments, no floating orbs, no grain texture,
no slide-number indicator, overlay not too dark, content not centered on desktop.
