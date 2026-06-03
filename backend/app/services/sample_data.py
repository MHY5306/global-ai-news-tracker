from datetime import datetime, timedelta, timezone

from app.models.news import Article


def sample_articles() -> list[Article]:
    now = datetime.now(timezone.utc)
    return [
        Article(
            id="openai-agent-2026",
            title="OpenAI expands enterprise agent platform with stronger workflow controls",
            source="TechCrunch",
            url="https://techcrunch.com",
            publishedAt=now - timedelta(minutes=18),
            category="LLMs",
            language="English",
            summary="OpenAI is positioning agentic workflows as a core enterprise layer with governance controls and safer tool execution.",
            sentiment="positive",
            country="United States",
            popularity=96,
            keywords=["OpenAI", "agents", "enterprise", "workflow"],
            companies=["OpenAI", "Microsoft"],
        ),
        Article(
            id="nvidia-supply-chain",
            title="NVIDIA AI accelerator demand reshapes global semiconductor supply chains",
            source="Reuters",
            url="https://reuters.com",
            publishedAt=now - timedelta(minutes=44),
            category="AI Hardware",
            language="English",
            summary="Cloud providers and sovereign AI programs continue to compete for GPUs, memory, packaging, and power infrastructure.",
            sentiment="neutral",
            country="United States",
            popularity=91,
            keywords=["NVIDIA", "GPU", "semiconductors", "datacenter"],
            companies=["NVIDIA", "TSMC", "SK hynix"],
        ),
    ]
