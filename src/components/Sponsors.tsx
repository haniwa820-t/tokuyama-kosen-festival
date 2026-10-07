import banners from '../data/sponsor-banners.json'
import { assetUrl } from '../lib/catalog'
import { pageUrl } from '../lib/pages'
export default function Sponsors({ compact = false }: { compact?: boolean }) {
  return (
    <section id="sponsors" className="container section sponsor-section">
      <div className="section-title">
        <p className="eyebrow">WITH OUR COMMUNITY</p>
        <h2>{compact ? 'スポンサー' : 'スポンサー掲載サンプル'}</h2>
      </div>
      <p className="section-lead">
        準備版パンフレット掲載企業の公式サイトをご紹介します。バナーは画像差し替え用のサンプルです。
      </p>
      <div id="sponsor-banners" className="sponsor-grid">
        {(compact ? banners.slice(0, 6) : banners).map((b) => (
          <a
            key={b.id}
            className="sponsor-card"
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${b.name}の公式サイト（新しいタブ）`}
          >
            <img
              src={assetUrl(b.image)}
              alt={`${b.name}のサンプルバナー。正式な企業ロゴではありません。`}
              width="720"
              height="300"
              loading="lazy"
            />
            <span>
              {b.name}
              <b aria-hidden="true">↗</b>
            </span>
          </a>
        ))}
      </div>
      {compact ? (
        <a className="button more" href={pageUrl('sponsors')}>
          30枠のスポンサーを見る ↗
        </a>
      ) : (
        <p className="note">
          掲載順に順位の意味はありません。正式な広告画像・掲載企業の確定版を受領したら差し替えます。
        </p>
      )}
    </section>
  )
}
