import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white hover:opacity-90"
        >
          <Sparkles
            className="h-5 w-5"
            style={{ color: "var(--teal-bright)" }}
          />
          <span className="uppercase tracking-wider">AI Tools Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--teal-bright)] text-[var(--teal-bright)] hover:bg-[var(--teal-bright)]/10 hover:text-[var(--teal-bright)]"
          >
            Try featured
          </Button>
          <Button
            size="sm"
            className="bg-[var(--teal-bright)] text-black hover:bg-[var(--teal-medium)]"
          >
            Submit tool
          </Button>
        </div>
      </div>
    </header>
  );
}
