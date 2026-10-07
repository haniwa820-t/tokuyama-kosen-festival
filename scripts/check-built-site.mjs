import { readFile, access } from 'node:fs/promises'
import { pages } from '../tmp/ssr/entry-server.js'
import assert from 'node:assert/strict'
const base = '/tokuyama-kosen-festival/'
const targets = new Map()
for (const page of pages) {
  const file = page.id === 'not-found' ? '404.html' : `${page.path}index.html`
  const html = await readFile(`dist/${file}`, 'utf8')
  assert.equal(
    (html.match(/<h1[ >]/g) ?? []).length,
    1,
    `${file}: require one page title`,
  )
  assert(html.includes(`data-page="${page.id}"`))
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)
  assert.equal(
    canonical?.[1],
    `https://haniwa820-t.github.io${base}${page.path}`,
    `${file}: incorrect canonical`,
  )
  const description = html.match(
    /<meta\b[^>]*name="description"[^>]*content="([^"]+)"/,
  )
  assert.equal(
    description?.[1],
    page.description,
    `${file}: incorrect description`,
  )
  targets.set(file, html)
}
for (const [file, html] of targets) {
  for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const href = match[1]
    if (!href.startsWith(base) && !href.startsWith('#')) continue
    const [path, anchor] = href.startsWith('#')
      ? [file, href.slice(1)]
      : href.slice(base.length).split('#')
    const target =
      path === '' || path.endsWith('/') ? `${path}index.html` : path
    await access(`dist/${target}`)
    if (anchor)
      assert(
        (targets.get(target) ?? '').includes(`id="${anchor}"`),
        `${file}: broken anchor ${href}`,
      )
  }
}
console.log(
  `${pages.length} HTML files: page titles, canonical URLs, internal links, images, downloads and anchors verified.`,
)
