/**
 * ============================================================================
 * Email Sending Helper
 * ============================================================================
 *
 * Wrapper around Resend for sending transactional emails.
 * Server-side only.
 */

import { Resend } from "resend";
import type { OrderWithItems } from "@/lib/orders";
import OrderConfirmationEmail from "@/emails/order-confirmation";
import WelcomeEmail from "@/emails/welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Aura Living <onboarding@resend.dev>";

/**
 * Send an order confirmation email to the customer.
 */
export async function sendOrderConfirmationEmail(
  order: OrderWithItems,
): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber} | Aura Living`,
    react: OrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      items: order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        image: item.productImage,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      shippingAddress: {
        line1: order.shippingLine1,
        line2: order.shippingLine2,
        city: order.shippingCity,
        province: order.shippingProvince,
        postal: order.shippingPostal,
      },
      paymentMethod: order.paymentMethod,
    }),
  });

  if (error) {
    console.error("[email] Order confirmation email error:", error);
  } else {
    console.log(`[email] ✅ Order confirmation sent: ${data?.id}`);
  }
}

/**
 * Send a welcome email (after email verification).
 */
export async function sendWelcomeEmail(
  name: string,
  email: string,
): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to Aura Living 🌿",
    react: WelcomeEmail({ name }),
  });

  if (error) {
    console.error("[email] Welcome email error:", error);
  }
}
