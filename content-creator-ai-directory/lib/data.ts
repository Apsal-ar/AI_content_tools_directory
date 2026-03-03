export type ToolCategory = "Video" | "Copywriting" | "Image" | "Audio";

export type PricingModel = "Free" | "Freemium" | "Paid";

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  pricing: PricingModel;
  websiteUrl: string;
  slug: string;
}

export const CATEGORIES: ToolCategory[] = ["Video", "Copywriting", "Image", "Audio"];

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
  },
];

export function getToolBySlug(slug: string): AITool | undefined {
  return AI_TOOLS.find((tool) => tool.slug === slug);
}
