"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { categories, languages } from "@/lib/mock-data";

export interface FilterState {
  query: string;
  category: string;
  language: string;
  source: string;
  sort: "newest" | "popularity";
}

export function FilterBar({
  filters,
  sources,
  onChange
}: {
  filters: FilterState;
  sources: string[];
  onChange: (filters: FilterState) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Search OpenAI, NVIDIA, regulation, robotics..."
            className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select className="h-11 rounded-md border border-border bg-background px-3 text-sm" value={filters.category} onChange={(event) => onChange({ ...filters, category: event.target.value })}>
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <select className="h-11 rounded-md border border-border bg-background px-3 text-sm" value={filters.language} onChange={(event) => onChange({ ...filters, language: event.target.value })}>
            <option value="All">All languages</option>
            {languages.map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>
          <select className="h-11 rounded-md border border-border bg-background px-3 text-sm" value={filters.source} onChange={(event) => onChange({ ...filters, source: event.target.value })}>
            <option value="All">All sources</option>
            {sources.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
          <select className="h-11 rounded-md border border-border bg-background px-3 text-sm" value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value as FilterState["sort"] })}>
            <option value="newest">Newest</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        Filters update instantly and can be backed by API query parameters in production.
      </div>
    </div>
  );
}
