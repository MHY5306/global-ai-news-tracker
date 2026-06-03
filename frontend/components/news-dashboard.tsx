"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Analytics, Article } from "@/lib/types";
import { getBookmarks } from "@/lib/storage";
import { ArticleCard } from "./article-card";
import { FilterBar, type FilterState } from "./filter-bar";
import { StatusStrip } from "./status-strip";
import { TrendingDashboard } from "./trending-dashboard";

const defaultFilters: FilterState = {
  query: "",
  category: "All",
  language: "All",
  source: "All",
  sort: "newest"
};

export function NewsDashboard({ articles, analytics }: { articles: Article[]; analytics: Analytics }) {
  const [liveArticles, setLiveArticles] = useState(articles);
  const [filters, setFilters] = useState(defaultFilters);
  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks().map((item) => item.id));

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBase) return;
    const refresh = async () => {
      try {
        const response = await fetch(`${apiBase}/api/news`);
        if (response.ok) setLiveArticles(await response.json());
      } catch {
        setLiveArticles((current) => current);
      }
    };
    const timer = window.setInterval(refresh, 180000);
    return () => window.clearInterval(timer);
  }, []);

  const sources = useMemo(() => [...new Set(liveArticles.map((article) => article.source))], [liveArticles]);

  const filtered = useMemo(() => {
    const query = filters.query.toLowerCase().trim();
    return liveArticles
      .filter((article) => filters.category === "All" || article.category === filters.category)
      .filter((article) => filters.language === "All" || article.language === filters.language)
      .filter((article) => filters.source === "All" || article.source === filters.source)
      .filter((article) => !query || [article.title, article.summary, article.source, ...article.keywords, ...article.companies].join(" ").toLowerCase().includes(query))
      .sort((a, b) => (filters.sort === "popularity" ? b.popularity - a.popularity : +new Date(b.publishedAt) - +new Date(a.publishedAt)));
  }, [liveArticles, filters]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-primary">Realtime AI Intelligence</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">Track the global AI news cycle before it becomes consensus.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Aggregated news, AI summaries, market signals, regulation tracking, and multilingual briefing workflows in one portfolio-ready dashboard.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Daily briefing readiness</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-[0.7fr_1fr] lg:grid-cols-1 xl:grid-cols-[0.7fr_1fr]">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold">92</span>
                <span className="pb-2 text-sm text-muted-foreground">signal score</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div className="h-2 w-[92%] rounded-full bg-primary" />
              </div>
            </div>
            <img src="/ai-signal-map.svg" alt="Global AI source signal map" className="h-28 w-full rounded-md border border-border object-cover" />
          </div>
        </div>
      </section>
      <div className="space-y-6">
        <StatusStrip />
        <FilterBar filters={filters} sources={sources} onChange={setFilters} />
        <TrendingDashboard analytics={analytics} />
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Latest AI News</h2>
              <p className="text-sm text-muted-foreground">{filtered.length} intelligence items match the current filters.</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((article, index) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }}>
                <ArticleCard
                  article={article}
                  bookmarked={bookmarks.includes(article.id)}
                  onBookmark={() => setBookmarks(getBookmarks().map((item) => item.id))}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
