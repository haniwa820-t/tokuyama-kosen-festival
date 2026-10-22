const controls = document.querySelector('.review-controls')
const page = document.querySelector('#page')
const width = document.querySelector('#width')
const tier = document.querySelector('#tier')
const version = document.querySelector('#version')
const options = [...document.querySelectorAll('.review-option')]

function scrollFrame(frame) {
  if (!frame.contentDocument?.querySelector('.header')) return
  if (page.value === 'home') frame.contentWindow.scrollTo(0, 0)
  else {
    const group = frame.contentDocument.querySelector(
      `[data-sponsor-tier="${tier.value}"]`,
    )
    const header = frame.contentDocument.querySelector('.header')
    if (group)
      frame.contentWindow.scrollTo(
        0,
        group.getBoundingClientRect().top +
          frame.contentWindow.scrollY -
          header.getBoundingClientRect().height -
          20,
      )
  }
}

function layout() {
  const targetWidth = Number(width.value)
  document.querySelector('#tier-control').hidden = page.value !== 'sponsors'
  document
    .querySelector('.review-grid')
    .classList.toggle('single', version.value !== 'all')
  for (const option of options) {
    option.hidden =
      version.value !== 'all' && version.value !== option.dataset.version
    if (option.hidden) continue
    const window = option.querySelector('.preview-window')
    const frame = option.querySelector('iframe')
    const scale = Math.min(1, (window.clientWidth - 2) / targetWidth)
    const height = page.value === 'home' ? 1400 : 1100
    frame.style.width = `${targetWidth}px`
    frame.style.height = `${height}px`
    frame.style.transform = `scale(${scale})`
    window.style.height = `${Math.ceil(height * scale)}px`
    const route = page.value === 'home' ? '' : 'sponsors/'
    const path = `/__design-review__/${option.dataset.version}/${route}`
    option.querySelector('.actual').href = path
    if (new URL(frame.src).pathname !== path) frame.src = path
    else scrollFrame(frame)
  }
}
for (const frame of document.querySelectorAll('iframe'))
  frame.addEventListener('load', () => scrollFrame(frame))
controls.addEventListener('change', layout)
document.querySelector('#top').addEventListener('click', () => {
  for (const frame of document.querySelectorAll('iframe'))
    frame.contentWindow.scrollTo(0, 0)
})
new ResizeObserver(layout).observe(document.querySelector('.review-grid'))
layout()
