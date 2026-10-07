import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Reveal from './Reveal'
afterEach(() => vi.unstubAllGlobals())
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
})
