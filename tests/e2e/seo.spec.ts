import { expect, test } from '@playwright/test'

const canonicalSiteUrl = 'https://tokuyama-kosen-festival.pages.dev/'
const routes = [
  '',
  'schedule/',
  'events/',
  'events/booths/',
  'guide/',
  'guide/map/',
  'guide/access/',
  'guide/pamphlet/',
  'sponsors/',
]

test('JavaScriptなしで全ページの検索・共有用メタ情報を読める', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  for (const route of routes) {
    const response = await page.goto(baseURL! + route)
    expect(response?.status()).toBe(200)
    expect(response?.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex/i)
    await expect(page).toHaveTitle(/徳山高専 高専祭2026/)
    const title = await page.title()
    const description = await page
      .locator('head meta[name="description"]')
      .getAttribute('content')
    expect(description).toContain('徳山高専')
    expect(description).toContain('2026')
    titles.add(title)
    descriptions.add(description!)
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      'href',
      canonicalSiteUrl + route,
    )
    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute(
      'content',
      canonicalSiteUrl + route,
    )
    await expect(
      page.locator('head meta[property="og:title"]'),
    ).toHaveAttribute('content', title)
    await expect(
      page.locator('head meta[property="og:description"]'),
    ).toHaveAttribute('content', description!)
    await expect(page.locator('head meta[name="robots"]')).toHaveCount(0)
  }
  expect(titles.size).toBe(routes.length)
  expect(descriptions.size).toBe(routes.length)
  await page.goto(baseURL! + '404.html')
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  )
  await context.close()
})

test('クローラー向けファイルに全9ページの正規URLを公開する', async ({
  request,
}) => {
  const robots = await request.get('robots.txt')
  expect(robots.status()).toBe(200)
  expect(robots.headers()['content-type']).toContain('text/plain')
  expect(await robots.text()).toBe(
    `User-agent: *\nAllow: /\nSitemap: ${canonicalSiteUrl}sitemap.xml\n`,
  )

  const sitemap = await request.get('sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(sitemap.headers()['content-type']).toContain('xml')
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => match[1],
  )
  expect(urls.sort()).toEqual(
    routes.map((route) => canonicalSiteUrl + route).sort(),
  )
})
