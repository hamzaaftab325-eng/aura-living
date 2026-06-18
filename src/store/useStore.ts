import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
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

export type PageType = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'wishlist' | 'account' | 'about' | 'contact' | 'login' | 'signup' | 'faq' | 'shipping' | 'returns' | 'care-guide' | 'new-arrivals' | 'sale' | 'lookbook' | 'terms' | 'privacy' | 'forgot-password' | 'track-orders' | 'addresses' | 'settings';


// Shared badge color mapping — used by ProductDetailView, ShopView, WishlistView, FeaturedProducts
export const badgeColors: Record<string, { bg: string; text: string }> = {
  NEW: { bg: '#A8B5A0', text: '#FFFFFF' },
  SALE: { bg: '#D4AF37', text: '#FFFFFF' },
  BESTSELLER: { bg: '#2C2C2C', text: '#D4AF37' },
};

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  addToCartWithQuantity: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User / Auth
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;

  // UI State
  currentPage: PageType;
  selectedProduct: Product | null;
  selectedCategory: string;
  searchQuery: string;
  cartOpen: boolean;

  setPage: (page: PageType) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setCartOpen: (open: boolean) => void;
}

// Page titles for SEO + browser tab
export const pageTitles: Record<PageType, string> = {
  home: 'Aura Living | Premium Home Decor Pakistan — Where Comfort Meets Style',
  shop: 'Shop All Products | Aura Living',
  product: 'Product Details | Aura Living',
  cart: 'Your Cart | Aura Living',
  checkout: 'Checkout | Aura Living',
  wishlist: 'Your Wishlist | Aura Living',
  account: 'My Account | Aura Living',
  about: 'Our Story | Aura Living',
  contact: 'Get in Touch | Aura Living',
  login: 'Sign In | Aura Living',
  signup: 'Create Account | Aura Living',
  faq: 'Frequently Asked Questions | Aura Living',
  shipping: 'Shipping Information | Aura Living',
  returns: 'Returns & Exchanges | Aura Living',
  'care-guide': 'Care Guide | Aura Living',
  'new-arrivals': 'New Arrivals | Aura Living',
  sale: 'Sale | Aura Living',
  lookbook: 'The Lookbook | Aura Living',
  terms: 'Terms of Service | Aura Living',
  privacy: 'Privacy Policy | Aura Living',
  'forgot-password': 'Reset Your Password | Aura Living',
  'track-orders': 'Track Your Orders | Aura Living',
  'addresses': 'Saved Addresses | Aura Living',
  'settings': 'Account Settings | Aura Living',
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product) => {
        const { cart } = get();
        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },
      addToCartWithQuantity: (product, quantity) => {
        const { cart } = get();
        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
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
            item.product.id === productId ? { ...item, quantity } : item
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
        } else {
          set({ wishlist: [...wishlist, productId] });
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
      currentPage: 'home',
      selectedProduct: null,
      selectedCategory: 'all',
      searchQuery: '',
      cartOpen: false,

      setPage: (page) => {
        // Push to browser history so back button works
        if (typeof window !== 'undefined' && window.history && window.history.pushState) {
          // Avoid pushing the same page twice in a row
          const current = window.history.state;
          if (!current || current.page !== page) {
            window.history.pushState({ page }, '', `#${page}`);
          }
        }
        set({ currentPage: page });
      },
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
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
