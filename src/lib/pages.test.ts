import { describe, expect, it } from 'vitest'
import { getPage, pageUrl, sectionUrl } from './pages'
describe('階層化した静的ページ', () => {
  it('末尾のindexとbaseを考慮し、深いURLを解決する', () => {
    expect(
      getPage('/tokuyama-kosen-festival/events/booths/index.html').id,
    ).toBe('booths')
    expect(getPage('/tokuyama-kosen-festival/guide/map/').parent).toBe('guide')
    expect(getPage('/tokuyama-kosen-festival/').id).toBe('home')
    expect(getPage('/unknown/').id).toBe('not-found')
    expect(pageUrl('booths')).toBe('/tokuyama-kosen-festival/events/booths/')
  })
  it('掲載項目のリンクを移動先ページに結びつける', () => {
    expect(sectionUrl('parking')).toBe(
      '/tokuyama-kosen-festival/guide/access/#parking',
    )
    expect(sectionUrl('theme')).toBe('/tokuyama-kosen-festival/#theme')
    expect(sectionUrl('top')).toBe('/tokuyama-kosen-festival/#top')
  })
})
