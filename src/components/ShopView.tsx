'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStaggerReveal, useTextReveal, useScaleIn } from '@/hooks/useAnimations';
import gsap from 'gsap';;
import {
  ChevronRight,
  Star,
  Eye,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  X } from 'lucide-react';
import { useStore, Product, badgeColors } from '@/store/useStore';
import { useCartActions } from '@/hooks/useCartActions';
import { formatRupees as formatPKR } from '@/lib/currency-display';
import Breadcrumb from '@/components/ui/Breadcrumb';

// Types for props (from server component)
interface ShopCategory {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface ShopViewProps {
  initialProducts?: Product[];
  initialCategories?: ShopCategory[];
}


type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'best-selling';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best Selling' },
];

/* ═══════════════════════════════════════════════════════════
   FilterSidebar
   ═══════════════════════════════════════════════════════════ */
interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (v: string) => void;
  onPriceMaxChange: (v: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  categories: ShopCategory[];
}

function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  hasActiveFilters,
  onClearFilters,
  categories }: FilterSidebarProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" >
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div
                className="w-5 h-5 rounded flex items-center justify-center transition-all duration-200"
                style={{ border: selectedCategory === cat.id ? '2px solid var(--color-gold)' : '1.5px solid var(--color-gold-soft)',
                  backgroundColor: selectedCategory === cat.id ? 'var(--color-gold)' : 'transparent' }}
              >
                {selectedCategory === cat.id && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-sm transition-colors duration-200 group-hover:aura-text-gold"
                style={{ color: selectedCategory === cat.id ? 'var(--color-gold)' : 'var(--color-warm-gray)' }}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" >
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              className="w-full h-10 px-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--color-gold)]/40"
              
            />
          </div>
          <span >-</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className="w-full h-10 px-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-[var(--color-gold)]/40"
              
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" >
          Sort By
        </h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full h-10 px-3 rounded-sm text-sm outline-none appearance-none cursor-pointer transition-all duration-300 focus:ring-2 focus:ring-[var(--color-gold)]/50"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"  />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm font-medium underline transition-colors hover:text-[var(--color-gold-hover)]"
          
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ProductCard — CSS hover transitions only
   ═══════════════════════════════════════════════════════════ */
function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist: checkWishlist }: {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (id: string, name?: string) => void;
  isInWishlist: (id: string) => boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const wishlisted = checkWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onAddToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist(product.id, product.name);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="group">
      <Link
        href={`/product/${product.slug}`}
        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="relative rounded-xl overflow-hidden block"
        style={{ aspectRatio: '3/4',
          border: isHovered ? '1px solid rgba(212,175,55,0.6)' : '1px solid rgba(232,213,163,0.25)',
          boxShadow: isHovered ? '0 0 25px rgba(212,175,55,0.2), 0 8px 32px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease',
          transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`View ${product.name} details`}
      >
        {/* Image with zoom */}
        <div className="absolute inset-0 overflow-hidden" >
          <Image
      src={product.image}
            alt={product.name}
            fill
            className="w-full h-full object-cover"
            style={{ transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-30">
            <span
              className="inline-block px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase"
              style={{ backgroundColor: badgeColors[product.badge]?.bg,
                color: badgeColors[product.badge]?.text }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick action buttons — hover-reveal on desktop, visible on touch via .touch-visible */}
        <div className="touch-visible absolute top-3 right-3 z-30 flex flex-col gap-2">
          {[
            { icon: <Eye className="w-5 h-5" strokeWidth={2} />, onClick: handleQuickView, label: 'Quick view', title: 'Preview' },
            { icon: <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} strokeWidth={2} />, onClick: handleToggleWishlist, label: 'Toggle wishlist', active: wishlisted, title: 'Wishlist' },
            { icon: <ShoppingCart className="w-5 h-5" strokeWidth={2} />, onClick: handleAddToCart, label: 'Add to cart', title: 'Add to Cart' },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              title={btn.title}
              className="touch-visible w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: isHovered
                  ? (wishlisted && btn.active ? 'var(--color-gold)' : 'var(--surface-card)')
                  : 'transparent',
                color: wishlisted && btn.active ? 'var(--text-on-dark)' : 'var(--surface-dark)',
                border: wishlisted && btn.active
                  ? '2px solid var(--color-gold)'
                  : (isHovered ? '2px solid rgba(212,175,55,0.3)' : '2px solid transparent'),
                boxShadow: isHovered ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(12px)',
                transition: 'all 0.3s ease',
                transitionDelay: isHovered ? `${0.05 + i * 0.07}s` : '0s' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-gold)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-on-dark)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gold)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(212,175,55,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = wishlisted && btn.active ? 'var(--color-gold)' : 'var(--surface-card)';
                (e.currentTarget as HTMLElement).style.color = wishlisted && btn.active ? 'var(--text-on-dark)' : 'var(--surface-dark)';
                (e.currentTarget as HTMLElement).style.borderColor = wishlisted && btn.active ? 'var(--color-gold)' : 'rgba(212,175,55,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Add to Cart bar — CSS transition (visible on touch via .touch-visible-translate) */}
        <div
          className="touch-visible-translate absolute bottom-0 left-0 right-0 z-30 px-4 pb-4"
          style={{ opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.35s ease',
            transitionDelay: isHovered ? '0.1s' : '0s' }}
        >
          <button
            onClick={handleAddToCart}
            className="premium-btn btn-primary btn-sm w-full"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3 flex flex-col gap-1 px-1">
        <Link
          href={`/product/${product.slug}`}
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-sm font-medium leading-snug transition-colors duration-300 line-clamp-1 block"
          
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--surface-dark)')}
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(product.rating)
                    ? 'fill-[var(--color-gold)] aura-text-gold'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-[11px]" >
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" >
            {formatPKR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through" >
              {formatPKR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main ShopView
   ═══════════════════════════════════════════════════════════ */
export default function ShopView({ initialProducts, initialCategories }: ShopViewProps = {}) {
  return (
    <Suspense fallback={null}>
      <ShopViewInner initialProducts={initialProducts} initialCategories={initialCategories} />
    </Suspense>
  );
}

/* ═══════════════════════════════════════════════════════════
   ShopViewInner — actual implementation (wrapped in <Suspense> so
   that `useSearchParams` works during static generation)
   ═══════════════════════════════════════════════════════════ */
function ShopViewInner({ initialProducts, initialCategories }: ShopViewProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const { isInWishlist } = useStore();
  const { handleAddToCart, handleToggleWishlist } = useCartActions();
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Use DB-fetched products if provided, otherwise fall back to mock data
  const products = initialProducts ?? [];
  const categories = initialCategories ?? [];
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  // Inject ItemList JSON-LD for SEO — exposes all shop products to search engines
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Shop All Products — Aura Living',
      url: 'https://auraliving.pk/#shop',
      numberOfItems: products.length,
      itemListElement: products.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          image: `https://auraliving.pk${p.image}`,
          url: `https://auraliving.pk/#product/${p.id}`,
          sku: p.sku || p.id,
          priceCurrency: 'PKR',
          price: p.price,
          availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } })) };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.setAttribute('data-itemlist-jsonld', 'true');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Hero heading blur text reveal
  const heroTitleRef = useTextReveal<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03, start: 'top 90%' });
  // GoldDivider scale-in
  const dividerRef = useScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.3 });

  // GSAP stagger for product grid — enhanced with y:60 and stagger:0.08
  const gridRef = useStaggerReveal<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%' });

  // GSAP stagger for hero content
  const heroRef = useStaggerReveal<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%' });

  // Enhanced parallax for hero background — 0.5x speed + zoom 1→1.1
  useEffect(() => {
    if (!heroBgRef.current || !heroSectionRef.current) return;
    const ctx = gsap.context(() => {
      // Parallax movement at 0.5x speed
      gsap.to(heroBgRef.current, {
        backgroundPositionY: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5 } });
      // Zoom from 1 to 1.1 on scroll
      gsap.fromTo(heroBgRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true } }
      );
    }, heroSectionRef);
    return () => ctx.revert();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    // Apply search query from store (set by Navbar search Enter)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (priceMin) {
      const min = parseInt(priceMin, 10);
      if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    }
    if (priceMax) {
      const max = parseInt(priceMax, 10);
      if (!isNaN(max)) result = result.filter((p) => p.price <= max);
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (a.badge === 'NEW' ? -1 : b.badge === 'NEW' ? 1 : 0)); break;
      case 'best-selling': result.sort((a, b) => (a.badge === 'BESTSELLER' ? -1 : b.badge === 'BESTSELLER' ? 1 : b.reviews - a.reviews)); break;
    }
    return result;
  }, [selectedCategory, sortBy, priceMin, priceMax, searchQuery]);

  const pushShopUrl = (nextCategory: string, nextSearch: string) => {
    const params = new URLSearchParams();
    if (nextCategory && nextCategory !== 'all') params.set('category', nextCategory);
    if (nextSearch) params.set('search', nextSearch);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : '/shop');
  };

  const handleCategoryChange = (catId: string) => {
    const next = selectedCategory === catId ? 'all' : catId;
    pushShopUrl(next, searchQuery);
  };

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSortBy('featured');
    pushShopUrl('all', '');
  };

  const clearSearch = () => {
    pushShopUrl(selectedCategory, '');
  };

  const clearCategory = () => {
    pushShopUrl('all', searchQuery);
  };

  const hasActiveFilters = selectedCategory !== 'all' || !!priceMin || !!priceMax || sortBy !== 'featured' || !!searchQuery.trim();

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const filterSidebarProps: FilterSidebarProps = {
    selectedCategory,
    onCategoryChange: handleCategoryChange,
    sortBy,
    onSortChange: setSortBy,
    priceMin,
    priceMax,
    onPriceMinChange: setPriceMin,
    onPriceMaxChange: setPriceMax,
    hasActiveFilters,
    onClearFilters: clearFilters,
    categories };

  return (
    <div className="w-full page-transition" >
      {/* Hero Banner */}
      <section
        ref={heroSectionRef}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background image */}
        <div
          ref={heroBgRef}
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/shop-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.18) 100%)' }}
        />

        {/* Decorative floating orbs */}
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          <h1 ref={heroTitleRef} className="aura-hero-title text-white" >Our Collection</h1>

          <div ref={dividerRef} className="flex items-center gap-3 mt-5">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          <p className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mt-4 leading-relaxed" >
            Discover handcrafted home decor curated for the modern Pakistani home
          </p>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop' },
        ]}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-sm text-sm font-medium transition-all duration-300 hover:bg-[var(--color-gold-pale)]"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white">!</span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[240px] xl:w-[260px] shrink-0">
            <div
              className="sticky top-28 p-6 rounded-lg"
              style={{ backgroundColor: 'rgba(255,253,247,0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(212,175,55,0.15)',
                boxShadow: '0 4px 20px rgba(212,175,55,0.06)' }}
            >
              <FilterSidebar {...filterSidebarProps} />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Search active banner */}
            {searchQuery.trim() && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-lg aura-bg-gold-tint">
                <span className="text-sm" >
                  Showing results for <strong >&ldquo;{searchQuery.trim()}&rdquo;</strong>
                </span>
                <span className="text-xs" >
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)
                </span>
                <button
                  onClick={clearSearch}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors hover:bg-[var(--color-gold-pale)]"
                  
                  aria-label="Clear search"
                >
                  <X size={12} />
                  Clear search
                </button>
              </div>
            )}

            {/* Active filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedCategory !== 'all' && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'rgba(245,237,218,0.8)' }}
                  >
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button onClick={clearCategory} aria-label="Clear category filter" className="hover:text-[var(--color-gold-hover)]"><X size={12} /></button>
                  </span>
                )}
                {priceMin && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245,237,218,0.8)' }}>
                    Min: {formatPKR(parseInt(priceMin, 10))}
                    <button onClick={() => setPriceMin('')} className="hover:text-[var(--color-gold-hover)]"><X size={12} /></button>
                  </span>
                )}
                {priceMax && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245,237,218,0.8)' }}>
                    Max: {formatPKR(parseInt(priceMax, 10))}
                    <button onClick={() => setPriceMax('')} className="hover:text-[var(--color-gold-hover)]"><X size={12} /></button>
                  </span>
                )}
                {sortBy !== 'featured' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245,237,218,0.8)' }}>
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                    <button onClick={() => setSortBy('featured')} className="hover:text-[var(--color-gold-hover)]"><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg mb-2" >No products found</p>
                <p className="text-sm mb-6" >Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:bg-[var(--color-gold-hover)]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={(id, name) => handleToggleWishlist(id, name)}
                    isInWishlist={isInWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer — CSS transitions for slide in/out */}
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 z-50 transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)',
            opacity: mobileFiltersOpen ? 1 : 0,
            pointerEvents: mobileFiltersOpen ? 'auto' : 'none' }}
          onClick={() => setMobileFiltersOpen(false)}
        />

        {/* Drawer */}
        <div
          className="fixed top-0 left-0 bottom-0 z-50 w-[320px] max-w-[92vw] shadow-2xl overflow-y-auto transition-transform duration-300 ease-out"
          style={{ backgroundColor: 'rgba(250,248,245,0.85)',
            borderRight: '1px solid rgba(212,175,55,0.15)',
            transform: mobileFiltersOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <div className="flex items-center justify-between px-6 h-16" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
            <span className="text-lg font-semibold tracking-wide" >Filters</span>
            <button className="p-2 rounded-full transition-colors duration-200 hover:bg-[var(--color-gold-pale)]"  onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <FilterSidebar {...filterSidebarProps} />
          </div>
          <div className="p-6 pt-0">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 rounded-sm text-white font-semibold uppercase tracking-wider text-sm transition-colors duration-300 hover:bg-[var(--color-gold-hover)]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </>
    </div>
  );
}
