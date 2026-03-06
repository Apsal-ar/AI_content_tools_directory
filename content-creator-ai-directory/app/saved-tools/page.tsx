import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getSupabase } from "@/lib/supabase";
import { AI_TOOLS } from "@/lib/data";
import { SavedToolsGrid } from "@/components/SavedToolsGrid";

export default async function SavedToolsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/saved-tools");
  }

  // Fetch saved slugs from Supabase (server-side, for initial render)
  let savedSlugs: string[] = [];
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("user_favourites")
      .select("tool_slug")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    savedSlugs = (data ?? []).map((r) => r.tool_slug);
  } catch {
    // table may not exist yet — show empty state
  }

  const initialTools = savedSlugs
    .map((slug) => AI_TOOLS.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-white/70 transition-colors hover:text-[var(--teal-bright)]"
        >
          <ArrowLeft className="size-4" />
          Back to directory
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          My saved tools
        </h1>

        <SavedToolsGrid initialTools={initialTools} />
      </div>
    </div>
  );
}
