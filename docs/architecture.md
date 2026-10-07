# 技術構成と公開

2026-10-08実装。React + TypeScript + Vite、npm、GitHub Pagesを採用した。
Node.jsは開発とビルドに使用し、公開後に常駐サーバーやデータベースは不要。
CIはNode.js 24 LTS（`.nvmrc`）。依存関係は`package-lock.json`で固定する。

## 表示と静的生成

ページ内アンカーで各案内に移動する1ページ構成。GitHub Pagesの直接アクセス・再読込で404になるSPAルーティングを避ける。
`src/entry-server.tsx`でReactをHTML化し、`scripts/prerender.mjs`がビルド済みHTMLへ埋め込む。
JavaScriptが無効でも開催日時と主要案内・PDFリンクを読める。日程の切り替え、全企画の展開、検索、ポスター詳細はReactで操作する。
検索語はNFKC正規化して文字列として照合し、サーバーへ送信・保存しない。外部スクリプトやSNSの自動埋め込みは使用しない。

- `src/data/`：出典を含む開催情報。
- `src/App.tsx`：ページ構成、来場案内。
- `src/components/`：日程と企画検索、キーボード操作可能な詳細画面。
- `src/styles/global.css`：独自デザインとモバイル対応。外部Webフォントなし。
- `assets/source/`：提供原素材とチェックサム。
- `public/`：WebPに最適化した画像、会場図、変更していない準備版PDF。
- `scripts/prepare-assets.mjs`：加工済み画像の再生成（元PDFのローカルレンダーが必要）。
- `scripts/check-content.mjs`：原素材の整合性、日付と曜日、出典、公開素材、PDF同一性の検証。
- `tests/e2e/`：PC・スマートフォンのブラウザー検証。

通常のビルドではPDFの再レンダーは不要。公開用画像をリポジトリで管理する。
Git上の日本語パスはNFC表記で記録し、MacとLinuxのCIで同じ原素材を参照する。移動前の原名はmanifestのoriginalPathで保持する。
`tmp/`、`dist/`、`node_modules/`、検証出力はGitへ追加しない。

## GitHub Pages

公開先：`https://haniwa820-t.github.io/tokuyama-kosen-festival/`
Viteの`base`は`/tokuyama-kosen-festival/`。画像と資料のURLは`assetUrl()`がbaseを付ける。
独自ドメインへ変更する場合はViteのbaseとindex.htmlのcanonical/OG URLを併せて変更する。

`.github/workflows/pages.yml`がmainへのpush時に`npm ci`、型・lint・テスト・出典確認・静的ビルド、ブラウザーテストを行い、成功した`dist/`だけをPagesへ公開する。
PRでは検証のみ。公開権限はdeployジョブに限定し、公式アクションのコミットSHAを固定する。
PagesのSourceはGitHub Actionsを使用する。公開状況はREADMEを参照。

## 検証

`npm run check`：型、lint、13件の単体・画面操作テスト、カバレッジ80%以上、素材・出典確認、ビルド。
`npm run test:e2e`：2画面サイズで日程、検索、詳細、PDF、地図、直接URL、JavaScript無効、横はみ出し、画像とブラウザーエラーを確認する。

参考公式資料：[Viteの静的公開](https://vite.dev/guide/static-deploy.html#github-pages)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)。
