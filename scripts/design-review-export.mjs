import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const folder = resolve('tmp/design-review')
const shots = resolve(folder, 'screenshots')
const normalized = resolve(shots, 'normalized')
await mkdir(normalized, { recursive: true })
const versions = ['current', 'c', 'd']
const names = {
  current: '現行',
  c: 'C：現行を整える',
  d: 'D：ポスターの青とピンク',
}
const scenes = {
  home: 'ホーム',
  sponsors: 'スポンサー全体',
  major: '大口',
  full: '1ページ',
  quarter: '4分の1',
  eighth: '8分の1',
}
const pictures = {}
for (const width of [360, 768, 1280]) {
  for (const [scene] of Object.entries(scenes)) {
    for (const version of versions) {
      const name = `${version}-${scene === 'home' ? 'home' : 'sponsors'}-${width}${['home', 'sponsors'].includes(scene) ? '' : '-' + scene}.jpg`
      const input = await readFile(resolve(shots, name))
      const { width: pixels, height } = await sharp(input).metadata()
      if (Math.abs(pixels / height - width / 800) > 0.025)
        throw new Error(
          `Unstable screenshot dimensions: ${name}: ${pixels}x${height}`,
        )
      // Browser captures are uniformly scaled by the host. Normalize to the tested viewport.
      const buffer = await sharp(input)
        .resize(width, 800)
        .jpeg({ quality: 90 })
        .toBuffer()
      await writeFile(resolve(normalized, name), buffer)
      pictures[`${width}-${scene}-${version}`] =
        'data:image/jpeg;base64,' + buffer.toString('base64')
    }
  }
}
function label(text, width, height = 48) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#f3f4f8"/><text x="16" y="31" font-family="sans-serif" font-size="20" font-weight="700" fill="#102f56">${text}</text></svg>`,
  )
}
for (const width of [360, 1280]) {
  const tileWidth = width === 360 ? 360 : 640
  const tileHeight = Math.round((800 * tileWidth) / width)
  const composites = []
  for (const [i, version] of versions.entries()) {
    composites.push({
      input: label(names[version], tileWidth),
      left: i * (tileWidth + 16),
      top: 0,
    })
    const input = await sharp(
      resolve(normalized, `${version}-home-${width}.jpg`),
    )
      .resize(tileWidth, tileHeight)
      .toBuffer()
    composites.push({ input, left: i * (tileWidth + 16), top: 48 })
  }
  await sharp({
    create: {
      width: tileWidth * 3 + 32,
      height: tileHeight + 48,
      channels: 3,
      background: '#f3f4f8',
    },
  })
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(resolve(folder, `home-comparison-${width}.jpg`))
}
const tileWidth = 480,
  tileHeight = 300,
  gap = 16,
  rowHeight = 348
const sponsorParts = []
for (const [row, scene] of ['major', 'full', 'quarter', 'eighth'].entries()) {
  for (const [column, version] of versions.entries()) {
    sponsorParts.push({
      input: label(`${names[version]} / ${scenes[scene]}`, tileWidth),
      top: row * rowHeight,
      left: column * (tileWidth + gap),
    })
    sponsorParts.push({
      input: await sharp(
        resolve(normalized, `${version}-sponsors-1280-${scene}.jpg`),
      )
        .resize(tileWidth, tileHeight)
        .toBuffer(),
      top: row * rowHeight + 48,
      left: column * (tileWidth + gap),
    })
  }
}
await sharp({
  create: {
    width: tileWidth * 3 + gap * 2,
    height: rowHeight * 4,
    channels: 3,
    background: '#f3f4f8',
  },
})
  .composite(sponsorParts)
  .jpeg({ quality: 92 })
  .toFile(resolve(folder, 'sponsor-comparison.jpg'))

const html = `<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>高専祭2026 デザイン比較</title><style>
*{box-sizing:border-box}body{margin:0;padding:24px;color:#102f56;background:#f3f4f8;font:15px/1.8 'Hiragino Sans','Yu Gothic',sans-serif}h1{font-size:26px;margin:0}p{margin:8px 0 20px}.controls{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px}label{display:grid;gap:4px}select{min-height:44px;padding:8px 16px;border:1px solid #68778e;border-radius:8px;background:#fff;color:#102f56;font:inherit}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}h2{font-size:20px;margin:0 0 12px}img{display:block;width:100%;height:auto;border:1px solid #aebdd0;background:white}.note{font-size:13px}a{color:#2356b2}:focus-visible{outline:3px solid #a83c79;outline-offset:3px}@media(max-width:780px){.grid{grid-template-columns:1fr}}
.zoom{display:block;width:100%;padding:0;border:0;background:transparent;cursor:zoom-in}dialog{border:0;border-radius:16px;padding:16px;max-width:96vw;max-height:94vh;overflow:auto}dialog img{width:auto;max-width:90vw}dialog button{min-height:44px;padding:8px 24px;margin-bottom:12px}dialog::backdrop{background:#102f56aa}</style><h1>高専祭2026 デザイン比較</h1><p>ご希望に合わせ、現行の鮮やかさと角丸を生かす方向に作り直しました。Cは現行の配色を保つ案、Dはポスターの青・ピンクを大きく使う案です。</p><div class="controls"><label>表示範囲<select id="scene">${Object.entries(
  scenes,
)
  .map(([k, v]) => `<option value="${k}">${v}</option>`)
  .join(
    '',
  )}</select></label><label>画面幅<select id="width"><option>360</option><option>768</option><option>1280</option></select></label></div><div class="grid">${versions.map((v) => `<section><h2>${names[v]}</h2><button class="zoom" data-version="${v}" type="button"><img id="image-${v}" alt="${names[v]}の比較用スクリーンショット"></button></section>`).join('')}</div><p class="note">画像を選ぶと拡大表示できます。これは実際のブラウザー表示を撮影した確認用資料です。時計は2026年10月22日10:00（日本時間）に固定し、動きを止めています。協賛区分名は比較操作にだけ表示し、サイト本文には追加していません。本番への反映・公開は行っていません。</p><dialog id="zoom"><button id="close" type="button">閉じる</button><img id="enlarged" alt="拡大した比較用スクリーンショット"></dialog><script>const pictures=${JSON.stringify(pictures)};function update(){const key=document.querySelector('#width').value+'-'+document.querySelector('#scene').value;for(const v of ['current','c','d']){document.querySelector('#image-'+v).src=pictures[key+'-'+v]}}document.querySelector('#width').addEventListener('change',update);document.querySelector('#scene').addEventListener('change',update);document.querySelectorAll('.zoom').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#enlarged').src=document.querySelector('#image-'+b.dataset.version).src;document.querySelector('#zoom').showModal()}));document.querySelector('#close').addEventListener('click',()=>document.querySelector('#zoom').close());update();</script></html>`
await writeFile(resolve(folder, 'comparison.html'), html)
await writeFile(resolve(folder, 'site/comparison.html'), html)
console.log(
  'Exported offline comparison (54 screenshots) and three comparison sheets.',
)
