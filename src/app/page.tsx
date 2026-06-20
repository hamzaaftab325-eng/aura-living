import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import TrendingCollection from '@/components/TrendingCollection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';
import { FloatingGoldDots } from '@/components/SVGDecorations';

export const metadata: Metadata = {
  title: 'Aura Living | Premium Home Decor Pakistan — Where Comfort Meets Style',
  description:
    'Discover handcrafted home decor, elegant lamps, indoor plants, ceramic vases, candles & more. Premium quality home decoration items delivered across Pakistan. Shop PKR.',
  alternates: { canonical: '/' },
  keywords: [
    'home decor Pakistan',
    'luxury home decoration',
    'lamps online Pakistan',
    'indoor plants Karachi',
    'ceramic vases',
    'candles',
    'wall art',
    'Aura Living',
    'home accessories PKR',
  ],
  openGraph: {
    title: 'Aura Living | Premium Home Decor Pakistan',
    description:
      'Where Comfort Meets Style — Handcrafted home decor, lamps, plants, vases & more. Shop online in Pakistan.',
    url: '/',
    siteName: 'Aura Living',
    type: 'website',
    locale: 'en_PK',
    images: [
      {
        url: '/og/home.png',
        width: 1344,
        height: 768,
        alt: 'Aura Living — Where Comfort Meets Style',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Living | Premium Home Decor Pakistan',
    description:
      'Where Comfort Meets Style — Shop handcrafted home decor online in Pakistan',
    images: ['/og/home.png'],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Preload hero image — only on home page where it's actually used */}
      <link rel="preload" as="image" href="/images/hero/hero-slide-1.webp" />
      <HeroSection />
      <FloatingGoldDots />
      <CategoriesSection />
      <FloatingGoldDots />
      <FeaturedProducts />
      <FloatingGoldDots />
      <TrendingCollection />
      <FloatingGoldDots />
      <TestimonialsSection />
      <FloatingGoldDots />
      <NewsletterSection />
    </>
  );
}
