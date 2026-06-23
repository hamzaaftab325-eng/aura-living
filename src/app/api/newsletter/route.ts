/**
 * ============================================================================
 * POST /api/newsletter — Subscribe to newsletter
 * ============================================================================
 *
 * Saves email to NewsletterSubscriber table. Idempotent — if email already
 * exists, reactivates it (in case they previously unsubscribed).
 *
 * No auth required — anyone can subscribe.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().optional(),
  source: z.string().optional().default("website"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 signups per hour per IP
    const ip = getClientIP(request);
    const limit = rateLimit(`newsletter:${ip}`, RATE_LIMITS.NEWSLETTER);
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many signup attempts. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message },
        { status: 400 },
      );
    }

    const { email, name, source } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Upsert: if exists (even if unsubscribed), reactivate
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: normalizedEmail },
      update: {
        isActive: true,
        unsubscribedAt: null,
        ...(name && { name }),
      },
      create: {
        email: normalizedEmail,
        name: name ?? null,
        source,
        isActive: true,
        confirmedAt: new Date(), // Single opt-in for now
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Subscribed successfully",
      subscriberId: subscriber.id,
    });
  } catch (error) {
    console.error("[newsletter] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/newsletter — Unsubscribe
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 },
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { email: email.toLowerCase().trim() },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
