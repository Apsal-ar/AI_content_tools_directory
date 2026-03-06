"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Video", "Audio", "Copywriting", "Image", "Productivity", "Code", "Other"] as const;
const PRICING_OPTIONS = ["Free", "Freemium", "Paid", "Enterprise"] as const;

// Shared input styles: dark bg at rest, slightly lighter when filled, autofill override
const inputClass =
  "mt-1.5 border-white/20 bg-white/5 text-white placeholder:text-white/40" +
  " [&:not(:placeholder-shown)]:bg-white/[0.09]" +
  " [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgba(255,255,255,0.09)]" +
  " [&:-webkit-autofill]:[-webkit-text-fill-color:white]";

const textareaClass =
  "mt-1.5 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2" +
  " text-white placeholder:text-white/40" +
  " focus:border-[var(--teal-bright)] focus:outline-none focus:ring-1 focus:ring-[var(--teal-bright)]" +
  " disabled:opacity-50 resize-none" +
  " [&:not(:placeholder-shown)]:bg-white/[0.09]";

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type FormErrors = Partial<Record<string, string>>;

export function SubmitToolForm({
  userEmail,
  userId,
}: {
  userEmail: string;
  userId: string;
}) {
  const [toolName, setToolName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [pricing, setPricing] = useState<string>("");
  const [tags, setTags] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!toolName.trim()) next.tool_name = "Tool name is required.";
    if (!websiteUrl.trim()) next.website_url = "Website URL is required.";
    else if (!isValidUrl(websiteUrl.trim())) next.website_url = "Please enter a valid URL (e.g. https://example.com).";
    if (!shortDescription.trim()) next.short_description = "Short description is required.";
    else if (shortDescription.length > 160) next.short_description = "Short description must be 160 characters or less.";
    if (longDescription.length > 1000) next.long_description = "Long description must be 1000 characters or less.";
    if (!category) next.category = "Category is required.";
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (tagList.length > 5) next.tags = "Maximum 5 tags allowed.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_name: toolName.trim(),
          website_url: websiteUrl.trim(),
          short_description: shortDescription.trim(),
          long_description: longDescription.trim() || undefined,
          category,
          pricing,
          tags: tags.trim() || undefined,
          logo_url: logoUrl.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError(data.error || "Submission failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto max-w-[640px] px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-white/70 transition-colors hover:text-[var(--teal-bright)]"
          >
            <ArrowLeft className="size-4" />
            Back to directory
          </Link>
          <div className="rounded-lg border border-[var(--teal-bright)]/30 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-[var(--teal-bright)]">Submission received</h2>
            <p className="mt-2 text-white/80">
              Thanks for submitting a tool. We&apos;ll review it and get back to you. Submissions appear in the directory only after approval.
            </p>
            <Button
              className="mt-6 bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)]"
              asChild
            >
              <Link href="/">Back to directory</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-[640px] px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-white/70 transition-colors hover:text-[var(--teal-bright)]"
        >
          <ArrowLeft className="size-4" />
          Back to directory
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">Submit a tool</h1>
        <p className="mt-2 text-white/70">
          Suggest a new AI tool for the directory. We&apos;ll review your submission before publishing.
        </p>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-white/50">Submitting as</p>
          <p className="mt-1 font-medium text-white">{userEmail}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {apiError && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {apiError}
            </div>
          )}

          <div>
            <label htmlFor="tool_name" className="block text-sm font-medium text-white/90">
              Tool name <span className="text-[var(--teal-bright)]">*</span>
            </label>
            <Input
              id="tool_name"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. Synthesia"
              className={inputClass}
              disabled={submitting}
              aria-invalid={!!errors.tool_name}
            />
            {errors.tool_name && <p className="mt-1 text-sm text-red-400">{errors.tool_name}</p>}
          </div>

          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-white/90">
              Website URL <span className="text-[var(--teal-bright)]">*</span>
            </label>
            <Input
              id="website_url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className={inputClass}
              disabled={submitting}
              aria-invalid={!!errors.website_url}
            />
            {errors.website_url && <p className="mt-1 text-sm text-red-400">{errors.website_url}</p>}
          </div>

          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-white/90">
              Short description <span className="text-[var(--teal-bright)]">*</span> (max 160 characters)
            </label>
            <textarea
              id="short_description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One sentence describing the tool."
              maxLength={160}
              rows={2}
              className={textareaClass}
              disabled={submitting}
              aria-invalid={!!errors.short_description}
              suppressHydrationWarning
            />
            <p className="mt-1 flex justify-end text-xs text-white/50">{shortDescription.length}/160</p>
            {errors.short_description && <p className="mt-1 text-sm text-red-400">{errors.short_description}</p>}
          </div>

          <div>
            <label htmlFor="long_description" className="block text-sm font-medium text-white/90">
              Long description (optional, max 1000 characters)
            </label>
            <textarea
              id="long_description"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="More details about features, use cases, etc."
              maxLength={1000}
              rows={5}
              className={textareaClass}
              disabled={submitting}
              aria-invalid={!!errors.long_description}
              suppressHydrationWarning
            />
            <p className="mt-1 flex justify-end text-xs text-white/50">{longDescription.length}/1000</p>
            {errors.long_description && <p className="mt-1 text-sm text-red-400">{errors.long_description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">
              Category <span className="text-[var(--teal-bright)]">*</span>
            </label>
            {mounted ? (
              <Select value={category} onValueChange={setCategory} disabled={submitting}>
                <SelectTrigger
                  className="mt-1.5 w-full border-white/20 bg-white/5 text-white data-[placeholder]:text-white/50"
                  aria-invalid={!!errors.category}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-black text-white">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="focus:bg-white/10 focus:text-white">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1.5 h-9 w-full rounded-md border border-white/20 bg-white/5" />
            )}
            {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">
              Pricing model <span className="text-white/50">(optional)</span>
            </label>
            {mounted ? (
              <Select
                value={pricing}
                onValueChange={(v) => setPricing(v === "__none__" ? "" : v)}
                disabled={submitting}
              >
                <SelectTrigger
                  className="mt-1.5 w-full border-white/20 bg-white/5 text-white data-[placeholder]:text-white/50"
                  aria-invalid={!!errors.pricing}
                >
                  <SelectValue placeholder="Select pricing" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-black text-white">
                  <SelectItem value="__none__" className="text-white/50 focus:bg-white/10 focus:text-white/70">
                    Unknown / not specified
                  </SelectItem>
                  {PRICING_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p} className="focus:bg-white/10 focus:text-white">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1.5 h-9 w-full rounded-md border border-white/20 bg-white/5" />
            )}
            {errors.pricing && <p className="mt-1 text-sm text-red-400">{errors.pricing}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-white/90">
              Tags (optional, comma separated, max 5)
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. video generation, AI avatars, presentations"
              className={inputClass}
              disabled={submitting}
              aria-invalid={!!errors.tags}
            />
            {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
          </div>

          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-white/90">
              Logo URL (optional)
            </label>
            <Input
              id="logo_url"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className={inputClass}
              disabled={submitting}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[var(--teal-bright)] text-black shadow-[var(--neon-glow)] hover:bg-[var(--teal-light)] disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
