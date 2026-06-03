"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bookmark, FileText, History, Radar } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Live Intel", icon: Radar },
  { href: "/briefing", label: "Daily Briefing", icon: FileText },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/history", label: "History", icon: History }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 glass">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground shadow-glow">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Global AI</p>
            <h1 className="text-lg font-semibold">News Tracker</h1>
          </div>
        </Link>
        <nav className="flex gap-2 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
