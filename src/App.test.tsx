import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

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
    expect(document.querySelectorAll('#sponsor-banners article')).toHaveLength(
      83,
    )
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
      screen.getByText('星マークは、スタンプラリーのスタンプ設置場所です。'),
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
