"use client";

import Link from "next/link";
import { ExternalLink, Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WebsitePreview } from "@/components/WebsitePreview";
import type { AITool } from "@/lib/data";

interface ToolCardProps {
  tool: AITool;
  variant?: "default" | "dark";
  isFavourited?: boolean;
  isSignedIn?: boolean;
  onToggleFavourite?: (slug: string) => void;
}

export function ToolCard({
  tool,
  variant = "default",
  isFavourited = false,
  isSignedIn = false,
  onToggleFavourite,
}: ToolCardProps) {
  const isDark = variant === "dark";

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden transition-all duration-200 rounded-sm",
        isDark &&
          "border-[var(--teal-bright)]/40 bg-white/5 text-white hover:border-[var(--teal-bright)] hover:shadow-[var(--neon-glow)]"
      )}
    >
      {/* Top part: screenshot with margin inside */}
      <div className="shrink-0">
        <div className="p-[5%]">
          <WebsitePreview
            websiteUrl={tool.websiteUrl}
            alt={tool.name}
            className="aspect-video mx-auto w-[90%] overflow-hidden rounded-sm"
          />
        </div>
      </div>
      {/* Teal separator */}
      <div className="h-px shrink-0 bg-[var(--teal-bright)]/60" aria-hidden />
      {/* Bottom part: text content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className="space-y-0">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="line-clamp-1 min-w-0 flex-1 text-xl">
              <Link href={`/tools/${tool.slug}`} className="hover:underline">
                {tool.name}
              </Link>
            </CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 rounded-md text-xs",
                isDark && "border-white/30 text-white/80"
              )}
            >
              {tool.pricing}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <CardDescription
            className={cn("line-clamp-2", isDark && "text-white/70")}
          >
            {tool.description}
          </CardDescription>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={isDark ? "outline" : "secondary"}
              className={cn(
                "rounded-md text-xs",
                isDark && "border-[var(--teal-bright)]/50 text-[var(--teal-bright)]"
              )}
            >
              {tool.category}
            </Badge>
            {tool.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "rounded-md text-xs font-normal",
                  isDark && "border-[var(--teal-medium)]/50 text-[var(--teal-light)]"
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2">
          {/* Heart / favourite button */}
          <button
            type="button"
            aria-label={
              !isSignedIn
                ? "Sign in to save tools"
                : isFavourited
                  ? "Remove from saved"
                  : "Save tool"
            }
            title={
              !isSignedIn
                ? "Sign in to save tools"
                : isFavourited
                  ? "Remove from saved"
                  : "Save tool"
            }
            disabled={!isSignedIn}
            onClick={() => isSignedIn && onToggleFavourite?.(tool.slug)}
            className={cn(
              "group flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
              !isSignedIn
                ? "cursor-not-allowed opacity-30"
                : isFavourited
                  ? "text-rose-400 hover:text-rose-300"
                  : "text-white/40 hover:text-rose-400 hover:scale-110"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-200",
                isFavourited && "fill-current"
              )}
            />
          </button>

          {/* Visit website */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className={
              isDark
                ? "border-[var(--teal-medium)] text-[var(--teal-light)] hover:bg-[var(--teal-medium)]/20"
                : undefined
            }
          >
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit website
            </a>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
