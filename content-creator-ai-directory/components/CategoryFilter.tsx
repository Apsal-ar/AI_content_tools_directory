"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ToolCategory } from "@/lib/data";

interface CategoryFilterProps {
  categories: ToolCategory[];
  activeCategory: ToolCategory | "All";
  onCategoryChange: (category: ToolCategory | "All") => void;
  variant?: "default" | "dark";
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  variant = "default",
}: CategoryFilterProps) {
  const isDark = variant === "dark";

  const buttonClass = (isActive: boolean) =>
    cn(
      "shrink-0 rounded-full",
      isDark &&
        (isActive
          ? "bg-[var(--fiery-vibrant-orange)] text-black border-[var(--fiery-vibrant-orange)] hover:bg-[var(--fiery-deep-orange)]"
          : "border-[var(--fiery-vibrant-orange)]/60 bg-transparent text-white hover:bg-white/10 hover:border-[var(--fiery-vibrant-orange)]")
    );

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant={isDark ? "outline" : activeCategory === "All" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("All")}
        className={buttonClass(activeCategory === "All")}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={isDark ? "outline" : activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={buttonClass(activeCategory === category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
