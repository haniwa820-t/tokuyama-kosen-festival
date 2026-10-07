import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const css = await readFile('src/styles/tokens.css', 'utf8')
const colors = Object.fromEntries(
  [...css.matchAll(/--(color-[\w-]+):\s*(#[0-9a-f]{6});/g)].map(
    ([, key, value]) => [key, value],
  ),
)
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    )
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
}
const pairs = [
  ['text', 'surface', 4.5],
  ['text-muted', 'surface', 4.5],
  ['text-muted', 'surface-subtle', 4.5],
  ['action', 'surface', 4.5],
  ['on-action', 'action', 4.5],
  ['on-action', 'action-hover', 4.5],
  ['action', 'surface-blue', 4.5],
  ['warning-text', 'surface-warm', 4.5],
  ['gold', 'action', 4.5],
  ['focus', 'surface', 3],
  ['control-border', 'surface', 3],
  ['disabled-text', 'disabled-bg', 4.5],
]
for (const [foreground, background, minimum] of pairs) {
  const a = luminance(colors[`color-${foreground}`]),
    b = luminance(colors[`color-${background}`])
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  assert(
    ratio >= minimum,
    `${foreground}/${background}: ${ratio.toFixed(2)} < ${minimum}`,
  )
  console.log(`${foreground}/${background}: ${ratio.toFixed(2)}:1`)
}
console.log(
  `${pairs.length} semantic color combinations meet the design requirements.`,
)
