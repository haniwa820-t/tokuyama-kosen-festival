// Test fixture only: all comparison pages use the same JST instant.
// The production countdown implementation and generated body remain untouched.
Date.now = () => Date.parse('2026-10-22T10:00:00+09:00')

// Review-only navigation to an existing tier; no labels or DOM are inserted.
window.addEventListener('load', () => {
  const tier = new URLSearchParams(window.location.search).get('tier')
  if (!['major', 'full', 'quarter', 'eighth'].includes(tier)) return
  const group = document.querySelector(`[data-sponsor-tier="${tier}"]`)
  const header = document.querySelector('.header')
  if (group && header)
    window.scrollTo(
      0,
      group.getBoundingClientRect().top +
        window.scrollY -
        header.getBoundingClientRect().height -
        20,
    )
})
