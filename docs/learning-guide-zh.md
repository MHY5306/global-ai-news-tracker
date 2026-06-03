# Global AI News Tracker 学习指南（中文）

这份文档是给“没有系统学过前端和后端，但想把这个项目真正变成转职作品”的你用的。目标不是背代码，而是能理解项目为什么这样设计、每一层在做什么、面试时怎么讲，以及接下来应该按什么顺序补基础。

## 1. 这个项目一句话怎么讲

Global AI News Tracker 是一个全栈 AI 新闻智能平台。前端使用 Next.js 展示新闻、图表、筛选和日报页面；后端使用 FastAPI 抓取 AI 相关新闻，并对新闻做摘要、分类、情绪分析和趋势统计；部署上使用 Vercel 托管前端，Render 托管后端。

面试开场可以这样说：

> 我做了一个 Global AI News Tracker，用来聚合全球 AI 新闻。项目采用前后端分离架构，前端负责展示 Dashboard 和交互，后端负责抓取新闻、整理数据和提供 API。上线后前端部署在 Vercel，后端部署在 Render。

## 2. 项目整体结构

```text
global-ai-news-tracker/
  frontend/          用户看到的网站界面
  backend/           后端 API，负责新闻抓取和数据处理
  database/          数据库表结构
  docs/              项目文档和学习文档
  scripts/           本地启动脚本
  README.md          GitHub 项目说明
  docker-compose.yml 本地 Docker 编排配置
  render.yaml        Render 后端部署配置
```

你要先记住一个核心分工：

```text
frontend = 给用户看的页面
backend = 给前端提供数据的服务
database = 长期保存数据的地方
deployment = 让别人能通过互联网访问
```

## 3. 前端是什么

前端就是用户在浏览器里看到和操作的部分。这个项目的前端在 `frontend/` 目录。

它负责：

- 展示新闻卡片
- 展示趋势图表
- 搜索和筛选新闻
- 显示 AI Daily Briefing 页面
- 保存收藏和阅读历史
- 向后端请求新闻数据

你需要学习的前端知识：

```text
HTML：网页结构
CSS：样式和布局
JavaScript：网页逻辑
TypeScript：带类型的 JavaScript
React：组件化 UI
Next.js：基于 React 的网站框架
Tailwind CSS：快速写现代 UI
```

## 4. 前端核心文件怎么理解

### `frontend/app/page.tsx`

首页入口。它会获取新闻和分析数据，然后把数据传给 Dashboard。

你可以理解为：

```text
首页 = 取数据 + 渲染主组件
```

### `frontend/components/news-dashboard.tsx`

主仪表盘组件。这里包含首页的大部分逻辑，比如搜索、筛选、排序、显示新闻列表和图表。

你要重点理解：

- `useState`：保存页面状态
- `useMemo`：根据筛选条件计算结果
- `useEffect`：页面加载后定时刷新数据

### `frontend/components/article-card.tsx`

单个新闻卡片。每一条新闻都会用这个组件展示。

它展示：

- 标题
- 来源
- 发布时间
- 分类
- 摘要
- 情绪
- 关键词
- 收藏按钮
- 原文链接

面试可以说：

> 我把新闻展示拆成了可复用的 ArticleCard 组件，这样首页、收藏页和历史页都能复用同一个展示逻辑。

### `frontend/components/filter-bar.tsx`

搜索和筛选栏。

用户可以按照：

- 关键词
- 分类
- 语言
- 来源
- 最新 / 热度

来过滤新闻。

### `frontend/components/trending-dashboard.tsx`

趋势图表区，使用 Recharts 画图。

它展示：

- 新闻数量趋势
- 公司提及次数
- 话题频率
- 来源分布
- 国家分布

### `frontend/lib/api.ts`

这是前端连接后端的地方。

核心逻辑是：

```text
如果有后端 API，就请求后端
如果后端失败，就使用 mock 数据兜底
```

这很重要，因为真实项目里外部服务可能失败，前端不能直接崩掉。

### `frontend/lib/mock-data.ts`

模拟数据。即使后端没有上线，前端也能展示完整页面。

面试可以说：

> 我设计了 mock 数据作为 fallback，这样项目在没有 API Key 或后端暂时不可用时，也能保持可演示状态。

## 5. 后端是什么

后端就是运行在服务器上的程序。用户看不到后端，但前端会向它请求数据。

这个项目的后端在 `backend/` 目录，使用 FastAPI。

它负责：

