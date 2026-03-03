"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface WebsitePreviewProps {
  websiteUrl: string;
  alt: string;
  className?: string;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getScreenshotUrls(url: string): string[] {
  return [
    `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=400&h=250`,
    `https://image.thum.io/get/width/400/height/250/noanimate/${encodeURIComponent(url)}`,
  ];
}

function getFallbackLogoUrl(websiteUrl: string): string {
  const domain = getDomain(websiteUrl);
  return domain ? `https://logo.clearbit.com/${domain}` : "";
}

export function WebsitePreview({
  websiteUrl,
  alt,
  className = "",
}: WebsitePreviewProps) {
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const screenshotUrls = getScreenshotUrls(websiteUrl);
  const logoUrl = getFallbackLogoUrl(websiteUrl);
  const domain = getDomain(websiteUrl);

  const imgSrc = showPlaceholder
    ? undefined
    : showLogo
      ? logoUrl
      : screenshotUrls[screenshotIndex];

  const handleImgError = () => {
    if (showLogo || !logoUrl) {
      setShowPlaceholder(true);
    } else if (screenshotIndex < screenshotUrls.length - 1) {
      setScreenshotIndex((i) => i + 1);
    } else {
      setShowLogo(true);
    }
  };

  if (showPlaceholder || (showLogo && !logoUrl)) {
    return (
      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-col items-center justify-center gap-2 bg-[var(--teal-very-dark)] text-[var(--teal-bright)] transition-opacity hover:opacity-90 ${className}`}
        style={{ minHeight: 160 }}
      >
        <span className="text-4xl font-semibold opacity-60">
          {alt.charAt(0)}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <ExternalLink className="h-4 w-4" />
          Preview {domain || "website"}
        </span>
      </a>
    );
  }

  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden ${className}`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={`${alt} website preview`}
          className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
          loading="lazy"
          onError={handleImgError}
        />
      )}
      <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs font-medium text-[var(--teal-bright)] opacity-0 transition-opacity group-hover:opacity-100">
        <ExternalLink className="h-3 w-3" />
        Visit site
      </span>
    </a>
  );
}
