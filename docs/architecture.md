# Architecture

```mermaid
flowchart LR
  A[NewsAPI] --> C[FastAPI collectors]
  B[GDELT] --> C
  D[Google News RSS] --> C
  E[Reddit and Hacker News] -. planned .-> C
  C --> F[TTL cache and rate-limit guard]
  F --> G[OpenAI enrichment]
  G --> H[PostgreSQL or Supabase]
  G --> I[REST API]
  I --> J[Next.js dashboard]
  J --> K[Bookmarks and reading history]
```

## Data Flow

1. Collectors query AI keywords across configured sources.
2. URLs are deduplicated with stable hashes.
3. OpenAI enrichment generates summaries, categories, sentiment, keywords, companies, and multilingual labels.
4. API responses are cached for the configured refresh interval to reduce rate-limit pressure.
5. Next.js renders the dashboard, polls the API every three minutes, and persists personal actions in local storage.

## Scalability Notes

- Move collector execution to a queue worker for high-volume production ingestion.
- Store article embeddings in Supabase pgvector for semantic search and RAG chat.
- Add user authentication before moving bookmarks from local storage to Postgres.
- Use Vercel ISR for public dashboards and Render/Railway background workers for ingestion.
