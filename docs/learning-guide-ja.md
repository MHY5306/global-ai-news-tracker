# Global AI News Tracker 学習ガイド（日本語）

このドキュメントは、フロントエンドやバックエンドの知識がまだ少ない状態でも、このプロジェクトを転職用ポートフォリオとして説明できるようになるための学習ガイドです。目的はコードを丸暗記することではなく、プロジェクトの構造、各ファイルの役割、学ぶべき技術、面接での説明方法を理解することです。

## 1. このプロジェクトを一言で説明する

Global AI News Tracker は、AI 関連ニュースを収集し、要約・分類・感情分析・トレンド分析を行うフルスタック Web アプリです。フロントエンドは Next.js、バックエンドは FastAPI、デプロイは Vercel と Render を使っています。

面接では次のように説明できます。

> Global AI News Tracker は、世界中の AI ニュースを収集して可視化する AI ニュースインテリジェンスプラットフォームです。フロントエンドではニュース一覧、検索、フィルター、チャート、日次レポートを表示し、バックエンドではニュース取得、データ整形、分析 API を提供しています。

## 2. プロジェクト全体の構成

```text
global-ai-news-tracker/
  frontend/          ユーザーが見る画面
  backend/           API サーバー、ニュース取得、データ処理
  database/          データベース設計
  docs/              ドキュメント
  scripts/           ローカル実行用スクリプト
  README.md          GitHub 用の説明
  docker-compose.yml Docker 用の設定
  render.yaml        Render 用のバックエンドデプロイ設定
```

まず覚えるべき役割分担はこれです。

```text
frontend = ブラウザに表示される画面
backend = データを返すサーバー
database = データを保存する場所
deployment = 他人がインターネットで使えるように公開すること
```

## 3. フロントエンドとは

フロントエンドは、ユーザーがブラウザで見たり操作したりする部分です。このプロジェクトでは `frontend/` に入っています。

このプロジェクトのフロントエンドは次のことを担当します。

- ニュースカードを表示する
- トレンドチャートを表示する
- ニュースを検索・フィルターする
- AI Daily Briefing ページを表示する
- ブックマークと閲覧履歴を保存する
- バックエンド API からニュースデータを取得する

学ぶべきフロントエンド技術：

```text
HTML：ページの構造
CSS：デザインとレイアウト
JavaScript：画面の動きや処理
TypeScript：型付き JavaScript
React：コンポーネントで UI を作るライブラリ
Next.js：React ベースの Web フレームワーク
Tailwind CSS：効率よく CSS を書くためのツール
```

## 4. フロントエンドの主要ファイル

### `frontend/app/page.tsx`

トップページの入口です。ニュースデータと分析データを取得し、メイン Dashboard に渡します。

イメージ：

```text
トップページ = データ取得 + Dashboard の表示
```

### `frontend/components/news-dashboard.tsx`

トップページの中心となるコンポーネントです。

担当していること：

- 検索キーワードの状態管理
- カテゴリや言語によるフィルター
- 並び替え
- ニュースカードの一覧表示
- トレンドチャートの表示
- 一定時間ごとのデータ更新

ここで学ぶ概念：

```text
useState：状態を保存する
useMemo：計算結果を効率よく使う
useEffect：画面表示後に処理を実行する
```

### `frontend/components/article-card.tsx`

1 つのニュースを表示するカードです。

表示する情報：

- タイトル
- ニュースソース
- 投稿日時
- カテゴリ
- 要約
- 感情
- キーワード
- ブックマークボタン
- 元記事リンク

面接では次のように説明できます。

> ニュース表示を ArticleCard コンポーネントとして分離することで、トップページ、ブックマークページ、履歴ページで再利用できるようにしました。

### `frontend/components/filter-bar.tsx`

検索とフィルターの UI です。

ユーザーは以下の条件でニュースを絞り込めます。

- キーワード
- カテゴリ
- 言語
- ソース
- 新着順 / 人気順

### `frontend/components/trending-dashboard.tsx`

チャートを表示する部分です。Recharts というライブラリを使っています。

表示内容：

- ニュース量の推移
- 企業名の出現回数
- トピック頻度
- ソース分布
- 国・地域分布

### `frontend/lib/api.ts`

フロントエンドからバックエンド API に接続するファイルです。

重要な考え方：

```text
バックエンド API が使える場合は API から取得
失敗した場合は mock データを使う
```

実務では外部サービスが失敗することがあります。そのため、fallback を用意することは重要です。

### `frontend/lib/mock-data.ts`

デモ用のサンプルデータです。バックエンドがまだ動いていなくても、画面を確認できます。

面接では次のように言えます。

