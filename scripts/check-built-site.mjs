import { readFile, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import {
  pages,
  canonicalSiteUrl,
  pageMetadata,
} from '../tmp/ssr/entry-server.js'
import assert from 'node:assert/strict'
import { deploymentConfig } from '../src/lib/deployment.ts'
const { base } = deploymentConfig(process.env)
const siteUrl = canonicalSiteUrl
const targets = new Map()
for (const page of pages) {
  const file = page.id === 'not-found' ? '404.html' : `${page.path}index.html`
  const html = await readFile(`dist/${file}`, 'utf8')
  const { title, description: expectedDescription } = pageMetadata(page.id)
  const head = html.split('</head>')[0]
  for (const pattern of [
    /<title>/g,
    /<meta\b[^>]*name="description"/g,
    /<link\b[^>]*rel="canonical"/g,
  ])
    assert.equal(
      (head.match(pattern) ?? []).length,
      1,
      `${file}: missing or duplicate metadata`,
    )
  assert.equal(head.match(/<title>(.*?)<\/title>/)?.[1], title)
  assert(head.includes(`property="og:title" content="${title}"`))
  assert.equal(
    head.match(
      /<meta\b[^>]*property="og:description"[^>]*content="([^"]+)"/,
    )?.[1],
    expectedDescription,
    `${file}: incorrect sharing description`,
  )
  assert.equal(
    (html.match(/<h1[ >]/g) ?? []).length,
    1,
    `${file}: require one page title`,
  )
  assert(html.includes(`data-page="${page.id}"`))
  assert(!html.includes('__SITE_URL__'))
  assert(
    html.includes(`property="og:image" content="${siteUrl}images/social.jpg"`),
  )
  assert(html.includes(`property="og:url" content="${siteUrl}${page.path}"`))
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)
  assert.equal(
    canonical?.[1],
    `${siteUrl}${page.path}`,
    `${file}: incorrect canonical`,
  )
  const description = html.match(
    /<meta\b[^>]*name="description"[^>]*content="([^"]+)"/,
  )
  assert.equal(
    description?.[1],
    expectedDescription,
    `${file}: incorrect description`,
  )
  const jsonLd = html.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/,
  )?.[1]
  assert(jsonLd, `${file}: structured data missing`)
  assert.equal(JSON.parse(jsonLd)['@context'], 'https://schema.org')
  const hash = createHash('sha256').update(jsonLd).digest('base64')
  assert(html.includes(`script-src 'self' 'sha256-${hash}'`))
  assert(!html.includes("script-src 'self' 'unsafe-inline'"))
  assert.equal(
    html.includes('name="robots" content="noindex"'),
    page.id === 'not-found',
  )
  targets.set(file, html)
}
assert(
  (await readFile('dist/robots.txt', 'utf8')).includes(`${siteUrl}sitemap.xml`),
)
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
for (const page of pages.filter((item) => item.id !== 'not-found'))
  assert(sitemap.includes(`<loc>${siteUrl}${page.path}</loc>`))
assert.deepEqual(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).sort(),
  pages
    .filter((page) => page.id !== 'not-found')
    .map((page) => siteUrl + page.path)
    .sort(),
  'Sitemap must contain exactly the published canonical URLs, without 404 or duplicates',
)
const headers = await readFile('dist/_headers', 'utf8')
assert(headers.includes('X-Content-Type-Options: nosniff'))
assert(headers.includes("frame-ancestors 'none'"))
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
