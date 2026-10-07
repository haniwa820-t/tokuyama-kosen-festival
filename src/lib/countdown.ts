import festival from '../data/festival.json'
const days = festival.days.map((d) => ({
  start: Date.parse(
    `${festival.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}T${d.opensAt}:00+09:00`,
  ),
  end: Date.parse(
    `${festival.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}T${d.closesAt}:00+09:00`,
  ),
}))
export function getCountdown(now: number) {
  const active = days.some((d) => now >= d.start && now < d.end)
  const index = days.findIndex((d) => d.start > now)
  const status = active ? 'active' : index < 0 ? 'ended' : 'countdown'
  const total =
    status === 'countdown'
      ? Math.max(0, Math.floor((days[index].start - now) / 1000))
      : 0
  return {
    status,
    label: active
      ? '高専祭、開催中！'
      : index < 0
        ? '高専祭は終了しました'
        : index === 0
          ? '開幕まで'
          : '2日目の開始まで',
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}