- 从新闻源抓取新闻
- 整理新闻字段
- 去重
- 生成摘要和分类
- 统计趋势数据
- 给前端提供 API

你需要学习的后端知识：

```text
HTTP：浏览器和服务器如何通信
API：前端拿数据的接口
REST API：常见 API 设计方式
Python：后端编程语言
FastAPI：Python 后端框架
异步请求：同时请求多个新闻源
环境变量：安全保存 API Key
缓存：减少重复请求和限流风险
```

## 6. 后端核心文件怎么理解

### `backend/app/main.py`

后端入口文件。启动 FastAPI 应用，配置 CORS，并挂载路由。

CORS 是什么？

```text
CORS 决定哪些前端网站可以访问后端 API。
```

因为你的前端在 Vercel，后端在 Render，它们是不同域名，所以必须配置 CORS。

### `backend/app/api/routes.py`

API 路由文件。这里定义了前端可以访问哪些接口。

主要接口：

```text
GET /health
GET /api/news
GET /api/analytics
GET /api/briefing
```

你要会讲：

> 前端通过 `/api/news` 获取新闻列表，通过 `/api/analytics` 获取趋势图表数据。

### `backend/app/core/config.py`

配置文件。读取环境变量。

比如：

```text
ENABLE_LIVE_FETCH
OPENAI_API_KEY
NEWS_API_KEY
ALLOWED_ORIGINS
REFRESH_MINUTES
```

你要理解：

```text
不能把 API Key 写死在代码里
应该通过环境变量配置
```

### `backend/app/models/news.py`

数据模型文件。定义新闻长什么样。

一篇 Article 包含：

- id
- title
- source
- url
- publishedAt
- category
- language
- summary
- sentiment
- country
- popularity
- keywords
- companies

这就是后端和前端之间的数据契约。

### `backend/app/services/collectors.py`

新闻采集逻辑。

它会从这些来源抓数据：

- NewsAPI
- GDELT
- Google News RSS
- Hacker News
- Reddit

你要理解：

```text
collector = 数据采集器
```

它负责把不同来源的数据整理成统一的 Article 格式。

### `backend/app/services/enrichment.py`

AI 分析层。

它负责：

- 生成摘要
- 判断分类
- 判断情绪
- 提取关键词
- 提取公司名

如果有 `OPENAI_API_KEY`，可以调用 OpenAI。  
如果没有，就使用规则兜底。

面试可以说：

> 我把 AI 分析逻辑单独放在 enrichment service 中，这样新闻采集和 AI 处理是解耦的，后续可以替换模型或升级 prompt。

### `backend/app/services/analytics.py`

趋势分析逻辑。

它统计：

- 公司提及次数
- 关键词频率
- 来源分布
- 国家分布
- 情绪趋势

### `backend/app/services/cache.py`

缓存逻辑。

为什么需要缓存？

```text
避免每次用户刷新页面都重新抓新闻
减少外部 API 请求次数
降低 API rate limit 风险
提升响应速度
```

## 7. 前端和后端怎么连接

整个数据流是：

```text
用户打开网页
  ↓
Vercel 前端加载页面
  ↓
frontend/lib/api.ts 请求 Render 后端
  ↓
FastAPI 后端抓取/整理新闻
  ↓
后端返回 JSON 数据
  ↓
前端把 JSON 渲染成卡片和图表
```

你要理解 JSON：

```json
{
  "title": "OpenAI expands enterprise agent platform",
  "source": "TechCrunch",
  "category": "LLMs",
  "summary": "..."
}
```

JSON 是前后端交换数据的常见格式。

## 8. 部署是什么

本地运行：

```text
http://localhost:3000
```

只能你自己的电脑访问。

部署后：

```text
https://global-ai-news-tracker.vercel.app
```

别人也能访问。

这个项目用了：

```text
Vercel：部署前端
Render：部署后端
GitHub：保存代码并触发部署
```

你要会讲：

> 我把前端部署到 Vercel，后端部署到 Render，并通过 GitHub 自动触发部署。这样代码更新后，线上网站可以自动更新。

## 9. 为什么要用 `.gitignore`

`.gitignore` 决定哪些文件不上传 GitHub。

不能上传：

```text
node_modules/
.next/
.env
.env.local
.venv/
__pycache__/
*.pyc
.DS_Store
```

原因：

- `node_modules` 太大
- `.next` 是构建产物
- `.env` 可能包含 API Key
- `__pycache__` 是 Python 缓存

## 10. 你应该按什么顺序学习

### 第一阶段：网页基础

