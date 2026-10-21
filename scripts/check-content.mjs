import { readFile, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import sharp from 'sharp'
const json = async (p) => JSON.parse(await readFile(p, 'utf8'))
const manifest = await json('assets/source/manifest.json')
for (const file of manifest.files) {
  assert.equal(
    file.path,
    file.path.normalize('NFC'),
    `Source path must be portable NFC: ${file.path}`,
  )
  const bytes = await readFile(file.path)
  assert.equal(bytes.length, file.bytes, `Original size changed: ${file.path}`)
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    file.sha256,
    `Original changed: ${file.path}`,
  )
}
const festival = await json('src/data/festival.json')
assert.equal(festival.yearStatus, 'confirmed')
assert.equal(festival.year, 2026)
for (const d of festival.days) {
  const date = new Date(Date.UTC(festival.year, d.month - 1, d.day))
  assert.equal(
    ['日', '月', '火', '水', '木', '金', '土'][date.getUTCDay()],
    d.weekday,
  )
  assert(d.opensAt < d.closesAt)
}
const booths = await json('src/data/booths.json')
assert.equal(booths.length, 32)
assert.equal(new Set(booths.map((b) => b.id)).size, 32)
for (const b of booths) {
  await access(b.source)
  await access(`public/${b.poster}`)
  await access(`public/${b.thumbnail}`)
  assert(b.venueSource.startsWith('pamphlet:'))
}
const schedule = await json('src/data/schedule.json')
for (const e of schedule) {
  assert(e.start < e.end)
  assert(manifest.files.some((file) => file.path === e.source))
  assert(e.venueSource.startsWith('pamphlet:'))
}
assert.equal(
  schedule.find((e) => e.title === '後夜祭').note,
  '一般の方も参加できます',
)
const original = await readFile(festival.pamphlet.source)
assert.deepEqual(
  await readFile(`public/${festival.pamphlet.path}`),
  original,
  'Distribution PDF differs from supplied preparation version',
)
assert.equal(festival.pamphlet.status, 'preparation')
console.log(
  `${manifest.files.length} originals intact; dates, 32 booth assets, source records and preparation PDF verified.`,
)

const banners = await json('src/data/sponsor-banners.json')
const expectedUrls = [
  'https://www.tosoh.co.jp/',
  'https://fujikoatsu.jp/',
  'https://www.tokuyama.co.jp/',
  'https://www.tkworks.jp/',
  'https://www.shunan-ds.com/',
]
assert.equal(banners.length, 88)
assert.equal(new Set(banners.map((b) => b.id)).size, banners.length)
assert.deepEqual(
  banners.filter((b) => b.tier === 'major').map((b) => b.url),
  expectedUrls,
)
const tiers = ['major', 'full', 'quarter', 'eighth']
let previousTier = 0
for (const b of banners) {
  assert.equal(b.imageStatus, 'supplied')
  assert(manifest.files.some((f) => f.path === b.source))
  assert(
    !b.source.includes('東ソー様 B5.pdf'),
    'Tosoh pamphlet ad must not be published',
  )
  const tier = tiers.indexOf(b.tier)
  assert(tier >= previousTier, 'Sponsor tiers must be largest first')
  previousTier = tier
  assert.equal(
    Boolean(b.url),
    b.tier === 'major',
    'Only major sponsors have links',
  )
  assert(b.width > 0 && b.height > 0)
  await access(`public/${b.image}`)
  const output = await sharp(`public/${b.image}`).metadata()
  assert.equal(output.width, b.width)
  assert.equal(output.height, b.height)
  if (!b.source.endsWith('.pdf')) {
    const input = await sharp(b.source).metadata()
    const ratio =
      b.rotation === 270
        ? input.height / input.width
        : input.width / input.height
    assert(
      Math.abs(b.width / b.height / ratio - 1) < 0.01,
      `Aspect ratio changed: ${b.source}`,
    )
  }
}
const maps = await json('src/data/campus-maps.json')
assert.equal(maps.length, 9)
for (const map of maps) {
  assert(map.source.startsWith('assets/source/map/'))
  assert(manifest.files.some((f) => f.path === map.source))
  await access(`public/${map.image}`)
  const image = await sharp(`public/${map.image}`).metadata()
  assert.equal(image.width, map.width)
  assert.equal(image.height, map.height)
}
console.log(
  '88 supplied sponsor images, five approved links, size order and nine supplied maps verified.',
)