> API が使えない場合でも画面を確認できるように、mock データを fallback として用意しました。

## 5. バックエンドとは

バックエンドは、サーバー側で動くプログラムです。ユーザーには直接見えませんが、フロントエンドはバックエンドにデータを取りに行きます。

このプロジェクトでは `backend/` にあり、FastAPI を使っています。

バックエンドの役割：

- ニュースを取得する
- データ形式を統一する
- 重複を取り除く
- 要約や分類を行う
- 分析データを作る
- フロントエンドに API として返す

学ぶべきバックエンド技術：

```text
HTTP：ブラウザとサーバーの通信
API：データを受け渡す入口
REST API：よく使われる API 設計
Python：バックエンド言語
FastAPI：Python の Web API フレームワーク
非同期処理：複数の外部 API を効率よく呼ぶ方法
環境変数：API Key などを安全に管理する方法
キャッシュ：毎回同じ処理を繰り返さない仕組み
```

## 6. バックエンドの主要ファイル

### `backend/app/main.py`

FastAPI アプリの入口です。

担当：

- FastAPI アプリを作る
- CORS を設定する
- API ルートを読み込む

CORS とは：

```text
どのフロントエンドのドメインからバックエンド API にアクセスしてよいかを決める設定
```

フロントエンドは Vercel、バックエンドは Render にあるため、CORS 設定が必要です。

### `backend/app/api/routes.py`

API の URL を定義するファイルです。

主な API：

```text
GET /health
GET /api/news
GET /api/analytics
GET /api/briefing
```

説明例：

> フロントエンドは `/api/news` からニュース一覧を取得し、`/api/analytics` からチャート用の分析データを取得します。

### `backend/app/core/config.py`

環境変数を読み込む設定ファイルです。

例：

```text
ENABLE_LIVE_FETCH
OPENAI_API_KEY
NEWS_API_KEY
ALLOWED_ORIGINS
REFRESH_MINUTES
```

大事な考え方：

```text
API Key はコードに直接書かない
環境変数として管理する
```

### `backend/app/models/news.py`

データモデルを定義するファイルです。

Article には以下のような項目があります。

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

これはフロントエンドとバックエンドの間の「データの約束」です。

### `backend/app/services/collectors.py`

ニュースを取得する処理です。

対応しているニュースソース：

- NewsAPI
- GDELT
- Google News RSS
- Hacker News
- Reddit

collector の意味：

```text
外部サービスからデータを集める部品
```

異なる形式のデータを、同じ Article 形式に変換しています。

### `backend/app/services/enrichment.py`

AI 分析を行う部分です。

担当：

- 要約
- カテゴリ分類
- 感情分析
- キーワード抽出
- 企業名抽出

`OPENAI_API_KEY` がある場合は OpenAI API を使います。  
ない場合はルールベースの fallback を使います。

面接での説明：

> AI 分析処理を enrichment service として分離し、ニュース取得処理と AI 処理を疎結合にしました。これにより、将来的にモデルや prompt を変更しやすくしています。

### `backend/app/services/analytics.py`

分析データを作るファイルです。

集計内容：

- 企業名の出現回数
- キーワード頻度
- ソース分布
- 国・地域分布
- 感情の推移

### `backend/app/services/cache.py`

キャッシュ処理です。

キャッシュが必要な理由：

```text
毎回ニュース API を呼ぶと遅くなる
外部 API の rate limit に引っかかる
同じデータを短時間に何度も取得する必要がない
```

## 7. フロントエンドとバックエンドのつながり

データの流れ：

```text
ユーザーがサイトを開く
  ↓
Vercel の Next.js フロントエンドが表示される
  ↓
frontend/lib/api.ts が Render の FastAPI にリクエストする
  ↓
FastAPI がニュースを取得・整形する
  ↓
JSON データを返す
  ↓
フロントエンドがカードやチャートとして表示する
```

JSON の例：

```json
{
  "title": "OpenAI expands enterprise agent platform",
  "source": "TechCrunch",
  "category": "LLMs",
  "summary": "..."
}
```

JSON はフロントエンドとバックエンドがデータをやり取りするための一般的な形式です。

## 8. デプロイとは

ローカル開発：

```text
http://localhost:3000
```

これは自分のパソコンでしか見られません。

デプロイ後：

```text
https://global-ai-news-tracker.vercel.app
```

これは他の人にも共有できます。

このプロジェクトでは：

```text
Vercel = フロントエンド
Render = バックエンド
GitHub = コード管理と自動デプロイの起点
```

面接での説明：

> フロントエンドは Vercel、バックエンドは Render にデプロイしました。GitHub に push すると、Vercel や Render が自動で再デプロイします。

## 9. `.gitignore` の意味

