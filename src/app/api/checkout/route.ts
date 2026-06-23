/**
 * ============================================================================
 * POST /api/checkout — Create an order
 * ============================================================================
 *
 * Request body:
 *   {
 *     "shippingAddress": { fullName, phone, line1, line2?, city, province, postal },
 *     "paymentMethod": "COD",
 *     "couponCode": "WELCOME10",  // optional
 *     "notes": "Leave at door",   // optional
 *     "cartItems": [               // optional — if provided, syncs to DB cart first
 *       { "productId": "...", "quantity": 2, "variantId": "..." }
 *     ]
 *   }
 *
 * Response (200):
 *   { "ok": true, "orderNumber": "AURA-2026-0001", "orderId": "..." }
 *
 * Response (400/500):
 *   { "ok": false, "error": "Your cart is empty" }
 *
 * Auth: Requires a valid session (Better Auth session cookie).
 * For guests: redirect to /auth/login?from=/checkout
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrder } from "@/lib/orders";
import { mergeCart, clearCart } from "@/lib/cart";
import { z } from "zod";

// ----------------------------------------------------------------------------
// Validation schema
// ----------------------------------------------------------------------------

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email().optional(),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postal: z.string().min(4, "Postal code is required"),
  country: z.string().optional(),
});

const cartItemSchema = z.object({
  productId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(99),
  variantId: z.string().optional(),
}).refine(
  (data) => data.productId || data.slug,
  { message: "Either productId or slug is required" },
);

const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["COD", "CARD", "BANK_TRANSFER"]),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  cartItems: z.array(cartItemSchema).optional(),
});

// ----------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // 1. Check auth — get session from Better Auth
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Please log in to place your order" },
        { status: 401 },
      );
    }

    // 2. Parse + validate request body
    const body = await request.json();
    const parseResult = checkoutSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    // 3. If cartItems provided, sync to user's DB cart
    //    (This handles the case where the user is logged in but their
    //    cart is in localStorage — we merge it to DB before checkout.)
    if (parseResult.data.cartItems && parseResult.data.cartItems.length > 0) {
      // Clear existing DB cart first, then merge fresh
      await clearCart(session.user.id);
      await mergeCart(session.user.id, parseResult.data.cartItems);
    }

    // 4. Create the order
    const order = await createOrder({
      userId: session.user.id,
      userEmail: session.user.email,
      paymentMethod: parseResult.data.paymentMethod,
      shippingAddress: parseResult.data.shippingAddress,
      couponCode: parseResult.data.couponCode,
      notes: parseResult.data.notes,
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[checkout] Error:", error);

    // User-facing errors (thrown by createOrder)
    if (error instanceof Error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
