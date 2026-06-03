import { NewsDashboard } from "@/components/news-dashboard";
import { TopNav } from "@/components/top-nav";
import { getAnalytics, getArticles } from "@/lib/api";

export default async function Home() {
  const [articles, analytics] = await Promise.all([getArticles(), getAnalytics()]);

  return (
    <>
      <TopNav />
      <NewsDashboard articles={articles} analytics={analytics} />
    </>
  );
}
