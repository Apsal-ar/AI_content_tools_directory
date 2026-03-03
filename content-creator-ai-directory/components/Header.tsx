import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LogoParticleBurst } from "@/components/LogoParticleBurst";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white hover:opacity-90"
        >
          <LogoParticleBurst width={44} height={44}>
            <Sparkles
              className="h-6 w-6"
              style={{ color: "var(--teal-bright)" }}
            />
          </LogoParticleBurst>
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
            className="bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)] hover:shadow-[var(--neon-glow-strong)]"
          >
            Submit tool
          </Button>
        </div>
      </div>
    </header>
  );
}
