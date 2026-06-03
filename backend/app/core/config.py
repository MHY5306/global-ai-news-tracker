from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Global AI News Tracker API"
    openai_api_key: str | None = None
    news_api_key: str | None = None
    reddit_client_id: str | None = None
    reddit_client_secret: str | None = None
    database_url: str = "postgresql://postgres:postgres@localhost:5432/global_ai_news"
    allowed_origins: list[str] = ["http://localhost:3000"]
    refresh_minutes: int = 3
    enable_live_fetch: bool = False
    source_timeout_seconds: float = 4.0

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
