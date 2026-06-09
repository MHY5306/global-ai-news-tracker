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
    "OpenAI ChatGPT",
    "Anthropic Claude",
    "Google Gemini artificial intelligence",
    "NVIDIA AI GPU",
    "large language model",
    "generative AI model",
    "AI regulation policy",
    "AI chip semiconductor",
    "AI research model",
    "AI coding assistant",
    "AI robotics",
]

REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GlobalAITracker/1.0; +https://global-ai-news-tracker.vercel.app)",
    "Accept": "application/json,text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
}

AI_RELEVANCE_TERMS = {
    "artificial intelligence": 4,
    "openai": 5,
    "chatgpt": 5,
    "gpt-": 4,
    "gpt": 3,
    "claude": 5,
    "anthropic": 5,
    "gemini": 4,
    "nvidia": 4,
    "llm": 4,
    "large language model": 5,
    "foundation model": 4,
    "generative ai": 4,
    "machine learning": 3,
    "deep learning": 3,
    "ai chip": 4,
    "gpu": 2,
    "robotics": 3,
    "ai regulation": 4,
    "ai act": 4,
}

GENERIC_AI_TERMS = {"ai", "artificial intelligence"}

TRUSTED_NEWS_DOMAINS = {
    "reuters.com",
    "apnews.com",
    "bloomberg.com",
    "wsj.com",
    "ft.com",
    "technologyreview.com",
    "theverge.com",
    "techcrunch.com",
    "wired.com",
    "arstechnica.com",
    "venturebeat.com",
    "theregister.com",
    "zdnet.com",
    "cnbc.com",
    "bbc.com",
    "cnn.com",
    "nytimes.com",
    "washingtonpost.com",
    "nikkei.com",
    "asia.nikkei.com",
    "the-decoder.com",
    "semianalysis.com",
}

OFFICIAL_AI_DOMAINS = {
    "openai.com",
    "anthropic.com",
    "deepmind.google",
    "ai.googleblog.com",
    "blogs.nvidia.com",
    "microsoft.com",
    "meta.com",
    "mistral.ai",
    "cohere.com",
    "huggingface.co",
}

MARKETING_TITLE_PATTERNS = [
    "best ai tools",
    "top ai tools",
    "top 10",
    "top 5",
    "best free",
    "coupon",
    "promo code",
    "discount",
    "sponsored",
    "affiliate",
    "buy now",
    "review:",
    "how to use",
    "how to choose",
    "complete guide",
    "ultimate guide",
    "what is",
    "market size",
    "stock to buy",
    "price prediction",
]

NON_NEWS_DOMAINS = {
    "github.com",
    "youtube.com",
    "youtu.be",
    "producthunt.com",
    "app.productnow.ai",
    "medium.com",
    "substack.com",
    "quora.com",
}

HN_TITLE_BLOCKLIST = ("show hn:", "ask hn:", "launch hn:")

ASTROLOGY_TERMS = [
    "horoscope",
    "zodiac",
    "astrology",
    "tarot",
    "birth chart",
    "daily horoscope",
    "weekly horoscope",
    "gemini horoscope",
    "mercury retrograde",
    "moon sign",
    "sun sign",
]


def stable_id(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]


def get_hostname(url: str) -> str:
    return urlparse(url).netloc.lower().removeprefix("www.")


def domain_matches(host: str, domains: set[str]) -> bool:
    return any(host == domain or host.endswith(f".{domain}") for domain in domains)


def ai_relevance_score(text: str, url: str = "", source: str = "") -> int:
    normalized = text.lower()
    score = 0
    for term, weight in AI_RELEVANCE_TERMS.items():
        if re.search(rf"\b{re.escape(term)}\b", normalized):
            score += weight

    host = get_hostname(url) if url else ""
    if host and domain_matches(host, TRUSTED_NEWS_DOMAINS):
        score += 3
    if host and domain_matches(host, OFFICIAL_AI_DOMAINS):
        score += 4
    if source.lower() in {"reuters", "ap", "associated press", "bloomberg", "techcrunch", "the verge"}:
        score += 2
    return score


def contains_ai_signal(text: str) -> bool:
    normalized = text.lower()
    return any(re.search(rf"\b{re.escape(term)}\b", normalized) for term in GENERIC_AI_TERMS)


