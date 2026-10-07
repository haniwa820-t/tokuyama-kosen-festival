import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Reveal from './Reveal'
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
describe('読みやすさを保つフェードイン', () => {
  it('画面に入った要素を表示し、終了時に観測を解除する', () => {
    let callback: IntersectionObserverCallback
    const observe = vi.fn(),
      unobserve = vi.fn(),
      disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb
        }
        observe = observe
        unobserve = unobserve
        disconnect = disconnect
      },
    )
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ top: 2000 } as DOMRect)
    const view = render(
      <Reveal>
        <section className="section">内容</section>
      </Reveal>,
    )
    const section = view.getByText('内容')
    expect(section).toHaveAttribute('data-motion', 'pending')
    act(() =>
      callback!(
        [
          { target: section, isIntersecting: false },
          { target: section, isIntersecting: true },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    )
    expect(section).toHaveAttribute('data-motion', 'visible')
    expect(unobserve).toHaveBeenCalledWith(section)
    view.unmount()
    expect(disconnect).toHaveBeenCalled()
    rect.mockRestore()
  })
  it('動きを減らす設定では隠さない', () => {
    const observer = vi.fn()
    vi.stubGlobal('IntersectionObserver', observer)
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const view = render(
      <Reveal>
        <section className="section">内容</section>
      </Reveal>,
    )
    expect(view.getByText('内容')).not.toHaveAttribute('data-motion')
    expect(observer).not.toHaveBeenCalled()
  })
  it('画面外の案内へキーボードで移動したときは内容を表示する', () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 2000,
    } as DOMRect)
    const view = render(
      <Reveal>
        <section className="section">
          <a href="#next">次の案内</a>
        </section>
      </Reveal>,
    )
    const link = view.getByText('次の案内')
    expect(link.closest('section')).toHaveAttribute('data-motion', 'pending')
    act(() => link.focus())
    expect(link.closest('section')).toHaveAttribute('data-motion', 'visible')
  })
  it('閲覧中に動きを減らす設定へ変えた場合も内容をすぐ表示する', () => {
    const media = Object.assign(new EventTarget(), { matches: false })
    const disconnect = vi.fn()
    vi.stubGlobal('matchMedia', () => media)
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect = disconnect
      },
    )
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 2000,
    } as DOMRect)
    const view = render(
      <Reveal>
        <section className="section">内容</section>
      </Reveal>,
    )
    expect(view.getByText('内容')).toHaveAttribute('data-motion', 'pending')
    act(() => {
      media.matches = true
      media.dispatchEvent(new Event('change'))
    })
    expect(view.getByText('内容')).not.toHaveAttribute('data-motion', 'pending')
    expect(disconnect).toHaveBeenCalled()
  })
})
