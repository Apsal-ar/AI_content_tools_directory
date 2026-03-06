"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { useFavourites } from "@/hooks/useFavourites";
import type { AITool } from "@/lib/data";

interface SavedToolsGridProps {
  initialTools: AITool[];
}

export function SavedToolsGrid({ initialTools }: SavedToolsGridProps) {
  const { slugs, toggle } = useFavourites();

  // Once the hook has loaded, filter to only still-favourited tools.
  // Before the hook loads (slugs is empty Set), fall back to initialTools
  // so the page doesn't flash empty.
  const tools =
    slugs.size === 0
      ? initialTools
      : initialTools.filter((t) => slugs.has(t.slug));

  const count = tools.length;

  return (
    <>
      <p className="mt-2 text-white/70">
        {count > 0
          ? `${count} saved tool${count === 1 ? "" : "s"}`
          : "Your saved tools will appear here."}
      </p>

      {count === 0 ? (
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
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              variant="dark"
              isFavourited={slugs.has(tool.slug)}
              isSignedIn={true}
              onToggleFavourite={toggle}
            />
          ))}
        </div>
      )}
    </>
  );
}
