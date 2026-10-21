# Cloudflare Pagesでの公開

2026-10-21更新。GitHubリポジトリを連携し、静的サイトを配信する構成です。Cloudflare側のログイン・リポジトリ連携は未完了です。

## 接続時の設定

CloudflareのWorkers & PagesからPagesを作成し、GitHubの`haniwa820-t/tokuyama-kosen-festival`を選びます。

| 項目 | 設定 |
| --- | --- |
| 本番ブランチ | `main` |
| フレームワーク | React (Vite) |
| ルートディレクトリ | リポジトリのルート |
| ビルドコマンド | `npm run check` |
| 出力ディレクトリ | `dist` |
| 環境変数 | `NODE_VERSION=24` |
| 公開URL | 作成時に確定したURLを`SITE_URL`に設定（末尾は`/`） |
| 配信パス | `SITE_BASE_PATH`は未設定、または`/` |

`npm run check`は型・lint・テスト・素材・配色・静的生成・内部リンクを検証します。通常のCloudflareビルドでは広告PDFの変換は行わず、Gitで管理する生成済み画像を使います。

`SITE_URL`の設定前はCloudflareが提供する`CF_PAGES_URL`を使います。公開URLが確定したら、本番環境の`SITE_URL`に安定したURLを設定して再ビルドしてください。独自ドメインを使う場合も同じ設定を更新します。
プレビュー環境の`SITE_URL`を未設定にすると、プレビュー自身のURLを使います。

## 配信と確認

各ページに静的なindex.htmlがあり、404.htmlも生成します。すべてのURLをホームへ転送するSPA用の設定は不要です。
公開後はホーム、`/sponsors/`、`/guide/map/`、`/events/booths/`の直接アクセスと再読込、PDF、画像、大口5社のリンクを確認してください。

既存のGitHub Pagesは、移行完了まで`.github/workflows/pages.yml`の設定で維持します。Cloudflare側の接続後はGitHubへのpushでPagesのビルドが動くため、CloudflareのAPIトークンをリポジトリへ保存する必要はありません。

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
