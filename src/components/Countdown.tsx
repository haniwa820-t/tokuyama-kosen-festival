import { useSyncExternalStore } from 'react'
import { getCountdown } from '../lib/countdown'
function subscribe(callback: () => void) {
  const timer = window.setInterval(callback, 1000)
  return () => window.clearInterval(timer)
}
const snapshot = () => Math.floor(Date.now() / 1000) * 1000
const serverSnapshot = () => null
export default function Countdown() {
  const now = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const countdown = now === null ? null : getCountdown(now)
  return (
    <div className="countdown">
      <div className="container countdown-inner">
        <div>
          <p className="eyebrow">第52回 高専祭</p>
          <p className="countdown-label">{countdown?.label ?? '開幕まで'}</p>
        </div>
        {countdown?.status === 'countdown' ? (
          <div
            className="countdown-digits"
            aria-label={`${countdown.days}日 ${countdown.hours}時間 ${countdown.minutes}分 ${countdown.seconds}秒`}
            aria-live="off"
          >
            {[
              [countdown.days, '日'],
              [countdown.hours, '時間'],
              [countdown.minutes, '分'],
              [countdown.seconds, '秒'],
            ].map(([value, label]) => (
              <div key={label}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="countdown-date">
            {countdown === null
              ? '2026.10.31 SAT / 9:45 OPEN'
              : countdown.status === 'active'
                ? '会場マップをチェックして、さあ出発。'
                : 'ご来場ありがとうございました。'}
          </p>
        )}
      </div>
    </div>
  )
}
