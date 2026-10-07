import { describe, expect, it } from 'vitest'
import { filterBooths, assetUrl } from './catalog'
import booths from '../data/booths.json'

describe('来場者が模擬店を探す', () => {
  it('未入力のときは全団体を返す', () => {
    expect(filterBooths(booths, 'all', '　 ')).toHaveLength(32)
  })
  it('分類と検索語を同時に適用する', () => {
    expect(
      filterBooths(booths, 'food', '部').every(
        (b) => b.category === 'food' && b.organization.includes('部'),
      ),
    ).toBe(true)
  })
  it('英字の大小文字・全角半角を区別しない', () => {
    expect(filterBooths(booths, 'all', 'ｉｅ３')[0].organization).toBe('IE3')
  })
  it('内容・会場からも検索できる', () => {
    expect(filterBooths(booths, 'all', 'ポップコーン')[0].organization).toBe(
      '総合文化部（写真）',
    )
    expect(filterBooths(booths, 'all', '第二体育館')[0].title).toBe(
      'バレーボールストラックアウト',
    )
  })
  it('検索語は正規表現やHTMLとして解釈しない', () => {
    expect(filterBooths(booths, 'all', '.*')).toEqual([])
    expect(filterBooths(booths, 'all', '<script>')).toEqual([])
  })
})

describe('リポジトリ配下への公開', () => {
  it('画像と資料のURLに公開先のbaseを付ける', () => {
    expect(assetUrl('posters/booth-01.webp')).toBe(
      '/tokuyama-kosen-festival/posters/booth-01.webp',
    )
  })
})
