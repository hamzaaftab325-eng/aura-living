'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import type { Article } from '@/types';

/**
 * BlogCard — Displays a single blog article in grid layouts.
 *
 * Used in: BlogView (listing page), ArticleView (related articles)
 *
 * @param article - The article data to display
 * @param variant - Card variant ('default' | 'featured')
 *
 * @example
 * <BlogCard article={article} />
 * <BlogCard article={featuredArticle} variant="featured" />
 */
export default function BlogCard({
  article,
  variant = 'default',
  className = '',
}: {
  article: Article;
  variant?: 'default' | 'featured';
  className?: string;
}) {
  const isFeatured = variant === 'featured';

  return (
    <Link
      href={`/blog/${article.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl aura-surface-card aura-border-gold-soft transition-all duration-300 hover:shadow-lg ${
        isFeatured ? 'md:flex-row' : ''
      } ${className}`}
    >
      <div className={`relative overflow-hidden ${isFeatured ? 'md:w-1/2 aspect-[16/9]' : 'aspect-[16/9]'}`}>
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider aura-bg-gold aura-text-white">
          {article.category.replace('-', ' ')}
        </span>
      </div>
      <div className={`flex flex-col gap-2 p-5 ${isFeatured ? 'md:w-1/2 md:p-8' : ''}`}>
        <h3 className={`font-bold aura-text-primary group-hover:aura-text-gold transition-colors ${isFeatured ? 'text-2xl' : 'text-lg'}`} style={{ fontFamily: 'var(--font-playfair), serif' }}>
          {article.title}
        </h3>
        <p className="text-sm aura-text-secondary line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center gap-3 mt-auto pt-3 text-xs aura-text-muted">
          <span>{article.author.name}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readingTime} min read
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold aura-text-gold mt-2">
          Read More
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
