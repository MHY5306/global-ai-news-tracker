import time

from app.core.config import settings
from app.models.news import Article
from app.services.collectors import collect_latest_news
from app.services.enrichment import enrich_articles

_cache: dict[str, object] = {"expires_at": 0.0, "articles": []}


async def get_cached_articles(limit: int = 60) -> list[Article]:
    now = time.time()
    if now < float(_cache["expires_at"]) and _cache["articles"]:
        return list(_cache["articles"])[:limit]  # type: ignore[arg-type]

    articles = await enrich_articles(await collect_latest_news(limit=limit))
    _cache["articles"] = articles
    _cache["expires_at"] = now + settings.refresh_minutes * 60
    return articles
