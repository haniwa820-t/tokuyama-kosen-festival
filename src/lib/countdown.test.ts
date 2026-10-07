import { describe, expect, it } from 'vitest'
import { getCountdown } from './countdown'
describe('日本時間での開催カウントダウン', () => {
  it('開幕前は日・時・分・秒を返す', () => {
    expect(getCountdown(Date.parse('2026-10-30T09:44:58+09:00'))).toMatchObject(
      {
        status: 'countdown',
        label: '開幕まで',
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 2,
      },
    )
  })
  it('両日の開始と終了、夜間、開催後を区別する', () => {
    expect(getCountdown(Date.parse('2026-10-31T09:45:00+09:00')).status).toBe(
      'active',
    )
    expect(getCountdown(Date.parse('2026-10-31T15:30:00+09:00')).label).toBe(
      '2日目の開始まで',
    )
    expect(getCountdown(Date.parse('2026-11-01T09:45:00+09:00')).status).toBe(
      'active',
    )
    expect(getCountdown(Date.parse('2026-11-01T15:00:00+09:00')).status).toBe(
      'ended',
    )
  })
})
