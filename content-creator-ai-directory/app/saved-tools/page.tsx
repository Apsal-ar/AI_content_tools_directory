import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default async function SavedToolsPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

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
          Your bookmarked tools will appear here. Save tools from the directory
          to see them in this list.
        </p>
        <div className="mt-8 rounded-lg border border-[var(--teal-bright)]/30 bg-white/5 p-8 text-center">
          <p className="text-white/70">
            No saved tools yet. Browse the directory and save tools you like.
          </p>
          <Button
            className="mt-4 bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)]"
            asChild
          >
            <Link href="/">Browse tools</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
