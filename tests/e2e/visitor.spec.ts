import { expect, test } from '@playwright/test'

test('開催情報が読み込め、日程を切り替えられる', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('徳山高専')
  await page.locator('#schedule').getByRole('button', { name: '11月1日（日）' }).click()
  await expect(page.locator('#schedule')).toContainText('イントロクイズ')
  await expect(page.locator('#schedule')).toContainText('在校生のみ')
})

test('模擬店を検索しポスターを確認できる', async ({ page }) => {
  await page.goto('./#booths')
  await page.getByRole('searchbox').fill('ワッフル')
  await page.getByRole('button', { name: /ワッフル.*詳細を見る/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('吹奏楽部')
  await expect(dialog.getByRole('img')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
})

test('直接リンクの再読込・地図・準備版PDFが使える', async ({ page, request }) => {
  await page.goto('./#access')
  await page.reload()
  await expect(page.locator('#access')).toContainText('大学高専下')
  const response = await request.get('documents/pamphlet-preparation.pdf')
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('application/pdf')
  await expect(page.locator('#campus-map .campus-figure img')).toBeVisible()
})

test('JavaScriptなしでも開催情報と主要リンクを読める', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL!)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('徳山高専')
  await expect(page.getByRole('link', { name: /準備版PDFをダウンロード/ })).toBeVisible()
  await context.close()
})

test('横にはみ出さず、読み込み失敗した画像がない', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('./')
  await page.locator('#pamphlet').scrollIntoViewIfNeeded()
  await page.locator('#top').scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await page.locator('img').evaluateAll(images => images.filter(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth === 0).length)).toBe(0)
  expect(errors).toEqual([])
})
