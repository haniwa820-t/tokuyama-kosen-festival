export const pages = [
  {
    id: 'home',
    path: '',
    title: '第52回 徳山高専 高専祭 2026 — Echo',
    label: 'ホーム',
    en: 'HOME',
    description:
      '徳山工業高等専門学校（山口県周南市）の第52回高専祭「Echo」。2026年10月31日9:45〜15:30・11月1日9:45〜15:00開催。ステージ日程、模擬店、学科企画、会場マップ、防長バス時刻表、パンフレットをご案内します。',
  },
  {
    id: 'schedule',
    path: 'schedule/',
    title: '2日間の予定',
    label: '日程',
    en: 'SCHEDULE',
    description: 'ステージ企画と日ごとのプログラム。',
    parent: 'home',
  },
  {
    id: 'events',
    path: 'events/',
    title: '高専祭の企画',
    label: '企画',
    en: 'PROGRAMS',
    description: 'メイン企画、3学科の企画、周南ロボコンと実習工場の案内。',
    parent: 'home',
  },
  {
    id: 'booths',
    path: 'events/booths/',
    title: '模擬店・展示・体験',
    label: '模擬店',
    en: 'EAT / PLAY / DISCOVER',
    description:
      '32件の企画を探す。行きたい企画を保存したり、おまかせで選んだり。',
    parent: 'events',
  },
  {
    id: 'guide',
    path: 'guide/',
    title: '来場ガイド',
    label: '来場ガイド',
    en: 'VISITOR GUIDE',
    description: '会場図、アクセス・駐車場、パンフレットはこちらから。',
    parent: 'home',
  },
  {
    id: 'map',
    path: 'guide/map/',
    title: '会場マップ',
    label: '会場マップ',
    en: 'CAMPUS MAP',
    description: '屋外・屋内の企画と会場の位置を確認できます。',
    parent: 'guide',
  },
  {
    id: 'access',
    path: 'guide/access/',
    title: 'アクセス・駐車場',
    label: 'アクセス・駐車場',
    en: 'ACCESS / PARKING',
    description:
      '開催日の防長バス時刻表と、徳山高専への交通・臨時駐車場の案内。',
    parent: 'guide',
  },
  {
    id: 'pamphlet',
    path: 'guide/pamphlet/',
    title: 'パンフレット',
    label: 'パンフレット',
    en: 'PAMPHLET',
    description:
      '第52回徳山高専高専祭のパンフレットPDF（全48ページ）です。日程、会場図、バス時刻表を確認できます。',
    parent: 'guide',
  },
  {
    id: 'sponsors',
    path: 'sponsors/',
    title: 'スポンサー',
    label: 'スポンサー',
    en: 'SPONSORS',
    description:
      '高専祭にご協賛いただいた企業・団体の皆様の広告を掲載するとともに、一部の協賛企業・団体の公式サイトをご紹介します。',
    parent: 'home',
  },
  {
    id: 'not-found',
    path: '404.html',
    title: 'ページが見つかりません',
    label: '404',
    en: 'NOT FOUND',
    description: 'メニューから目的のページを探してください。',
    parent: 'home',
  },
]
export function pageById(id: string) {
  return pages.find((p) => p.id === id) ?? pages[pages.length - 1]
}
export function pageUrl(id: string) {
  return `${import.meta.env.BASE_URL}${pageById(id).path}`
}
export function getPage(pathname: string) {
  const path = pathname
    .replace(import.meta.env.BASE_URL, '')
    .replace(/^\//, '')
    .replace(/index\.html$/, '')
  return (
    pages.find((p) => p.path === path || p.path === `${path}/`) ??
    pageById('not-found')
  )
}
const sectionPages: Record<string, string> = {
  top: 'home',
  theme: 'home',
  news: 'home',
  schedule: 'schedule',
  'main-events': 'events',
  departments: 'events',
  'related-events': 'events',
  'stamp-rally': 'events',
  booths: 'booths',
  'campus-map': 'map',
  access: 'access',
  parking: 'access',
  pamphlet: 'pamphlet',
  sponsors: 'sponsors',
}
export function sectionUrl(id: string) {
  return `${pageUrl(sectionPages[id])}#${id}`
}
