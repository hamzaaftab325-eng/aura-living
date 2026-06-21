/**
 * Product-related type definitions.
 * Centralized here for reuse across the entire application.
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  badge?: 'NEW' | 'SALE' | 'BESTSELLER';
  description: string;
  material: string;
  inStock: boolean;
  sku?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  warranty?: string;
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}
