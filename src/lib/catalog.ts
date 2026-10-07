export interface Booth {
  id: string
  organization: string
  title: string
  category: string
  venue: string
  poster: string
  thumbnail: string
  note?: string
}
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`
}
const normalize = (value: string) =>
  value.normalize('NFKC').toLocaleLowerCase('ja').trim()
export function filterBooths(
  items: Booth[],
  category: string,
  query: string,
): Booth[] {
  const keyword = normalize(query)
  return items.filter(
    (item) =>
      (category === 'all' || item.category === category) &&
      normalize(`${item.organization} ${item.title} ${item.venue}`).includes(
        keyword,
      ),
  )
}
