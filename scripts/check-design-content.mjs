// Compare a saved build with a redesign build without accepting content drift.
// Usage: node scripts/check-design-content.mjs <before-directory> [after-directory]
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'

const [before, after = 'dist'] = process.argv.slice(2)
assert(before, 'Supply the directory containing the saved pre-design build.')
async function htmlFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)))
    else if (entry.name.endsWith('.html')) files.push(path)
  }
  return files
}
function signature(html) {
  const document = new JSDOM(html).window.document
  const all = (selector) => [...document.querySelectorAll(selector)]
  return {
    body: document.body.innerHTML,
    text: document.body.textContent,
    links: all('a').map((a) => a.getAttribute('href')),
    images: all('img').map((i) => [
      i.getAttribute('src'),
      i.getAttribute('alt'),
    ]),
    headings: all('h1,h2,h3,h4,h5,h6').map((h) => [h.tagName, h.textContent]),
    metadata: all(
      'title,meta,link[rel="canonical"],script[type="application/ld+json"]',
    ).map((node) => node.outerHTML),
  }
}
const originalFiles = (await htmlFiles(before))
  .map((p) => relative(before, p))
  .sort()
const newFiles = (await htmlFiles(after)).map((p) => relative(after, p)).sort()
assert.deepEqual(newFiles, originalFiles, 'Page set changed')
for (const file of originalFiles) {
  assert.deepEqual(
    signature(await readFile(join(after, file), 'utf8')),
    signature(await readFile(join(before, file), 'utf8')),
    `Content changed: ${file}`,
  )
}
console.log(
  `${originalFiles.length} HTML files: exact body DOM, text, ordered hrefs, image src/alt, headings and metadata preserved.`,
)
