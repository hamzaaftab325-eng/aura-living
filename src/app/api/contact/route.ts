/**
 * POST /api/contact — Submit a contact message
 * Saves to ContactMessage table + sends email notification to admin.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIP, RATE_LIMITS } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 messages per hour per IP
    const ip = getClientIP(request);
    const limit = rateLimit(`contact:${ip}`, RATE_LIMITS.NEWSLETTER);
    if (!limit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many messages. Please try again later." },
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

    const { name, email, phone, subject, message } = parseResult.data;

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        subject,
        message,
      },
    });

    // Send email notification to admin (non-blocking)
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const adminEmail = process.env.EMAIL_FROM ?? "noreply@auraliving.pk";

      await resend.emails.send({
        from: adminEmail,
        to: "hamzaaftab325@gmail.com", // Admin email
        subject: `New Contact: ${subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });
    } catch (emailErr) {
      console.error("[contact] Failed to send admin email:", emailErr);
      // Don't fail the request — message is saved in DB
    }

    return NextResponse.json({
      ok: true,
      message: "Message sent successfully. We'll get back to you soon!",
    });
  } catch (error) {
    console.error("[contact] POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
