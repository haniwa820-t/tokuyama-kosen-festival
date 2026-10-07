import { readFile, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
const json = async p => JSON.parse(await readFile(p,'utf8'))
const manifest = await json('assets/source/manifest.json')
for (const file of manifest.files) {
 const bytes = await readFile(file.path)
 assert.equal(bytes.length,file.bytes,`Original size changed: ${file.path}`)
 assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,`Original changed: ${file.path}`)
}
const festival = await json('src/data/festival.json')
assert.equal(festival.yearStatus,'confirmed')
assert.equal(festival.year,2026)
for (const d of festival.days) {
 const date = new Date(Date.UTC(festival.year,d.month - 1,d.day))
 assert.equal(['日','月','火','水','木','金','土'][date.getUTCDay()],d.weekday)
 assert(d.opensAt < d.closesAt)
}
const booths = await json('src/data/booths.json')
assert.equal(booths.length,32)
assert.equal(new Set(booths.map(b => b.id)).size,32)
for (const b of booths) { await access(b.source); await access(`public/${b.poster}`); await access(`public/${b.thumbnail}`); assert(b.venueSource.startsWith('pamphlet:')) }
const schedule = await json('src/data/schedule.json')
for (const e of schedule) { assert(e.start < e.end); assert(e.source.startsWith('pamphlet:')) }
assert.equal(schedule.find(e => e.title === '後夜祭').note,'在校生のみ参加可能')
const original = await readFile(festival.pamphlet.source)
assert.deepEqual(await readFile(`public/${festival.pamphlet.path}`), original,'Distribution PDF differs from supplied preparation version')
assert.equal(festival.pamphlet.status,'preparation')
console.log(`${manifest.files.length} originals intact; dates, 32 booth assets, source records and preparation PDF verified.`)
