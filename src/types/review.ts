/**
 * Review-related type definitions.
 */

export interface Review {
  id: string;
  productId: string;
  author: string;
  location?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}
