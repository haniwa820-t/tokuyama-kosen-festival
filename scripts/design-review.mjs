import { readFile, writeFile, mkdir, cp, readdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { resolve, extname } from 'node:path'
import { JSDOM } from 'jsdom'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'tmp/design-review/site')
const prefix = '/__design-review__'
const versions = ['current', 'a', 'b', 'c', 'd']
const paths = ['', 'sponsors/']

function signature(html) {
  const document = new JSDOM(html).window.document
  return {
    body: document.body.innerHTML,
    text: document.body.textContent,
    links: [...document.querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    ),
    images: [...document.images].map((img) => [
      img.getAttribute('src'),
      img.getAttribute('alt'),
    ]),
    headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => [
      h.tagName,
      h.textContent,
    ]),
    metadata: [
      ...document.querySelectorAll(
        'meta,title,link[rel="canonical"],script[type="application/ld+json"]',
      ),
    ].map((e) => e.outerHTML),
  }
}

async function build() {
  await mkdir(output, { recursive: true })
  for (const name of [
    'shared.css',
    'a.css',
    'b.css',
    'vivid.css',
    'c.css',
    'd.css',
    'index.html',
    'review.css',
    'review.js',
    'clock.js',
    'snapshot.css',
  ]) {
    await cp(resolve(root, 'design-review', name), resolve(output, name))
  }
  const reports = []
  for (const version of versions) {
    for (const path of paths) {
      const source = await readFile(
        resolve(root, 'dist', path, 'index.html'),
        'utf8',
      )
      const shared = ['c', 'd'].includes(version) ? 'vivid' : 'shared'
      const styles =
        version === 'current'
          ? ''
          : `<link rel="stylesheet" href="${prefix}/${shared}.css"><link rel="stylesheet" href="${prefix}/${version}.css">`
      const fixture = `<link rel="stylesheet" href="${prefix}/snapshot.css"><script src="${prefix}/clock.js"></script>`
      const result = source.replace('</head>', styles + fixture + '</head>')
      if (
        JSON.stringify(signature(source)) !== JSON.stringify(signature(result))
      ) {
        throw new Error(`Content changed: ${version}/${path}`)
      }
      const folder = resolve(output, version, path)
      await mkdir(folder, { recursive: true })
      await writeFile(resolve(folder, 'index.html'), result)
      reports.push({
        version,
        page: path || '/',
        bodyIdentical: true,
        textIdentical: true,
        hrefsIdentical: true,
        imagesIdentical: true,
        headingsIdentical: true,
        metadataIdentical: true,
        sourceSha256: createHash('sha256').update(source).digest('hex'),
      })
    }
  }
  await writeFile(
    resolve(root, 'tmp/design-review/content-comparison.json'),
    JSON.stringify(reports, null, 2) + '\n',
  )
  const chars = new Set(
    Array.from(
      ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789↗↓→↑',
    ),
  )
  async function collect(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = resolve(folder, entry.name)
      if (entry.isDirectory()) await collect(file)
      else if (entry.name.endsWith('.html')) {
        for (const c of new JSDOM(await readFile(file, 'utf8')).window.document
          .body.textContent)
          chars.add(c)
      }
    }
  }
  await collect(resolve(root, 'dist'))
  await writeFile(
    resolve(root, 'tmp/design-review/font-characters.txt'),
    [...chars].join(''),
  )
  console.log(
    `Built local comparison: ${reports.length} page copies; body, text, URLs, images, headings and metadata unchanged.`,
  )
}

async function serve() {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
    '.pdf': 'application/pdf',
  }
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, 'http://localhost').pathname,
      )
      const isReview = pathname.startsWith(prefix + '/')
      const base = isReview ? output : resolve(root, 'dist')
      const local = isReview ? pathname.slice(prefix.length) : pathname
      let file = resolve(base, '.' + local)
      if (file !== base && !file.startsWith(base + '/'))
        throw new Error('Invalid path')
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html')
      const content = await readFile(file)
      res.writeHead(200, {
        'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      res.end(content)
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
    }
  })
  server.listen(4186, '127.0.0.1', () =>
    console.log(`Local: http://127.0.0.1:4186${prefix}/`),
  )
}

if (process.argv.includes('--serve')) await serve()
else await build()
