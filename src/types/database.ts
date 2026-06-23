export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string | null; phone: string | null; avatar_url: string | null; rewards_points: number; is_admin: boolean; created_at: string; updated_at: string; };
        Insert: { id: string; email: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null; rewards_points?: number; is_admin?: boolean; created_at?: string; updated_at?: string; };
        Update: { email?: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null; rewards_points?: number; is_admin?: boolean; updated_at?: string; };
      };
      categories: {
        Row: { id: string; name: string; slug: string; description: string | null; image: string | null; parent_id: string | null; sort_order: number; is_active: boolean; created_at: string; updated_at: string; };
        Insert: { id: string; name: string; slug: string; description?: string | null; image?: string | null; parent_id?: string | null; sort_order?: number; is_active?: boolean; };
        Update: Record<string, never>;
      };
      products: {
        Row: { id: string; slug: string; name: string; description: string; material: string | null; price: number; original_price: number | null; category_id: string; image: string; images: string[]; badge: 'NEW' | 'SALE' | 'BESTSELLER' | null; in_stock: boolean; stock_quantity: number; sku: string | null; rating: number; reviews_count: number; specifications: Json; is_active: boolean; created_at: string; updated_at: string; search_vector: unknown; };
        Insert: { id: string; slug: string; name: string; description: string; material?: string | null; price: number; original_price?: number | null; category_id: string; image: string; images?: string[]; badge?: 'NEW' | 'SALE' | 'BESTSELLER' | null; in_stock?: boolean; stock_quantity?: number; sku?: string | null; rating?: number; reviews_count?: number; specifications?: Json; is_active?: boolean; };
        Update: Record<string, never>;
      };
      cart_items: {
        Row: { id: string; user_id: string; product_id: string; quantity: number; selected_color: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; user_id: string; product_id: string; quantity?: number; selected_color?: string | null; };
        Update: Record<string, never>;
      };
      wishlist_items: {
        Row: { id: string; user_id: string; product_id: string; created_at: string; };
        Insert: { id?: string; user_id: string; product_id: string; };
        Update: Record<string, never>;
      };
      addresses: {
        Row: { id: string; user_id: string; label: 'Home' | 'Work' | 'Other'; full_name: string; phone: string; line1: string; line2: string | null; city: string; province: string; postal_code: string; is_default: boolean; created_at: string; updated_at: string; };
        Insert: { id?: string; user_id: string; label: 'Home' | 'Work' | 'Other'; full_name: string; phone: string; line1: string; line2?: string | null; city: string; province: string; postal_code: string; is_default?: boolean; };
        Update: Record<string, never>;
      };
      orders: {
        Row: { id: string; order_number: string; user_id: string; status: string; payment_method: string; payment_status: string; payment_transaction_id: string | null; subtotal: number; discount: number; shipping_cost: number; total: number; coupon_code: string | null; shipping_address: Json; billing_address: Json | null; order_notes: string | null; tracking_number: string | null; estimated_delivery: string | null; idempotency_key: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; order_number: string; user_id: string; status?: string; payment_method: string; payment_status?: string; payment_transaction_id?: string | null; subtotal: number; discount?: number; shipping_cost?: number; total: number; coupon_code?: string | null; shipping_address: Json; billing_address?: Json | null; order_notes?: string | null; tracking_number?: string | null; estimated_delivery?: string | null; idempotency_key?: string | null; };
        Update: Record<string, never>;
      };
      order_items: {
        Row: { id: string; order_id: string; product_id: string | null; product_name: string; product_image: string; price: number; quantity: number; selected_color: string | null; subtotal: number; };
        Insert: { id?: string; order_id: string; product_id?: string | null; product_name: string; product_image: string; price: number; quantity: number; selected_color?: string | null; subtotal: number; };
        Update: Record<string, never>;
      };
      reviews: {
        Row: { id: string; product_id: string; user_id: string; author: string; rating: number; title: string; body: string; verified: boolean; helpful: number; is_hidden: boolean; created_at: string; updated_at: string; };
        Insert: { id?: string; product_id: string; user_id: string; author: string; rating: number; title: string; body: string; verified?: boolean; helpful?: number; is_hidden?: boolean; };
        Update: Record<string, never>;
      };
      coupons: {
        Row: { id: string; code: string; description: string | null; discount_type: string; discount_value: number; min_order_value: number; max_uses: number | null; used_count: number; starts_at: string; expires_at: string | null; is_active: boolean; created_at: string; updated_at: string; };
        Insert: { id?: string; code: string; description?: string | null; discount_type: string; discount_value: number; min_order_value?: number; max_uses?: number | null; used_count?: number; starts_at?: string; expires_at?: string | null; is_active?: boolean; };
        Update: Record<string, never>;
      };
      articles: {
        Row: { id: string; slug: string; title: string; excerpt: string; body: string; cover_image: string; category: string; tags: string[]; author_name: string; author_role: string; author_avatar: string; reading_time: number; published_at: string | null; is_published: boolean; created_at: string; updated_at: string; search_vector: unknown; };
        Insert: { id?: string; slug: string; title: string; excerpt: string; body: string; cover_image: string; category: string; tags?: string[]; author_name: string; author_role: string; author_avatar: string; reading_time?: number; published_at?: string | null; is_published?: boolean; };
        Update: Record<string, never>;
      };
      newsletter_subscribers: {
        Row: { id: string; email: string; is_active: boolean; subscribed_at: string; unsubscribed_at: string | null; source: string; };
        Insert: { id?: string; email: string; is_active?: boolean; subscribed_at?: string; unsubscribed_at?: string | null; source?: string; };
        Update: { is_active?: boolean; subscribed_at?: string; unsubscribed_at?: string | null; };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
