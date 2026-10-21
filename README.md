# 徳山高専 高専祭 2026 — Echo

第52回高専祭の案内サイト。React + TypeScript + Viteで制作し、Cloudflare PagesのGitHub連携で静的公開できる構成です。
既存のGitHub Pages：<https://haniwa820-t.github.io/tokuyama-kosen-festival/>
Cloudflare Pagesはログインとリポジトリ連携が未完了です。[公開手順](docs/cloudflare-pages.md)を参照してください。

10月31日（土）9:45〜15:30、11月1日（日）9:45〜15:00。
テーマ：Echo — あの感動をもう一度。

## 実装内容

昨年度の11項目を網羅し、日程切り替え、32件の企画検索とポスター詳細、3学科企画、併催企画、会場図、来場・駐車案内、準備版PDF、公式SNS、協賛を掲載。
9ページの階層、開催カウントダウン、企画の保存とおまかせ選択を備えています。提供されたスポンサー画像88件を、大口・1ページ・4分の1・8分の1の順で掲載し、大口5社だけに企業公式サイトへのリンクを設定しています。
スクロール時のフェードイン、詳細のポップアップ、PCの文字サイズ拡大、動きを減らす設定にも対応しています。
スマートフォン対応、キーボード操作とフォーカス復帰、静的HTML生成、SNS共有情報を備えます。
メインロゴをヘッダー・テーマ紹介・フッター・faviconに使用。共通メニューにはホームを用意しています。
配色・文字・余白・操作状態は[デザイン要件](docs/design-system.md)にまとめ、CSSのトークンで管理します。
ホームはユーザーが添付した以前の画面に合わせ、大きなEcho.・淡青の同心円・斜めのポスターを復元。追加Webフォントは使わず、標準ゴシック体で統一しています。2026-10-21の指定に合わせて青とオレンジの配色、見出し・操作・本文のウェイト差、角丸を反映しました。ホームの淡青と紺のEcho.、同心円、ポスター配置は維持しています。パンフレット表紙の傾きと薄い影を維持し、登場とスクロール時のフェードは一度だけ行います。
他高専のコード・文章・画像・固有デザインはコピーせず、提供素材を中心に独自制作しました。

## 開発

Node.js 24 LTSを推奨（`.nvmrc`）。

```sh
npm ci
npm run dev
```

Viteが表示するローカルURLを開きます。公開用ビルドとプレビュー：

```sh
npm run build
npm run preview
```

## 検証

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

`check`は型・lint・単体/画面操作テスト、80%以上のカバレッジ、素材・開催情報の整合性、26組の配色コントラスト、静的生成を確認します。
E2EはPCとスマートフォン幅で合計20件を実行。Actionsではテスト成功後にのみ公開します。

## 更新する場所

| 場所 | 用途 |
| --- | --- |
| `src/data/` | 開催情報、32企画、学科、日程、協賛と出典 |
| `src/App.tsx` / `src/lib/pages.ts` | 共通レイアウト・階層とURL |
| `src/pages/ContentSections.tsx` | 来場・併催案内、本文 |
| `src/components/` | 検索、保存、おまかせ、詳細、日程、時計、スポンサー |
| `src/styles/tokens.css` / `src/styles/global.css` | 共通デザイン値と部品・モバイル対応 |
| `assets/source/` | 原素材とチェックサム。加工・上書きしない |
| `public/` | WebP画像・地図・PDFなどの公開用コピー |
| `scripts/` | 画像加工、静的HTML生成、出典・素材の検証 |
| `tests/e2e/` | ブラウザーでの動作検証 |
| `.github/workflows/pages.yml` | mainへのpush時の検証・Pages公開 |
| `docs/` | 構成、掲載情報、確認事項、参考サイトとの区別 |

公開用画像は用意済みなので通常ビルドにPDFレンダーは不要。
画像を再加工する場合は`scripts/inspect-pdf.swift`でPDFKitによるローカルレンダー後、`node scripts/prepare-assets.mjs`を実行します。
`tmp/`と`dist/`、依存パッケージはGit管理しません。空フォルダ用`.gitkeep`もあります。

## 新しい機能の更新

開催日時は`src/data/festival.json`で管理し、時計は日本時間で一般公開時間に合わせて切り替わります。
企画の保存は来場者のブラウザー内だけに残ります。アカウント・サーバーへの送信はありません。
スポンサー画像と掲載順は`src/data/sponsor-banners.json`、会場マップ9枚は`src/data/campus-maps.json`で管理します。原素材は保持し、公開用コピーだけをWebPに変換しています。
名称・リンクも同じJSONで更新できます。画像の再生成は`npm run assets:provided`（広告PDFの初回レンダーにはmacOSのSwift/PDFKitが必要）を使います。通常のビルドは生成済み画像を使用します。`npm run assets:sponsors`は提供画像の上書きを防ぐため停止します。
詳細は[スポンサー枠の更新](docs/sponsors.md)を参照。整形は`npm run format`、確認は`npm run format:check`。

## 準備版と未確定情報

パンフレットはユーザー回答に従い全57ページを変更せず「準備版」として配布。後夜祭は2026-10-21のユーザー訂正により、一般の方も参加できます。
会場マップは`assets/source/map/`の画像に差し替え、星マークをスタンプ設置場所として案内しています。IE2会場の階数、スタンプラリーの参加方法、開催日のバス時刻表、駐車場の入口・出口は確認中として表示しています。
詳しくは[確認事項](docs/confirmation-items.md)、[出典](docs/content.md)、[構成と公開](docs/architecture.md)、[独自制作の方針](docs/reference/design-references.md)を参照。
ローカル作業方針は`AGENTS.md`に記録しています（現在のignore設定に従いローカル管理）。
