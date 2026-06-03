"use client";

import { Bookmark, ExternalLink, Sparkles } from "lucide-react";
import type { Article } from "@/lib/types";
import { addHistory, toggleBookmark } from "@/lib/storage";
import { cn, timeAgo } from "@/lib/utils";

const sentimentClasses = {
  positive: "bg-emerald-500/12 text-emerald-300 border-emerald-500/30",
  neutral: "bg-cyan-500/12 text-cyan-200 border-cyan-500/30",
  negative: "bg-rose-500/12 text-rose-200 border-rose-500/30"
};

export function ArticleCard({ article, bookmarked = false, onBookmark }: { article: Article; bookmarked?: boolean; onBookmark?: () => void }) {
  return (
    <article className="group rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-primary/12 px-2 py-1 font-medium text-primary">{article.category}</span>
            <span className={cn("rounded-md border px-2 py-1 capitalize", sentimentClasses[article.sentiment])}>{article.sentiment}</span>
            <span className="text-muted-foreground">{article.source}</span>
            <span className="text-muted-foreground">{timeAgo(article.publishedAt)}</span>
          </div>
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug">{article.title}</h2>
        </div>
        <button
          aria-label="Bookmark article"
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition hover:text-foreground",
            bookmarked && "border-accent/70 bg-accent/15 text-accent"
          )}
          onClick={() => {
            toggleBookmark(article);
            onBookmark?.();
          }}
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {article.keywords.slice(0, 4).map((keyword) => (
          <span key={keyword} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {keyword}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          {article.language} summary
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          onClick={() => addHistory(article)}
          className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm transition hover:bg-primary hover:text-primary-foreground"
        >
          Original
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
