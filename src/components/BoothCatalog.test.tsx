import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BoothCatalog from './BoothCatalog'
describe('行きたい企画とおまかせ', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('保存して絞り込み、再表示しても保存が残る', async () => {
    const user = userEvent.setup()
    const view = render(<BoothCatalog />)
    const save = screen.getAllByRole('button', {
      name: /行きたい企画に保存/,
    })[0]
    await user.click(save)
    expect(save).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: /保存した企画だけ/ }))
    expect(screen.getAllByRole('button', { name: /詳細を見る/ })).toHaveLength(
      1,
    )
    view.unmount()
    render(<BoothCatalog />)
    expect(
      screen.getAllByRole('button', { name: /行きたい企画から外す/ }),
    ).toHaveLength(1)
    await user.click(
      screen.getAllByRole('button', { name: /行きたい企画から外す/ })[0],
    )
    expect(screen.getByRole('status')).toHaveTextContent('保存から外しました')
  })
  it('壊れた保存データでも企画を探せる', () => {
    localStorage.setItem('echo-2026-favorites', 'broken')
    render(<BoothCatalog />)
    expect(screen.getAllByRole('button', { name: /詳細を見る/ })).toHaveLength(
      8,
    )
  })
  it('絞り込み結果からおまかせで選び、結果なしでは選べない', async () => {
    const user = userEvent.setup()
    render(<BoothCatalog />)
    await user.type(screen.getByRole('searchbox'), 'ワッフル')
    await user.click(
      screen.getByRole('button', { name: 'おまかせで1企画選ぶ' }),
    )
    expect(
      within(screen.getByRole('dialog')).getByRole('heading'),
    ).toHaveTextContent('ワッフル')
    await user.keyboard('{Escape}')
    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), '不存在')
    expect(
      screen.getByRole('button', { name: 'おまかせで1企画選ぶ' }),
    ).toBeDisabled()
  })
  it('保存が許可されていなくても画面内では保存できる', async () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })
    const user = userEvent.setup()
    render(<BoothCatalog />)
    await user.click(
      screen.getAllByRole('button', { name: /行きたい企画に保存/ })[0],
    )
    expect(screen.getByRole('status')).toHaveTextContent('この画面でのみ保存')
    spy.mockRestore()
  })
})
