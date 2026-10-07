import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import Countdown from './Countdown'
afterEach(() => vi.useRealTimers())
describe('開催時計の表示', () => {
  it('静的HTMLには固定した開幕日時を含み、端末の時計に依存しない', () => {
    expect(renderToString(<Countdown />)).toContain(
      '2026.10.31 SAT / 9:45 OPEN',
    )
  })
  it('残り秒数を更新し、開幕時に開催中へ切り替える', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-31T09:44:58+09:00'))
    const view = render(<Countdown />)
    expect(screen.getByLabelText('0日 0時間 0分 2秒')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByText('高専祭、開催中！')).toBeInTheDocument()
    view.unmount()
  })
  it('開催後は終了表示になる', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-02T09:00:00+09:00'))
    render(<Countdown />)
    expect(screen.getByText('高専祭は終了しました')).toBeInTheDocument()
  })
})
