import Link from "next/link";

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
        "flex h-full flex-col transition-shadow hover:shadow-md",
        isDark &&
          "border-white/10 bg-white/5 text-white hover:border-[var(--teal-bright)]/30"
      )}
    >
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
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
