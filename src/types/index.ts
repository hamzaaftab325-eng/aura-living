/**
 * Centralized type definitions for Aura Living.
 *
 * Import from here instead of individual files:
 *   import type { Product, CartItem, User } from '@/types';
 */

export type { Product, CartItem, Category } from './product';
export type { User, Address, Order, OrderItem, TrackedOrder } from './user';
export type { Article, ArticleAuthor } from './blog';
export type { Review } from './review';
