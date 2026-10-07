import { readFile, writeFile } from 'node:fs/promises'
import { render } from '../tmp/ssr/entry-server.js'
const html = await readFile('dist/index.html','utf8')
await writeFile('dist/index.html', html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
console.log('Static Japanese HTML generated for search engines and visitors without JavaScript.')
