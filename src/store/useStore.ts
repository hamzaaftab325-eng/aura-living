import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
  slug: string; // URL-friendly identifier (e.g. 'hammered-brass-table-lamp')
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

export interface User {
  name: string;
  email: string;
  memberSince: string;
  rewardsPoints: number;
}

// Shared badge color mapping — used by ProductDetailView, ShopView, WishlistView, FeaturedProducts
export const badgeColors: Record<string, { bg: string; text: string }> = {
  NEW: { bg: '#A8B5A0', text: '#FFFFFF' },
  SALE: { bg: '#D4AF37', text: '#FFFFFF' },
  BESTSELLER: { bg: '#2C2C2C', text: '#D4AF37' },
};

// Maximum quantity per cart line item
export const MAX_CART_QTY = 99;

/** Result of an add-to-cart operation, so callers can show appropriate toast. */
export type AddToCartResult =
  | { ok: true; added: number }
  | { ok: false; reason: 'out-of-stock' | 'max-reached' };

/** Result of toggle-wishlist so callers can toast "added"/"removed". */
export type WishlistToggleResult = { added: boolean; productId: string };

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => AddToCartResult;
  addToCartWithQuantity: (product: Product, quantity: number) => AddToCartResult;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => WishlistToggleResult;
  isInWishlist: (productId: string) => boolean;

  // User / Auth
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;

  // UI State (cart drawer visibility is the only SPA UI state we need;
  // all other "page state" is now derived from the URL via App Router)
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product) => {
        // Out-of-stock guard
        if (product.inStock === false) {
          return { ok: false, reason: 'out-of-stock' as const };
        }
        const { cart } = get();
        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
          if (existing.quantity >= MAX_CART_QTY) {
            return { ok: false, reason: 'max-reached' as const };
          }
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, MAX_CART_QTY) }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
        return { ok: true, added: 1 };
      },
      addToCartWithQuantity: (product, quantity) => {
        if (product.inStock === false) {
          return { ok: false, reason: 'out-of-stock' as const };
        }
        const { cart } = get();
        const safeQty = Math.max(1, Math.min(quantity, MAX_CART_QTY));
        const existing = cart.find((item) => item.product.id === product.id);
        let added = 0;
        if (existing) {
          if (existing.quantity >= MAX_CART_QTY) {
            return { ok: false, reason: 'max-reached' as const };
          }
          const newQty = Math.min(existing.quantity + safeQty, MAX_CART_QTY);
          added = newQty - existing.quantity;
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQty }
                : item
            ),
          });
        } else {
          added = safeQty;
          set({ cart: [...cart, { product, quantity: safeQty }] });
        }
        return { ok: true, added };
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.min(quantity, MAX_CART_QTY) } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
          return { added: false, productId };
        } else {
          set({ wishlist: [...wishlist, productId] });
          return { added: true, productId };
        }
      },
      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      // User / Auth (frontend-only simulation)
      user: null,
      login: (email) => {
        const name = email.split('@')[0].replace(/[._-]/g, ' ');
        set({
          user: {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            email,
            memberSince: new Date().getFullYear().toString(),
            rewardsPoints: 450,
          },
        });
      },
      signup: (name, email) => {
        set({
          user: {
            name,
            email,
            memberSince: new Date().getFullYear().toString(),
            rewardsPoints: 100, // welcome bonus
          },
        });
      },
      logout: () => set({ user: null }),

      // UI State
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
    }),
    {
      name: 'aura-living-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart, wishlist, and user — UI state is ephemeral
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
      }),
    }
  )
);
