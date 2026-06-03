import { analytics, articles } from "./mock-data";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://global-ai-news-tracker-api.onrender.com";

async function request<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: 120 } });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getArticles() {
  return request("/api/news", articles);
}

export async function getAnalytics() {
  return request("/api/analytics", analytics);
}
