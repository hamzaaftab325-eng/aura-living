# Task: Update ContactView & ShopView Hero Banners + Fix Image Cropping

## Summary

Completed all three parts of the task:

### Part 1: ContactView Hero Banner
- Replaced the plain background header (`backgroundColor: '#F5EDDA'`) with a full hero banner section
- Added background image: `/images/pages/contact-hero.png` with `backgroundSize: 'cover'` and `backgroundPosition: 'center'`
- Added dark gradient overlay: `linear-gradient(135deg, rgba(44,44,44,0.75) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)`
- Added decorative floating orbs (gold blurred circles)
- Changed text colors to white/gold on dark overlay (breadcrumb: `rgba(255,255,255,0.7)`, heading: `text-white`, subtitle: `text-white/70`)
- Updated parallax effect to target the background div (`heroBgRef`) instead of the section element for proper `backgroundPositionY` animation
- Height: `h-[40vh] sm:h-[50vh] md:h-[55vh]`
- Kept existing `useGsapFadeIn` animation for hero content

### Part 2: ShopView Hero Banner
- Replaced the plain header div (`backgroundColor: '#F5EDDA'`) with a full hero banner section
- Added background image: `/images/pages/shop-hero.png` with proper cover/center settings
- Added dark gradient overlay: `linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.18) 100%)`
- Added decorative floating orbs
- Shows breadcrumb (Home > Shop), heading "Our Collection", gold divider, and subtitle
- White/gold text on dark overlay
- Updated parallax effect to use `heroBgRef` for proper `backgroundPositionY` animation
- Height: `h-[40vh] sm:h-[50vh] md:h-[55vh]`
- Changed from `useGsapFadeIn` to `useGsapStagger` for hero content animations
- Removed unused imports (`useGsapFadeIn`, `GoldDivider`)

### Part 3: Image Cropping Verification
Verified across all view files:
- All hero/banner sections using `backgroundImage` have `backgroundSize: 'cover'` and `backgroundPosition: 'center'` ✅
- Product card images use `object-contain` (ShopView, CartDrawer, ProductDetailView, FeaturedProducts, SaleView, NewArrivalsView, WishlistView, CheckoutView, Navbar) ✅
- Editorial/lifestyle images use `object-cover` (LookbookView scenes, AboutView workshop, CategoriesSection, TrendingCollection) ✅
- CartView product images use `object-contain` ✅
- No category images in ShopView filter sidebar (uses text-only checkboxes) ✅

## Files Modified
- `/home/z/my-project/src/components/ContactView.tsx`
- `/home/z/my-project/src/components/ShopView.tsx`

## Lint Results
- No new lint errors introduced in modified files
- Pre-existing lint errors in other files (Navbar, WhyChooseUs, stagger-testimonials) are unrelated
