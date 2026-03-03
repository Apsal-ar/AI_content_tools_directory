export type ToolCategory = "Video" | "Copywriting" | "Image" | "Audio";

export type PricingModel = "Free" | "Freemium" | "Paid";

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
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
    pricing: "Freemium",
    websiteUrl: "https://synthesia.io",
    slug: "synthesia",
  },
  {
    id: "2",
    name: "Jasper",
    description: "AI writing assistant that helps you create marketing copy, blog posts, and social content.",
    category: "Copywriting",
    pricing: "Paid",
    websiteUrl: "https://jasper.ai",
    slug: "jasper",
  },
  {
    id: "3",
    name: "Midjourney",
    description: "Generate stunning images from text prompts. Create art, illustrations, and concept visuals.",
    category: "Image",
    pricing: "Paid",
    websiteUrl: "https://midjourney.com",
    slug: "midjourney",
  },
  {
    id: "4",
    name: "ElevenLabs",
    description: "Text-to-speech and voice cloning. Create natural-sounding voiceovers in multiple languages.",
    category: "Audio",
    pricing: "Freemium",
    websiteUrl: "https://elevenlabs.io",
    slug: "elevenlabs",
  },
  {
    id: "5",
    name: "Descript",
    description: "Edit video and audio by editing text. Podcast editing, transcription, and AI voice cloning.",
    category: "Video",
    pricing: "Freemium",
    websiteUrl: "https://descript.com",
    slug: "descript",
  },
  {
    id: "6",
    name: "Canva AI",
    description: "Design templates and AI-powered image generation. Create social graphics and presentations.",
    category: "Image",
    pricing: "Freemium",
    websiteUrl: "https://canva.com",
    slug: "canva-ai",
  },
];

export function getToolBySlug(slug: string): AITool | undefined {
  return AI_TOOLS.find((tool) => tool.slug === slug);
}
