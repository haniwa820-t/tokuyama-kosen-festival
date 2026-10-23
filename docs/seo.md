# 検索設定とSearch Console

確認日：2026-10-23（日本時間）。公開サイトは <https://tokuyama-kosen-festival.pages.dev/>。

## サイト側の設定

- 全9ページを本文入りの静的HTMLとして生成する。
- `src/lib/seo.ts`の`pageMetadata`で、ページ固有のtitle・description・canonicalを管理する。画面上の見出しや短い紹介文は`src/lib/pages.ts`のまま保持する。
- HTMLのheadにtitle・description・canonical・OGタイトル・OG説明・OG URLを出力する。JavaScriptの実行は不要。
- `sitemap.xml`には9ページのcanonicalだけを掲載する。404や検索・保存状態のURLは含めない。
- `robots.txt`でクロールを許可し、サイトマップのURLを案内する。404には`noindex`を設定する。
- 既存のイベント・パンくずの構造化データは維持する。検索での特別な表示を保証するものではない。
- GitHub Pages側もCloudflare Pagesをcanonicalとして参照する。

今回の変更は検索・共有用メタ情報とその検証に限定し、ページ本文・見出し・CSS・画像・機能は変更しない。

変更前の公開サイトで、全9ページのHTTP 200、トップの自己参照canonical・固有のdescription、全9ページのHTTPヘッダーに`noindex`がないことを確認した。`robots.txt`と9ページを含む`sitemap.xml`もHTTP 200で取得でき、存在しないURLはHTTP 404と`noindex`を返した。全9ページのHTMLのbodyは変更後のビルドと完全一致した。これはGooglebotによる取得成功やインデックス登録の証明ではない。

## Search Consoleで行うこと

ユーザー回答（2026-10-23）：まだ登録していない。所有権確認とインデックス状況の確認は未実施。

1. [Google Search Console](https://search.google.com/search-console/)に、URLプレフィックスとして`https://tokuyama-kosen-festival.pages.dev/`を追加する。
2. 所有権確認の「HTMLタグ」を選ぶ。表示された`<meta name="google-site-verification" content="…" />`を、そのままサイト担当者へ共有する。Googleアカウントのパスワードやログインコードは共有しない。確認用タグは公開HTMLへ入る値。
3. 担当者が`index.html`のheadにタグを追加して公開する。静的生成でもタグを保持する。公開ソースにタグがあることを確認してから、Search Consoleで「確認」を押す。確認後もタグは残す。
4. 「サイトマップ」で`https://tokuyama-kosen-festival.pages.dev/sitemap.xml`を送信し、取得結果を確認する。
5. URL検査でまず以下を調べる。「公開URLをテスト」で取得・インデックス許可・canonicalを確認し、未登録なら「インデックス登録をリクエスト」する。

   - `https://tokuyama-kosen-festival.pages.dev/`
   - `https://tokuyama-kosen-festival.pages.dev/schedule/`
   - `https://tokuyama-kosen-festival.pages.dev/events/`
   - `https://tokuyama-kosen-festival.pages.dev/guide/`

6. 学校公式サイトの高専祭案内から、上記の本番URLへの直接リンクを掲載できるか学校の担当者に依頼する。外部への連絡はこの作業では行っていない。

送信やリクエストは登録・順位・開催日までの反映を保証しない。結果はSearch Consoleのレポートで確認する。

## pages.devと独自ドメイン

独自ドメインの購入は今回の必須条件としない。まず現在の本番URLの取得・登録状況を調べる。Cloudflare PagesはプレビューURLに標準で`X-Robots-Tag: noindex`を付けるため、Search Consoleには本番URLを登録する。

将来ドメインを変更する場合は、`canonicalSiteUrl`、配信先設定、既存URLから対応する新URLへの恒久リダイレクト、サイトマップ、Search Consoleをまとめて更新する。Googleは恒久リダイレクトによるPageRankの損失はないと説明しているが、移行中に順位が変動することはある。

## 検証

`npm run check`で型・lint・単体テスト・カバレッジ・素材・配色・ビルドを確認する。ビルド後にtitleとdescriptionの出力、OGとの一致、canonical、サイトマップの全URL、404の検索除外を検査する。

`npm run test:e2e`ではPCとスマートフォンの構成で、JavaScript無効の全9ページのメタ情報と、robots.txt・sitemap.xmlのHTTP応答を確認する。本番配信後は、Search ConsoleでもGoogle側からの取得を確認する。

2026-10-23の検証では`npm run check`が成功（単体・画面操作テスト54件）。Cloudflare Pagesのルート配信とGitHub Pagesのリポジトリ配下配信の両方でビルドに成功し、ブラウザーテストはそれぞれ28件が成功した。公開用フォント・CSS・ブラウザー用JavaScriptの変更はない。head専用の文言とテスト名は本文用フォントの収録文字チェックから除外し、不要なフォント再生成を防いだ。

## 公式資料

2026-10-23確認。

- [Google：所有権の確認](https://support.google.com/webmasters/answer/9008080)
- [Google：サイトマップの作成と送信](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google：サイトの移転](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Cloudflare：プレビューデプロイと検索除外](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
