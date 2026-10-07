import { readFile, writeFile, mkdir } from 'node:fs/promises'
const supplied = JSON.parse(
  await readFile('src/data/sponsors.json', 'utf8'),
).names
const entries = [
  ['KRY山口放送', 'https://www.kry.co.jp/outline/index.html'],
  [
    '株式会社カシワバラ・コーポーレーション',
    'https://www.kashiwabara.co.jp/corp/company/about/',
  ],
  ['株式会社京瀧', 'https://kyotaki.co.jp/about'],
  ['株式会社 ムラシゲスポーツ', 'https://www.murashige-sports.com/company'],
  ['くだまつ健康パーク', 'https://www.k-park.co.jp/park/'],
  ['下松自動車学校', 'https://kudamatsu.e-jikou.com/guide/highschool/'],
  ['くだまつスポーツセンター', 'https://www.k-park.co.jp/center'],
  ['澤田建設', 'https://www.sawata.com/company/'],
  ['新立電機株式会社', 'https://shinritsu.co.jp/wp/company-about/'],
  ['長沼建設', 'https://naganumakensetsu.com/'],
  ['中林建設', 'https://www.nakabayashi-hikari.jp/pages/2/'],
  ['銘建', 'https://meiken-renovation.jp/about/'],
  ['洋林建設株式会社本社', 'https://yorin.jp/html/'],
  ['山田石油株式会社', 'https://www.yamadaoil.co.jp/information/'],
  ['維新国際特許事務所', 'https://www.iipi.jp/'],
  ['徳山商工会議所', 'https://tokuyama-cci.or.jp/'],
  ['徳山コーヒーボーイ', 'https://www.coffeeboy.co.jp/top-info/'],
  ['アルク秋月店', 'https://www.mrk09.co.jp/area_info/アルク秋月店/'],
  [
    'フジ新南陽店',
    'https://www.the-fuji.com/fuji/store/shop/yamaguchi/fuji_shinnanyo.php',
  ],
  [
    'マックスバリュ 末武店',
    'https://www.the-fuji.com/mv/store/shop/yamaguchi/mv_suetake.php',
  ],
  ['ローソン 徳山駅前店', 'https://www.lawson.co.jp/'],
  ['田中建設 防府店', 'https://www.o-tanaken.com/aboutus/company/'],
  ['黒川病院', 'https://www.kurokawa-hospital.jp/aboutus/'],
  ['Restaurant seahorse', 'https://marinaseahorse.jp/htm/restaurant/'],
  ['English Club May', 'https://welove-ecm.com/access/'],
  ['大嶋運輸機工株式会社', 'https://oshima-uk.co.jp/'],
  ['ふじい歯科クリニック', 'https://www.fujii-dc-shunan.com/'],
  [
    'マックスバリュイオンタウン周南久米店',
    'https://www.the-fuji.com/mv/store/shop/yamaguchi/mv_aeontownshunankume.php',
  ],
  ['たむら耳鼻咽喉科', 'https://www.tamura-jibika.com/'],
  ['カフェレストラン瀬里家', 'https://www.caferestaurantserika.com/'],
]
await mkdir('public/images/sponsors', { recursive: true })
const tokens = await readFile('src/styles/tokens.css', 'utf8')
const color = (role) => {
  const value = tokens.match(
    new RegExp(`--color-${role}:\\s*(#[0-9a-f]{6});`),
  )?.[1]
  if (!value) throw new Error(`Missing color token: ${role}`)
  return value
}
const palette = [
  [color('surface-blue'), color('text')],
  [color('surface-warm'), color('text')],
  [color('surface-subtle'), color('text')],
]
const escape = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
const banners = []
for (const [i, [name, url]] of entries.entries()) {
  if (!supplied.includes(name))
    throw new Error(`Not in supplied pamphlet: ${name}`)
  const displayName =
    name === '株式会社カシワバラ・コーポーレーション'
      ? '株式会社カシワバラ・コーポレーション'
      : name
  const id = `sponsor-${String(i + 1).padStart(2, '0')}`
  const [bg, ink] = palette[i % 3]
  const fontSize = name.length > 20 ? 21 : name.length > 14 ? 25 : 30
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="300" viewBox="0 0 720 300"><rect width="720" height="300" fill="${bg}"/><rect x="0" y="0" width="8" height="300" fill="${color('action')}"/><text x="35" y="43" fill="${ink}" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">ECHO / SPONSOR ${String(i + 1).padStart(2, '0')}</text><text x="360" y="166" text-anchor="middle" fill="${ink}" font-family="sans-serif" font-size="${fontSize}" font-weight="700">${escape(displayName)}</text><path d="M35 217h650" stroke="${ink}" opacity=".3"/><text x="35" y="267" fill="${ink}" font-family="Arial,sans-serif" font-size="13" letter-spacing="2">SAMPLE BANNER</text><text x="682" y="267" text-anchor="end" fill="${ink}" font-family="sans-serif" font-size="13">画像差し替え用サンプル</text></svg>`
  await writeFile(`public/images/sponsors/${id}.svg`, svg)
  banners.push({
    id,
    name: displayName,
    sourceName: name,
    url,
    image: `images/sponsors/${id}.svg`,
    imageStatus: 'sample',
    nameSource: 'pamphlet:p43-44',
    urlSource: url,
    verifiedOn: '2026-10-08',
  })
}
await writeFile(
  'src/data/sponsor-banners.json',
  JSON.stringify(banners, null, 2) + '\n',
)
console.log(
  `${banners.length} original SVG sample banners generated. No company logos copied.`,
)
