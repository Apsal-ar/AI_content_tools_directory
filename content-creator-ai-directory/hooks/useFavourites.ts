"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export function useFavourites() {
  const { userId, isLoaded } = useAuth();
  const isSignedIn = isLoaded && !!userId;

  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch on sign-in
  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setSlugs(new Set());
      return;
    }
    setLoading(true);
    fetch("/api/favourites")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.slugs)) {
          setSlugs(new Set<string>(data.slugs));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, isLoaded]);

  const toggle = useCallback(
    async (slug: string) => {
      if (!isSignedIn) return;

      const wasFav = slugs.has(slug);

      // Optimistic update
      setSlugs((prev) => {
        const next = new Set(prev);
        if (wasFav) next.delete(slug);
        else next.add(slug);
        return next;
      });

      try {
        await fetch("/api/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
      } catch {
        // Revert on error
        setSlugs((prev) => {
          const next = new Set(prev);
          if (wasFav) next.add(slug);
          else next.delete(slug);
          return next;
        });
      }
    },
    [isSignedIn, slugs]
  );

  return { slugs, toggle, isSignedIn, loading };
}
