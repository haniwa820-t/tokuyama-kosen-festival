import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import {
  render,
  pages,
  canonicalSiteUrl as base,
  pageMetadata,
  structuredData,
  serializeJsonLd,
} from '../tmp/ssr/entry-server.js'
const template = await readFile('dist/index.html', 'utf8')
const escape = (s) =>
  s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
for (const page of pages) {
  const { title, description, canonical: url } = pageMetadata(page.id)
  const jsonLd = serializeJsonLd(structuredData(page.id))
  const hash = createHash('sha256').update(jsonLd).digest('base64')
  const policy = `default-src 'self'; script-src 'self' 'sha256-${hash}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`
  let html = template
    .replace(
      /(<meta charset="UTF-8"\s*\/>)/,
      `$1<meta http-equiv="Content-Security-Policy" content="${policy}" />`,
    )
    .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(
      /(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*/,
      `$1${escape(title)}`,
    )
    .replace(
      /(<meta\b[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*/g,
      `$1${escape(description)}`,
    )
    .replace(/(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*/, `$1${url}`)
    .replace(/(<meta\b[^>]*property="og:url"[^>]*content=")[^"]*/, `$1${url}`)
    .replace(
      /(<meta\b[^>]*property="og:image"[^>]*content=")[^"]*/,
      `$1${base}images/social.jpg`,
    )
    .replace(
      '</head>',
      `<script type="application/ld+json">${jsonLd}</script></head>`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-page="${page.id}">${render(page.id)}</div>`,
    )
  if (page.id === 'not-found')
    html = html.replace(
      '</head>',
      '<meta name="robots" content="noindex" /></head>',
    )
  const file =
    page.id === 'not-found' ? 'dist/404.html' : `dist/${page.path}index.html`
  await mkdir(file.substring(0, file.lastIndexOf('/')), { recursive: true })
  await writeFile(file, html)
}
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
    .filter((p) => p.id !== 'not-found')
    .map((p) => `<url><loc>${base + p.path}</loc></url>`)
    .join('')}</urlset>`,
)
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`,
)
console.log(
  `${pages.length - 1} static pages, 404 and sitemap generated; direct URLs work without a router server.`,
)
