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
            style={{ color: "var(--fiery-vibrant-orange)" }}
          />
          <span className="uppercase tracking-wider">AI Tools Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--fiery-vibrant-orange)] text-[var(--fiery-vibrant-orange)] hover:bg-[var(--fiery-vibrant-orange)]/10 hover:text-[var(--fiery-vibrant-orange)]"
          >
            Try featured
          </Button>
          <Button
            size="sm"
            className="bg-[var(--fiery-vibrant-orange)] text-black hover:bg-[var(--fiery-deep-orange)]"
          >
            Submit tool
          </Button>
        </div>
      </div>
    </header>
  );
}
