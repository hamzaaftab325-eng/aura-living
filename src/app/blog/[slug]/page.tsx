import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getArticleBySlug } from '@/data/articles';
import ArticleView from '@/components/ArticleView';

// Revalidate every 24 hours
export const revalidate = 86400;


// Pre-render all article pages at build time
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

// Per-article metadata for SEO
export async function generateMetadata({
  params }: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Aura Living',
      robots: { index: false, follow: true } };
  }

  const title = `${article.title} | Aura Living Journal`;
  const description = article.excerpt;
  const canonical = `/blog/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      publishedTime: article.date,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: '/og/blog.png',
          width: 1344,
          height: 768,
          alt: article.title },
      ] },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/blog.png'] } };
}

export default async function ArticlePage({
  params }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleView article={article} />;
}
