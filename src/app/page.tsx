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
    url: 'https://auraliving.com',
    siteName: 'Aura Living',
    type: 'website',
    locale: 'en_PK',
    images: [
      {
        url: '/images/hero/hero-slide-1.webp',
        width: 1200,
        height: 630,
        alt: 'Aura Living — Premium Home Decor Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Living | Premium Home Decor Pakistan',
    description:
      'Where Comfort Meets Style — Shop handcrafted home decor online in Pakistan',
    images: ['/images/hero/hero-slide-1.webp'],
  },
};

export default function HomePage() {
  return (
    <>
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
