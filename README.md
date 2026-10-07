# 徳山高専 高専祭 2026 — Echo

第52回高専祭の案内サイト。React + TypeScript + Viteで制作し、GitHub ActionsからGitHub Pagesへ静的公開します。
公開先：<https://haniwa820-t.github.io/tokuyama-kosen-festival/>

10月31日（土）9:45〜15:30、11月1日（日）9:45〜15:00。
テーマ：Echo — あの感動をもう一度。

## 実装内容

昨年度の11項目を網羅し、日程切り替え、32件の企画検索とポスター詳細、3学科企画、併催企画、会場図、来場・駐車案内、準備版PDF、公式SNS、協賛を掲載。
9ページの階層、開催カウントダウン、企画の保存とおまかせ選択、30枠のサンプル画像から企業公式サイトへのリンクを追加。
スクロール時のフェードイン、詳細のポップアップ、PCの文字サイズ拡大、動きを減らす設定にも対応しています。
スマートフォン対応、キーボード操作とフォーカス復帰、静的HTML生成、SNS共有情報を備えます。
メインロゴをヘッダー・テーマ紹介・フッター・faviconに使用。共通メニューにはホームを用意しています。
配色・文字・余白・操作状態は[デザイン要件](docs/design-system.md)にまとめ、CSSのトークンで管理します。
ホームはユーザーが添付した以前の画面に合わせ、大きなEcho.・淡青の同心円・斜めのポスターを復元。全ページをゴシック体、紺・淡青・ピンク・生成りに統一し、追加フォントを撤去しました。パンフレット表紙の傾きと薄い影を維持し、登場とスクロール時のフェードは一度だけ行います。
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

`check`は型・lint・単体/画面操作テスト、80%以上のカバレッジ、素材・開催情報の整合性、13組の配色コントラスト、静的生成を確認します。
E2EはPCとスマートフォン幅で実行。Actionsではテスト成功後にのみ公開します。

## 更新する場所

| 場所 | 用途 |
| --- | --- |
| `src/data/` | 開催情報、32企画、学科、日程、協賛と出典 |
| `src/App.tsx` / `src/lib/pages.ts` | 共通レイアウト・階層とURL |
| `src/pages/ContentSections.tsx` | 来場・併催案内、本文 |
| `src/components/` | 検索、保存、おまかせ、詳細、日程、時計、スポンサー |
| `src/styles/tokens.css` / `src/styles/global.css` | 共通デザイン値と部品・モバイル対応 |
| `assets/source/` | 原素材38点とチェックサム。加工・上書きしない |
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
30枚のスポンサー画像は独自制作のサンプルです。正式画像は`public/images/sponsors/`へ追加し、`src/data/sponsor-banners.json`の`image`を変更します。
名称・リンクも同じJSONで更新できます。`npm run assets:sponsors`はサンプルを再生成するため、正式画像への切り替え後には実行しないでください。
詳細は[スポンサー枠の更新](docs/sponsors.md)を参照。整形は`npm run format`、確認は`npm run format:check`。

## 準備版と未確定情報

パンフレットはユーザー回答に従い全57ページを変更せず「準備版」として配布。後夜祭は在校生限定。
IE2会場の階数、スタンプラリー詳細、開催日のバス時刻表、駐車場の入口・出口は確認中として表示しています。
詳しくは[確認事項](docs/confirmation-items.md)、[出典](docs/content.md)、[構成と公開](docs/architecture.md)、[独自制作の方針](docs/reference/design-references.md)を参照。
ローカル作業方針は`AGENTS.md`に記録しています（現在のignore設定に従いローカル管理）。
