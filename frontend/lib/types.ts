export type Language = "English" | "Chinese" | "Japanese";

export type NewsCategory =
  | "LLMs"
  | "AI Hardware"
  | "AI Startups"
  | "Robotics"
  | "AI Regulation"
  | "Open Source AI"
  | "AI Research"
  | "AI Tools"
  | "AI Finance"
  | "AI Coding";

export type Sentiment = "positive" | "neutral" | "negative";

export interface Article {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: NewsCategory;
  language: Language;
  summary: string;
  sentiment: Sentiment;
  country: string;
  popularity: number;
  keywords: string[];
  companies: string[];
}

export interface Analytics {
  companies: { name: string; mentions: number }[];
  topics: { name: string; mentions: number }[];
  timeline: { date: string; articles: number; positive: number; neutral: number; negative: number }[];
  sources: { source: string; count: number }[];
  countries: { country: string; count: number }[];
}
