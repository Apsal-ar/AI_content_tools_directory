"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ToolCard } from "@/components/ToolCard";
import {
  AI_TOOLS,
  CATEGORIES,
  type ToolCategory,
  type AITool,
} from "@/lib/data";

const fieryOrange = "var(--fiery-vibrant-orange)";
const fieryNavy = "var(--fiery-navy)";

export function ToolsSection() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ToolCategory | "All">("All");

  const filteredTools = useMemo(() => {
    return AI_TOOLS.filter((tool: AITool) => {
      const matchesSearch =
        search === "" ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || tool.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleReset = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - black background */}
      <section className="bg-black px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Subtle icon */}
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border-2"
            style={{
              borderColor: "rgba(244, 140, 6, 0.4)",
              boxShadow: "0 0 24px rgba(244, 140, 6, 0.15)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={fieryOrange}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
              <path d="M12 12l1.5 4.5L18 18l-4.5 1.5L12 21l-1.5-4.5L6 18l4.5-1.5L12 12z" />
            </svg>
          </div>

          {/* Title and subtitle */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              The latest AI tools for content creators
            </h1>
            <p className="mt-4 text-lg text-white/80 sm:text-xl">
              Search and filter through hundreds of the top AI tools launching
              every day.
            </p>
          </div>

          {/* Popular Tags */}
          <div className="mt-10 text-center">
            <p
              className="mb-3 text-sm font-medium uppercase tracking-wider"
              style={{ color: fieryOrange }}
            >
              Popular tags
            </p>
            <div className="flex justify-center">
              <CategoryFilter
                categories={CATEGORIES}
                activeCategory={category}
                onCategoryChange={setCategory}
                variant="dark"
              />
            </div>
          </div>

          {/* Search and filter bar */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: fieryOrange }}
              />
              <Input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-white/20 bg-white/5 pl-9 text-white placeholder:text-white/50 focus-visible:ring-[var(--fiery-vibrant-orange)]"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/70">
                {filteredTools.length} tools
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={handleReset}
                className="h-auto p-0 text-[var(--fiery-vibrant-orange)] hover:text-[var(--fiery-golden)]"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid - dark navy background */}
      <section
        className="container mx-auto px-4 py-12 sm:px-6 lg:px-8"
        style={{ background: fieryNavy }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="dark" />
            ))}
          </div>
          {filteredTools.length === 0 && (
            <p className="py-12 text-center text-white/60">
              No tools found. Try adjusting your search or filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
