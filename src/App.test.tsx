import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import sponsorExclusions from './data/sponsor-exclusions.json'

beforeEach(() =>
  vi
    .spyOn(Date, 'now')
    .mockReturnValue(Date.parse('2026-10-08T12:00:00+09:00')),
)
afterEach(() => vi.restoreAllMocks())

describe('高専祭の案内', () => {
  it('開催日時・最低限の掲載項目・完成版資料を確認できる', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '徳山高専',
    )
    expect(document.getElementById('theme')).toBeInTheDocument()
    expect(document.getElementById('schedule')).not.toBeInTheDocument()
    expect(
      screen
        .getByRole('navigation', { name: 'メインメニュー' })
        .querySelector('a'),
    ).toHaveAttribute('href', '/tokuyama-kosen-festival/')
    expect(
      screen.getByRole('link', { name: /パンフレットPDFをダウンロード/ }),
    ).toHaveAttribute(
      'href',
      '/tokuyama-kosen-festival/documents/festival-pamphlet-2026.pdf',
    )
    expect(screen.getByText('開幕まで')).toBeInTheDocument()
  })

  it('2日目のステージ日程へ切り替えられる', async () => {
    const user = userEvent.setup()
    render(<App pageId="schedule" />)
    const schedule = within(document.getElementById('schedule')!)
    expect(schedule.getByText('カラオケ')).toBeVisible()
    await user.click(schedule.getByRole('button', { name: '11月1日（日）' }))
    expect(schedule.getByText('イントロクイズ')).toBeVisible()
    expect(schedule.getByText('一般の方も参加できます')).toBeVisible()
    expect(schedule.queryByText(/在校生のみ/)).not.toBeInTheDocument()
    expect(schedule.queryByText('カラオケ')).not.toBeInTheDocument()
    await user.click(schedule.getByRole('button', { name: '10月31日（土）' }))
    expect(schedule.getByText('カラオケ')).toBeVisible()
  })

  it('模擬店の分類・検索・リセットが連動する', async () => {
    const user = userEvent.setup()
    render(<App pageId="booths" />)
    const catalog = within(document.getElementById('booths')!)
    await user.click(catalog.getByRole('button', { name: '飲食' }))
    await user.type(catalog.getByRole('searchbox'), 'ワッフル')
    expect(
      catalog.getByRole('button', { name: /ワッフル.*詳細を見る/ }),
    ).toBeVisible()
    await user.clear(catalog.getByRole('searchbox'))
    await user.type(catalog.getByRole('searchbox'), '存在しないお店')
    expect(
      catalog.getByText('該当する企画が見つかりませんでした。'),
    ).toBeVisible()
    await user.click(
      catalog.getByRole('button', { name: '検索条件をリセット' }),
    )
    expect(catalog.getByRole('button', { name: 'すべて' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(catalog.getByRole('button', { name: /残り.*見る/ }))
    expect(catalog.getAllByRole('button', { name: /詳細を見る/ })).toHaveLength(
      32,
    )
  })

  it('ポスター詳細を閉じられ、フォーカスが元の企画に戻る', async () => {
    const user = userEvent.setup()
    render(<App pageId="booths" />)
    const catalog = within(document.getElementById('booths')!)
    const opener = catalog.getAllByRole('button', { name: /詳細を見る/ })[0]
    await user.click(opener)
    expect(screen.getByRole('dialog')).toBeVisible()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    await user.click(opener)
    await user.click(screen.getByRole('button', { name: '詳細を閉じる' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('詳細の中だけでTabキー移動できる', async () => {
    const user = userEvent.setup()
    render(<App pageId="booths" />)
    await user.click(
      within(document.getElementById('booths')!).getAllByRole('button', {
        name: /詳細を見る/,
      })[0],
    )
    const close = screen.getByRole('button', { name: '詳細を閉じる' })
    const link = within(screen.getByRole('dialog')).getByRole('link')
    expect(close).toHaveFocus()
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(link).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(close).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(link).toHaveFocus()
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(close).toHaveFocus()
  })

  it('背景クリックで詳細を閉じ、詳細内の操作では閉じない', async () => {
    const user = userEvent.setup()
    render(<App pageId="booths" />)
    await user.click(
      within(document.getElementById('booths')!).getAllByRole('button', {
        name: /詳細を見る/,
      })[0],
    )
    await user.click(screen.getByRole('dialog'))
    expect(screen.getByRole('dialog')).toBeVisible()
    fireEvent.click(screen.getByTestId('dialog-backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('モバイルのメニューを開閉し、リンク選択で閉じる', async () => {
    const user = userEvent.setup()
    render(<App pageId="booths" />)
    await user.click(screen.getByRole('button', { name: 'メニューを開く' }))
    expect(
      screen.getByRole('button', { name: 'メニューを閉じる' }),
    ).toHaveAttribute('aria-expanded', 'true')
    const link = within(
      screen.getByRole('navigation', { name: 'メインメニュー' }),
    ).getByRole('link', { name: '日程' })
    link.addEventListener('click', (event) => event.preventDefault())
    await user.click(link)
    expect(
      screen.getByRole('button', { name: 'メニューを開く' }),
    ).toHaveAttribute('aria-expanded', 'false')
    await user.click(screen.getByRole('button', { name: 'メニューを開く' }))
    await user.click(screen.getByRole('button', { name: 'メニューを閉じる' }))
    expect(
      screen.getByRole('button', { name: 'メニューを開く' }),
    ).toHaveAttribute('aria-expanded', 'false')
  })
})

// 各ページの情報が失われず、パンくずから上の階層へ戻れることを確認。
describe('ページの階層', () => {
  it.each([
    ['events', 'main-events'],
    ['events', 'departments'],
    ['events', 'related-events'],
    ['map', 'campus-map'],
    ['access', 'access'],
    ['access', 'parking'],
    ['pamphlet', 'pamphlet'],
    ['guide', 'guide'],
    ['sponsors', 'sponsors'],
  ])('%sページに%sがある', (page, id) => {
    render(<App pageId={page} />)
    expect(document.getElementById(id)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'パンくず' }),
    ).toBeInTheDocument()
  })
  it('大口5社の提供画像から指定された公式サイトへ移動できる', () => {
    render(<App pageId="sponsors" />)
    const major = document.querySelector('[data-sponsor-tier="major"]')!
    const links = within(major as HTMLElement).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://www.tosoh.co.jp/',
      'https://fujikoatsu.jp/',
      'https://www.tokuyama.co.jp/',
      'https://www.tkworks.jp/',
      'https://www.shunan-ds.com/',
    ])
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(within(link).getByRole('img').getAttribute('alt')).not.toContain(
        'サンプル',
      )
    }
    expect(within(links[0]).getByRole('img')).toHaveAttribute(
      'alt',
      '東ソー株式会社 南陽事業所のロゴマーク',
    )
    expect(document.querySelectorAll('#sponsor-banners a')).toHaveLength(5)
    expect(document.querySelectorAll('#sponsor-banners img')).toHaveLength(44)
    for (const entry of sponsorExclusions.entries) {
      expect(document.body.textContent).not.toContain(entry.directoryName)
      expect(document.querySelector(`img[src$="${entry.image}"]`)).toBeNull()
    }
    expect(document.querySelectorAll('.sponsors li')).toHaveLength(52)

    expect(document.querySelectorAll('#sponsor-banners article')).toHaveLength(
      39,
    )
    expect(
      screen.queryByText(/りんかい日産建設/),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByAltText(/りんかい日産建設/),
    ).not.toBeInTheDocument()
    expect(
      Array.from(document.querySelectorAll('[data-sponsor-tier]')).map((node) =>
        node.getAttribute('data-sponsor-tier'),
      ),
    ).toEqual(['major', 'full', 'quarter', 'eighth'])
    expect(
      document.querySelector('[data-sponsor-tier="quarter"]'),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[data-sponsor-tier="eighth"]'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/画像差し替え用のサンプル/),
    ).not.toBeInTheDocument()
  })
  it('提供された会場図とスタンプ設置場所の説明を確認できる', () => {
    render(<App pageId="map" />)
    expect(document.querySelector('.campus-figure img')).toHaveAttribute(
      'src',
      '/tokuyama-kosen-festival/maps/campus.webp',
    )
    expect(
      screen.getByText('星マークはスタンプラリーのスタンプ設置場所です。'),
    ).toBeInTheDocument()
    expect(document.querySelectorAll('#campus-map img')).toHaveLength(9)
  })
  it('存在しないページは戻り先を示す', () => {
    render(<App pageId="not-found" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'ページが見つかりません',
    )
  })
})

describe('ホームへの導線とメインロゴ', () => {
  it('サブページのメニューからホームへ戻れる', () => {
    render(<App pageId="booths" />)
    const menu = within(
      screen.getByRole('navigation', { name: 'メインメニュー' }),
    )
    expect(menu.getByRole('link', { name: 'ホーム' })).toHaveAttribute(
      'href',
      '/tokuyama-kosen-festival/',
    )
    expect(menu.getByRole('link', { name: '模擬店' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    const brand = screen.getByRole('link', {
      name: '徳山高専 高専祭 ホームへ戻る',
    })
    expect(
      within(brand).getByRole('img', { name: '徳山高専 高専祭 メインロゴ' }),
    ).toHaveAttribute('src', '/tokuyama-kosen-festival/images/echo-logo.webp')
  })
  it('ホームの現在地とEchoのタイトル、ヘッダーの提供ロゴを表示する', () => {
    render(<App />)
    expect(
      within(
        screen.getByRole('navigation', { name: 'メインメニュー' }),
      ).getByRole('link', { name: 'ホーム' }),
    ).toHaveAttribute('aria-current', 'page')
    expect(
      within(document.getElementById('top')!).getByText('Echo'),
    ).toHaveTextContent('Echo.')
    expect(
      within(
        screen.getByRole('link', { name: '徳山高専 高専祭 ホームへ戻る' }),
      ).getByRole('img'),
    ).toHaveAttribute('src', '/tokuyama-kosen-festival/images/echo-logo.webp')
  })
})

describe('2026年10月23日の掲載情報訂正', () => {
  it('日程タイトル直下だけ後夜祭の説明を外し、日程内の案内は維持する', () => {
    render(<App pageId="schedule" />)
    expect(document.querySelector('.page-heading p')).toHaveTextContent(
      'ステージ企画と日ごとのプログラム。',
    )
    expect(document.querySelector('.page-heading p')).not.toHaveTextContent(
      '後夜祭',
    )
    expect(document.querySelector('#schedule')).toHaveTextContent(
      '後夜祭は一般の方も参加できます',
    )
    expect(document.querySelector('.all-day')).toHaveTextContent('総務課前')
  })
  it('CAの展示は両日、体験だけ日曜日とし、未提供の時刻を付けない', () => {
    render(<App pageId="events" />)
    const ca = screen
      .getByRole('heading', { name: 'CAすぎるよ展 ＆ CA作品展' })
      .closest('article')!
    expect(ca).toHaveTextContent(
      '展示：10月31日（土）・11月1日（日）／体験：11月1日（日）のみ',
    )
    expect(ca.textContent).not.toMatch(/\d{1,2}:\d{2}|不明|限定開催/)
    const blood = document.getElementById('blood-donation')!
    expect(blood).toHaveTextContent('10月31日（土）')
    expect(blood).toHaveTextContent('9:30〜11:45／13:00〜15:30')
    expect(blood).toHaveTextContent('総務課前')
    expect(blood).not.toHaveTextContent('正面玄関前')
  })
  it('IE2の会場を教室・管理棟3階として検索できる', async () => {
    const user = userEvent.setup()
    render(<App pageId="booths" />)
    await user.type(screen.getByRole('searchbox'), 'IE2')
    const booth = screen.getByRole('button', {
      name: /IE2.*ボウリング.*詳細を見る/,
    })
    expect(booth).toHaveTextContent('教室・管理棟3階')
    await user.click(booth)
    expect(screen.getByRole('dialog')).toHaveTextContent('教室・管理棟3階')
    expect(screen.getByRole('dialog')).not.toHaveTextContent(
      '当日の案内をご確認',
    )
  })
})
