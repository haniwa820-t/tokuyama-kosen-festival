export const pages = [
  {
    id: 'home',
    path: '',
    title: '第52回 徳山高専 高専祭 2026 — Echo',
    label: 'ホーム',
    en: 'HOME',
    description: '2026年10月31日・11月1日。Echo — あの感動をもう一度。',
  },
  {
    id: 'schedule',
    path: 'schedule/',
    title: '2日間の予定',
    label: '日程',
    en: 'SCHEDULE',
    description: 'ステージ企画と日ごとのプログラム。後夜祭は在校生限定です。',
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
    description: '会場図、アクセス・駐車場、準備版パンフレットはこちらから。',
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
    description: '徳山高専への通常の交通案内と臨時駐車場の案内。',
    parent: 'guide',
  },
  {
    id: 'pamphlet',
    path: 'guide/pamphlet/',
    title: 'パンフレット',
    label: 'パンフレット',
    en: 'PAMPHLET',
    description: '現在の準備版PDF（全57ページ）を配布しています。',
    parent: 'guide',
  },
  {
    id: 'sponsors',
    path: 'sponsors/',
    title: 'スポンサー',
    label: 'スポンサー',
    en: 'SPONSORS',
    description:
      '準備版掲載企業の公式サイトへ。30枠のサンプルバナーを掲載しています。',
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
