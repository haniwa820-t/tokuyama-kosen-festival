import { useSyncExternalStore } from 'react'
import booths from '../data/booths.json'
const key = 'echo-2026-favorites'
const event = 'echo-favorites-updated'
let temporary: string | null = null
function snapshot() {
  if (temporary !== null) return temporary
  try {
    return localStorage.getItem(key) ?? '[]'
  } catch {
    return '[]'
  }
}
function subscribe(callback: () => void) {
  const storage = (e: StorageEvent) => {
    if (e.key === key || e.key === null) {
      temporary = null
      callback()
    }
  }
  window.addEventListener('storage', storage)
  window.addEventListener(event, callback)
  return () => {
    window.removeEventListener('storage', storage)
    window.removeEventListener(event, callback)
  }
}
export function parseFavorites(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter(
          (id): id is string =>
            typeof id === 'string' && booths.some((b) => b.id === id),
        )
      : []
  } catch {
    return []
  }
}
export function useFavorites() {
  const value = useSyncExternalStore(subscribe, snapshot, () => '[]')
  const ids = parseFavorites(value)
  function toggle(id: string) {
    const next = ids.includes(id)
      ? ids.filter((item) => item !== id)
      : [...ids, id]
    const serialized = JSON.stringify(next)
    let persisted = true
    try {
      localStorage.setItem(key, serialized)
      temporary = null
    } catch {
      temporary = serialized
      persisted = false
    }
    window.dispatchEvent(new Event(event))
    return persisted
  }
  return { ids, toggle }
}
