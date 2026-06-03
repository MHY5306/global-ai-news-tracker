from fastapi import APIRouter, Query

from app.models.news import Analytics, Article
from app.services.analytics import build_analytics
from app.services.cache import get_cached_articles

router = APIRouter()


@router.get("/news", response_model=list[Article])
async def get_news(
    q: str | None = None,
    category: str | None = None,
    language: str | None = None,
    source: str | None = None,
    limit: int = Query(default=60, le=100),
) -> list[Article]:
    articles = await get_cached_articles(limit=limit)
    if q:
        needle = q.lower()
        articles = [item for item in articles if needle in f"{item.title} {item.summary} {' '.join(item.keywords)}".lower()]
    if category:
        articles = [item for item in articles if item.category == category]
    if language:
        articles = [item for item in articles if item.language == language]
    if source:
        articles = [item for item in articles if item.source == source]
    return articles


@router.get("/analytics", response_model=Analytics)
async def get_analytics() -> Analytics:
    articles = await get_cached_articles(limit=80)
    return build_analytics(articles)


@router.get("/briefing")
async def get_briefing() -> dict[str, object]:
    articles = await get_cached_articles(limit=20)
    top = sorted(articles, key=lambda item: item.popularity, reverse=True)[:10]
    return {
        "executive_summary": "AI coverage is concentrated around frontier models, compute supply, regulation, and enterprise agent adoption.",
        "market_trend_analysis": "Commercial momentum favors AI workflow automation, developer tools, and accelerated infrastructure.",
        "important_events": top,
        "future_impact": "Expect more governance, sector-specific AI products, and competition for compute capacity.",
    }
