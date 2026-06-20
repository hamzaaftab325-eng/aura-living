'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useGsapFadeIn } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  BookOpen,
  Share2,
  Link2,
  Facebook,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PremiumButton from '@/components/ui/PremiumButton';
import { getRelatedArticles, type Article } from '@/data/articles';

/* ═══════════════════════════════════════════════════════════
   Category labels (mirrored from BlogView for the breadcrumb
   and hero badge)
   ═══════════════════════════════════════════════════════════ */
const categoryLabels: Record<Article['category'], string> = {
  styling: 'Styling',
  care: 'Care',
  trends: 'Trends',
  lifestyle: 'Lifestyle',
  'behind-the-scenes': 'Behind the Scenes',
};

/* ═══════════════════════════════════════════════════════════
   ArticleImage — graceful fallback for missing cover images
   (same approach as BlogView)
   ═══════════════════════════════════════════════════════════ */
function ArticleImage({
  src,
  alt,
  title,
  sizes,
  priority = false,
  className,
}: {
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
            'linear-gradient(135deg, var(--color-gold-pale) 0%, var(--surface-accent) 50%, #EAD9B6 100%)',
        }}
        aria-label={alt}
        role="img"
      >
        <div className="text-center px-6 py-10">
          <BookOpen
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: 'var(--color-gold)' }}
            aria-hidden="true"
          />
          <p
            className="font-serif text-lg sm:text-xl leading-snug"
            style={{ color: 'var(--color-gold-text)', fontFamily: 'var(--font-playfair)' }}
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
   Inline markdown renderer
   - Splits body by `## ` to get sections (heading + body)
   - Within a section, splits by newlines → paragraphs
   - Lines starting with `- ` → unordered list items
   - `**bold**` → <strong>
   ═══════════════════════════════════════════════════════════ */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  // Split on **bold** segments
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} style={{ color: 'var(--text-primary)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-t-${i}`}>{part}</span>;
  });
}

interface Section {
  heading: string | null;
  blocks: { type: 'paragraph' | 'list'; items?: string[]; text?: string }[];
}

function parseArticleBody(body: string): Section[] {
  // Split on lines that start with `## `
  const lines = body.split('\n');
  const sections: Section[] = [];
  let current: Section = { heading: null, blocks: [] };
  let currentList: string[] | null = null;

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      current.blocks.push({ type: 'list', items: currentList });
    }
    currentList = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('## ')) {
      // Flush any pending list, push current section, start new one
      flushList();
      if (current.blocks.length > 0 || current.heading !== null) {
        sections.push(current);
      }
      current = { heading: line.slice(3).trim(), blocks: [] };
    } else if (line.startsWith('- ')) {
      // List item
      if (currentList === null) currentList = [];
      currentList.push(line.slice(2).trim());
    } else if (line === '') {
      // Blank line — end any pending list
      flushList();
    } else {
      // Paragraph
      flushList();
      current.blocks.push({ type: 'paragraph', text: line });
    }
  }
  flushList();
  if (current.blocks.length > 0 || current.heading !== null) {
    sections.push(current);
  }
  return sections;
}

/* ═══════════════════════════════════════════════════════════
   ArticleBody — renders the parsed markdown
   ═══════════════════════════════════════════════════════════ */
