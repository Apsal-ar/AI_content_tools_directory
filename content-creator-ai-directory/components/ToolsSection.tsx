"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryFilter } from "@/components/CategoryFilter";
import MandalaLogo from "@/components/MandalaLogo";
import { ToolCard } from "@/components/ToolCard";
import {
  AI_TOOLS,
  CATEGORIES,
  ROLES,
  CATEGORY_FILTER_OPTIONS,
  getToolRole,
  toolMatchesCategoryFilter,
  type AITool,
  type Role,
  type CategoryFilterValue,
  type SortOption,
  type ToolCategory,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const tealAccent = "var(--teal-bright)";

const filterBarBorder = "border border-white/20";
const filterBarDivider = "border-r border-white/20";

export function ToolsSection() {
  const [search, setSearch] = useState("");
  const [tagCategory, setTagCategory] = useState<ToolCategory | "All">("All");
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryFilterValue[]
  >([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortSelectMounted, setSortSelectMounted] = useState(false);
  useEffect(() => setSortSelectMounted(true), []);

  const filteredTools = useMemo(() => {
    let list = AI_TOOLS.filter((tool: AITool) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      const matchesTag =
        tagCategory === "All" || tool.category === tagCategory;
      const matchesRole =
        selectedRoles.length === 0 ||
        selectedRoles.includes(getToolRole(tool));
      const matchesCategoryFilter =
        selectedCategories.length === 0 ||
        selectedCategories.some((c) => toolMatchesCategoryFilter(tool, c));
      return (
        matchesSearch && matchesTag && matchesRole && matchesCategoryFilter
      );
    });
    list = [...list].sort((a, b) => {
      if (sort === "newest") {
        const dateA = a.addedAt ?? "";
        const dateB = b.addedAt ?? "";
        return dateB.localeCompare(dateA);
      }
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
    return list;
  }, [search, tagCategory, selectedRoles, selectedCategories, sort]);

  const handleReset = () => {
    setSearch("");
    setTagCategory("All");
    setSelectedRoles([]);
    setSelectedCategories([]);
    setSort("newest");
  };

  const toggleRole = (role: Role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleCategory = (value: CategoryFilterValue) => {
    if (value === "all") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  };

  const selectTriggerClass =
    "border-0 bg-transparent shadow-none rounded-none h-auto py-3 text-white/90 hover:bg-white/5 focus:ring-0 focus-visible:ring-0 data-[placeholder]:text-white/60";

  const roleLabel =
    selectedRoles.length === 0
      ? "Filter by role"
      : selectedRoles.length === 1
        ? selectedRoles[0]
        : `${selectedRoles.length} roles`;

  const categoryLabel =
    selectedCategories.length === 0
      ? "Filter by category"
      : selectedCategories.length === 1
        ? CATEGORY_FILTER_OPTIONS.find((o) => o.value === selectedCategories[0])
            ?.label ?? "Filter by category"
        : `${selectedCategories.length} categories`;

  return (
    <div className="min-h-screen">
      {/* Hero Section - black background */}
      <section className="bg-black px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl">
          {/* Logo */}
          <div className="mb-12 flex justify-center sm:mb-16">
            <MandalaLogo size={120} className="shrink-0" />
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

          {/* Popular tags - single selection: clicking a tag selects only that tag */}
          <div className="mt-10 text-center">
            <p
              className="mb-3 text-sm font-medium uppercase tracking-wider"
              style={{ color: tealAccent }}
            >
              Popular tags
            </p>
            <div className="flex justify-center">
              <CategoryFilter
                categories={CATEGORIES}
                activeCategory={tagCategory}
                onCategoryChange={(cat) => setTagCategory(cat)}
                variant="dark"
              />
            </div>
          </div>

          {/* 4-part filter bar */}
          <div
            className={`mt-8 flex flex-col overflow-hidden rounded-lg sm:flex-row sm:items-stretch ${filterBarBorder}`}
          >
            {/* 1. Search */}
            <div
              className={`flex flex-1 items-center ${filterBarDivider} sm:border-r`}
            >
              <Search
                className="ml-3 h-4 w-4 shrink-0 sm:ml-4"
                style={{ color: tealAccent }}
              />
              <Input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent py-3 pl-2 pr-3 text-white placeholder:text-white/50 focus-visible:ring-0 sm:pl-3"
              />
            </div>

            {/* 2. Filter by role (multi-select) */}
            <div
              className={`flex min-w-0 flex-1 items-center sm:min-w-[140px] ${filterBarDivider}`}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between gap-2 rounded-none border-0 bg-transparent py-3 pl-4 pr-3 text-left text-white/90 hover:bg-white/5",
                      selectTriggerClass
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Filter
                        className="h-4 w-4 shrink-0"
                        style={{ color: tealAccent }}
                      />
                      <span className={cn(!roleLabel.startsWith("Filter") && "capitalize")}>
                        {roleLabel}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="max-h-[280px] overflow-y-auto border-white/20 bg-black p-2 text-white"
                >
                  <div className="flex flex-col gap-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-white/10">
                      <Checkbox
                        checked={selectedRoles.length === 0}
                        onCheckedChange={() => setSelectedRoles([])}
                        className="border-white/40 data-[state=checked]:bg-[var(--teal-bright)] data-[state=checked]:border-[var(--teal-bright)]"
                      />
                      <span>All roles</span>
                    </label>
                    {ROLES.map((r) => (
                      <label
                        key={r}
                        className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm capitalize hover:bg-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedRoles.includes(r)}
                          onCheckedChange={() => toggleRole(r)}
                          className="border-white/40 data-[state=checked]:bg-[var(--teal-bright)] data-[state=checked]:border-[var(--teal-bright)]"
                        />
                        <span>{r}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* 3. Filter by category (multi-select) */}
            <div
              className={`flex min-w-0 flex-1 items-center sm:min-w-[160px] ${filterBarDivider}`}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between gap-2 rounded-none border-0 bg-transparent py-3 pl-4 pr-3 text-left text-white/90 hover:bg-white/5",
                      selectTriggerClass
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Filter
                        className="h-4 w-4 shrink-0"
                        style={{ color: tealAccent }}
                      />
                      <span>{categoryLabel}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="max-h-[280px] overflow-y-auto border-white/20 bg-black p-2 text-white"
                >
                  <div className="flex flex-col gap-1">
                    {CATEGORY_FILTER_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={
                            opt.value === "all"
                              ? selectedCategories.length === 0
                              : selectedCategories.includes(opt.value)
                          }
                          onCheckedChange={() => toggleCategory(opt.value)}
                          className="border-white/40 data-[state=checked]:bg-[var(--teal-bright)] data-[state=checked]:border-[var(--teal-bright)]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* 4. Sort + count + Reset - Sort Select rendered only after mount to avoid hydration mismatch from browser extensions (e.g. data-sharkid) */}
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2 py-2 pl-4 pr-3 sm:flex-nowrap sm:gap-3 sm:py-0">
              {sortSelectMounted ? (
                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  <SelectTrigger
                    className={`w-full gap-2 sm:w-auto ${selectTriggerClass} pl-0`}
                  >
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="border-white/20 bg-black text-white">
                    <SelectItem value="newest" className="focus:bg-white/10 focus:text-white">
                      Newest to oldest
                    </SelectItem>
                    <SelectItem value="popularity" className="focus:bg-white/10 focus:text-white">
                      Popularity
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="min-h-9 py-2 text-white/90 sm:py-0">
                  {sort === "newest" ? "Newest to oldest" : "Popularity"}
                </span>
              )}
              <span className="text-sm text-white/70">
                {filteredTools.length} tools
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={handleReset}
                className="h-auto p-0 text-[var(--teal-bright)] hover:text-[var(--teal-medium)]"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid - black background */}
      <section className="container mx-auto max-w-[1280px] bg-black px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
