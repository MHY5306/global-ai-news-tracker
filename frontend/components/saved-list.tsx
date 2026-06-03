"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { ArticleCard } from "./article-card";

export function SavedList({ title, description, loader }: { title: string; description: string; loader: () => Article[] }) {
  const [items, setItems] = useState<Article[]>([]);

  useEffect(() => {
    setItems(loader());
  }, [loader]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-primary">Personal Intel</p>
        <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">No articles yet.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} bookmarked onBookmark={() => setItems(loader())} />
          ))}
        </div>
      )}
    </main>
  );
}
