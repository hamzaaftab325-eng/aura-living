'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useGsapFadeIn, useGsapStagger } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PremiumButton from '@/components/ui/PremiumButton';
import { articles, type Article, type Article as ArticleType } from '@/data/articles';

/* ═══════════════════════════════════════════════════════════
   Category tabs
   ═══════════════════════════════════════════════════════════ */
type CategoryTab = 'all' | Article['category'];

const categoryTabs: { id: CategoryTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'styling', label: 'Styling' },
  { id: 'care', label: 'Care' },
  { id: 'trends', label: 'Trends' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'behind-the-scenes', label: 'Behind the Scenes' },
];

const categoryLabels: Record<Article['category'], string> = {
  styling: 'Styling',
  care: 'Care',
  trends: 'Trends',
  lifestyle: 'Lifestyle',
  'behind-the-scenes': 'Behind the Scenes' };

/* ═══════════════════════════════════════════════════════════
   ArticleImage — next/image with graceful fallback for missing
   cover images. The blog cover images live at /images/blog/*.webp
   but are not yet shipped, so we render a tasteful gradient
   placeholder with the article title overlaid on error.
   ═══════════════════════════════════════════════════════════ */
function ArticleImage({
  src,
  alt,
  title,
  sizes,
  priority = false,
  className }: {
  src: string;
  alt: string;
  title: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center ${className ?? ''}`}
        style={{
          background:
            'linear-gradient(135deg, var(--color-gold-pale) 0%, var(--surface-accent) 50%, var(--color-gold-soft) 100%)' }}
        aria-label={alt}
        role="img"
      >
        <div className="text-center px-6 py-8">
          <BookOpen
            className="w-8 h-8 mx-auto mb-3"
            
            aria-hidden="true"
          />
          <p
            className="font-serif text-base sm:text-lg leading-snug"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   ArticleCard
   ═══════════════════════════════════════════════════════════ */
function ArticleCard({
  article,
  priority = false }: {
  article: ArticleType;
  priority?: boolean;
}) {
  const formattedDate = useMemo(
    () =>
      new Date(article.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric' }),
    [article.date]
  );

  return (
    <Link
      href={`/blog/${article.slug}`}
      onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className="group flex flex-col overflow-hidden rounded-sm border transition-all duration-300 hover:shadow-lg cursor-pointer block"
      style={{ borderColor: 'var(--border-default)' }}
      aria-label={`Read article: ${article.title}`}
    >
      {/* Cover image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <ArticleImage
          src={article.coverImage}
          alt={article.title}
          title={article.title}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 text-[10px] uppercase tracking-[2px] font-medium px-3 py-1.5 rounded-sm"
          style={{
            backgroundColor: 'rgba(250, 248, 245, 0.95)' }}
        >
          {categoryLabels[article.category]}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="text-lg sm:text-xl font-bold leading-snug mb-2 transition-colors duration-200"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {article.title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4 line-clamp-3"
          
        >
          {article.excerpt}
        </p>

        {/* Meta */}
        <div
          className="mt-auto pt-3 flex items-center justify-between gap-2 text-xs"
          style={{
            borderTop: '1px solid var(--border-default)' }}
        >
          <span className="truncate">
            {article.author.name}
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>{article.readingTime} min</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   BlogView
   ═══════════════════════════════════════════════════════════ */
export default function BlogView() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');

  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%' });

  const gridRef = useGsapStagger<HTMLDivElement>({
    selector: '.blog-card',
    y: 50,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 88%' });

  const featuredRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.1 });

  // Inject ItemList JSON-LD for the article listing
  useEffect(() => {
    const baseUrl = 'https://auraliving.pk';
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Aura Living Journal',
      description: 'Articles on home styling, care, trends, and lifestyle from Aura Living.',
      itemListElement: articles.map((a, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${baseUrl}/#article/${a.slug}`,
        name: a.title })) };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.setAttribute('data-blog-list-jsonld', 'true');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const featured = useMemo(() => articles.find((a) => a.featured) ?? articles[0], []);

  const visibleArticles = useMemo(() => {
    const list = activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory);
    // exclude featured from the grid when "All" is selected so it does not repeat
    if (activeCategory === 'all') {
      return list.filter((a) => a.slug !== featured.slug);
    }
    return list;
  }, [activeCategory, featured.slug]);

  const featuredDate = new Date(featured.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric' });

  return (
    <div className="w-full page-transition" >
      {/* Hero */}
      <section className="relative w-full py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, var(--color-gold-pale) 0%, var(--surface-page) 100%)' }}
        />
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            
          >
            <BookOpen className="w-8 h-8"  aria-hidden="true" />
          </div>
          <span
            className="text-xs sm:text-sm tracking-[4px] uppercase font-medium"
            
          >
            Aura Living
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mt-3 mb-5"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            The Journal
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            
          >
            Stories, styling notes, and care guides from the Aura Living studio — written by the
            people who design, make, and live with our pieces every day.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px" style={{ backgroundColor: 'var(--color-gold)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-gold)' }} />
            <div className="w-10 sm:w-14 h-px" style={{ backgroundColor: 'var(--color-gold)' }} />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Journal' },
        ]}
      />

      {/* Featured article */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div ref={featuredRef} className="max-w-7xl mx-auto">
          <span
            className="text-xs sm:text-sm tracking-[3px] uppercase font-medium block mb-6 text-center"
            
          >
            Featured Story
          </span>
          <Link
            href={`/blog/${featured.slug}`}
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center cursor-pointer block"
            aria-label={`Read featured article: ${featured.title}`}
          >
            {/* Image */}
            <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden">
              <ArticleImage
                src={featured.coverImage}
                alt={featured.title}
                title={featured.title}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute top-4 left-4 text-[10px] uppercase tracking-[2px] font-medium px-3 py-1.5 rounded-sm"
                style={{
                  backgroundColor: 'var(--color-gold)',
                  color: '#FFFFFF' }}
              >
                Featured
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-4">
              <span
                className="text-xs sm:text-sm font-medium uppercase tracking-wider"
                
              >
                {categoryLabels[featured.category]}
              </span>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {featured.title}
              </h2>
              <GoldDivider />
              <p
                className="text-base sm:text-lg leading-relaxed"
                
              >
                {featured.excerpt}
              </p>
              <div
                className="flex items-center gap-3 text-sm pt-2"
                
              >
                <span className="font-medium" >
                  {featured.author.name}
                </span>
                <span aria-hidden="true">·</span>
                <span>{featured.author.role}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredDate}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {featured.readingTime} min
                </span>
              </div>
              <div className="pt-3">
                <PremiumButton variant="primary" href={`/blog/${featured.slug}`}>
                  Read Article
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </PremiumButton>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Category filter */}
      <section className="pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Filter articles by category"
          >
            {categoryTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(tab.id)}
                  className="px-4 py-2 text-xs sm:text-sm uppercase tracking-wider font-medium rounded-sm transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'var(--color-gold)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    border: `1px solid ${isActive ? 'var(--color-gold)' : 'var(--border-default)'}` }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div ref={gridRef} className="max-w-7xl mx-auto">
          {visibleArticles.length === 0 ? (
            <p
              className="text-center py-16 text-base"
              
            >
              No articles in this category yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {visibleArticles.map((article) => (
                <div key={article.slug} className="blog-card">
                  <ArticleCard
                    article={article}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Bring the Journal Home
          </h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p
            className="text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed"
            
          >
            Explore our full collection of handcrafted pieces and bring the stories you read here
            into your own home.
          </p>
          <PremiumButton variant="secondary" href="/shop">
            Shop the Collection
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </PremiumButton>
        </div>
      </section>
    </div>
  );
}
