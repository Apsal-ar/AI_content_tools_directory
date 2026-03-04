export type ToolCategory = "Video" | "Copywriting" | "Image" | "Audio";

export type PricingModel = "Free" | "Freemium" | "Paid";

/** Role filter options (Filter by role dropdown) */
export const ROLES = [
  "video",
  "audio",
  "image",
  "text",
  "art",
  "social media",
  "podcast",
  "analytics",
] as const;
export type Role = (typeof ROLES)[number];

/** Category filter options (Filter by category dropdown) */
export const CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "video-generators", label: "Video generators" },
  { value: "image-generators", label: "Image generators" },
  { value: "video-editing", label: "Video editing" },
  { value: "copywriting", label: "Copywriting" },
  { value: "voice-audio", label: "Voice & audio" },
  { value: "graphic-design", label: "Graphic design" },
  { value: "podcast-tools", label: "Podcast tools" },
] as const;
export type CategoryFilterValue =
  (typeof CATEGORY_FILTER_OPTIONS)[number]["value"];

export type SortOption = "newest" | "popularity";

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  pricing: PricingModel;
  websiteUrl: string;
  slug: string;
  /** For sort by newest (default) */
  addedAt?: string;
  /** For sort by popularity */
  popularity?: number;
}

export const CATEGORIES: ToolCategory[] = ["Video", "Copywriting", "Image", "Audio"];

/** Derive primary role from tool category (and optionally tags) */
export function getToolRole(tool: AITool): Role {
  const map: Record<ToolCategory, Role> = {
    Video: "video",
    Copywriting: "text",
    Image: "image",
    Audio: "audio",
  };
  const tagLower = tool.tags.join(" ").toLowerCase();
  if (tagLower.includes("podcast")) return "podcast";
  if (tagLower.includes("social media") || tagLower.includes("social graphics"))
    return "social media";
  if (tagLower.includes("analytics")) return "analytics";
  if (
    tagLower.includes("art") ||
    tagLower.includes("concept art") ||
    tagLower.includes("illustration")
  )
    return "art";
  return map[tool.category];
}

/** Whether tool matches a category filter value */
export function toolMatchesCategoryFilter(
  tool: AITool,
  value: CategoryFilterValue
): boolean {
  if (value === "all") return true;
  const tags = tool.tags.map((t) => t.toLowerCase());
  const desc = tool.description.toLowerCase();
  const match = (s: string) => tags.some((t) => t.includes(s)) || desc.includes(s);
  switch (value) {
    case "video-generators":
      return tool.category === "Video" && (match("video generation") || match("ai avatar") || match("text-to-video") || match("image-to-video"));
    case "image-generators":
      return tool.category === "Image" && (match("image generation") || match("text-to-image"));
    case "video-editing":
      return match("video editing");
    case "copywriting":
      return tool.category === "Copywriting";
    case "voice-audio":
      return tool.category === "Audio" || match("voice") || match("voiceover") || match("text-to-speech") || match("voice cloning");
    case "graphic-design":
      return match("graphic design") || match("templates") || match("social graphics");
    case "podcast-tools":
      return match("podcast");
    default:
      return true;
  }
}

