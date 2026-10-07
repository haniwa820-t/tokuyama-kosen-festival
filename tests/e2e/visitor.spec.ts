import { expect, test } from '@playwright/test'
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
test('ホームから日程へ移動し2日目へ切り替えられる', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    '徳山高専',
  )
  if (await page.getByRole('button', { name: 'メニューを開く' }).isVisible())
    await page.getByRole('button', { name: 'メニューを開く' }).click()
  await page
    .getByRole('navigation', { name: 'メインメニュー' })
    .getByRole('link', { name: '日程', exact: true })
    .click()
  await expect(page).toHaveURL(/\/schedule\/$/)
  await page
    .locator('#schedule')
    .getByRole('button', { name: '11月1日（日）' })
    .click()
  await expect(page.locator('#schedule')).toContainText('イントロクイズ')
  await expect(page.locator('#schedule')).toContainText('在校生のみ')
})
test('検索・保存・おまかせ・ポスター詳細を使える', async ({ page }) => {
  await page.goto('./events/booths/')
  await page.getByRole('searchbox').fill('ワッフル')
  await page
    .getByRole('button', { name: /ワッフル.*行きたい企画に保存/ })
    .click()
  await page.reload()
  await page.getByRole('button', { name: /保存した企画だけ/ }).click()
  await expect(page.getByRole('button', { name: /詳細を見る/ })).toHaveCount(1)
  await page.getByRole('button', { name: 'おまかせで1企画選ぶ' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('吹奏楽部')
  await expect(dialog.getByRole('img')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
})
test('深いページが直接アクセスと再読込で表示される', async ({
  page,
  request,
}) => {
  for (const route of routes) {
    const response = await page.goto(`./${route}`)
    expect(response?.status()).toBe(200)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    if (route)
      await expect(
        page.getByRole('navigation', { name: 'パンくず' }),
      ).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
  }
  await page.goto('./guide/access/')
  await expect(page.locator('#access')).toContainText('大学高専下')
  await page.goto('./guide/map/')
  await expect(page.locator('.campus-figure img')).toBeVisible()
  const pdf = await request.get('documents/pamphlet-preparation.pdf')
  expect(pdf.ok()).toBe(true)
  expect(pdf.headers()['content-type']).toContain('application/pdf')
})
test('スポンサー30枚の画像リンクが表示される', async ({ page }) => {
  await page.goto('./sponsors/')
  const links = page.locator('#sponsor-banners a')
  await expect(links).toHaveCount(30)
  for (const link of await links.all()) {
    expect(await link.getAttribute('href')).toMatch(/^https:\/\//)
    await expect(link).toHaveAttribute('target', '_blank')
  }
  await page.locator('#sponsor-banners').scrollIntoViewIfNeeded()
  await expect(links.first().getByRole('img')).toBeVisible()
})
test('JavaScriptなしでも階層とPDFリンクを使える', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL! + 'guide/')
  await page
    .getByRole('link', { name: /パンフレット.*現在の準備版PDF/ })
    .click()
  await expect(
    page.getByRole('link', { name: /準備版PDFをダウンロード/ }),
  ).toBeVisible()
  await context.close()
})
test('動きを減らす設定でも内容を読め、時計や画像にエラーがない', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.clock.install({ time: new Date('2026-10-08T12:00:00+09:00') })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  await expect(page.locator('.countdown-digits')).toBeVisible()
  await page.locator('#sponsors').scrollIntoViewIfNeeded()
  await expect(page.locator('#sponsors h2')).toBeVisible()
  expect(
    await page
      .locator('img')
      .evaluateAll(
        (imgs) =>
          imgs.filter(
            (img) =>
              img instanceof HTMLImageElement &&
              img.complete &&
              img.naturalWidth === 0,
          ).length,
      ),
  ).toBe(0)
  expect(errors).toEqual([])
})
test('旧ページ内リンクから新しい階層に移動できる', async ({ page }) => {
  await page.goto('./#booths')
  await expect(page).toHaveURL(/\/events\/booths\/#booths$/)
  await expect(page.getByRole('searchbox')).toBeVisible()
})

test('メインロゴが表示され、各画面のメニューからホームに戻れる', async ({
  page,
}) => {
  await page.goto('./events/booths/')
  await expect(
    page
      .getByRole('link', { name: '徳山高専 高専祭 ホームへ戻る' })
      .getByRole('img'),
  ).toBeVisible()
  const toggle = page.getByRole('button', { name: 'メニューを開く' })
  if (await toggle.isVisible()) await toggle.click()
  const home = page
    .getByRole('navigation', { name: 'メインメニュー' })
    .getByRole('link', { name: 'ホーム', exact: true })
  await expect(home).toBeVisible()
  expect((await home.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await home.click()
  await expect(page).toHaveURL(/\/tokuyama-kosen-festival\/$/)
  await expect(
    page.getByRole('img', {
      name: 'メインロゴ Echo あの感動をもう一度',
      exact: true,
    }),
  ).toBeVisible()
  expect(
    await page.evaluate(async () => {
      await document.fonts.ready
      return [...document.fonts].some(
        (font) =>
          font.family.includes('Festival Mincho') && font.status === 'loaded',
      )
    }),
  ).toBe(true)
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await expect(
      page.getByRole('link', { name: '徳山高専 高専祭 ホームへ戻る' }),
    ).toBeVisible()
  }
})
