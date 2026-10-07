# スポンサー枠の出典と更新

2026-10-08確認。ユーザー依頼により30枠を用意。名称の基礎は提供パンフレットp43〜44の準備版一覧です。30社の正式協賛確定を示すものではありません。
画像はこのリポジトリで作成したSVGの差し替え用サンプルです。企業のロゴ・広告文・写真はコピーしていません。
リンク先は各企業の公式ページを確認しました。店舗ページがない場合は運営会社の公式ページへリンクしています（ローソン徳山駅前店、田中建設防府店など）。
株式会社カシワバラ・コーポレーションの名称は公式表記を使用し、提供版の表記は`sourceName`に保持します。準備版の全名称一覧は原文どおりです。

## 差し替え

1. 掲載許諾のある正式画像を`public/images/sponsors/`へ追加する。
2. `src/data/sponsor-banners.json`の`name`、`url`、`image`を更新する。追跡用の出典と確認日も更新する。
3. 正式掲載に切り替える際は`imageStatus`、`src/components/Sponsors.tsx`のサンプル表記・代替テキスト、`scripts/check-content.mjs`のサンプル検証を合わせて更新する。
4. `npm run check`と`npm run test:e2e`を実行し、PC・スマートフォンで画像とリンクを確認する。

`npm run assets:sponsors`はJSONと30枚のサンプルを上書き再生成します。正式画像への切り替え後は使用しません。
外部リンクは新しいタブで開き、`noopener noreferrer`を指定しています。トップには6枠、スポンサーのページには30枠を表示します。

## 公式リンク

| 枠 | 表示名 | リンク先 |
| --- | --- | --- |
| 01 | KRY山口放送 | [公式ページ](https://www.kry.co.jp/outline/index.html) |
| 02 | 株式会社カシワバラ・コーポレーション | [公式ページ](https://www.kashiwabara.co.jp/corp/company/about/) |
| 03 | 株式会社京瀧 | [公式ページ](https://kyotaki.co.jp/about) |
| 04 | 株式会社 ムラシゲスポーツ | [公式ページ](https://www.murashige-sports.com/company) |
| 05 | くだまつ健康パーク | [公式ページ](https://www.k-park.co.jp/park/) |
| 06 | 下松自動車学校 | [公式ページ](https://kudamatsu.e-jikou.com/guide/highschool/) |
| 07 | くだまつスポーツセンター | [公式ページ](https://www.k-park.co.jp/center) |
| 08 | 澤田建設 | [公式ページ](https://www.sawata.com/company/) |
| 09 | 新立電機株式会社 | [公式ページ](https://shinritsu.co.jp/wp/company-about/) |
| 10 | 長沼建設 | [公式ページ](https://naganumakensetsu.com/) |
| 11 | 中林建設 | [公式ページ](https://www.nakabayashi-hikari.jp/pages/2/) |
| 12 | 銘建 | [公式ページ](https://meiken-renovation.jp/about/) |
| 13 | 洋林建設株式会社本社 | [公式ページ](https://yorin.jp/html/) |
| 14 | 山田石油株式会社 | [公式ページ](https://www.yamadaoil.co.jp/information/) |
| 15 | 維新国際特許事務所 | [公式ページ](https://www.iipi.jp/) |
| 16 | 徳山商工会議所 | [公式ページ](https://tokuyama-cci.or.jp/) |
| 17 | 徳山コーヒーボーイ | [公式ページ](https://www.coffeeboy.co.jp/top-info/) |
| 18 | アルク秋月店 | [公式ページ](https://www.mrk09.co.jp/area_info/アルク秋月店/) |
| 19 | フジ新南陽店 | [公式ページ](https://www.the-fuji.com/fuji/store/shop/yamaguchi/fuji_shinnanyo.php) |
| 20 | マックスバリュ 末武店 | [公式ページ](https://www.the-fuji.com/mv/store/shop/yamaguchi/mv_suetake.php) |
| 21 | ローソン 徳山駅前店 | [公式ページ](https://www.lawson.co.jp/) |
| 22 | 田中建設 防府店 | [公式ページ](https://www.o-tanaken.com/aboutus/company/) |
| 23 | 黒川病院 | [公式ページ](https://www.kurokawa-hospital.jp/aboutus/) |
| 24 | Restaurant seahorse | [公式ページ](https://marinaseahorse.jp/htm/restaurant/) |
| 25 | English Club May | [公式ページ](https://welove-ecm.com/access/) |
| 26 | 大嶋運輸機工株式会社 | [公式ページ](https://oshima-uk.co.jp/) |
| 27 | ふじい歯科クリニック | [公式ページ](https://www.fujii-dc-shunan.com/) |
| 28 | マックスバリュイオンタウン周南久米店 | [公式ページ](https://www.the-fuji.com/mv/store/shop/yamaguchi/mv_aeontownshunankume.php) |
| 29 | たむら耳鼻咽喉科 | [公式ページ](https://www.tamura-jibika.com/) |
| 30 | カフェレストラン瀬里家 | [公式ページ](https://www.caferestaurantserika.com/) |
