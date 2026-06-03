from collections import Counter, defaultdict

from app.models.news import Analytics, Article


def build_analytics(articles: list[Article]) -> Analytics:
    companies = Counter(company for article in articles for company in article.companies)
    topics = Counter(keyword for article in articles for keyword in article.keywords)
    sources = Counter(article.source for article in articles)
    countries = Counter(article.country for article in articles)
    timeline: dict[str, Counter[str]] = defaultdict(Counter)

    for article in articles:
        key = article.publishedAt.strftime("%b %d")
        timeline[key]["articles"] += 1
        timeline[key][article.sentiment] += 1

    return Analytics(
        companies=[{"name": name, "mentions": count} for name, count in companies.most_common(8)],
        topics=[{"name": name, "mentions": count} for name, count in topics.most_common(8)],
        timeline=[
            {
                "date": date,
                "articles": counts["articles"],
                "positive": counts["positive"],
                "neutral": counts["neutral"],
                "negative": counts["negative"],
            }
            for date, counts in timeline.items()
        ],
        sources=[{"source": name, "count": count} for name, count in sources.most_common(8)],
        countries=[{"country": name, "count": count} for name, count in countries.most_common(8)],
    )
