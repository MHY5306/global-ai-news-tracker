import { Activity, Globe2, RefreshCcw, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Sources monitored", value: "5", icon: Globe2 },
  { label: "Auto refresh", value: "3 min", icon: RefreshCcw },
  { label: "AI enriched", value: "100%", icon: ShieldCheck },
  { label: "Live signal", value: "High", icon: Activity }
];

export function StatusStrip() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="rounded-lg border border-border bg-card/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
          </div>
        );
      })}
    </section>
  );
}
