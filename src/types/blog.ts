/**
 * Blog and article-related type definitions.
 */

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: 'styling' | 'care' | 'trends' | 'lifestyle' | 'behind-the-scenes';
  tags: string[];
  author: ArticleAuthor;
  date: string;
  readingTime: number;
  coverImage: string;
  featured?: boolean;
}

export interface ArticleAuthor {
  name: string;
  role: string;
}
