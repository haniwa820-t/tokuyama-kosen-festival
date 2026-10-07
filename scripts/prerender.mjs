import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { render, pages } from '../tmp/ssr/entry-server.js'
const template = await readFile('dist/index.html', 'utf8')
const base = 'https://haniwa820-t.github.io/tokuyama-kosen-festival/'
const escape = (s) =>
  s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
for (const page of pages) {
  const title =
    page.id === 'home'
      ? page.title
      : `${page.title} | 徳山高専 高専祭 2026 — Echo`
  const url = base + page.path
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(
      /(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*/,
      `$1${escape(title)}`,
    )
    .replace(
      /(<meta\b[^>]*(?:name="description"|property="og:description")[^>]*content=")[^"]*/g,
      `$1${escape(page.description)}`,
    )
    .replace(/(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*/, `$1${url}`)
    .replace(/(<meta\b[^>]*property="og:url"[^>]*content=")[^"]*/, `$1${url}`)
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
console.log(
  `${pages.length - 1} static pages, 404 and sitemap generated; direct URLs work without a router server.`,
)
