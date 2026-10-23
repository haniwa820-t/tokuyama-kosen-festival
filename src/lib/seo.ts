import festival from '../data/festival.json'
import { pageById } from './pages'

// Both hosting providers point search engines to this primary public site.
export const canonicalSiteUrl = 'https://tokuyama-kosen-festival.pages.dev/'

// Search descriptions are separate from the short introductions shown on screen.
const searchDescriptions: Record<string, string> = {
  home: '2026年10月31日（土）・11月1日（日）開催。山口県周南市の第52回徳山高専高専祭「Echo」の公式サイトです。企画・模擬店・ステージ日程・アクセス・駐車場・会場マップ・パンフレットをご案内します。',
  schedule:
    '徳山高専 高専祭2026「Echo」のステージ日程。10月31日・11月1日の吹奏楽、カラオケ、クイズ、ライブなどの開始・終了時刻と、11月1日の後夜祭をご案内します。',
  events:
    '徳山高専 高専祭2026の企画をご紹介。メイン企画のコーンホール、3学科の展示・体験、周南ロボコン、実習工場開放、スタンプラリーの内容・日程・会場を確認できます。',
  booths:
    '徳山高専 高専祭2026の模擬店・展示・体験、全32件をご紹介。飲食や体験などの分類・キーワードで検索し、企画の内容・会場・ポスターを確認できます。行きたい企画の保存にも対応。',
  guide:
    '2026年10月31日・11月1日の徳山高専高専祭へお越しの方へ。会場マップ、アクセス・駐車場、防長バス時刻表、パンフレットPDFへのリンクをまとめています。',
  map: '徳山高専 高専祭2026の会場マップ。校内全体図と屋内・屋外の地図9枚で、模擬店・展示・体験の場所を確認できます。星マークはスタンプラリーのスタンプ設置場所です。',
  access:
    '徳山高専 高専祭2026へのアクセス・駐車場のご案内。会場は山口県周南市の徳山工業高等専門学校。開催日の防長バス時刻表、後夜祭後のバス、臨時駐車場の案内を掲載しています。',
  pamphlet:
    '徳山高専 高専祭2026「Echo」のパンフレットPDFをダウンロードできます。全48ページ・約12.2 MB。ステージ日程、模擬店・学科企画、会場図、バス時刻表などを掲載しています。',
  sponsors:
    '第52回徳山高専 高専祭2026にご協賛いただいた企業・団体の皆様をご紹介します。広告と協賛一覧を掲載し、一部の協賛企業・団体の公式サイトへリンクしています。',
}

export function pageMetadata(pageId: string) {
  const page = pageById(pageId)
  return {
    title:
      page.id === 'home'
        ? '徳山高専 高専祭2026｜10月31日・11月1日開催【第52回】'
        : `${page.title}｜徳山高専 高専祭2026【第52回】`,
    description: searchDescriptions[page.id] ?? page.description,
    canonical: canonicalSiteUrl + page.path,
  }
}

export function structuredData(pageId: string) {
  const page = pageById(pageId)
  const graph: Record<string, unknown>[] = []
  if (page.id === 'home') {
    const first = festival.days[0]
    const last = festival.days[festival.days.length - 1]
    const dateTime = (day: typeof first, time: string) =>
      `${festival.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}T${time}:00+09:00`
    graph.push(
      {
        '@type': 'WebSite',
        name: '徳山高専 高専祭2026',
        alternateName: '徳山工業高等専門学校 第52回高専祭',
        url: canonicalSiteUrl,
        inLanguage: 'ja',
      },
      {
        '@type': 'Event',
        name: '第52回 徳山高専 高専祭「Echo」',
        description:
          '徳山工業高等専門学校の高専祭。模擬店、ステージ企画、学科企画、スタンプラリーを開催します。',
        startDate: dateTime(first, first.opensAt),
        endDate: dateTime(last, last.closesAt),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: festival.schoolName,
          address: {
            '@type': 'PostalAddress',
            postalCode: '745-8585',
            addressRegion: '山口県',
            addressLocality: '周南市',
            streetAddress: '学園台',
            addressCountry: 'JP',
          },
        },
        image: `${canonicalSiteUrl}images/main-poster.webp`,
        url: canonicalSiteUrl,
      },
    )
  } else if (page.id !== 'not-found') {
    const trail = [page]
    let current = page
    while (current.parent) {
      current = pageById(current.parent)
      trail.unshift(current)
    }
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: canonicalSiteUrl + item.path,
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029')
}
