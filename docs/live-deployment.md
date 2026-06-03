# Live News Deployment

This project is already deployed as a frontend-only portfolio demo on Vercel. To make it fetch live AI news, deploy the FastAPI backend and connect the Vercel frontend to it.

## Backend: Render

1. Open Render and choose **New +** -> **Blueprint**.
2. Connect the GitHub repository `MHY5306/global-ai-news-tracker`.
3. Render will read `render.yaml` and create `global-ai-news-tracker-api`.
4. The backend can deploy without API keys. After it is running, optionally add:

```env
OPENAI_API_KEY=your_openai_key_optional_but_recommended
NEWS_API_KEY=your_newsapi_key_optional
```

The blueprint already sets `ENABLE_LIVE_FETCH=true` and `ALLOWED_ORIGINS`. The app can still fetch from GDELT, Google News RSS, Hacker News, and Reddit without NewsAPI. Without `OPENAI_API_KEY`, it uses heuristic enrichment instead of OpenAI summaries.

## Frontend: Vercel

After the Render backend is live, copy its public URL, for example:

```text
https://global-ai-news-tracker-api.onrender.com
```

The frontend defaults to the Render backend URL. If you deploy your own backend URL, open the Vercel project and add:

```env
NEXT_PUBLIC_API_BASE_URL=https://global-ai-news-tracker-api.onrender.com
```

Redeploy the Vercel project. The frontend will then request live backend data and refresh every three minutes in the browser.

## Check

Backend health:

```text
https://your-render-url/health
```

Backend news:

```text
https://your-render-url/api/news?limit=5
```
