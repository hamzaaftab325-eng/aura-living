import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, CartItem, User } from '@/types';

// Re-export types for backward compatibility with existing imports
export type { Product, CartItem, User } from '@/types';

// ============================================================================
// IMPORTANT: Auth state is NO LONGER in Zustand.
// Use the `useSession` hook from `@/lib/auth-client` instead:
//   import { authClient } from '@/lib/auth-client';
//   const { data: session } = authClient.useSession();
// The `User` type is re-exported above only for backward compat with
// components that still import it.
// ============================================================================

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

      // UI State
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
    }),
    {
      name: 'aura-living-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart + wishlist (auth state removed — comes from Better Auth)
      // UI state (cartOpen) is NOT persisted — always starts as false
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
      // Merge persisted state with initial state — ensures cartOpen + functions
      // are never overwritten by the persisted partial state
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<StoreState>;
        return {
          ...current,
          ...persistedState,
          // Always reset UI state on load
          cartOpen: false,
        };
      },
    }
  )
);
