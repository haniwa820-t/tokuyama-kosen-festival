# 技術構成と公開

2026-10-22更新。React + TypeScript + Vite、npmを使用。Cloudflare PagesのGitHub連携に対応し、既存のGitHub Pages用ビルドも維持する。
Node.jsは開発とビルドに使用し、公開後に常駐サーバーやデータベースは不要。
CIはNode.js 24 LTS。`.nvmrc`は依存パッケージの対応範囲に合わせて24.15.0に固定する。依存関係は`package-lock.json`で固定する。

## 表示と静的生成

9ページの階層を持つ静的サイト。通常のリンクで移動し、各ディレクトリへindex.htmlを生成するため、静的ホスティングでの直接アクセス・再読込に対応する。

| URL（リポジトリのbaseに続く部分） | 内容 |
| --- | --- |
| `/` | 開催概要、カウントダウン、テーマ、お知らせ、大口スポンサー5社 |
| `/schedule/` | 2日間の予定 |
| `/events/` | メイン企画、学科企画、併催企画 |
| `/events/booths/` | 32企画の検索、保存、おまかせ、ポスター詳細 |
| `/guide/` | 来場ガイド入口 |
| `/guide/map/` | 会場・屋内外の地図 |
| `/guide/access/` | 交通・駐車場 |
| `/guide/pamphlet/` | 完成版PDF |
| `/sponsors/` | 提供広告87件、大口5社の公式リンク、確定した協賛一覧 |

共通メニュー、パンくず、親・関連ページへのリンク、ページ固有のtitle・description・canonical・OG URL、イベント・パンくずのJSON-LD、404.html、robots.txtとsitemap.xmlを生成する。
旧URLの`#booths`等は対応する階層へ移動する。
`src/entry-server.tsx`でReactをHTML化し、`scripts/prerender.mjs`が各ページのHTMLへ埋め込む。
JavaScriptが無効でも開催日時と主要案内・PDFリンクを読める。日程の切り替え、全企画の展開、検索、保存・おまかせ、ポスター詳細はReactで操作する。
保存はlocalStorage内の企画IDだけで、別タブとの同期と保存拒否・壊れたデータに対応する。カウントダウンは開催情報から日本時間で算出し、1日目終了後は2日目の開始を表示、一般公開終了後は終了表示に切り替える。
SSRの時計は固定の開催日表示にし、ブラウザーで現在時刻へ更新してhydrationの不一致を防ぐ。フェードインは画面外の要素だけに適用し、JavaScript無効・動きを減らす設定でも本文を隠さない。
検索語はNFKC正規化して文字列として照合し、サーバーへ送信・保存しない。外部スクリプトやSNSの自動埋め込みは使用しない。

- `src/data/`：出典を含む開催情報。
- `src/App.tsx` / `src/lib/pages.ts`：ページ構成・階層。`src/pages/ContentSections.tsx`：掲載本文。
- `src/components/`：日程と企画検索、キーボード操作可能な詳細画面。
- `src/styles/tokens.css`：役割別の色・書体・余白・状態。`src/styles/global.css`：部品の適用とモバイル対応。日本語は端末標準ゴシック、追加Webフォントなし。要件は`docs/design-system.md`。
- `assets/source/`：提供原素材とチェックサム。
- `public/`：WebPに最適化した画像、会場図、変更していない完成版PDF。
- `scripts/prepare-assets.mjs`：加工済み画像の再生成（元PDFのローカルレンダーが必要）。
- `scripts/check-content.mjs`：原素材の整合性、日付と曜日、出典、公開素材、PDF同一性の検証。
- `tests/e2e/`：PC・スマートフォンのブラウザー検証。

通常のビルドではPDFの再レンダーは不要。公開用画像をリポジトリで管理する。
Git上の日本語パスはNFC表記で記録し、MacとLinuxのCIで同じ原素材を参照する。移動前の原名はmanifestのoriginalPathで保持する。
`tmp/`、`dist/`、`node_modules/`、検証出力はGitへ追加しない。

## Cloudflare Pages

