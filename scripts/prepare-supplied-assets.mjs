import sharp from 'sharp'
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export async function prepareSuppliedAssets() {
  const banners = JSON.parse(
    await readFile('src/data/sponsor-banners.json', 'utf8'),
  )
  const maps = JSON.parse(await readFile('src/data/campus-maps.json', 'utf8'))
  await mkdir('public/images/sponsors', { recursive: true })
  await mkdir('public/maps', { recursive: true })
  for (const banner of banners) {
    let input = banner.source
    if (input.endsWith('.pdf')) {
      const directory = `tmp/supplied-assets/${banner.id}`
      input = `${directory}/page-${banner.sourcePage}.png`
      try {
        await access(input)
      } catch {
        // PDFKit preserves the full media box, including original whitespace.
        const render = spawnSync(
          'swift',
          [
            '-module-cache-path',
            'tmp/swift-cache',
            'scripts/inspect-pdf.swift',
            banner.source,
            directory,
          ],
          { stdio: 'inherit' },
        )
        if (render.error || render.status !== 0)
          throw new Error(
            `PDF render failed: ${banner.source}. Run on macOS with Swift/PDFKit installed.`,
          )
      }
    }
    const result = await sharp(input)
      .rotate(banner.rotation)
      .resize({
        width: 1600,
        height: 1800,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 90 })
      .toFile(`public/${banner.image}`)
    banner.width = result.width
    banner.height = result.height
  }
  for (const map of maps) {
    const result = await sharp(map.source)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 92 })
      .toFile(`public/${map.image}`)
    map.width = result.width
    map.height = result.height
  }
  await writeFile(
    'src/data/sponsor-banners.json',
    JSON.stringify(banners, null, 2) + '\n',
  )
  await writeFile(
    'src/data/campus-maps.json',
    JSON.stringify(maps, null, 2) + '\n',
  )
  console.log(
    `${banners.length} supplied sponsor banners and ${maps.length} maps prepared without cropping.`,
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await prepareSuppliedAssets()
