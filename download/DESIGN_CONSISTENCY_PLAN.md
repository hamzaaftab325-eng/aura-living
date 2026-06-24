# Design Consistency Fix Plan

## P0 — Hero Sections (highest visibility)
1. Standardize all hero heights to `h-[60vh] sm:h-[70vh] md:h-[80vh]`
2. Standardize overlay to `rgba(44,44,44,0.75) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%`
3. Add hero to CartView (missing entirely)
4. Fix SaleView hero (uses min-h-[90vh])
5. Fix BlogView hero (uses py-20, no fixed height, broken divider)
6. Standardize hero divider to gold gradient bars
7. Standardize subtitle color to `text-white/70`

## P0 — Section Padding
8. Standardize all sections to `py-16 sm:py-20 md:py-24`

## P1 — Card Radius
9. Standardize all cards to `rounded-xl` (fix rounded-lg, rounded-sm, rounded-2xl)

## P1 — Heading Hierarchy
10. Fix h1/h2/h3 semantic tags (h1 only in hero, h2 for sections, h3 for cards)

## P1 — Empty States
11. Standardize all empty states to use consistent pattern

## P2 — Hardcoded Colors
12. Replace bg-gray-* with design tokens
13. Replace #ef4444 with var(--color-danger)
14. Replace #E85D4A with var(--color-danger) in SaleView
