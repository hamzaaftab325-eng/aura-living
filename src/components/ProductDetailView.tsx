'use client';

import { useState, useRef, useEffect } from 'react';
import { useGsapFadeIn, useGsapStagger } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  ChevronRight,
  ChevronLeft,
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
} from 'lucide-react';
import { useStore, badgeColors } from '@/store/useStore';
import { products, categories, formatPKR } from '@/data/products';
import PremiumButton from '@/components/ui/PremiumButton';

const colorSwatches = [
  { name: 'Cream', hex: '#F2EDE4' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#2C2C2C' },
  { name: 'Sage', hex: '#A8B5A0' },
];

const accordionItems = [
  {
    id: 'description',
    title: 'Product Description',
    defaultOpen: true,
    getContent: (product: NonNullable<ReturnType<typeof useStore.getState>['selectedProduct']>) => (
      <p style={{ color: '#5A5A5A' }} className="text-sm leading-relaxed">
        {product.description}
      </p>
    ),
  },
  {
    id: 'materials',
    title: 'Materials & Care',
    defaultOpen: false,
    getContent: (product: NonNullable<ReturnType<typeof useStore.getState>['selectedProduct']>) => (
      <div style={{ color: '#5A5A5A' }} className="text-sm leading-relaxed space-y-2">
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
      <div style={{ color: '#5A5A5A' }} className="text-sm leading-relaxed space-y-2">
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
  product: NonNullable<ReturnType<typeof useStore.getState>['selectedProduct']>;
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
        <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>
          {item.title}
        </span>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-300"
          style={{ color: '#D4AF37', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
export default function ProductDetailView() {
  const { selectedProduct, setSelectedProduct, setPage, addToCartWithQuantity, toggleWishlist, isInWishlist, setCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Gold');
  const [selectedImage, setSelectedImage] = useState(0);
  // Track previously seen product id so we can reset state synchronously when it changes (avoids set-state-in-effect lint)
  const [lastProductId, setLastProductId] = useState<string | undefined>(selectedProduct?.id);

  if (selectedProduct?.id !== lastProductId) {
    setLastProductId(selectedProduct?.id);
    setQuantity(1);
    setSelectedColor('Gold');
    setSelectedImage(0);
  }

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProduct?.id]);

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

  if (!selectedProduct) {
    return (
      <div className="w-full flex flex-col items-center justify-center pt-32 pb-20" style={{ backgroundColor: '#FAF8F5' }}>
        <Package className="w-12 h-12 mb-4 text-gold" />
        <p className="aura-body-large text-warm-gray mb-6">No product selected. Browse our collection to find your perfect piece.</p>
        <PremiumButton variant="gold" onClick={() => setPage('shop')}>
          Browse Shop
        </PremiumButton>
      </div>
    );
  }

  const product = selectedProduct;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCartWithQuantity(product, quantity);
    setCartOpen(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
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
    <div className="w-full pt-28 sm:pt-32" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Breadcrumb Header */}
      <div className="w-full" style={{ backgroundColor: '#F5EDDA' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage('shop')}
              className="shrink-0 flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#D4AF37]"
              style={{ color: '#5A5A5A' }}
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
            <button onClick={() => setPage('home')} className="text-xs transition-colors hover:text-[#D4AF37]" style={{ color: '#8A8A8A' }}>Home</button>
            <ChevronRight size={12} style={{ color: '#8A8A8A' }} />
            <button onClick={() => setPage('shop')} className="text-xs transition-colors hover:text-[#D4AF37]" style={{ color: '#8A8A8A' }}>Shop</button>
            <ChevronRight size={12} style={{ color: '#8A8A8A' }} />
            {productCategory && (
              <>
                <button onClick={() => setPage('shop')} className="text-xs transition-colors hover:text-[#D4AF37]" style={{ color: '#8A8A8A' }}>{productCategory.name}</button>
                <ChevronRight size={12} style={{ color: '#8A8A8A' }} />
              </>
            )}
            <span className="text-xs font-medium" style={{ color: '#B8941F' }}>{product.name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div ref={contentRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image — CSS transition for switching */}
            <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '1/1', border: '1px solid rgba(232,213,163,0.3)', backgroundColor: '#FFFDF7' }}>
              <img
                key={selectedImage}
                src={galleryImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain animate-[fadeIn_0.4s_ease]"
              loading="lazy" />
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
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: wishlisted ? '#D4AF37' : 'rgba(255,253,247,0.9)',
                  border: wishlisted ? '2px solid #D4AF37' : '2px solid rgba(212,175,55,0.3)',
                  color: wishlisted ? '#FFFFFF' : '#2C2C2C',
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
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-md overflow-hidden transition-all duration-300"
                  style={{ border: selectedImage === i ? '2px solid #D4AF37' : '1px solid rgba(232,213,163,0.3)',
                    opacity: selectedImage === i ? 1 : 0.7,
                    boxShadow: selectedImage === i ? '0 0 10px rgba(212,175,55,0.2)' : 'none',
                    backgroundColor: '#FFFDF7',
                  }}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Category Tag */}
            {productCategory && (
              <span className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#D4AF37' }}>
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
                  <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#E8D5A3]'} />
                ))}
              </div>
              <span className="text-sm" style={{ color: '#8A8A8A' }}>
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base line-through" style={{ color: '#B8A99A' }}>
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="mb-8">
              <GoldDivider />
            </div>

            {/* Color Swatches — CSS transition for selection ring */}
            <div className="mb-8">
              <span className="text-sm font-medium mb-3 block" style={{ color: '#2C2C2C' }}>
                Color: <span style={{ color: '#D4AF37' }}>{selectedColor}</span>
              </span>
              <div className="flex items-center gap-3">
                {colorSwatches.map((swatch) => (
                  <button
                    key={swatch.name}
                    onClick={() => setSelectedColor(swatch.name)}
                    className="w-11 h-11 rounded-full transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: swatch.hex,
                      border: selectedColor === swatch.name ? '2px solid #D4AF37' : '1px solid #E8D5A3',
                      boxShadow: selectedColor === swatch.name ? '0 0 10px rgba(212,175,55,0.3)' : 'none',
                    }}
                    aria-label={`Select ${swatch.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-sm font-medium mb-3 block" style={{ color: '#2C2C2C' }}>Quantity</span>
              <div className="inline-flex items-center rounded-full" style={{ border: '1px solid #E8D5A3', backgroundColor: 'rgba(245,237,218,0.3)' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]"
                  style={{ color: '#5A5A5A' }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold" style={{ color: '#2C2C2C' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]"
                  style={{ color: '#5A5A5A' }}
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
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#C9A22E] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] active:scale-[0.97]"
                style={{ backgroundColor: '#D4AF37', color: '#FFFFFF' }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#F5EDDA] hover:text-[#D4AF37] active:scale-[0.97]"
                style={{ border: '2px solid #D4AF37', color: wishlisted ? '#D4AF37' : '#2C2C2C', backgroundColor: wishlisted ? 'rgba(212,175,55,0.08)' : 'transparent' }}
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
                  <div style={{ color: '#D4AF37' }}>{badge.icon}</div>
                  <span className="text-[10px] sm:text-[11px] font-medium leading-tight" style={{ color: '#5A5A5A' }}>{badge.label}</span>
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
                <div
                  key={rp.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProduct(rp); setPage('product'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                  className="cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                  style={{ border: '1px solid rgba(232,213,163,0.3)', backgroundColor: '#FFFDF7' }}
                  onClick={() => {
                    setSelectedProduct(rp);
                    setPage('product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#FFFDF7' }}>
                    <img src={rp.image} alt={rp.name} className="w-full h-full object-contain transition-transform duration-500 hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-medium line-clamp-1" style={{ color: '#2C2C2C' }}>{rp.name}</h3>
                    <p className="text-xs sm:text-sm font-bold mt-1" style={{ color: '#B8941F' }}>{formatPKR(rp.price)}</p>
                  </div>
                </div>
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
