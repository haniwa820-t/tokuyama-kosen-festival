import { describe, expect, it } from 'vitest'
import { canonicalSiteUrl, structuredData, serializeJsonLd } from './seo'

describe('検索向けの開催情報', () => {
  it('開催日時と会場を日本時間で出力する', () => {
    const event = structuredData('home')['@graph'].find(
      (item) => item['@type'] === 'Event',
    )
    expect(event).toMatchObject({
      startDate: '2026-10-31T09:45:00+09:00',
      endDate: '2026-11-01T15:00:00+09:00',
      location: { name: '徳山工業高等専門学校' },
      url: canonicalSiteUrl,
    })
    expect(event).not.toHaveProperty('offers')
  })
  it('深いページのパンくずを主公開URLへ結びつける', () => {
    const breadcrumb = structuredData('booths')['@graph'].find(
      (item) => item['@type'] === 'BreadcrumbList',
    )
    expect(breadcrumb?.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: canonicalSiteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '企画',
        item: `${canonicalSiteUrl}events/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '模擬店',
        item: `${canonicalSiteUrl}events/booths/`,
      },
    ])
    expect(structuredData('not-found')['@graph']).toEqual([])
  })
  it('データ中のHTMLがscript要素の外へ出ないようにする', () => {
    const value = { text: '</script><img src=x onerror=alert(1)>\u2028\u2029' }
    const encoded = serializeJsonLd(value)
    expect(encoded).not.toContain('<')
    expect(encoded).not.toContain('\u2028')
    expect(JSON.parse(encoded)).toEqual(value)
  })
})
