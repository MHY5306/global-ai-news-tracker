"use client";

import { SavedList } from "@/components/saved-list";
import { TopNav } from "@/components/top-nav";
import { getBookmarks } from "@/lib/storage";

export default function BookmarksPage() {
  return (
    <>
      <TopNav />
      <SavedList title="Bookmarks" description="Articles saved for deeper reading and portfolio demo persistence." loader={getBookmarks} />
    </>
  );
}
