# Cloudflare Pagesでの公開

2026-10-21更新。GitHubリポジトリとの連携と初回公開が完了しました。
公開先：<https://tokuyama-kosen-festival.pages.dev/>
初回公開のソースは`70cf650`。本番ブランチ`main`の自動デプロイが有効です。

## 設定済みの内容

Cloudflare Pagesのプロジェクト名は`tokuyama-kosen-festival`、公開元はGitHubの`haniwa820-t/tokuyama-kosen-festival`です。

| 項目 | 設定 |
| --- | --- |
| 本番ブランチ | `main` |
| フレームワーク | React (Vite) |
| ルートディレクトリ | リポジトリのルート |
| ビルドコマンド | `npm run check` |
| 出力ディレクトリ | `dist` |
| 環境変数 | `NODE_VERSION=24` |
| 公開URL | `SITE_URL=https://tokuyama-kosen-festival.pages.dev/` |
| 配信パス | `SITE_BASE_PATH`は未設定、または`/` |

`npm run check`は型・lint・テスト・素材・配色・静的生成・内部リンクを検証します。通常のCloudflareビルドでは広告PDFの変換は行わず、Gitで管理する生成済み画像を使います。

`SITE_URL`は公開URLに設定済みです。独自ドメインを使う場合は同じ設定を更新し、再ビルドしてください。未設定時はCloudflareが提供する`CF_PAGES_URL`を使います。
プレビュー環境の`SITE_URL`を未設定にすると、プレビュー自身のURLを使います。

## 配信と確認

各ページに静的なindex.htmlがあり、404.htmlも生成します。すべてのURLをホームへ転送するSPA用の設定は不要です。
公開後はホーム、`/sponsors/`、`/guide/map/`、`/events/booths/`の直接アクセスと再読込、PDF、画像、大口5社のリンクを確認してください。

既存のGitHub Pagesも`.github/workflows/pages.yml`の設定で維持しています。GitHubへのpushでCloudflare Pagesのビルドが動くため、CloudflareのAPIトークンをリポジトリへ保存する必要はありません。

## ローカルでの確認

```sh
npm run check
npm run test:e2e
```

既存のGitHub Pages用ビルド：

```sh
SITE_BASE_PATH=/tokuyama-kosen-festival/ SITE_URL=https://haniwa820-t.github.io/tokuyama-kosen-festival/ npm run build
SITE_BASE_PATH=/tokuyama-kosen-festival/ npm run test:e2e
```

公式資料（2026-10-21確認）：[ビルド設定](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[GitHub連携](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)、[静的ページと404の配信](https://developers.cloudflare.com/pages/configuration/serving-pages/)。

## 公開後の確認

2026-10-21に、ホーム・スポンサー・会場マップ・企画検索・アクセス・日程のHTTP 200とページ固有のcanonicalを確認しました。準備版PDFの配信と容量、メイン画像、会場全体図、東ソーのロゴ画像も確認済みです。
ブラウザーではスポンサー画像88件と大口5社のリンク、地図9枚と星マークの説明、企画検索、深いURLからの再読込を確認しました。
