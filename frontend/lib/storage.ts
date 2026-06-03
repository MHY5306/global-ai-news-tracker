"use client";

import type { Article } from "./types";

const bookmarksKey = "gain-bookmarks";
const historyKey = "gain-history";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getBookmarks() {
  return read<Article[]>(bookmarksKey, []);
}

export function toggleBookmark(article: Article) {
  const current = getBookmarks();
  const exists = current.some((item) => item.id === article.id);
  const next = exists ? current.filter((item) => item.id !== article.id) : [article, ...current];
  write(bookmarksKey, next);
  return next;
}

export function getHistory() {
  return read<Article[]>(historyKey, []);
}

export function addHistory(article: Article) {
  const next = [article, ...getHistory().filter((item) => item.id !== article.id)].slice(0, 30);
  write(historyKey, next);
  return next;
}
