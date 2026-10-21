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
  await expect(page.locator('#schedule')).toContainText(
    '一般の方も参加できます',
  )
})
test('開いたナビゲーションがフェードインする', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 })
  await page.goto('./')
  await page.getByRole('button', { name: 'メニューを開く' }).click()
  await expect
    .poll(() =>
      page
        .getByRole('navigation', { name: 'メインメニュー' })
        .evaluate((nav) => getComputedStyle(nav).animationName),
    )
    .toBe('nav-in')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect
    .poll(() =>
      page
        .getByRole('navigation', { name: 'メインメニュー' })
        .evaluate((nav) => getComputedStyle(nav).animationName),
    )
    .toBe('none')
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
test('大口だけ公式リンクを持ち、広告は大きい区分から並ぶ', async ({ page }) => {
  await page.goto('./sponsors/')
  const groups = page.locator('[data-sponsor-tier]')
  expect(
    await groups.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('data-sponsor-tier')),
    ),
  ).toEqual(['major', 'full', 'quarter', 'eighth'])
  const links = page.locator('#sponsor-banners a')
  await expect(links).toHaveCount(5)
  expect(
    await links.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href')),
    ),
  ).toEqual([
    'https://www.tosoh.co.jp/',
    'https://fujikoatsu.jp/',
    'https://www.tokuyama.co.jp/',
    'https://www.tkworks.jp/',
    'https://www.shunan-ds.com/',
  ])
  await expect(page.locator('#sponsor-banners article')).toHaveCount(83)
  await page.locator('#sponsor-banners').scrollIntoViewIfNeeded()
  for (const img of await page.locator('#sponsor-banners img').all()) {
    await img.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        img.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true)
    const ratio = await img.evaluate((node: HTMLImageElement) => ({
      shown: node.width / node.height,
      original: node.naturalWidth / node.naturalHeight,
    }))
    expect(ratio.shown).toBeCloseTo(ratio.original, 1)
  }
})
test('提供された地図9枚を拡大でき、星マークの意味が分かる', async ({
  page,
  request,
}) => {
  await page.goto('./guide/map/')
  await expect(
    page.getByText('星マークは、スタンプラリーのスタンプ設置場所です。'),
  ).toBeVisible()
  const details = page.locator('#campus-map details')
  await expect(details).toHaveCount(8)
  for (const detail of await details.all()) {
    await detail.locator('summary').click()
    const image = detail.getByRole('img')
    await image.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        image.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true)
    expect(
      (
        await request.get(
          (await detail.getByRole('link').getAttribute('href'))!,
        )
      ).ok(),
    ).toBe(true)
  }
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
  baseURL,
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
  await expect(page).toHaveURL(baseURL!)
  await expect(page.getByText('Echo.', { exact: true })).toBeVisible()
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
