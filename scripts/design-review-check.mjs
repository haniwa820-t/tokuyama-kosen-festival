import { readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const source = await readFile('scripts/check-design.mjs', 'utf8')
for (const version of ['a', 'b', 'c', 'd']) {
  let all = ''
  const shared = ['c', 'd'].includes(version) ? 'vivid' : 'shared'
  for (const path of [
    'src/styles/tokens.css',
    `design-review/${shared}.css`,
    `design-review/${version}.css`,
  ])
    all += '\n' + (await readFile(path, 'utf8'))
  const rootRules = [...all.matchAll(/:root\s*\{([^}]+)\}/gs)]
    .map(([, block]) => block)
    .join('\n')
  const tokens = Object.fromEntries(
    [...rootRules.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [
      key,
      value.trim(),
    ]),
  )
  function resolveColor(key) {
    const value = tokens[key]
    if (!value) throw new Error(`Missing token: ${key}`)
    return value.startsWith('var(') ? resolveColor(value.slice(6, -1)) : value
  }
  const css = Object.keys(tokens)
    .filter((key) => key.startsWith('color-'))
    .map((key) => `--${key}: ${resolveColor(key)};`)
    .join('\n')
  await writeFile(`tmp/design-review/${version}-tokens.css`, css)
  await writeFile(
    `tmp/design-review/check-${version}.mjs`,
    source.replace(
      "'src/styles/tokens.css'",
      `'tmp/design-review/${version}-tokens.css'`,
    ),
  )
  const check = spawnSync(
    process.execPath,
    [`tmp/design-review/check-${version}.mjs`],
    { encoding: 'utf8' },
  )
  await writeFile(
    `tmp/design-review/contrast-${version}.txt`,
    check.stdout + check.stderr,
  )
  if (check.status !== 0) {
    process.stderr.write(check.stdout + check.stderr)
    process.exit(1)
  }
  console.log(
    `${version.toUpperCase()}: existing 26 color contrast requirements passed.`,
  )
}
