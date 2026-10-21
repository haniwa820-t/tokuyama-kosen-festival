import { describe, expect, it } from 'vitest'
import { deploymentConfig } from './deployment'

describe('公開先の設定', () => {
  it('Cloudflare Pagesではルートと配信URLを使う', () => {
    expect(
      deploymentConfig({ CF_PAGES_URL: 'https://preview.festival.pages.dev' }),
    ).toEqual({
      base: '/',
      siteUrl: 'https://preview.festival.pages.dev/',
    })
  })
  it('独自ドメインと既存GitHub Pagesのパスを指定できる', () => {
    expect(
      deploymentConfig({
        SITE_URL: 'https://festival.example/',
        CF_PAGES_URL: 'https://preview.pages.dev',
      }).siteUrl,
    ).toBe('https://festival.example/')
    expect(
      deploymentConfig({
        SITE_BASE_PATH: '/tokuyama-kosen-festival/',
        SITE_URL: 'https://haniwa820-t.github.io/tokuyama-kosen-festival/',
      }),
    ).toEqual({
      base: '/tokuyama-kosen-festival/',
      siteUrl: 'https://haniwa820-t.github.io/tokuyama-kosen-festival/',
    })
  })
  it('ローカルプレビューの既定値を使い、不正な公開先を拒否する', () => {
    expect(deploymentConfig({}).siteUrl).toBe('http://localhost:4173/')
    expect(() =>
      deploymentConfig({ SITE_BASE_PATH: 'https://example.com/' }),
    ).toThrow()
    expect(() =>
      deploymentConfig({ SITE_URL: 'javascript:alert(1)' }),
    ).toThrow()
    expect(() =>
      deploymentConfig({
        SITE_BASE_PATH: '/festival/',
        SITE_URL: 'https://example.com/',
      }),
    ).toThrow()
  })
})