`.gitignore` は GitHub にアップロードしないファイルを指定するものです。

アップロードしないもの：

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

理由：

- `node_modules` は大きすぎる
- `.next` はビルド結果
- `.env` には API Key が入る可能性がある
- `__pycache__` は Python のキャッシュ

## 10. 学習順序

### Step 1: Web の基礎

学ぶこと：

- HTML
- CSS
- JavaScript の基本

練習：

- 静的なニュースカードを作る
- ボタンを押したら表示が変わる処理を書く
- 簡単な検索フォームを作る

### Step 2: React

学ぶこと：

- コンポーネント
- props
- state
- イベント処理

練習：

- ArticleCard を自分で作る
- 配列から複数カードを表示する
- ブックマークボタンを作る

### Step 3: Next.js

学ぶこと：

- `app/page.tsx`
- ルーティング
- Client Component
- Server Component
- 環境変数

練習：

- `/about` ページを追加する
- `/sources` ページを追加する
- トップページのデザインを少し変更する

### Step 4: API とバックエンド

学ぶこと：

- HTTP
- GET / POST
- JSON
- FastAPI の route

練習：

- `/health` をブラウザで開く
- `/api/news` を開く
- API の返却項目を 1 つ追加する

### Step 5: データベース

学ぶこと：

- テーブル
- 主キー
- インデックス
- SQL

練習：

- `database/schema.sql` を読む
- 最新ニュースを取得する SQL を書く
- カテゴリで絞り込む SQL を書く

### Step 6: AI API

学ぶこと：

- prompt
- OpenAI API
- JSON 形式の出力
- fallback
- API Key の管理

練習：

- 要約 prompt を変更する
- 日本語要約フィールドを追加する
- ニュースの重要度スコアを追加する

### Step 7: デプロイと運用

学ぶこと：

- GitHub
- Vercel
- Render
- 環境変数
- Logs の読み方

練習：

- フロントエンドの文言を変更して再デプロイする
- バックエンド API を変更して再デプロイする
- Render の logs を読んでエラー原因を探す

## 11. 面接での話し方

### プロジェクト概要

> AI ニュースを複数ソースから取得し、要約、分類、感情分析、トレンド可視化を行う Web アプリを作りました。フロントエンドは Next.js、バックエンドは FastAPI、デプロイは Vercel と Render を使用しています。

### 技術選定

> Next.js は UI とルーティングを効率よく作れるため採用しました。FastAPI は Python で非同期 API を作りやすく、ニュース取得や AI 処理と相性が良いため採用しました。

### Codex を使ったことについて

AI ツールを使ったことを隠す必要はありません。次のように言うと自然です。

> 実装には AI コーディングツールも活用しました。ただし、私はプロジェクト構造、前後分離、API、環境変数、デプロイ、ログ確認などを理解しながら進めました。特にデプロイ時のエラー対応を通じて、実務に近い問題解決を経験しました。

### トラブル対応の説明

今回の実例：

> Render でバックエンドをデプロイした際、`ALLOWED_ORIGINS` の環境変数が list として解析されず、起動に失敗しました。ログを確認し、文字列として受け取ってから split する実装に変更して解決しました。

これは面接でとても良い話題になります。単に作っただけではなく、ログを読んで原因を特定した経験になるからです。

## 12. まず理解すべき重要概念

優先順位：

```text
1. コンポーネントとは何か
2. API とは何か
3. JSON とは何か
4. フロントエンドがバックエンドからデータを取る流れ
5. FastAPI の route とは何か
6. 環境変数とは何か
7. ローカル実行とデプロイの違い
8. logs を見てエラーを調べる方法
```

## 13. 自分でやるべき小さな改修

理解を深めるために、次の改修を自分でやると効果的です。

1. トップページのタイトルを変更する
2. ArticleCard に国・地域を表示する
3. 新しいカテゴリを追加する
4. `/sources` ページを追加する
5. `/api/news` に source フィルターを追加する
6. 更新間隔を 3 分から 5 分に変える
7. Daily Briefing に日本語要約セクションを追加する
8. README にスクリーンショットを追加する

## 14. このプロジェクトで到達したい状態

最初からすべてを理解する必要はありません。まずは次の状態を目指してください。

```text
プロジェクト構造を説明できる
主要ファイルの役割を説明できる
フロントエンドの部品を 1 つ修正できる
バックエンド API を 1 つ修正できる
GitHub に push できる
Vercel / Render で再デプロイできる
ログを見てエラー原因を探せる
面接でプロジェクトの価値を説明できる
```

ここまでできれば、このプロジェクトは単に AI が作ったコードではなく、あなたが理解し、説明し、改善できるポートフォリオになります。