通常のビルドはルートパス`/`で配信する。Cloudflare Pagesでは`npm run check`、出力`dist`、Node.js 24.15.0を設定済み。
公開先は`https://tokuyama-kosen-festival.pages.dev/`。2026-10-21に初回公開し、GitHubの`main`へのpushで自動ビルド・公開する。
配信URLは`SITE_URL`または`CF_PAGES_URL`、配信パスは`SITE_BASE_PATH`で指定する。検索向けのcanonical・OG URL・OG画像・JSON-LD・sitemapは、配信先にかかわらず`src/lib/seo.ts`の`canonicalSiteUrl`（Cloudflare Pages）を使用する。
各階層のindex.htmlと404.htmlを生成するため、SPA用の全URL転送は不要。[設定と運用](cloudflare-pages.md)を参照。

## 既存のGitHub Pages

公開先：`https://haniwa820-t.github.io/tokuyama-kosen-festival/`
Actionsで`SITE_BASE_PATH=/tokuyama-kosen-festival/`と`SITE_URL`を設定し、従来のURLを維持する。画像と資料のURLは`assetUrl()`がbaseを付ける。
公開先を変更する場合は`SITE_BASE_PATH`と`SITE_URL`を揃える。ソース内のURLを書き換える必要はない。

`.github/workflows/pages.yml`がmainへのpush時に`npm ci`、型・lint・テスト・出典確認・静的ビルド、ブラウザーテストを行い、成功した`dist/`だけをPagesへ公開する。
PRでは検証のみ。公開権限はdeployジョブに限定し、公式アクションのコミットSHAを固定する。
PagesのSourceはGitHub Actionsを使用する。公開状況はREADMEを参照。

## 検証

`npm run check`：型、lint、48件の単体・画面操作テスト、カバレッジ80%以上、素材・出典確認、26組の配色コントラスト、ビルド、10件のHTML（9ページ＋404）の内部リンク・画像・配布資料・metadata検証。
`npm run test:e2e`：2画面サイズで計22件。日程、検索、保存の再読込、おまかせ、詳細、87件のスポンサー画像と大口5社のリンク、PDF、地図、全階層の直接URL・再読込、旧URL、JavaScript無効、動きを減らす設定、ホームへのメニュー・メインロゴ、320〜1440pxの横はみ出し、画像とブラウザーエラーを確認する。

参考公式資料：[Viteの静的公開](https://vite.dev/guide/static-deploy.html#github-pages)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)。

## 2026-10-22の公開前確認

来場者に不要な完成版・制作資料の説明を公開ページから外し、未確定のIE2会場と駐車場の入口・出口は当日の案内を確認する表現にした。日時・バス・企業名は変更していない。公開本文とREADMEにはyomiyasuのlint・差分検査と最終稿の照合を実施した。未使用の公開用サンプル広告SVG30件も削除した。記録はGit対象外の`.yomiyasu/`に保存する。

HTMLのCSPでは同一サイトのスクリプトとJSON-LDのSHA-256ハッシュだけを許可し、eval・未承認のインラインスクリプトを許可しない。既存のフェード用CSS変数を保つためstyle-srcにはunsafe-inlineを許可する。Cloudflare Pagesの追加ヘッダーは`public/_headers`で管理する。GitHub PagesではCSPのmeta指定が有効で、埋め込み防止などの追加HTTPヘッダーは適用されない。

認証・送信フォーム・API・データベースはない。検索語は文字列として照合し、保存データは既存企画IDで検証する。2026-10-22のnpm auditは既知の脆弱性0件。現在のGit管理テキストの既知形式の認証情報パターンと、履歴中の.env・鍵ファイル名の検査でも検出はなかった。この検査は外部サービスの設定全体やGit履歴中のあらゆる秘密情報の不存在を保証するものではない。

参考（2026-10-22確認）：[Googleのイベント構造化データ](https://developers.google.com/search/docs/appearance/structured-data/event)、[正規URLの指定](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)、[Cloudflare Pagesのヘッダー](https://developers.cloudflare.com/pages/configuration/headers/)。検索掲載や順位は検索エンジンが決定し、設定だけで即時掲載されるものではない。
