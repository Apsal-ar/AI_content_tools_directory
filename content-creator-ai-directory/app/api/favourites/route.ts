import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** GET /api/favourites — returns { slugs: string[] } for the signed-in user */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ slugs: [] }, { status: 200 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("user_favourites")
    .select("tool_slug")
    .eq("user_id", userId);

  if (error) {
    console.error("Supabase get favourites error:", error);
    return NextResponse.json({ slugs: [] }, { status: 200 });
  }

  return NextResponse.json({ slugs: (data ?? []).map((r) => r.tool_slug) });
}

/** POST /api/favourites — toggles a favourite: { slug: string } */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Check if already favourited
  const { data: existing } = await supabase
    .from("user_favourites")
    .select("id")
    .eq("user_id", userId)
    .eq("tool_slug", slug)
    .maybeSingle();

  if (existing) {
    // Remove
    const { error: deleteError } = await supabase
      .from("user_favourites")
      .delete()
      .eq("user_id", userId)
      .eq("tool_slug", slug);
    if (deleteError) {
      console.error("Supabase delete favourite error:", deleteError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    return NextResponse.json({ action: "removed", slug });
  } else {
    // Add
    const { error: insertError } = await supabase
      .from("user_favourites")
      .insert({ user_id: userId, tool_slug: slug });
    if (insertError) {
      console.error("Supabase insert favourite error:", insertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    return NextResponse.json({ action: "added", slug });
  }
}
