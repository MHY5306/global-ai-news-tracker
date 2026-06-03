"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Analytics } from "@/lib/types";

const palette = ["#22d3ee", "#fb923c", "#a7f3d0", "#fda4af", "#c4b5fd", "#fde68a"];

export function TrendingDashboard({ analytics }: { analytics: Analytics }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Trend Velocity</h2>
          <p className="text-sm text-muted-foreground">Article volume and sentiment movement over the last seven days.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #243244", borderRadius: 8 }} />
              <Line type="monotone" dataKey="articles" stroke="#22d3ee" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="positive" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="negative" stroke="#fb7185" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Company Mentions</h2>
          <p className="text-sm text-muted-foreground">Most cited organizations across monitored sources.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.companies} layout="vertical" margin={{ left: 16 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={82} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #243244", borderRadius: 8 }} />
              <Bar dataKey="mentions" radius={[0, 6, 6, 0]}>
                {analytics.companies.map((_, index) => (
                  <Cell key={index} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Topic Frequency</h2>
        <div className="mt-4 space-y-3">
          {analytics.topics.map((topic, index) => (
            <div key={topic.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{topic.name}</span>
                <span className="text-muted-foreground">{topic.mentions}</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full" style={{ width: `${Math.min(topic.mentions, 60) * 1.5}%`, background: palette[index % palette.length] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Source Distribution</h2>
        <div className="mt-4 space-y-3">
          {analytics.sources.map((source) => (
            <div key={source.source} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
              <span>{source.source}</span>
              <span className="text-muted-foreground">{source.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Country Signal</h2>
        <div className="mt-4 space-y-3">
          {analytics.countries.map((country) => (
            <div key={country.country} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
              <span>{country.country}</span>
              <span className="text-muted-foreground">{country.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
