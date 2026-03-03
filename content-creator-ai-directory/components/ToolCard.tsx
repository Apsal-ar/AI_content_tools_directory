import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
}

export function ToolCard({ tool, variant = "default" }: ToolCardProps) {
  const isDark = variant === "dark";

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden transition-all duration-200",
        isDark &&
          "border-[var(--teal-bright)]/40 bg-white/5 text-white hover:border-[var(--teal-bright)] hover:shadow-[var(--neon-glow)]"
      )}
    >
      <WebsitePreview
        websiteUrl={tool.websiteUrl}
        alt={tool.name}
        className="aspect-video w-full shrink-0"
      />
      <CardHeader className="flex flex-row items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
            isDark
              ? "bg-[var(--teal-dark)]/50 text-[var(--teal-bright)]"
              : "bg-muted text-muted-foreground"
          )}
        >
          <span className="text-xl font-semibold">{tool.name.charAt(0)}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <CardTitle className="line-clamp-1">
            <Link href={`/tools/${tool.slug}`} className="hover:underline">
              {tool.name}
            </Link>
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={isDark ? "outline" : "secondary"}
              className={cn(
                "text-xs",
                isDark && "border-[var(--teal-bright)]/50 text-[var(--teal-bright)]"
              )}
            >
              {tool.category}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                isDark && "border-white/30 text-white/80"
              )}
            >
              {tool.pricing}
            </Badge>
            {tool.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "text-xs font-normal",
                  isDark && "border-[var(--teal-medium)]/50 text-[var(--teal-light)]"
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription
          className={cn("line-clamp-2", isDark && "text-white/70")}
        >
          {tool.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className={
            isDark
              ? "border-[var(--teal-bright)] text-[var(--teal-bright)] hover:bg-[var(--teal-bright)]/10"
              : undefined
          }
        >
          <Link href={`/tools/${tool.slug}`}>View details</Link>
        </Button>
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
    </Card>
  );
}
