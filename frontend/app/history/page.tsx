"use client";

import { SavedList } from "@/components/saved-list";
import { TopNav } from "@/components/top-nav";
import { getHistory } from "@/lib/storage";

export default function HistoryPage() {
  return (
    <>
      <TopNav />
      <SavedList title="Reading History" description="Recently opened source articles are stored locally in the browser." loader={getHistory} />
    </>
  );
}
