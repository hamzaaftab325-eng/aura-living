/**
 * ============================================================================
 * Welcome Email Template
 * ============================================================================
 *
 * Sent after the user successfully verifies their email. Welcomes them to
 * Aura Living and highlights key features.
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
} from "@react-email/components";

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Aura Living — your home, elevated ✨</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Aura Living</Text>
          </Section>
          <Heading style={h1}>Welcome to the family, {name}!</Heading>
          <Text style={text}>
            Thank you for joining Aura Living. Your email is verified and your
            account is now active.
          </Text>
          <Text style={text}>
            We&apos;re thrilled to have you. Explore our curated collection of
            handcrafted home decor — from elegant lighting to artisan ceramics
            — all designed to make your home a sanctuary.
          </Text>
          <Section style={buttonSection}>
            <Button
              style={button}
              href="https://aura-living-two.vercel.app/shop"
            >
              Start Shopping
            </Button>
          </Section>
          <Hr style={hr} />
          <Heading style={h2}>A few things you can do:</Heading>
          <Text style={text}>🛍️ Browse our newest arrivals and bestsellers</Text>
          <Text style={text}>❤️ Save your favorites to a wishlist</Text>
          <Text style={text}>📦 Track your orders anytime from your account</Text>
          <Text style={text}>
            🎟️ Use code <strong>WELCOME10</strong> for 10% off your first order
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Aura Living — Where Comfort Meets Style
            <br />
            Karachi, Pakistan
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
  marginBottom: "16px",
};

const text = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4A4A4A",
  marginBottom: "12px",
};

const buttonSection = {
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

const hr = {
  borderColor: "#E5E5E5",
  margin: "32px 0",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
  lineHeight: "20px",
  textAlign: "center" as const,
};
