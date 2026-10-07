# 技術構成と公開

2026-10-08実装。React + TypeScript + Vite、npm、GitHub Pagesを採用した。
Node.jsは開発とビルドに使用し、公開後に常駐サーバーやデータベースは不要。
CIはNode.js 24 LTS（`.nvmrc`）。依存関係は`package-lock.json`で固定する。

## 表示と静的生成

9ページの階層を持つ静的サイト。通常のリンクで移動し、各ディレクトリへindex.htmlを生成するため、GitHub Pagesの直接アクセス・再読込に対応する。

| URL（リポジトリのbaseに続く部分） | 内容 |
| --- | --- |
| `/` | 開催概要、カウントダウン、テーマ、お知らせ、スポンサー6枠 |
| `/schedule/` | 2日間の予定 |
| `/events/` | メイン企画、学科企画、併催企画 |
| `/events/booths/` | 32企画の検索、保存、おまかせ、ポスター詳細 |
| `/guide/` | 来場ガイド入口 |
| `/guide/map/` | 会場・屋内外の地図 |
| `/guide/access/` | 交通・駐車場 |
| `/guide/pamphlet/` | 準備版PDF |
| `/sponsors/` | サンプル画像30枠と準備版の協賛一覧 |

共通メニュー、パンくず、親・関連ページへのリンク、ページ固有のtitle・description・canonical・OG URL、404.htmlとsitemap.xmlを生成する。
旧URLの`#booths`等は対応する階層へ移動する。
`src/entry-server.tsx`でReactをHTML化し、`scripts/prerender.mjs`が各ページのHTMLへ埋め込む。
JavaScriptが無効でも開催日時と主要案内・PDFリンクを読める。日程の切り替え、全企画の展開、検索、保存・おまかせ、ポスター詳細はReactで操作する。
保存はlocalStorage内の企画IDだけで、別タブとの同期と保存拒否・壊れたデータに対応する。カウントダウンは開催情報から日本時間で算出し、1日目終了後は2日目の開始を表示、一般公開終了後は終了表示に切り替える。
SSRの時計は固定の開催日表示にし、ブラウザーで現在時刻へ更新してhydrationの不一致を防ぐ。フェードインは画面外の要素だけに適用し、JavaScript無効・動きを減らす設定でも本文を隠さない。
検索語はNFKC正規化して文字列として照合し、サーバーへ送信・保存しない。外部スクリプトやSNSの自動埋め込みは使用しない。

- `src/data/`：出典を含む開催情報。
- `src/App.tsx` / `src/lib/pages.ts`：ページ構成・階層。`src/pages/ContentSections.tsx`：掲載本文。
- `src/components/`：日程と企画検索、キーボード操作可能な詳細画面。
- `src/styles/tokens.css`：役割別の色・書体・余白・状態。`src/styles/global.css`：部品の適用とモバイル対応。外部Webフォントなし。要件は`docs/design-system.md`。
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

`npm run check`：型、lint、39件の単体・画面操作テスト、カバレッジ80%以上、素材・出典確認、12組の配色コントラスト、ビルド、10件のHTML（9ページ＋404）の内部リンク・画像・配布資料・metadata検証。
`npm run test:e2e`：2画面サイズで計16件。日程、検索、保存の再読込、おまかせ、詳細、30スポンサー、PDF、地図、全階層の直接URL・再読込、旧URL、JavaScript無効、動きを減らす設定、ホームへのメニュー・メインロゴ、320〜1440pxの横はみ出し、画像とブラウザーエラーを確認する。

参考公式資料：[Viteの静的公開](https://vite.dev/guide/static-deploy.html#github-pages)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)。
