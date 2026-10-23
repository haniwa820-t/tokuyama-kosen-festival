# 徳山高専 高専祭2026

徳山工業高等専門学校・第52回高専祭「Echo — あの感動をもう一度」の案内サイトです。

公開サイト：<https://tokuyama-kosen-festival.pages.dev/>

開催日時は2026年10月31日（土）9:45〜15:30、11月1日（日）9:45〜15:00です。後夜祭は11月1日16:30〜18:50で、一般の方も参加できます。

## 掲載内容

9ページで開催概要、ステージ日程、32件の模擬店・展示・体験、3学科の企画、併催企画、スタンプラリー、会場マップ9枚、アクセス・防長バスの時刻表、駐車案内を掲載しています。パンフレットは48ページ・約12.2 MBのPDFです。スポンサー広告は39件、協賛企業・団体一覧は52件で、大口5社の広告に公式サイトへのリンクを設定しています。

企画の検索・保存・おまかせ選択、ポスターの拡大、開催カウントダウンに対応しています。保存先は来場者のブラウザー内です。アカウント登録やサーバーへの送信はありません。

## 開発

React・TypeScript・Viteを使用しています。Node.js 24.15.0以降の対応バージョンとnpmが必要です。推奨バージョンは`.nvmrc`を参照してください。

```sh
npm ci
npm run dev
```

公開用ビルドとプレビュー：

```sh
npm run build
npm run preview
```

通常のビルドではPDFの変換は不要です。公開用の画像・PDFをGitで管理しています。

## 検証

```sh
npm run check
npx playwright install chromium
npm run test:e2e
npm audit
```

`check`は型、lint、単体・画面操作テスト、カバレッジ、原素材・開催情報の整合性、色のコントラスト、静的HTML生成を確認します。生成後には内部リンク、画像、PDF、canonical、構造化データ、CSP、robots.txt、sitemap.xmlも検証します。

ブラウザーテストはPCとスマートフォンで、深いURLの直接表示・再読込、検索・保存、広告と地図、PDFリンク、JavaScript無効時の表示、CSPによるスクリプトの拒否を確認します。

## 更新する場所

| 場所 | 内容 |
| --- | --- |
| `src/data/festival.json` | 開催情報、SNS、問い合わせ、PDFのパス・ページ数・容量 |
| `src/data/schedule.json` / `bus-timetable.json` | ステージ日程、防長バス時刻表 |
| `src/data/booths.json` / `departments.json` | 模擬店・展示・体験、学科企画 |
| `src/data/sponsor-banners.json` / `sponsors.json` | 広告39件、確定した協賛一覧52件 |
| `src/data/campus-maps.json` | 会場マップ9枚 |
| `src/pages/ContentSections.tsx` / `src/components/` | 掲載本文、操作部品 |
| `src/lib/pages.ts` / `seo.ts` | ページ階層、検索向けの説明・正規URL・構造化データ |
| `src/styles/` | 共通のデザインと操作状態 |
| `assets/source/` / `public/` | 提供原素材とチェックサム、公開用コピー |
| `scripts/` / `tests/e2e/` | 素材加工、静的生成・検証、ブラウザーテスト |

名称・日時・会場は提供資料とユーザーの訂正を優先します。未確認事項と出典は[掲載情報](docs/content.md)と[確認事項](docs/confirmation-items.md)に記録しています。企業名や企画名を校正の都合で変更しないでください。

## 公開と検索設定

Cloudflare Pagesは`main`へのpushで`npm run check`を実行し、`dist/`を公開します。GitHub Actionsでも検証とブラウザーテストを行い、成功した成果物だけを[既存のGitHub Pages](https://haniwa820-t.github.io/tokuyama-kosen-festival/)へ公開します。

検索向けの正規URLは両方の配信先でCloudflare Pagesに統一しています。変更する場合は`src/lib/seo.ts`の`canonicalSiteUrl`を更新してください。各ページを静的HTMLで生成し、ページ固有のtitle・description、SNS共有情報、イベント・パンくずの構造化データ、robots.txtとsitemap.xmlを出力します。404ページは検索対象から除外します。

検索用のタイトル・説明は`src/lib/seo.ts`の`pageMetadata`で管理し、画面上の見出し・紹介文と分離しています。2026-10-23にユーザー提供のSearch Console所有権確認用タグを追加しました。Google側での確認操作とインデックス状況の確認は未実施です。所有権確認・サイトマップ送信・URL検査の手順は[検索設定](docs/seo.md)を参照してください。

CSPは生成HTMLに設定しています。Cloudflare Pagesでは`public/_headers`で埋め込み防止、MIMEタイプの推測防止、参照元・端末権限の制限も適用します。GitHub Pagesではこのヘッダーファイルは適用されません。

運用の詳細は[公開設定](docs/cloudflare-pages.md)、[技術構成](docs/architecture.md)、[スポンサーの更新](docs/sponsors.md)を参照してください。`node_modules/`、`dist/`、検証結果、秘密情報はコミットしません。