def looks_like_marketing_content(text: str, url: str = "") -> bool:
    normalized = f"{text} {url}".lower()
    return any(pattern in normalized for pattern in MARKETING_TITLE_PATTERNS)


def is_quality_ai_news(text: str, url: str = "", source: str = "", *, min_score: int = 5) -> bool:
    if contains_blocked_topic(text) or looks_like_marketing_content(text, url):
        return False
    if url and is_non_news_url(url):
        return False
    return ai_relevance_score(text, url=url, source=source) >= min_score


def contains_blocked_topic(text: str) -> bool:
    normalized = text.lower()
    return any(term in normalized for term in ASTROLOGY_TERMS)


def is_non_news_url(url: str) -> bool:
    host = get_hostname(url)
    return domain_matches(host, NON_NEWS_DOMAINS)


async def fetch_google_news_rss(keyword: str) -> list[Article]:
    query = quote_plus(keyword)
    url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    async with httpx.AsyncClient(timeout=settings.source_timeout_seconds, headers=REQUEST_HEADERS, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()
    feed = feedparser.parse(response.text)
    articles: list[Article] = []
    for entry in feed.entries[:8]:
        title = getattr(entry, "title", "")
        summary = getattr(entry, "summary", title)
        relevance_text = f"{title} {summary} {entry.link}"
        if not is_quality_ai_news(relevance_text, str(entry.link), "Google News"):
            continue
        published = getattr(entry, "published_parsed", None)
        published_at = datetime(*published[:6], tzinfo=timezone.utc) if published else datetime.now(timezone.utc)
        articles.append(
            Article(
                id=stable_id(entry.link),
                title=title,
                source="Google News",
                url=entry.link,
                publishedAt=published_at,
                summary=summary,
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
        title = item.get("title", "Untitled AI article")
        source = item.get("sourceCommonName", "GDELT")
        article_url = item.get("url", "")
        relevance_text = f"{title} {source} {article_url}"
        if not is_quality_ai_news(relevance_text, article_url, source):
            continue
        articles.append(
            Article(
                id=stable_id(article_url),
                title=title,
                source=source,
                url=article_url,
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
    articles: list[Article] = []
    for item in payload.get("articles", []):
        if not item.get("url") or not item.get("title"):
            continue
        title = item["title"]
        summary = item.get("description") or title
        source = item.get("source", {}).get("name", "NewsAPI")
        article_url = item["url"]
        relevance_text = f"{title} {summary} {source} {article_url}"
        if not is_quality_ai_news(relevance_text, article_url, source):
            continue
        articles.append(
            Article(
                id=stable_id(article_url),
                title=title,
                source=source,
                url=article_url,
                publishedAt=item.get("publishedAt") or datetime.now(timezone.utc),
                summary=summary,
                keywords=[keyword],
                popularity=60,
            )
        )
    return articles


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
        points = int(item.get("points") or 0)
        relevance_text = f"{title} {external_url}"
        if title.lower().startswith(HN_TITLE_BLOCKLIST):
            continue
        if not is_quality_ai_news(relevance_text, external_url, "Hacker News", min_score=7):
            continue
        if points < 3 and not domain_matches(get_hostname(external_url), TRUSTED_NEWS_DOMAINS | OFFICIAL_AI_DOMAINS):
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
                popularity=min(points, 100),
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
        title = item.get("title", "Reddit AI discussion")
        summary = item.get("selftext", "")[:280] or f"Reddit discussion matching {keyword}."
        score = int(item.get("score") or 0)
        outbound_url = item.get("url_overridden_by_dest", "")
        relevance_text = f"{title} {summary} {outbound_url}"
        if not is_quality_ai_news(relevance_text, outbound_url, f"Reddit r/{item.get('subreddit', 'AI')}", min_score=7):
            continue
        if score < 5:
            continue
        permalink = f"https://www.reddit.com{item.get('permalink', '')}"
        created = datetime.fromtimestamp(item.get("created_utc", datetime.now(timezone.utc).timestamp()), tz=timezone.utc)
        articles.append(
            Article(
                id=stable_id(permalink),
                title=title,
                source=f"Reddit r/{item.get('subreddit', 'AI')}",
                url=outbound_url or permalink,
                publishedAt=created,
                summary=summary,
                keywords=[keyword, "Reddit"],
                popularity=min(score, 100),
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
    return sorted(deduped.values(), key=lambda item: (item.popularity, item.publishedAt), reverse=True)[:limit]
