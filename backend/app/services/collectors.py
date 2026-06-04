import hashlib
import asyncio
import re
from datetime import datetime, timezone
from urllib.parse import quote_plus, urlparse

import feedparser
import httpx

from app.core.config import settings
from app.models.news import Article
from app.services.sample_data import sample_articles

KEYWORDS = [
    "artificial intelligence",
    "OpenAI",
    "ChatGPT",
    "GPT",
    "Claude",
    "Gemini",
    "NVIDIA",
    "AI startup",
    "LLM",
    "AGI",
    "robotics",
    "generative AI",
    "AI regulation",
]

REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GlobalAITracker/1.0; +https://global-ai-news-tracker.vercel.app)",
    "Accept": "application/json,text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
}

AI_RELEVANCE_TERMS = [
    "ai",
    "artificial intelligence",
    "openai",
    "chatgpt",
    "gpt",
    "claude",
    "anthropic",
    "gemini",
    "nvidia",
    "llm",
    "agi",
    "robot",
    "generative",
    "machine learning",
    "deep learning",
]

NON_NEWS_DOMAINS = {
    "github.com",
    "youtube.com",
    "youtu.be",
    "producthunt.com",
    "app.productnow.ai",
}

HN_TITLE_BLOCKLIST = ("show hn:", "ask hn:", "launch hn:")


def stable_id(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]


def contains_ai_signal(text: str) -> bool:
    normalized = text.lower()
    return any(re.search(rf"\b{re.escape(term)}\b", normalized) for term in AI_RELEVANCE_TERMS)


def is_non_news_url(url: str) -> bool:
    host = urlparse(url).netloc.lower().removeprefix("www.")
    return host in NON_NEWS_DOMAINS


async def fetch_google_news_rss(keyword: str) -> list[Article]:
    query = quote_plus(keyword)
    url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    async with httpx.AsyncClient(timeout=settings.source_timeout_seconds, headers=REQUEST_HEADERS, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()
    feed = feedparser.parse(response.text)
    articles: list[Article] = []
    for entry in feed.entries[:8]:
        published = getattr(entry, "published_parsed", None)
        published_at = datetime(*published[:6], tzinfo=timezone.utc) if published else datetime.now(timezone.utc)
        articles.append(
            Article(
                id=stable_id(entry.link),
                title=entry.title,
                source="Google News",
                url=entry.link,
                publishedAt=published_at,
                summary=getattr(entry, "summary", entry.title),
                keywords=[keyword],
                popularity=55,
            )
        )
    return articles


async def fetch_gdelt(keyword: str) -> list[Article]:
    url = "https://api.gdeltproject.org/api/v2/doc/doc"
    params = {
        "query": keyword,
        "mode": "ArtList",
        "format": "json",
        "maxrecords": 12,
        "sort": "HybridRel",
    }
    async with httpx.AsyncClient(timeout=settings.source_timeout_seconds, headers=REQUEST_HEADERS, follow_redirects=True) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()
    articles: list[Article] = []
    for item in payload.get("articles", []):
        articles.append(
            Article(
                id=stable_id(item["url"]),
                title=item.get("title", "Untitled AI article"),
                source=item.get("sourceCommonName", "GDELT"),
                url=item["url"],
                publishedAt=datetime.now(timezone.utc),
                summary=item.get("seendate", "Global AI news item detected by GDELT."),
                country=item.get("sourceCountry", "Global"),
                keywords=[keyword],
                popularity=50,
            )
        )
    return articles


async def fetch_newsapi(keyword: str) -> list[Article]:
    if not settings.news_api_key:
        return []
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": keyword,
        "language": "en",
        "pageSize": 12,
        "sortBy": "publishedAt",
        "apiKey": settings.news_api_key,
    }
    async with httpx.AsyncClient(timeout=settings.source_timeout_seconds, headers=REQUEST_HEADERS, follow_redirects=True) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()
    return [
        Article(
            id=stable_id(item["url"]),
            title=item["title"],
            source=item.get("source", {}).get("name", "NewsAPI"),
            url=item["url"],
            publishedAt=item.get("publishedAt") or datetime.now(timezone.utc),
            summary=item.get("description") or item["title"],
            keywords=[keyword],
            popularity=60,
        )
        for item in payload.get("articles", [])
        if item.get("url") and item.get("title")
    ]


async def fetch_hacker_news(keyword: str) -> list[Article]:
    url = "https://hn.algolia.com/api/v1/search_by_date"
    params = {"query": keyword, "tags": "story", "hitsPerPage": 10}
    async with httpx.AsyncClient(timeout=settings.source_timeout_seconds, headers=REQUEST_HEADERS, follow_redirects=True) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()
    articles: list[Article] = []
    for item in payload.get("hits", []):
        title = item.get("title") or item.get("story_title") or "Hacker News AI discussion"
        external_url = item.get("url") or ""
        hn_url = f"https://news.ycombinator.com/item?id={item.get('objectID')}"
        relevance_text = f"{title} {external_url} {keyword}"
        if title.lower().startswith(HN_TITLE_BLOCKLIST) or not contains_ai_signal(relevance_text):
            continue
        if external_url and is_non_news_url(external_url):
            continue
        target_url = external_url or hn_url
        created_at = item.get("created_at") or datetime.now(timezone.utc).isoformat()
        articles.append(
            Article(
                id=stable_id(target_url),
                title=title,
                source="Hacker News",
                url=target_url,
                publishedAt=created_at,
                summary=f"Hacker News discussion matching {keyword}.",
                keywords=[keyword, "Hacker News"],
                popularity=min(int(item.get("points") or 0), 100),
            )
        )
    return articles


async def fetch_reddit(keyword: str) -> list[Article]:
    url = "https://www.reddit.com/r/artificial+MachineLearning+LocalLLaMA+OpenAI/search.json"
    params = {"q": keyword, "restrict_sr": "on", "sort": "new", "limit": 10}
    async with httpx.AsyncClient(timeout=settings.source_timeout_seconds, headers=REQUEST_HEADERS, follow_redirects=True) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        payload = response.json()
    articles: list[Article] = []
    for child in payload.get("data", {}).get("children", []):
        item = child.get("data", {})
        permalink = f"https://www.reddit.com{item.get('permalink', '')}"
        created = datetime.fromtimestamp(item.get("created_utc", datetime.now(timezone.utc).timestamp()), tz=timezone.utc)
        articles.append(
            Article(
                id=stable_id(permalink),
                title=item.get("title", "Reddit AI discussion"),
                source=f"Reddit r/{item.get('subreddit', 'AI')}",
                url=item.get("url_overridden_by_dest") or permalink,
                publishedAt=created,
                summary=item.get("selftext", "")[:280] or f"Reddit discussion matching {keyword}.",
                keywords=[keyword, "Reddit"],
                popularity=min(int(item.get("score") or 0), 100),
            )
        )
    return articles


async def collect_latest_news(limit: int = 60) -> list[Article]:
    if not settings.enable_live_fetch:
        return sample_articles()

    async def safe_collect(keyword: str, collector) -> list[Article]:
        try:
            return await collector(keyword)
        except Exception:
            return []

    tasks = [
        safe_collect(keyword, collector)
        for keyword in KEYWORDS
        for collector in (fetch_newsapi, fetch_gdelt, fetch_google_news_rss, fetch_hacker_news, fetch_reddit)
    ]
    results = await asyncio.gather(*tasks)
    articles = [article for result in results for article in result]
    deduped = {article.url.unicode_string(): article for article in articles}
    if not deduped:
        return sample_articles()
    return sorted(deduped.values(), key=lambda item: item.publishedAt, reverse=True)[:limit]
