/**
 * ============================================================================
 * Order Confirmation Email Template
 * ============================================================================
 *
 * Sent immediately after an order is placed. Shows:
 * - Order number
 * - Item list with images, quantities, prices
 * - Subtotal, shipping, discount, total (all in PKR)
 * - Shipping address
 * - Payment method (COD)
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: bigint;
    lineTotal: bigint;
    image: string;
  }>;
  subtotal: bigint;
  shippingCost: bigint;
  discount: bigint;
  total: bigint;
  shippingAddress: {
    line1: string;
    line2: string | null;
    city: string;
    province: string;
    postal: string;
  };
  paymentMethod: string;
}

function formatPKR(paisa: bigint): string {
  const rupees = Number(paisa) / 100;
  return `Rs. ${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees)}`;
}

export default function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingCost,
  discount,
  total,
  shippingAddress,
  paymentMethod,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmed — {orderNumber} | Aura Living</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Aura Living</Text>
          </Section>

          <Heading style={h1}>Order Confirmed! 🎉</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your order. We&apos;ve received it and will start
            processing it right away. Here are the details:
          </Text>

          <Section style={orderNumberBox}>
            <Text style={orderNumberLabel}>ORDER NUMBER</Text>
            <Text style={orderNumberValue}>{orderNumber}</Text>
          </Section>

          <Heading style={h2}>Items Ordered</Heading>
          {items.map((item, i) => (
            <Section key={i} style={itemRow}>
              <Img
                src={item.image}
                alt={item.name}
                width="64"
                height="64"
                style={itemImage}
              />
              <Section style={itemDetails}>
                <Text style={itemName}>{item.name}</Text>
                <Text style={itemMeta}>
                  Qty: {item.quantity} × {formatPKR(item.unitPrice)}
                </Text>
              </Section>
              <Text style={itemTotal}>{formatPKR(item.lineTotal)}</Text>
            </Section>
          ))}

          <Hr style={hr} />

          <Section style={totalsSection}>
            <Text style={totalLine}>
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </Text>
            <Text style={totalLine}>
              <span>Shipping</span>
              <span>
                {shippingCost === 0n ? "FREE" : formatPKR(shippingCost)}
              </span>
            </Text>
            {discount > 0n && (
              <Text style={discountLine}>
                <span>Discount</span>
                <span>-{formatPKR(discount)}</span>
              </Text>
            )}
            <Hr style={hr} />
            <Text style={grandTotal}>
              <span>Total</span>
              <span>{formatPKR(total)}</span>
            </Text>
          </Section>

          <Heading style={h2}>Shipping Address</Heading>
          <Text style={addressText}>
            {customerName}
            <br />
            {shippingAddress.line1}
            {shippingAddress.line2 && (
              <>
                <br />
                {shippingAddress.line2}
              </>
            )}
            <br />
            {shippingAddress.city}, {shippingAddress.province}
            <br />
            {shippingAddress.postal}
            <br />
            Pakistan
          </Text>

          <Heading style={h2}>Payment Method</Heading>
          <Text style={text}>
            {paymentMethod === "COD"
              ? "Cash on Delivery — Pay when your order arrives"
              : paymentMethod}
          </Text>

          <Hr style={hr} />

          <Section style={ctaSection}>
            <Button
              style={button}
              href="https://aura-living-two.vercel.app/account/orders"
            >
              Track Your Order
            </Button>
          </Section>

          <Text style={footer}>
            Thank you for shopping with Aura Living.
            <br />
            If you have any questions, reply to this email or contact us at
            support@auraliving.pk
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#FAFAF7",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const brand = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#2C2C2C",
  letterSpacing: "0.05em",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#2C2C2C",
  marginBottom: "24px",
};

const h2 = {
  fontSize: "18px",
  fontWeight: "bold" as const,
  color: "#2C2C2C",
  marginTop: "32px",
  marginBottom: "16px",
};

const text = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4A4A4A",
  marginBottom: "16px",
};

const orderNumberBox = {
  backgroundColor: "#FAF8F0",
  border: "1px solid #D4AF37",
  borderRadius: "6px",
  padding: "16px 24px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const orderNumberLabel = {
  fontSize: "11px",
  color: "#999",
  letterSpacing: "0.1em",
  marginBottom: "4px",
};

const orderNumberValue = {
  fontSize: "20px",
  fontWeight: "bold" as const,
  color: "#D4AF37",
};

const itemRow = {
  display: "flex" as const,
  marginBottom: "16px",
  paddingBottom: "16px",
  borderBottom: "1px solid #F0F0F0",
};

const itemImage = {
  borderRadius: "4px",
  width: "64px",
  height: "64px",
  objectFit: "cover" as const,
  marginRight: "16px",
  flexShrink: 0,
};

const itemDetails = {
  flex: 1,
};

const itemName = {
  fontSize: "14px",
  fontWeight: "bold" as const,
  color: "#2C2C2C",
  marginBottom: "4px",
};

const itemMeta = {
  fontSize: "13px",
  color: "#888",
};

const itemTotal = {
  fontSize: "14px",
  fontWeight: "bold" as const,
  color: "#2C2C2C",
  textAlign: "right" as const,
};

const hr = {
  borderColor: "#E5E5E5",
  margin: "24px 0",
};

const totalsSection = {
  marginBottom: "24px",
};

const totalLine = {
  fontSize: "14px",
  color: "#4A4A4A",
  display: "flex" as const,
  justifyContent: "space-between",
  marginBottom: "8px",
};

const discountLine = {
  fontSize: "14px",
  color: "#22A06B",
  display: "flex" as const,
  justifyContent: "space-between",
  marginBottom: "8px",
};

const grandTotal = {
  fontSize: "18px",
  fontWeight: "bold" as const,
  color: "#2C2C2C",
  display: "flex" as const,
  justifyContent: "space-between",
};

const addressText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#4A4A4A",
  marginBottom: "16px",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#D4AF37",
  borderRadius: "6px",
  color: "#FFFFFF",
  fontSize: "15px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "14px 32px",
  display: "inline-block",
};

const footer = {
  fontSize: "12px",
  color: "#999",
  lineHeight: "20px",
  textAlign: "center" as const,
  marginTop: "24px",
};
