import json

from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings
from app.models.news import Article

CATEGORIES = [
    "LLMs",
    "AI Hardware",
    "AI Startups",
    "Robotics",
    "AI Regulation",
    "Open Source AI",
    "AI Research",
    "AI Tools",
    "AI Finance",
    "AI Coding",
]


def heuristic_enrich(article: Article) -> Article:
    text = f"{article.title} {article.summary}".lower()
    if any(token in text for token in ["nvidia", "gpu", "chip", "semiconductor"]):
        article.category = "AI Hardware"
    elif any(token in text for token in ["regulation", "policy", "act", "compliance"]):
        article.category = "AI Regulation"
    elif any(token in text for token in ["robot", "robotics"]):
        article.category = "Robotics"
    elif any(token in text for token in ["github", "coding", "developer"]):
        article.category = "AI Coding"
    elif any(token in text for token in ["open source", "llama", "model weights"]):
        article.category = "Open Source AI"
    elif any(token in text for token in ["startup", "funding", "venture"]):
        article.category = "AI Startups"
    article.companies = [name for name in ["OpenAI", "NVIDIA", "Google", "Anthropic", "Microsoft", "Meta", "DeepSeek"] if name.lower() in text]
    article.keywords = list(dict.fromkeys(article.keywords + [article.category, "AI"]))[:6]
    return article


@retry(wait=wait_exponential(min=1, max=10), stop=stop_after_attempt(3))
async def openai_enrich(article: Article) -> Article:
    if not settings.openai_api_key:
        return heuristic_enrich(article)
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    prompt = {
        "title": article.title,
        "source_summary": article.summary,
        "allowed_categories": CATEGORIES,
        "languages": ["English", "Chinese", "Japanese"],
    }
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": "Enrich AI news. Return JSON with summary, category, sentiment, keywords, companies, language.",
            },
            {"role": "user", "content": json.dumps(prompt)},
        ],
    )
    data = json.loads(response.choices[0].message.content or "{}")
    article.summary = data.get("summary", article.summary)
    article.category = data.get("category", article.category)
    article.sentiment = data.get("sentiment", article.sentiment)
    article.keywords = data.get("keywords", article.keywords)[:8]
    article.companies = data.get("companies", article.companies)[:8]
    article.language = data.get("language", article.language)
    return article


async def enrich_articles(articles: list[Article]) -> list[Article]:
    enriched: list[Article] = []
    for article in articles:
        try:
            enriched.append(await openai_enrich(article))
        except Exception:
            enriched.append(heuristic_enrich(article))
    return enriched
