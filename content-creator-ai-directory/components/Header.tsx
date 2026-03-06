"use client";

import Link from "next/link";
import { SignInButton, UserButton, Show, useUser } from "@clerk/nextjs";
import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import MandalaLogo from "@/components/MandalaLogo";

const clerkAppearance = {
  variables: {
    colorPrimary: "#00f5d4",
    colorBackground: "#0a0a0a",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.6)",
    colorInputBackground: "rgba(255,255,255,0.05)",
    colorInputText: "#ffffff",
    colorNeutral: "#ffffff",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    spacingUnit: "0.85rem",
  },
  elements: {
    userButtonPopoverCard:
      "!bg-[#0a0a0a] !border !border-[rgba(0,245,212,0.25)] !shadow-[0_0_30px_rgba(0,245,212,0.1)] !text-white !min-w-[220px] !max-w-[260px]",
    userButtonPopoverMain: "!p-3",
    userButtonPopoverFooter: "hidden",
    userButtonPopoverActionButton:
      "!text-white hover:!bg-white/10 !rounded-md !text-sm !py-1.5 !px-2 !w-full",
    userButtonPopoverActionButtonText: "!text-white !text-sm",
    userButtonPopoverActionButtonIcon: "!text-[var(--teal-bright)]",
    userPreview: "!gap-2.5 !p-2",
    userPreviewAvatarBox: "!size-8",
    userPreviewTextContainer: "!gap-0",
    userPreviewMainIdentifier: "!text-white !text-sm !font-medium",
    userPreviewSecondaryIdentifier: "!text-white/50 !text-xs",
    userButtonPopoverActionButtonIconBox: "!text-[var(--teal-bright)]",
    avatarBox:
      "!border-2 !border-[rgba(0,245,212,0.5)] hover:!border-[rgba(0,245,212,0.8)] !transition-colors",
    userButtonTrigger:
      "!rounded-full focus:!shadow-none focus-visible:!outline-none",
  },
};

function UserInfo() {
  const { user } = useUser();
  if (!user) return null;
  const name =
    user.fullName ??
    user.firstName ??
    user.username ??
    user.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "";
  return (
    <span className="hidden text-sm font-medium text-white sm:block">{name}</span>
  );
}

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(5, 5, 15, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0, 245, 212, 0.6)",
        boxShadow: "0 1px 20px rgba(0, 255, 255, 0.15)",
      }}
    >
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight hover:opacity-90"
        >
          <MandalaLogo size={53} />
          <span
            className="uppercase tracking-wider"
            style={{
              background: "linear-gradient(to right, #ffffff, var(--teal-bright))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Tools Directory
          </span>
        </Link>
        <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-2">
              <UserInfo />
              <UserButton appearance={clerkAppearance}>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My saved tools"
                    href="/saved-tools"
                    labelIcon={<Bookmark className="size-4" />}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
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
