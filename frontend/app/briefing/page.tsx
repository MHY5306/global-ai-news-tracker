import { TopNav } from "@/components/top-nav";
import { getArticles } from "@/lib/api";

export default async function BriefingPage() {
  const articles = await getArticles();
  const topArticles = [...articles].sort((a, b) => b.popularity - a.popularity).slice(0, 10);
  const companies = [...new Set(topArticles.flatMap((article) => article.companies))].slice(0, 8);

  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.24em] text-primary">AI Analyst Report</p>
          <h1 className="mt-3 text-4xl font-semibold">AI Daily Briefing</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            A synthesized executive view of today&apos;s highest-signal AI stories, market movements, and strategic implications.
          </p>
        </div>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
            <h2 className="text-xl font-semibold">Executive Summary</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The AI cycle is currently led by enterprise agents, accelerated compute constraints, and tightening regulation. OpenAI, NVIDIA, Google, Anthropic, and regional open-source labs remain the core entities shaping developer adoption and board-level AI strategy.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Market Trend Analysis</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Demand is moving from experimentation to operational integration. The strongest commercial signals are workflow automation, AI coding, datacenter buildout, and compliance tooling.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Future Impact</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Expect AI budgets to consolidate around measurable productivity systems, safer agent execution, and domain-specific infrastructure. Regulation will increasingly influence product roadmaps.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
            <h2 className="text-xl font-semibold">Important Events</h2>
            <div className="mt-4 grid gap-3">
              {topArticles.map((article) => (
                <a key={article.id} href={article.url} target="_blank" rel="noreferrer" className="rounded-md bg-muted p-4 transition hover:bg-primary/15">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-primary">{article.category}</span>
                    <span>{article.source}</span>
                    <span>{article.country}</span>
                  </div>
                  <h3 className="mt-2 font-medium">{article.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{article.summary}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
            <h2 className="text-xl font-semibold">Entities To Watch</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {companies.map((company) => (
                <span key={company} className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
