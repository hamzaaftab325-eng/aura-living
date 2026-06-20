'use client';

import { useCallback } from 'react';
import { useStore, type Product, type AddToCartResult, type WishlistToggleResult } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

/**
 * Centralized hook for cart + wishlist actions with toast feedback.
 * Use this instead of calling addToCart/toggleWishlist directly.
 *
 * Guarantees:
 * - "Added to cart" / "Removed from cart" toast
 * - Out-of-stock toast
 * - Max-quantity (99) toast
 * - Wishlist add/remove toast
 */
export function useCartActions() {
  const addToCart = useStore((s) => s.addToCart);
  const addToCartWithQuantity = useStore((s) => s.addToCartWithQuantity);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const { toast } = useToast();

  const handleAddToCart = useCallback(
    (product: Product, opts?: { openCart?: boolean; silent?: boolean }) => {
      const result: AddToCartResult = addToCart(product);
      if (opts?.silent) return result;

      if (!result.ok) {
        if (result.reason === 'out-of-stock') {
          toast({
            title: 'Out of stock',
            description: `${product.name} is currently unavailable.`,
            variant: 'destructive',
          });
        } else if (result.reason === 'max-reached') {
          toast({
            title: 'Maximum quantity reached',
            description: `You can add up to 99 of ${product.name}.`,
          });
        }
        return result;
      }

      toast({
        title: 'Added to cart',
        description: `${product.name} × ${result.added}`,
      });

      if (opts?.openCart) {
        setTimeout(() => setCartOpen(true), 300);
      }
      return result;
    },
    [addToCart, toast, setCartOpen]
  );

  const handleAddToCartWithQuantity = useCallback(
    (product: Product, quantity: number, opts?: { openCart?: boolean; silent?: boolean }) => {
      const result = addToCartWithQuantity(product, quantity);
      if (opts?.silent) return result;

      if (!result.ok) {
        if (result.reason === 'out-of-stock') {
          toast({
            title: 'Out of stock',
            description: `${product.name} is currently unavailable.`,
            variant: 'destructive',
          });
        } else if (result.reason === 'max-reached') {
          toast({
            title: 'Maximum quantity reached',
            description: `You can add up to 99 of ${product.name}.`,
          });
        }
        return result;
      }

      toast({
        title: 'Added to cart',
        description: `${product.name} × ${result.added}`,
      });

      if (opts?.openCart) {
        setTimeout(() => setCartOpen(true), 300);
      }
      return result;
    },
    [addToCartWithQuantity, toast, setCartOpen]
  );

  const handleToggleWishlist = useCallback(
    (productId: string, productName?: string): WishlistToggleResult => {
      const result = toggleWishlist(productId);
      toast({
        title: result.added ? 'Added to wishlist' : 'Removed from wishlist',
        description: productName
          ? `${productName} ${result.added ? 'saved to your wishlist' : 'removed from your wishlist'}`
          : undefined,
      });
      return result;
    },
    [toggleWishlist, toast]
  );

  return {
    handleAddToCart,
    handleAddToCartWithQuantity,
    handleToggleWishlist,
  };
}
