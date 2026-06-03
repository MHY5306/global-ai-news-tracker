from datetime import datetime
from typing import Literal

from pydantic import BaseModel, HttpUrl

Category = Literal[
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
Language = Literal["English", "Chinese", "Japanese"]
Sentiment = Literal["positive", "neutral", "negative"]


class Article(BaseModel):
    id: str
    title: str
    source: str
    url: HttpUrl
    publishedAt: datetime
    category: Category = "LLMs"
    language: Language = "English"
    summary: str
    sentiment: Sentiment = "neutral"
    country: str = "Global"
    popularity: int = 50
    keywords: list[str] = []
    companies: list[str] = []


class Analytics(BaseModel):
    companies: list[dict[str, int | str]]
    topics: list[dict[str, int | str]]
    timeline: list[dict[str, int | str]]
    sources: list[dict[str, int | str]]
    countries: list[dict[str, int | str]]
