import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { getSupabase } from "@/lib/supabase";
import { AI_TOOLS } from "@/lib/data";

export default async function SavedToolsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/saved-tools");
  }

  // Fetch saved slugs from Supabase
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

  const savedTools = savedSlugs
    .map((slug) => AI_TOOLS.find((t) => t.slug === slug))
    .filter(Boolean);

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
        <p className="mt-2 text-white/70">
          {savedTools.length > 0
            ? `${savedTools.length} saved tool${savedTools.length === 1 ? "" : "s"}`
            : "Your saved tools will appear here."}
        </p>

        {savedTools.length === 0 ? (
          <div className="mt-8 rounded-lg border border-[var(--teal-bright)]/30 bg-white/5 p-8 text-center">
            <p className="text-white/70">
              No saved tools yet. Browse the directory and click the{" "}
              <span className="text-rose-400">♥</span> on any tool to save it.
            </p>
            <Button
              className="mt-4 bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)]"
              asChild
            >
              <Link href="/">Browse tools</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedTools.map((tool) => (
              <ToolCard
                key={tool!.id}
                tool={tool!}
                variant="dark"
                isFavourited={true}
                isSignedIn={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
