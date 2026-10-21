import festival from '../data/festival.json'
import { pageById } from './pages'

// Both hosting providers point search engines to this primary public site.
export const canonicalSiteUrl = 'https://tokuyama-kosen-festival.pages.dev/'

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
