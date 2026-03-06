import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

const CATEGORIES = ["Video", "Audio", "Copywriting", "Image", "Productivity", "Code", "Other"] as const;
const PRICING = ["Free", "Freemium", "Paid", "Enterprise"] as const;

export type SubmitToolBody = {
  tool_name: string;
  website_url: string;
  short_description: string;
  long_description?: string;
  category: string;
  pricing: string;
  tags?: string;
  logo_url?: string;
};

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function parseTags(tagsStr: string | undefined): string[] {
  if (!tagsStr?.trim()) return [];
  return tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ??
      user?.emailAddresses?.[0]?.emailAddress ??
      "";

    if (!email) {
      return NextResponse.json(
        { error: "Could not determine your email. Please ensure your account has an email." },
        { status: 400 }
      );
    }

    const body: SubmitToolBody = await request.json();

    const tool_name = typeof body.tool_name === "string" ? body.tool_name.trim() : "";
    const website_url = typeof body.website_url === "string" ? body.website_url.trim() : "";
    const short_description = typeof body.short_description === "string" ? body.short_description.trim() : "";
    const long_description = typeof body.long_description === "string" ? body.long_description.trim() : undefined;
    const category = typeof body.category === "string" ? body.category : "";
    const pricing = typeof body.pricing === "string" ? body.pricing : "";
    const logo_url = typeof body.logo_url === "string" ? body.logo_url.trim() || undefined : undefined;

    if (!tool_name) {
      return NextResponse.json({ error: "Tool name is required" }, { status: 400 });
    }
    if (!website_url || !isValidUrl(website_url)) {
      return NextResponse.json({ error: "A valid website URL is required" }, { status: 400 });
    }
    if (!short_description) {
      return NextResponse.json({ error: "Short description is required" }, { status: 400 });
    }
    if (short_description.length > 160) {
      return NextResponse.json({ error: "Short description must be 160 characters or less" }, { status: 400 });
    }
    if (long_description && long_description.length > 1000) {
      return NextResponse.json({ error: "Long description must be 1000 characters or less" }, { status: 400 });
    }
    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (pricing && !PRICING.includes(pricing as (typeof PRICING)[number])) {
      return NextResponse.json({ error: "Invalid pricing model" }, { status: 400 });
    }

    const tags = parseTags(body.tags);

    const supabase = getSupabase();
    const { data: row, error: insertError } = await supabase
      .from("tool_submissions")
      .insert({
        tool_name,
        website_url,
        short_description,
        long_description: long_description || null,
        category,
        pricing: pricing || null,
        tags: tags.length ? tags : null,
        logo_url: logo_url || null,
        submitted_by_user_id: userId,
        submitted_by_email: email,
        status: "pending",
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      const detail = insertError.message ?? String(insertError);
      const isDev = process.env.NODE_ENV === "development";
      return NextResponse.json(
        {
          error: isDev
            ? `Database error: ${detail}`
            : "Failed to save submission. Please try again.",
        },
        { status: 500 }
      );
    }

    if (NOTIFICATION_EMAIL && process.env.RESEND_API_KEY) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "AI Tools Directory <onboarding@resend.dev>";
      await resend.emails.send({
        from: fromEmail,
        to: [NOTIFICATION_EMAIL],
        subject: `[AI Tools Directory] New tool submission: ${tool_name}`,
        html: `
          <h2>New tool submission</h2>
          <p><strong>Tool name:</strong> ${escapeHtml(tool_name)}</p>
          <p><strong>Website URL:</strong> <a href="${escapeHtml(website_url)}">${escapeHtml(website_url)}</a></p>
          <p><strong>Short description:</strong> ${escapeHtml(short_description)}</p>
          ${long_description ? `<p><strong>Long description:</strong><br/>${escapeHtml(long_description)}</p>` : ""}
          <p><strong>Category:</strong> ${escapeHtml(category)}</p>
          <p><strong>Pricing:</strong> ${escapeHtml(pricing)}</p>
          ${tags.length ? `<p><strong>Tags:</strong> ${escapeHtml(tags.join(", "))}</p>` : ""}
          ${logo_url ? `<p><strong>Logo URL:</strong> ${escapeHtml(logo_url)}</p>` : ""}
          <p><strong>Submitted by (Clerk user ID):</strong> ${escapeHtml(userId)}</p>
          <p><strong>Submitted by (email):</strong> ${escapeHtml(email)}</p>
          <p><strong>Status:</strong> pending</p>
          <p><strong>Submitted at:</strong> ${row?.created_at ?? new Date().toISOString()}</p>
        `,
      }).catch((err) => {
        console.error("Resend email error:", err);
      });
    }

    return NextResponse.json({
      success: true,
      id: row?.id,
      message: "Submission received. We'll review it shortly.",
    });
  } catch (e) {
    console.error("submit-tool API error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
