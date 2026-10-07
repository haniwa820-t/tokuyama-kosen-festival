import { useEffect, useRef, useState } from 'react'
import booths from '../data/booths.json'
import { useFavorites } from '../lib/favorites'
import { assetUrl, filterBooths, type Booth } from '../lib/catalog'
const categories = [
  ['all', 'すべて'],
  ['food', '飲食'],
  ['experience', '体験'],
  ['exhibit', '展示'],
]
function PosterDialog({ booth, close }: { booth: Booth; close: () => void }) {
  const dialog = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab') {
        const nodes =
          dialog.current!.querySelectorAll<HTMLElement>('button, a[href]')
        const first = nodes[0],
          last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', keyboard)
    return () => {
      document.removeEventListener('keydown', keyboard)
      document.body.style.overflow = previous
      opener.focus()
    }
  }, [close])
  return (
    <div
      className="dialog-backdrop"
      data-testid="dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        ref={dialog}
        className="poster-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="poster-title"
      >
        <button
          className="dialog-close"
          onClick={close}
          aria-label="詳細を閉じる"
        >
          閉じる ×
        </button>
        <div className="dialog-copy">
          <p className="eyebrow">{booth.organization}</p>
          <h2 id="poster-title">{booth.title}</h2>
          <p>{booth.venue}</p>
          {booth.note && <p className="note">{booth.note}</p>}
        </div>
        <img
          src={assetUrl(booth.poster)}
          alt={`${booth.organization}「${booth.title}」の企画ポスター`}
        />
        <a href={assetUrl(booth.poster)} target="_blank" rel="noreferrer">
          ポスターを別のタブで開く ↗
        </a>
      </div>
    </div>
  )
}
export default function BoothCatalog() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState<Booth | null>(null)
  const [savedOnly, setSavedOnly] = useState(false)
  const [notice, setNotice] = useState('')
  const favorites = useFavorites()
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])
  const filtered = filterBooths(booths, category, query).filter(
    (b) => !savedOnly || favorites.ids.includes(b.id),
  )
  const shown = expanded ? filtered : filtered.slice(0, 8)
  function reset() {
    setSavedOnly(false)
    setCategory('all')
    setQuery('')
    setExpanded(false)
  }
  function save(b: Booth) {
    const wasSaved = favorites.ids.includes(b.id)
    const persisted = favorites.toggle(b.id)
    setNotice(
      persisted
        ? `${b.title}を${wasSaved ? '保存から外しました' : '行きたい企画に保存しました'}`
        : 'この画面でのみ保存しました（端末への保存が許可されていません）',
    )
  }
  return (
    <>
      <div className="discovery-tools">
        <div>
          <p className="eyebrow">YOUR FESTIVAL PLAN</p>
          <p>気になる企画は♡で保存。迷ったら、おまかせ。</p>
        </div>
        <div className="discovery-actions">
          <button
            className="saved-filter"
            aria-pressed={savedOnly}
            onClick={() => {
              setSavedOnly(!savedOnly)
              setExpanded(false)
            }}
          >
            ♡ 保存した企画だけ ({favorites.ids.length})
          </button>
          <button
            className="surprise-button"
            aria-label="おまかせで1企画選ぶ"
            disabled={filtered.length === 0}
            onClick={() =>
              setSelected(filtered[Math.floor(Math.random() * filtered.length)])
            }
          >
            ✦ おまかせで1企画
          </button>
        </div>
      </div>
      <p className="small">
        保存内容はこの端末のブラウザーに残ります。検索条件の中から、おまかせで1件選びます。
      </p>
      <div className="catalog-controls">
        <div className="filters" aria-label="企画の分類">
          {categories.map(([value, label]) => (
            <button
              key={value}
              aria-pressed={category === value}
              onClick={() => {
                setCategory(value)
                setExpanded(false)
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="search">
          企画を探す
          <input
            type="search"
            value={query}
            placeholder="店名・団体・会場で検索"
            onChange={(e) => {
              setQuery(e.target.value)
              setExpanded(false)
            }}
          />
        </label>
      </div>
      <div className="catalog-meta">
        <p aria-live="polite">{filtered.length}件の企画</p>
        <button className="text-button" onClick={reset}>
          検索条件をリセット
        </button>
      </div>
      {filtered.length === 0 && (
        <p className="empty">該当する企画が見つかりませんでした。</p>
      )}
      <div className="booth-grid">
        {shown.map((b) => (
          <article className="booth-card" key={b.id}>
            <button
              className="booth"
              key={b.id}
              onClick={() => setSelected(b)}
              aria-label={`${b.organization} ${b.title} 詳細を見る`}
            >
              <div className="booth-art">
                <img
                  src={assetUrl(b.thumbnail)}
                  alt=""
                  loading="lazy"
                  width="440"
                  height="620"
                />
                <span>詳細を見る ↗</span>
              </div>
              <p>{b.organization}</p>
              <h3>{b.title}</h3>
              <div className="booth-place">{b.venue}</div>
            </button>
            <button
              className="favorite-button"
              onClick={() => save(b)}
              aria-label={`${b.organization} ${b.title} ${favorites.ids.includes(b.id) ? '行きたい企画から外す' : '行きたい企画に保存'}`}
              aria-pressed={favorites.ids.includes(b.id)}
            >
              {favorites.ids.includes(b.id) ? '♥' : '♡'}
              <span>
                {favorites.ids.includes(b.id) ? '保存済み' : '行きたい'}
              </span>
            </button>
          </article>
        ))}
      </div>
      {!expanded && filtered.length > 8 && (
        <button className="button more" onClick={() => setExpanded(true)}>
          残り{filtered.length - 8}件を見る ＋
        </button>
      )}
      <div
        role="status"
        aria-live="polite"
        className={notice ? 'favorite-notice is-shown' : 'favorite-notice'}
      >
        {notice}
      </div>
      {selected && (
        <PosterDialog booth={selected} close={() => setSelected(null)} />
      )}
    </>
  )
}
