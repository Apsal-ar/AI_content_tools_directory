import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default async function SubmitToolPage() {
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
          Submit a tool
        </h1>
        <p className="mt-2 text-white/70">
          Suggest a new AI tool for the directory. We&apos;ll review your
          submission.
        </p>
        <div className="mt-8 rounded-lg border border-[var(--teal-bright)]/30 bg-white/5 p-8">
          <p className="text-white/70">
            Submission form coming soon. For now, contact the team to suggest a
            tool.
          </p>
          <Button
            className="mt-4 border-[var(--teal-bright)] text-[var(--teal-bright)] hover:bg-[var(--teal-bright)]/10"
            variant="outline"
            asChild
          >
            <Link href="/">Back to directory</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
