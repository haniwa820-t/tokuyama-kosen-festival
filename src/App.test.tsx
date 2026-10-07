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
  it('開催日時・最低限の掲載項目・準備版資料を確認できる', () => {
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
    ).toHaveAttribute('href', '/tokuyama-kosen-festival/schedule/')
    expect(
      screen.getByRole('link', { name: /準備版PDFをダウンロード/ }),
    ).toHaveAttribute(
      'href',
      '/tokuyama-kosen-festival/documents/pamphlet-preparation.pdf',
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
  it('30枚のサンプル画像から企業の公式サイトへ移動できる', () => {
    render(<App pageId="sponsors" />)
    const links = within(
      document.getElementById('sponsor-banners')!,
    ).getAllByRole('link')
    expect(links).toHaveLength(30)
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('href')).toMatch(/^https:\/\//)
      expect(within(link).getByRole('img')).toHaveAttribute(
        'alt',
        expect.stringContaining('サンプル'),
      )
    }
  })
  it('存在しないページは戻り先を示す', () => {
    render(<App pageId="not-found" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'ページが見つかりません',
    )
  })
})