function ArticleBody({ body }: { body: string }) {
  const sections = useMemo(() => parseArticleBody(body), [body]);

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section, sIdx) => (
        <section key={`sec-${sIdx}`} className="flex flex-col gap-3">
          {section.heading && (
            <h2
              className="text-2xl sm:text-3xl font-bold mt-4 first:mt-0"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-playfair)',
              }}
            >
              {section.heading}
            </h2>
          )}
          {section.blocks.map((block, bIdx) => {
            if (block.type === 'list' && block.items) {
              return (
                <ul
                  key={`ul-${sIdx}-${bIdx}`}
                  className="flex flex-col gap-2 pl-5"
                  style={{ listStyleType: 'disc', color: 'var(--text-secondary)' }}
                >
                  {block.items.map((item, i) => (
                    <li
                      key={`li-${sIdx}-${bIdx}-${i}`}
                      className="text-base sm:text-lg leading-relaxed pl-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {renderInline(item, `li-${sIdx}-${bIdx}-${i}`)}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p
                key={`p-${sIdx}-${bIdx}`}
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {renderInline(block.text ?? '', `p-${sIdx}-${bIdx}`)}
              </p>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ShareButtons
   ═══════════════════════════════════════════════════════════ */
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://auraliving.pk/blog/${slug}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for browsers without clipboard API
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore — share is a progressive enhancement
    }
  };

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const btnClass =
    'flex items-center justify-center w-10 h-10 rounded-sm border transition-all duration-200 hover:opacity-80 cursor-pointer';
  const btnStyle = {
    borderColor: 'var(--border-default)',
    backgroundColor: 'var(--surface-page)',
    color: 'var(--text-muted)',
  };

  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-xs uppercase tracking-[3px] font-medium"
        style={{ color: 'var(--color-gold)' }}
      >
        Share this article
      </span>
      <div className="flex items-center gap-2">
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          style={btnStyle}
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" aria-hidden="true" />
        </a>
        <a
          href={twUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          style={btnStyle}
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className={btnClass}
          style={btnStyle}
          aria-label="Copy article link"
        >
          {copied ? (
            <span
              className="text-[10px] font-bold uppercase"
              style={{ color: 'var(--color-gold)' }}
            >
              Copied
            </span>
          ) : (
            <Link2 className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ArticleView
   ═══════════════════════════════════════════════════════════ */
export default function ArticleView({ article }: { article: Article }) {
  const related = useMemo(
    () => getRelatedArticles(article.slug, 3),
    [article.slug]
  );

  const bodyFadeRef = useGsapFadeIn<HTMLDivElement>({ y: 20, duration: 0.7, delay: 0.1 });
  const relatedRef = useGsapFadeIn<HTMLDivElement>({ y: 20, duration: 0.7, delay: 0.05 });

  // Inject BlogPosting JSON-LD for the article
  useEffect(() => {
    if (!article) return;
    const baseUrl = 'https://auraliving.pk';
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      image: [`${baseUrl}${article.coverImage}`],
      datePublished: article.date,
      dateModified: article.date,
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Aura Living',
      },
      description: article.excerpt,
      articleSection: categoryLabels[article.category],
      keywords: article.tags.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${article.slug}`,
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.setAttribute('data-article-jsonld', 'true');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [article]);

  // Scroll to top when an article loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [article?.slug]);

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full page-transition" style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Journal', href: '/blog' },
          { label: article.title },
        ]}
      />

      {/* Hero */}
      <section className="pt-12 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="inline-block text-xs sm:text-sm font-medium uppercase tracking-[3px] mb-4 px-3 py-1.5 rounded-sm"
            style={{
              backgroundColor: 'var(--color-gold-pale)',
              color: 'var(--color-gold-text)',
            }}
          >
            {categoryLabels[article.category]}
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-playfair)' }}
          >
            {article.title}
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            {article.excerpt}
          </p>

          {/* Author + meta */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 text-sm pt-4"
            style={{
              borderTop: '1px solid var(--border-default)',
              color: 'var(--text-muted)',
            }}
          >
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {article.author.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.author.role}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {formattedDate}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {article.readingTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section className="pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden">
            <ArticleImage
              src={article.coverImage}
              alt={article.title}
              title={article.title}
              sizes="(min-width: 1024px) 56vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Body + share */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-start">
          {/* Article body */}
          <div ref={bodyFadeRef} className="min-w-0">
            <ArticleBody body={article.body} />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--border-default)' }}>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-sm"
                    style={{
                      backgroundColor: 'var(--surface-accent)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Mobile share (below body) */}
            <div className="mt-8 lg:hidden">
              <ShareButtons title={article.title} slug={article.slug} />
            </div>

            {/* Back to journal */}
            <div className="mt-10">
              <PremiumButton variant="outline" href="/blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Journal
              </PremiumButton>
            </div>
          </div>

          {/* Desktop sidebar — share */}
          <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-24">
            <ShareButtons title={article.title} slug={article.slug} />
            <div
              className="rounded-sm p-4"
              style={{
                backgroundColor: 'var(--surface-accent)',
                border: '1px solid var(--border-default)',
              }}
            >
              <p
                className="text-xs uppercase tracking-[2px] font-medium mb-2"
                style={{ color: 'var(--color-gold)' }}
              >
                Written by
              </p>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {article.author.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {article.author.role}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Continue reading */}
      {related.length > 0 && (
        <section
          className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: 'var(--surface-accent)' }}
        >
          <div ref={relatedRef} className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <span
                className="text-xs sm:text-sm tracking-[3px] uppercase font-medium"
                style={{ color: 'var(--color-gold)' }}
              >
                Keep Reading
              </span>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-4"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-playfair)' }}
              >
                Continue Your Journey
              </h2>
              <div className="flex justify-center">
                <GoldDivider />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {related.map((rel) => {
                const relDate = new Date(rel.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="group flex flex-col overflow-hidden rounded-sm border cursor-pointer transition-all duration-300 hover:shadow-lg block"
                    style={{
                      backgroundColor: 'var(--surface-page)',
                      borderColor: 'var(--border-default)',
                    }}
                    aria-label={`Read related article: ${rel.title}`}
                  >
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <ArticleImage
                        src={rel.coverImage}
                        alt={rel.title}
                        title={rel.title}
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span
                        className="absolute top-3 left-3 text-[10px] uppercase tracking-[2px] font-medium px-3 py-1.5 rounded-sm"
                        style={{
                          backgroundColor: 'rgba(250, 248, 245, 0.95)',
                          color: 'var(--color-gold-text)',
                        }}
                      >
                        {categoryLabels[rel.category]}
                      </span>
                    </div>
                      <div className="flex flex-col flex-1 p-5">
                        <h3
                          className="text-lg font-bold leading-snug mb-2"
                          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-playfair)' }}
                        >
                          {rel.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed mb-4 line-clamp-2"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {rel.excerpt}
                        </p>
                        <div
                          className="mt-auto pt-3 flex items-center justify-between text-xs"
                          style={{
                            borderTop: '1px solid var(--border-default)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <span>{rel.author.name}</span>
                          <span className="flex items-center gap-1.5">
                            <span>{relDate}</span>
                            <span aria-hidden="true">·</span>
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            <span>{rel.readingTime} min</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <PremiumButton variant="gold" href="/blog">
                View All Articles
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </PremiumButton>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
