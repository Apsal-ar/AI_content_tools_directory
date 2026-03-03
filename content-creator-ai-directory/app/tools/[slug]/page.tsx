import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/lib/data";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/"
            className="mb-8 -ml-2 flex items-center gap-2 text-white/70 hover:text-[var(--teal-bright)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>
        </Button>

        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-2xl font-semibold"
              style={{
                backgroundColor: "var(--teal-dark)",
                color: "var(--teal-bright)",
              }}
            >
              {tool.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {tool.name}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-[var(--teal-bright)]/50 text-[var(--teal-bright)]"
                  >
                    {tool.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white/80"
                  >
                    {tool.pricing}
                  </Badge>
                  {tool.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-[var(--teal-medium)]/50 text-[var(--teal-light)]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-white/70">{tool.description}</p>
              <Button
                asChild
                className="bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)]"
              >
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