export const AI_TOOLS: AITool[] = [
  {
    id: "1",
    name: "Synthesia",
    description: "Create professional AI-generated videos with lifelike avatars. No camera or studio required.",
    category: "Video",
    tags: ["AI avatars", "video generation", "presentations", "e-learning"],
    pricing: "Freemium",
    websiteUrl: "https://synthesia.io",
    slug: "synthesia",
    addedAt: "2025-02-01",
    popularity: 95,
  },
  {
    id: "2",
    name: "Jasper",
    description: "AI writing assistant that helps you create marketing copy, blog posts, and social content.",
    category: "Copywriting",
    tags: ["marketing copy", "blog writing", "social media", "content creation"],
    pricing: "Paid",
    websiteUrl: "https://jasper.ai",
    slug: "jasper",
    addedAt: "2025-01-28",
    popularity: 92,
  },
  {
    id: "3",
    name: "Midjourney",
    description: "Generate stunning images from text prompts. Create art, illustrations, and concept visuals.",
    category: "Image",
    tags: ["image generation", "digital art", "illustration", "concept art"],
    pricing: "Paid",
    websiteUrl: "https://midjourney.com",
    slug: "midjourney",
    addedAt: "2025-01-25",
    popularity: 98,
  },
  {
    id: "4",
    name: "ElevenLabs",
    description: "Text-to-speech and voice cloning. Create natural-sounding voiceovers in multiple languages.",
    category: "Audio",
    tags: ["text-to-speech", "voice cloning", "voiceovers", "dubbing"],
    pricing: "Freemium",
    websiteUrl: "https://elevenlabs.io",
    slug: "elevenlabs",
    addedAt: "2025-01-20",
    popularity: 88,
  },
  {
    id: "5",
    name: "Descript",
    description: "Edit video and audio by editing text. Podcast editing, transcription, and AI voice cloning.",
    category: "Video",
    tags: ["video editing", "podcast editing", "transcription", "voice cloning"],
    pricing: "Freemium",
    websiteUrl: "https://descript.com",
    slug: "descript",
    addedAt: "2025-01-15",
    popularity: 85,
  },
  {
    id: "6",
    name: "Canva AI",
    description: "Design templates and AI-powered image generation. Create social graphics and presentations.",
    category: "Image",
    tags: ["graphic design", "templates", "social graphics", "presentations"],
    pricing: "Freemium",
    websiteUrl: "https://canva.com",
    slug: "canva-ai",
    addedAt: "2025-01-10",
    popularity: 90,
  },
  {
    id: "7",
    name: "Runway",
    description: "AI video editing and generation. Create effects, remove backgrounds, and generate video from text.",
    category: "Video",
    tags: ["video editing", "video generation", "VFX", "background removal"],
    pricing: "Freemium",
    websiteUrl: "https://runwayml.com",
    slug: "runway",
    addedAt: "2025-01-05",
    popularity: 94,
  },
  {
    id: "8",
    name: "Copy.ai",
    description: "Generate marketing copy, email drafts, and ad headlines in seconds with AI assistance.",
    category: "Copywriting",
    tags: ["marketing copy", "email drafts", "ad copy", "headlines"],
    pricing: "Freemium",
    websiteUrl: "https://copy.ai",
    slug: "copy-ai",
    addedAt: "2024-12-28",
    popularity: 82,
  },
  {
    id: "9",
    name: "DALL-E",
    description: "Create images from text descriptions. Generate unique artwork, illustrations, and visuals.",
    category: "Image",
    tags: ["image generation", "text-to-image", "artwork", "illustration"],
    pricing: "Paid",
    websiteUrl: "https://openai.com/dall-e",
    slug: "dall-e",
    addedAt: "2024-12-20",
    popularity: 96,
  },
  {
    id: "10",
    name: "Murf",
    description: "AI voice generator for podcasts, videos, and presentations. Over 100 voices and 20 languages.",
    category: "Audio",
    tags: ["voice generation", "voiceovers", "podcasts", "multilingual"],
    pricing: "Freemium",
    websiteUrl: "https://murf.ai",
    slug: "murf",
    addedAt: "2024-12-15",
    popularity: 79,
  },
  {
    id: "11",
    name: "HeyGen",
    description: "Create AI avatar videos for marketing, training, and product demos. 100+ avatars available.",
    category: "Video",
    tags: ["AI avatars", "video generation", "product demos", "training videos"],
    pricing: "Paid",
    websiteUrl: "https://heygen.com",
    slug: "heygen",
    addedAt: "2024-12-10",
    popularity: 87,
  },
  {
    id: "12",
    name: "Writesonic",
    description: "AI writer for blogs, ads, and landing pages. SEO-optimized content in 25+ languages.",
    category: "Copywriting",
    tags: ["blog writing", "SEO", "landing pages", "ads"],
    pricing: "Freemium",
    websiteUrl: "https://writesonic.com",
    slug: "writesonic",
    addedAt: "2024-12-05",
    popularity: 75,
  },
  {
    id: "13",
    name: "Leonardo.AI",
    description: "Generate game assets, concept art, and marketing visuals with AI image generation.",
    category: "Image",
    tags: ["game assets", "concept art", "image generation", "marketing visuals"],
    pricing: "Freemium",
    websiteUrl: "https://leonardo.ai",
    slug: "leonardo-ai",
    addedAt: "2024-12-01",
    popularity: 81,
  },
  {
    id: "14",
    name: "Adobe Podcast",
    description: "AI-powered audio enhancer. Improve speech clarity and remove background noise for free.",
    category: "Audio",
    tags: ["audio enhancement", "speech clarity", "noise removal", "podcasting"],
    pricing: "Free",
    websiteUrl: "https://podcast.adobe.com",
    slug: "adobe-podcast",
    addedAt: "2024-11-25",
    popularity: 84,
  },
  {
    id: "15",
    name: "Pika Labs",
    description: "Generate and edit videos with AI. Turn text and images into short video clips.",
    category: "Video",
    tags: ["video generation", "video editing", "text-to-video", "image-to-video"],
    pricing: "Freemium",
    websiteUrl: "https://pika.art",
    slug: "pika-labs",
    addedAt: "2024-11-20",
    popularity: 91,
  },
  {
    id: "16",
    name: "ChatGPT",
    description: "AI writing assistant for drafts, brainstorming, and content creation across any format.",
    category: "Copywriting",
    tags: ["writing assistant", "brainstorming", "drafts", "content creation"],
    pricing: "Freemium",
    websiteUrl: "https://chat.openai.com",
    slug: "chatgpt",
    addedAt: "2024-11-15",
    popularity: 99,
  },
  {
    id: "17",
    name: "Ideogram",
    description: "AI image generator with superior text rendering. Create logos, posters, and branded visuals.",
    category: "Image",
    tags: ["image generation", "logos", "text in images", "branded visuals"],
    pricing: "Freemium",
    websiteUrl: "https://ideogram.ai",
    slug: "ideogram",
    addedAt: "2024-11-10",
    popularity: 83,
  },
  {
    id: "18",
    name: "Resemble AI",
    description: "Create custom AI voices for games, audiobooks, and voiceovers. Clone any voice in minutes.",
    category: "Audio",
    tags: ["voice cloning", "voiceovers", "audiobooks", "custom voices"],
    pricing: "Freemium",
    websiteUrl: "https://resemble.ai",
    slug: "resemble-ai",
    addedAt: "2024-11-05",
    popularity: 78,
  },
];

export function getToolBySlug(slug: string): AITool | undefined {
  return AI_TOOLS.find((tool) => tool.slug === slug);
}
