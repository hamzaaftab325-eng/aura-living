import type { Metadata } from 'next';
import HeroSlider from '@/components/HeroSlider';
import HomeNew from '@/components/HomeNew';
import { getFeaturedProducts, getNewArrivals, getCategories } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Aura Living | Premium Home Decor Pakistan — Where Comfort Meets Style',
  description:
    'Discover handcrafted home decor, elegant lamps, indoor plants, ceramic vases, candles & more. Premium quality home decoration items delivered across Pakistan. Shop PKR.',
  alternates: { canonical: '/home-new' },
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
    url: '/home-new',
    siteName: 'Aura Living',
    type: 'website',
    locale: 'en_PK',
    images: [
      {
        url: '/og/home-new.png',
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
    images: ['/og/home-new.png'],
  },
  robots: { index: false, follow: true },
};

export const revalidate = 3600;

export default async function HomeNewPage() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(4),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero: Full-bleed background slider with Ken Burns + editorial overlay */}
      <HeroSlider />

      {/* Rest of homepage sections */}
      <HomeNew
        featuredProducts={featuredProducts}
        newArrivals={newArrivals}
        categories={categories}
      />
    </>
  );
}
