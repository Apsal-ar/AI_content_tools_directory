"use client";

import Link from "next/link";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import MandalaLogo from "@/components/MandalaLogo";

const clerkAppearance = {
  variables: {
    colorPrimary: "#00f5d4",
    colorBackground: "#000000",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.7)",
    colorInputBackground: "rgba(255,255,255,0.05)",
    colorInputText: "#ffffff",
    borderRadius: "0.5rem",
  },
  elements: {
    formButtonPrimary:
      "bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)]",
    card: "bg-black border border-[var(--teal-bright)]/30",
    headerTitle: "text-white",
    headerSubtitle: "text-white/70",
    socialButtonsBlockButton: "border-[var(--teal-bright)]/50 text-[var(--teal-bright)]",
    formFieldLabel: "text-white/90",
    formFieldInput:
      "bg-white/5 border-white/20 text-white placeholder:text-white/50",
    footerActionLink: "text-[var(--teal-bright)] hover:text-[var(--teal-light)]",
    identityPreviewEditButton: "text-[var(--teal-bright)]",
    menuButton: "text-white hover:bg-white/10",
    menuList: "bg-black border border-[var(--teal-bright)]/30",
    userButtonBox: "text-white",
    userButtonTrigger: "focus:shadow-[var(--neon-glow)]",
    avatarBox: "border-2 border-[var(--teal-bright)]/50",
  },
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--teal-bright)] bg-black">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white hover:opacity-90"
        >
          <MandalaLogo size={44} />
          <span className="uppercase tracking-wider">AI Tools Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button
                size="sm"
                className="bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)] hover:shadow-[var(--neon-glow-strong)]"
              >
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton appearance={clerkAppearance}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My saved tools"
                  href="/saved-tools"
                  labelIcon={<Bookmark className="size-4" />}
                />
              </UserButton.MenuItems>
            </UserButton>
          </Show>
          <Button
            size="sm"
            className="bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)] hover:shadow-[var(--neon-glow-strong)]"
            asChild
          >
            <Link href="/submit-tool">Submit tool</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
