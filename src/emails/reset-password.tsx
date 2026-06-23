/**
 * ============================================================================
 * Reset Password Email Template
 * ============================================================================
 *
 * Sent when user requests password reset. Contains a reset link that expires
 * in 1 hour. Clicking the link takes user to /auth/reset-password?token=...
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

export default function ResetPasswordEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Aura Living password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Aura Living</Text>
          </Section>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We received a request to reset your password. Click the button below
            to choose a new password for your Aura Living account.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          <Text style={text}>
            If the button doesn&apos;t work, copy and paste this link into your
            browser:
          </Text>
          <Text style={link}>{resetUrl}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            This link expires in 1 hour for security. If you didn&apos;t request
            a password reset, you can safely ignore this email — your password
            will remain unchanged.
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
