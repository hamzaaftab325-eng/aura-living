'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useGsapFadeIn, useGsapStagger } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  ChevronDown,
  Package,
  PenLine,
} from 'lucide-react';
import { useStore, badgeColors, type Product } from '@/store/useStore';
import { useCartActions } from '@/hooks/useCartActions';
import { products, categories, formatPKR } from '@/data/products';
import { getReviewsForProduct, getAverageRating } from '@/data/reviews';
import Link from 'next/link';
import PremiumButton from '@/components/ui/PremiumButton';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';

const colorSwatches = [
  { name: 'Cream', hex: 'var(--color-cream)' },
  { name: 'Gold', hex: 'var(--color-gold)' },
  { name: 'White', hex: 'var(--text-on-dark)' },
  { name: 'Black', hex: 'var(--surface-dark)' },
  { name: 'Sage', hex: 'var(--color-sage)' },
];

const accordionItems = [
  {
    id: 'description',
    title: 'Product Description',
    defaultOpen: true,
    getContent: (product: Product) => (
      <p style={{ color: 'var(--color-warm-gray)' }} className="text-sm leading-relaxed">
        {product.description}
      </p>
    ),
  },
  {
    id: 'materials',
    title: 'Materials & Care',
    defaultOpen: false,
    getContent: (product: Product) => (
      <div style={{ color: 'var(--color-warm-gray)' }} className="text-sm leading-relaxed space-y-2">
        <p><strong>Material:</strong> {product.material}</p>
        <p><strong>Care:</strong> Wipe with a soft, dry cloth. Avoid direct sunlight and moisture.</p>
      </div>
    ),
  },
  {
    id: 'shipping',
    title: 'Shipping & Returns',
    defaultOpen: false,
    getContent: () => (
      <div style={{ color: 'var(--color-warm-gray)' }} className="text-sm leading-relaxed space-y-2">
        <p><strong>Free Shipping:</strong> On orders above PKR 2,999</p>
        <p><strong>Delivery:</strong> 3-5 business days across Pakistan</p>
        <p><strong>Returns:</strong> 7-day hassle-free returns & exchanges</p>
      </div>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════
   AccordionItem — CSS max-height transition for expand/collapse
   ═══════════════════════════════════════════════════════════ */
function AccordionItem({
  item,
  product,
}: {
  item: (typeof accordionItems)[number];
  product: Product;
}) {
  const [isOpen, setIsOpen] = useState(item.defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const accordionId = `accordion-${item.title.replace(/\s+/g, '-').toLowerCase()}`;

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      contentRef.current.style.maxHeight = contentRef.current.scrollHeight + 'px';
      contentRef.current.style.opacity = '1';
    } else {
      contentRef.current.style.maxHeight = '0px';
      contentRef.current.style.opacity = '0';
    }
  }, [isOpen]);

  return (
    <div style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
      <button
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${accordionId}-panel`}
        id={`${accordionId}-button`}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--surface-dark)' }}>
          {item.title}
        </span>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-300"
          style={{ color: 'var(--color-gold)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        ref={contentRef}
        id={`${accordionId}-panel`}
        role="region"
        aria-labelledby={`${accordionId}-button`}
        style={{ maxHeight: item.defaultOpen ? '500px' : '0px',
          opacity: item.defaultOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.3s ease',
        }}
      >
        <div className="pb-4">{item.getContent(product)}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main ProductDetailView
   ═══════════════════════════════════════════════════════════ */
export default function ProductDetailView({ product }: { product: Product }) {
  const { isInWishlist } = useStore();
  const { handleAddToCartWithQuantity, handleToggleWishlist } = useCartActions();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Gold');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // GSAP fade-in for main content area
  const contentRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.6 });

  // Related products stagger — must be called before any conditional returns
  const relatedRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 20,
    duration: 0.5,
    stagger: 0.1,
    start: 'top 90%',
  });

  const wishlisted = isInWishlist(product.id);

  // Reviews for this product + computed average (falls back to product.rating
  // when no individual review records exist).
  const productReviews = getReviewsForProduct(product.id);
  const reviewAverage = getAverageRating(product.id) || product.rating;

  const handleAddToCart = () => {
    handleAddToCartWithQuantity(product, quantity, { openCart: true });
  };

  const handleToggleWishlistClick = () => {
    handleToggleWishlist(product.id, product.name);
  };

  // Use product images array. When fewer than 4 images are available,
  // pad with the category hero image (if available) so each thumbnail is unique.
  const productCategory = categories.find((c) => c.id === product.category);
  const galleryImages = (() => {
    const main = product.image;
    const extras = (product.images && product.images.length > 0 ? product.images : [main]);
    const uniqueExtras = Array.from(new Set([main, ...extras]));
    const fillerImage = productCategory?.image;
    const filler = fillerImage && !uniqueExtras.includes(fillerImage) ? [fillerImage] : [];
    const combined = [...uniqueExtras, ...filler];
    while (combined.length < 4 && combined.length > 0) {
      // Last resort: reuse the main image only if we truly have nothing else
      if (combined[combined.length - 1] === main && combined.length > 1) break;
      combined.push(main);
    }
    return combined.slice(0, 4);
  })();

  // Related products from same category
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full pt-28 sm:pt-32" style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Breadcrumb Header */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          ...(productCategory ? [{ label: productCategory.name, href: '/shop' }] : []),
          { label: product.name },
        ]}
        productName={product.name}
        productId={product.id}
      />

      {/* Product Content */}
      <div ref={contentRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image — CSS transition for switching */}
            <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '3/4', border: '1px solid rgba(232,213,163,0.3)', backgroundColor: 'var(--surface-card)' }}>
              <Image
                key={selectedImage}
                src={galleryImages[selectedImage]}
                alt={product.name}
                fill
                priority
                className="w-full h-full object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span
                    className="inline-block px-3 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase"
                    style={{ backgroundColor: badgeColors[product.badge]?.bg, color: badgeColors[product.badge]?.text }}
                  >
                    {product.badge}
                  </span>
                </div>
              )}
              {/* Wishlist button */}
              <button
                onClick={handleToggleWishlistClick}
                className="absolute top-4 right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: wishlisted ? 'var(--color-gold)' : 'rgba(255,253,247,0.9)',
                  border: wishlisted ? '2px solid var(--color-gold)' : '2px solid rgba(212,175,55,0.3)',
                  color: wishlisted ? 'var(--text-on-dark)' : 'var(--surface-dark)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} strokeWidth={2} />
              </button>
            </div>

            {/* Thumbnail Row — CSS transition for selection ring */}
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-md overflow-hidden transition-all duration-300"
                  style={{ border: selectedImage === i ? '2px solid var(--color-gold)' : '1px solid rgba(232,213,163,0.3)',
                    opacity: selectedImage === i ? 1 : 0.7,
                    boxShadow: selectedImage === i ? '0 0 10px rgba(212,175,55,0.2)' : 'none',
                    backgroundColor: 'var(--surface-card)',
                  }}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="w-full h-full object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Category Tag */}
            {productCategory && (
              <span className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
                {productCategory.name}
              </span>
            )}

            {/* Title */}
            <h1 className="aura-h2 text-charcoal mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-[var(--color-gold-soft)]'} />
                ))}
              </div>
              <span className="text-sm" style={{ color: 'var(--color-muted-gray)' }}>
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-gold)' }}>
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base line-through" style={{ color: 'var(--color-taupe)' }}>
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="mb-8">
              <GoldDivider />
            </div>

            {/* Color Swatches — CSS transition for selection ring */}
            <div className="mb-8">
              <span className="text-sm font-medium mb-3 block" style={{ color: 'var(--surface-dark)' }}>
                Color: <span style={{ color: 'var(--color-gold)' }}>{selectedColor}</span>
              </span>
              <div className="flex items-center gap-3">
                {colorSwatches.map((swatch) => (
                  <button
                    key={swatch.name}
                    onClick={() => setSelectedColor(swatch.name)}
                    className="w-11 h-11 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: swatch.hex,
                      border: selectedColor === swatch.name ? '2px solid var(--color-gold)' : '1px solid var(--color-gold-soft)',
                      boxShadow: selectedColor === swatch.name ? '0 0 10px rgba(212,175,55,0.3)' : 'none',
                    }}
                    aria-label={`Select ${swatch.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-sm font-medium mb-3 block" style={{ color: 'var(--surface-dark)' }}>Quantity</span>
              <div className="inline-flex items-center rounded-full" style={{ border: '1px solid var(--color-gold-soft)', backgroundColor: 'rgba(245,237,218,0.3)' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-[var(--color-gold-pale)]"
                  style={{ color: 'var(--color-warm-gray)' }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold" style={{ color: 'var(--surface-dark)' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-[var(--color-gold-pale)]"
                  style={{ color: 'var(--color-warm-gray)' }}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons — CSS transitions for hover/active states */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--color-gold-hover)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] active:scale-[0.97]"
                style={{ backgroundColor: 'var(--color-gold)', color: 'var(--text-on-dark)' }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlistClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--color-gold-pale)] hover:text-[var(--color-gold)] active:scale-[0.97]"
                style={{ border: '2px solid var(--color-gold)', color: wishlisted ? 'var(--color-gold)' : 'var(--surface-dark)', backgroundColor: wishlisted ? 'rgba(212,175,55,0.08)' : 'transparent' }}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-10">
              {[
                { icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Free Shipping' },
                { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Secure Payment' },
                { icon: <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Easy Returns' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1.5 sm:gap-2 text-center p-2 sm:p-3 rounded-sm" style={{ backgroundColor: 'rgba(245,237,218,0.3)', border: '1px solid rgba(232,213,163,0.3)' }}>
                  <div style={{ color: 'var(--color-gold)' }}>{badge.icon}</div>
                  <span className="text-[10px] sm:text-[11px] font-medium leading-tight" style={{ color: 'var(--color-warm-gray)' }}>{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Accordion — CSS max-height transition */}
            <div>
              {accordionItems.map((item) => (
                <AccordionItem key={item.id} item={item} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <ReviewList reviews={productReviews} averageRating={reviewAverage} />

          {/* Write a Review — toggleable */}
          <div className="mt-8">
            {showReviewForm ? (
              <ReviewForm
                productId={product.id}
                productName={product.name}
                onSubmitted={() => setShowReviewForm(false)}
              />
            ) : (
              <div className="text-center">
                <PremiumButton
                  variant="outline"
                  onClick={() => setShowReviewForm(true)}
                  leftIcon={<PenLine size={14} aria-hidden="true" />}
                >
                  Write a Review
                </PremiumButton>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="aura-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="aura-h2 text-charcoal mb-3">You May Also Like</h2>
              <GoldDivider />
            </div>
            <div ref={relatedRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/product/${rp.slug}`}
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 block"
                  style={{ border: '1px solid rgba(232,213,163,0.3)', backgroundColor: 'var(--surface-card)' }}
                >
                  <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--surface-card)' }}>
                    <Image src={rp.image} alt={rp.name} fill className="w-full h-full object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-medium line-clamp-1" style={{ color: 'var(--surface-dark)' }}>{rp.name}</h3>
                    <p className="text-xs sm:text-sm font-bold mt-1" style={{ color: 'var(--color-gold-text)' }}>{formatPKR(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD structured data for Product rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: `https://auraliving.pk${product.image}`,
            sku: product.id,
            brand: {
              '@type': 'Brand',
              name: 'Aura Living',
            },
            material: product.material,
            category: productCategory?.name || product.category,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
            // Individual review records (capped at 10 most helpful for SEO).
            // Only included when the product has written reviews.
            ...(productReviews.length > 0
              ? {
                  review: [...productReviews]
                    .sort((a, b) => b.helpful - a.helpful)
                    .slice(0, 10)
                    .map((r) => ({
                      '@type': 'Review',
                      author: { '@type': 'Person', name: r.author },
                      datePublished: r.date,
                      reviewRating: {
                        '@type': 'Rating',
                        ratingValue: r.rating,
                        bestRating: 5,
                        worstRating: 1,
                      },
                      name: r.title,
                      reviewBody: r.body,
                      ...(r.verified ? { reviewAspect: 'Verified Purchase' } : {}),
                    })),
                }
              : {}),
            offers: {
              '@type': 'Offer',
              url: 'https://auraliving.pk',
              priceCurrency: 'PKR',
              price: product.price,
              availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
              seller: {
                '@type': 'Organization',
                name: 'Aura Living',
              },
            },
          }),
        }}
      />
    </div>
  );
}
