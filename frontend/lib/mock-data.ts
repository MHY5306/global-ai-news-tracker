import type { Analytics, Article } from "./types";

export const categories = [
  "LLMs",
  "AI Hardware",
  "AI Startups",
  "Robotics",
  "AI Regulation",
  "Open Source AI",
  "AI Research",
  "AI Tools",
  "AI Finance",
  "AI Coding"
] as const;

export const languages = ["English", "Chinese", "Japanese"] as const;

export const articles: Article[] = [
  {
    id: "openai-agent-2026",
    title: "OpenAI expands enterprise agent platform with stronger workflow controls",
    source: "TechCrunch",
    url: "https://techcrunch.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    category: "LLMs",
    language: "English",
    summary:
      "OpenAI is positioning agentic workflows as a core enterprise layer, with governance controls, audit trails, and safer tool execution for regulated teams.",
    sentiment: "positive",
    country: "United States",
    popularity: 96,
    keywords: ["OpenAI", "agents", "enterprise", "workflow"],
    companies: ["OpenAI", "Microsoft"]
  },
  {
    id: "nvidia-supply-chain",
    title: "NVIDIA AI accelerator demand reshapes global semiconductor supply chains",
    source: "Reuters",
    url: "https://reuters.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    category: "AI Hardware",
    language: "English",
    summary:
      "Cloud providers and sovereign AI programs continue to compete for advanced GPUs, intensifying pressure on memory, packaging, and power infrastructure.",
    sentiment: "neutral",
    country: "United States",
    popularity: 91,
    keywords: ["NVIDIA", "GPU", "semiconductors", "datacenter"],
    companies: ["NVIDIA", "TSMC", "SK hynix"]
  },
  {
    id: "eu-ai-act-tools",
    title: "EU regulators publish practical guidance for AI Act compliance tooling",
    source: "Euractiv",
    url: "https://www.euractiv.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 79).toISOString(),
    category: "AI Regulation",
    language: "English",
    summary:
      "New guidance clarifies documentation, risk classification, and transparency expectations for companies deploying high-impact AI systems in Europe.",
    sentiment: "neutral",
    country: "European Union",
    popularity: 72,
    keywords: ["AI Act", "compliance", "regulation", "risk"],
    companies: ["Mistral AI", "SAP"]
  },
  {
    id: "tokyo-robotics",
    title: "日本のロボティクス企業、生成AI搭載の物流ロボットを発表",
    source: "Nikkei Asia",
    url: "https://asia.nikkei.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 122).toISOString(),
    category: "Robotics",
    language: "Japanese",
    summary:
      "新しい物流ロボットは自然言語指示と視覚モデルを組み合わせ、倉庫内の例外処理やピッキング計画を自動化することを目指しています。",
    sentiment: "positive",
    country: "Japan",
    popularity: 68,
    keywords: ["robotics", "物流", "生成AI", "automation"],
    companies: ["SoftBank Robotics", "Toyota"]
  },
  {
    id: "china-open-source-llm",
    title: "中国开源大模型社区发布多语言推理模型",
    source: "36Kr",
    url: "https://36kr.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 165).toISOString(),
    category: "Open Source AI",
    language: "Chinese",
    summary:
      "该模型强调低成本部署和跨语言推理能力，吸引开发者关注企业私有化部署、教育和代码生成场景。",
    sentiment: "positive",
    country: "China",
    popularity: 64,
    keywords: ["open source", "LLM", "multilingual", "reasoning"],
    companies: ["Alibaba", "DeepSeek"]
  },
  {
    id: "ai-coding-stack",
    title: "AI coding assistants move from autocomplete into repository-wide planning",
    source: "Hacker News",
    url: "https://news.ycombinator.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 205).toISOString(),
    category: "AI Coding",
    language: "English",
    summary:
      "Developers are evaluating coding agents by their ability to understand repository context, run tests, and produce reviewable pull requests.",
    sentiment: "positive",
    country: "Global",
    popularity: 83,
    keywords: ["AI coding", "agents", "developer tools", "GitHub"],
    companies: ["GitHub", "OpenAI", "Anthropic"]
  },
  {
    id: "claude-research",
    title: "Anthropic researchers detail progress on interpretable model behavior",
    source: "Anthropic Blog",
    url: "https://www.anthropic.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 248).toISOString(),
    category: "AI Research",
    language: "English",
    summary:
      "The research explores ways to map model features to understandable concepts, aiming to improve safety reviews for frontier LLM systems.",
    sentiment: "neutral",
    country: "United States",
    popularity: 77,
    keywords: ["Claude", "interpretability", "safety", "research"],
    companies: ["Anthropic"]
  },
  {
    id: "gemini-ad-platform",
    title: "Google integrates Gemini into campaign analytics and creative testing",
    source: "The Verge",
    url: "https://www.theverge.com",
    publishedAt: new Date(Date.now() - 1000 * 60 * 301).toISOString(),
    category: "AI Tools",
    language: "English",
    summary:
      "Gemini-powered tooling helps marketing teams compare campaign performance, draft creative variants, and surface audience insights faster.",
    sentiment: "positive",
    country: "United States",
    popularity: 59,
    keywords: ["Gemini", "advertising", "analytics", "AI tools"],
    companies: ["Google"]
  }
];

export const analytics: Analytics = {
  companies: [
    { name: "OpenAI", mentions: 42 },
    { name: "NVIDIA", mentions: 37 },
    { name: "Google", mentions: 24 },
    { name: "Anthropic", mentions: 21 },
    { name: "Microsoft", mentions: 19 },
    { name: "DeepSeek", mentions: 15 }
  ],
  topics: [
    { name: "agents", mentions: 58 },
    { name: "GPU supply", mentions: 44 },
    { name: "AI regulation", mentions: 32 },
    { name: "open source", mentions: 29 },
    { name: "robotics", mentions: 22 }
  ],
  timeline: [
    { date: "May 27", articles: 18, positive: 8, neutral: 8, negative: 2 },
    { date: "May 28", articles: 24, positive: 10, neutral: 11, negative: 3 },
    { date: "May 29", articles: 21, positive: 9, neutral: 9, negative: 3 },
    { date: "May 30", articles: 31, positive: 15, neutral: 12, negative: 4 },
    { date: "May 31", articles: 27, positive: 12, neutral: 11, negative: 4 },
    { date: "Jun 1", articles: 36, positive: 17, neutral: 15, negative: 4 },
    { date: "Jun 2", articles: 29, positive: 14, neutral: 12, negative: 3 }
  ],
  sources: [
    { source: "Reuters", count: 18 },
    { source: "Hacker News", count: 15 },
    { source: "Reddit", count: 13 },
    { source: "Google News", count: 12 },
    { source: "TechCrunch", count: 10 }
  ],
  countries: [
    { country: "United States", count: 46 },
    { country: "China", count: 22 },
    { country: "Japan", count: 14 },
    { country: "European Union", count: 17 },
    { country: "Global", count: 28 }
  ]
};
