/**
 * ============================================================================
 * Verify Email Template
 * ============================================================================
 *
 * Sent immediately after signup. Contains a verification link that, when
 * clicked, marks the user's email as verified.
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

export default function VerifyEmailEmail({
  name,
  verificationUrl,
}: {
  name: string;
  verificationUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address to activate your Aura Living account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Aura Living</Text>
          </Section>
          <Heading style={h1}>Verify your email</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Welcome to Aura Living! Please verify your email address to activate
            your account and start shopping our curated collection of premium
            home decor.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            If the button doesn&apos;t work, copy and paste this link into your
            browser:
          </Text>
          <Text style={link}>{verificationUrl}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            This link expires in 24 hours. If you didn&apos;t create an account,
            you can safely ignore this email.
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

const text = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4A4A4A",
  marginBottom: "16px",
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

const link = {
  fontSize: "13px",
  color: "#888888",
  wordBreak: "break-all" as const,
  marginBottom: "24px",
};

const hr = {
  borderColor: "#E5E5E5",
  margin: "32px 0",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
  lineHeight: "18px",
};
