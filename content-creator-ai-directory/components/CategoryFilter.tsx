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

  const getVariant = (isActive: boolean) => {
    if (!isDark) return isActive ? "default" : "outline";
    return isActive ? "default" : "outline";
  };

  const buttonClass = (isActive: boolean) =>
    cn(
      "shrink-0 rounded-full transition-all duration-200",
      isDark &&
        (isActive
          ? "!bg-[var(--teal-bright)] !text-black !border-[var(--teal-bright)] shadow-[var(--neon-glow)] hover:!bg-[var(--teal-light)] hover:shadow-[var(--neon-glow-strong)]"
          : "border-[var(--teal-bright)]/50 bg-transparent text-white hover:bg-[var(--teal-bright)]/10 hover:border-[var(--teal-bright)]")
    );

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant={getVariant(activeCategory === "All")}
        size="sm"
        onClick={() => onCategoryChange("All")}
        className={buttonClass(activeCategory === "All")}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={getVariant(activeCategory === category)}
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