学习目标：

- 看懂 HTML 结构
- 会用 CSS 调整布局
- 理解 JavaScript 变量、函数、数组、对象

练习：

- 做一个静态新闻卡片
- 做一个搜索输入框
- 做一个简单筛选列表

### 第二阶段：React 和组件

学习目标：

- 理解组件
- 理解 props
- 理解 state
- 理解事件处理

练习：

- 把新闻卡片拆成组件
- 用数组渲染多个新闻卡片
- 做收藏按钮

### 第三阶段：Next.js

学习目标：

- 理解 `app/page.tsx`
- 理解页面路由
- 理解服务器组件和客户端组件
- 理解环境变量

练习：

- 新增一个 `/about` 页面
- 新增一个 `/sources` 页面
- 修改首页文案和布局

### 第四阶段：API 和后端

学习目标：

- 理解 HTTP 请求
- 理解 GET / POST
- 理解 JSON
- 理解 FastAPI 路由

练习：

- 打开 `/health`
- 打开 `/api/news`
- 修改 `/api/news` 返回字段

### 第五阶段：数据库

学习目标：

- 理解表
- 理解主键
- 理解索引
- 理解 SQL 查询

练习：

- 看懂 `database/schema.sql`
- 写一个查询最新新闻的 SQL
- 写一个按分类筛选的 SQL

### 第六阶段：AI API

学习目标：

- 理解 prompt
- 理解模型输出 JSON
- 理解 fallback
- 理解 API Key 安全

练习：

- 改写摘要 prompt
- 增加一个风险等级字段
- 增加中文摘要字段

### 第七阶段：部署

学习目标：

- 理解 GitHub
- 理解 Vercel
- 理解 Render
- 理解环境变量
- 理解日志排错

练习：

- 修改前端文字并重新部署
- 修改后端接口并重新部署
- 看一次 Render logs

## 11. 面试时怎么讲这个项目

### 项目介绍

> 这是一个 AI 新闻智能聚合平台，目标是帮助用户快速追踪全球 AI 行业动态。系统会从多个新闻源抓取 AI 相关新闻，并生成摘要、分类、情绪和趋势分析。前端使用 Next.js 构建 Dashboard，后端使用 FastAPI 提供新闻和分析 API。

### 技术栈

> 前端使用 Next.js、TypeScript、Tailwind CSS 和 Recharts；后端使用 FastAPI、Python async 请求和 OpenAI API；部署使用 Vercel 和 Render。

### 你负责的部分

如果你是用 Codex 辅助开发，可以诚实但专业地说：

> 这个项目是在 AI 编程工具辅助下完成的，但我重点理解了整体架构、前后端职责、部署流程和主要代码模块。我也通过部署和排错理解了真实项目从本地到上线的过程。

这比假装全都手写更可信。

### 遇到的问题

你可以讲真实经历：

> 部署后端时遇到了环境变量解析问题，Render 传入的 `ALLOWED_ORIGINS` 是字符串，但代码一开始按 list 解析，导致后端启动失败。后来我把配置改成字符串，再在代码里 split 成数组，解决了部署问题。

这是很好的面试素材，因为它体现了你会看日志和排查问题。

## 12. 你现在最需要补的概念

优先级最高：

```text
1. 前端组件是什么
2. API 是什么
3. JSON 是什么
4. 前端如何 fetch 后端数据
5. 后端 route 是什么
6. 环境变量为什么重要
7. 部署和本地运行有什么区别
8. 如何看 logs 排错
```

## 13. 你可以做的二次开发任务

为了真正学到东西，建议你自己做这些小改动：

1. 修改首页标题和副标题
2. 新增一个新闻分类
3. 在 ArticleCard 里增加 `country` 显示
4. 新增一个 `/sources` 页面
5. 给 `/api/news` 增加 `source` 筛选
6. 修改刷新时间为 5 分钟
7. 在 README 里增加你的项目截图
8. 给日报页面增加中文摘要区

这些任务比重新做一个项目更适合入门，因为你可以在已有项目里逐步理解。

## 14. 最终你要达到的状态

你不需要马上成为高级工程师。你下一阶段的目标是能做到：

```text
看懂项目结构
知道每个文件大概负责什么
能改一个前端组件
能改一个后端 API
能重新部署
能解释一次真实 bug 的排查过程
能在面试中讲清楚项目价值
```

当你能做到这些，这个项目就不只是 Codex 写出来的代码，而会变成你真正理解过、能讲出来、能继续扩展的作品。
