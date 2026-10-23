import { describe, expect, it } from 'vitest'
import {
  canonicalSiteUrl,
  pageMetadata,
  structuredData,
  serializeJsonLd,
} from './seo'
import { pages, pageById } from './pages'

describe('検索結果と共有用のメタ情報', () => {
  it('トップのタイトルと説明に開催年・開催日・案内内容を含める', () => {
    expect(pageMetadata('home')).toEqual({
      title: '徳山高専 高専祭2026｜10月31日・11月1日開催【第52回】',
      description:
        '2026年10月31日（土）・11月1日（日）開催。山口県周南市の第52回徳山高専高専祭「Echo」の公式サイトです。企画・模擬店・ステージ日程・アクセス・駐車場・会場マップ・パンフレットをご案内します。',
      canonical: canonicalSiteUrl,
    })
  })

  it('全公開ページに固有のタイトル・説明・正規URLを用意する', () => {
    const publishedPages = pages.filter((page) => page.id !== 'not-found')
    const metadata = publishedPages.map((page) => pageMetadata(page.id))
    expect(new Set(metadata.map((item) => item.title)).size).toBe(9)
    expect(new Set(metadata.map((item) => item.description)).size).toBe(9)
    for (const [index, item] of metadata.entries()) {
      expect(item.title).toContain('徳山高専 高専祭2026')
      expect(item.description).toContain('徳山高専')
      expect(item.description).toContain('2026')
      expect(item.canonical).toBe(canonicalSiteUrl + publishedPages[index].path)
    }
    expect(pageMetadata('schedule').description).toContain('後夜祭')
    expect(pageMetadata('access').description).toContain('防長バス')
    expect(pageMetadata('pamphlet').description).toContain('全48ページ')
  })

  it('画面上の見出しや紹介文を変えず、未知のページは404として扱う', () => {
    expect(pageById('home').title).toBe('第52回 徳山高専 高専祭 2026 — Echo')
    expect(pageById('schedule').description).toBe(
      'ステージ企画と日ごとのプログラム。',
    )
    expect(pageMetadata('unknown')).toEqual(pageMetadata('not-found'))
    expect(pageMetadata('not-found').canonical).toBe(
      `${canonicalSiteUrl}404.html`,
    )
  })
})

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
