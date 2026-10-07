import sharp from 'sharp'
import { readFile, mkdir, copyFile, readdir } from 'node:fs/promises'
import path from 'node:path'
const json = async (p) => JSON.parse(await readFile(p, 'utf8'))
const booths = await json('src/data/booths.json')
const departments = await json('src/data/departments.json')
const names = await readdir('assets/source/模擬店ポスター')
const source = async (p) => {
  if (!p.endsWith('.pdf')) return p
  const actual = names.find(
    (n) => n.normalize('NFC') === path.basename(p).normalize('NFC'),
  )
  return `tmp/pdfs/posters/${path.parse(actual).name}/page-1.png`
}
for (const b of [
  ...booths,
  ...departments.map((d) => ({ ...d, id: `department-${d.id}` })),
]) {
  const input = await source(b.source)
  await sharp(input)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(`public/posters/${b.id}.webp`)
  await sharp(input)
    .rotate()
    .resize({ width: 440, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`public/posters/thumbnails/${b.id}.webp`)
}
await mkdir('public/images', { recursive: true })
const originals = await readdir('assets/source')
const main = originals.find((n) => n.normalize('NFC') === 'メインポスター.jpg')
const logo = originals.find((n) => n.normalize('NFC') === 'メインロゴ.jpg')
await sharp(`assets/source/${main}`)
  .resize({ width: 1000 })
  .webp({ quality: 90 })
  .toFile('public/images/main-poster.webp')
await sharp(`assets/source/${main}`)
  .resize({ width: 1000 })
  .jpeg({ quality: 88 })
  .toFile('public/images/social.jpg')
await sharp(`assets/source/${logo}`)
  .extract({ left: 0, top: 470, width: 1168, height: 626 })
  .webp({ quality: 90 })
  .toFile('public/images/echo-logo.webp')
await sharp('public/images/echo-logo.webp')
  .resize(128, 128, { fit: 'contain', background: '#ffffff' })
  .png()
  .toFile('public/favicon.png')
const crops = [
  [4, 'maps/campus', 304, 228, 905, 864],
  [5, 'maps/outdoor', 200, 160, 1000, 1370],
  [6, 'maps/indoor-1', 260, 195, 1015, 845],
  [7, 'maps/indoor-2', 160, 200, 980, 1440],
  [14, 'images/robocon', 304, 319, 850, 1210],
  [15, 'images/factory', 211, 355, 864, 1136],
  [18, 'images/cornhole', 289, 970, 564, 795],
]
for (const [page, out, left, top, width, height] of crops) {
  await sharp(`tmp/pdfs/pamphlet/page-${page}.png`)
    .extract({ left, top, width, height })
    .webp({ quality: 90 })
    .toFile(`public/${out}.webp`)
}
await sharp('tmp/pdfs/pamphlet/page-1.png')
  .resize({ width: 600 })
  .webp({ quality: 85 })
  .toFile('public/images/pamphlet-cover.webp')
await copyFile(
  'assets/source/pamphlet/テンプレート(182 x 257 mm).pdf',
  'public/documents/pamphlet-preparation.pdf',
)
console.log(
  '35 posters, main artwork, 4 maps and preparation PDF generated; originals unchanged.',
)
