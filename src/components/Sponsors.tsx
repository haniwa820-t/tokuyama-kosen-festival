import banners from '../data/sponsor-banners.json'
import { assetUrl } from '../lib/catalog'
import { pageUrl } from '../lib/pages'

export default function Sponsors({ compact = false }: { compact?: boolean }) {
  const tiers = compact ? ['major'] : ['major', 'full', 'quarter', 'eighth']
  return (
    <section id="sponsors" className="container section sponsor-section">
      <div className="section-title">
        <h2>スポンサー</h2>
      </div>
      {compact && (
        <p className="section-lead">
          高専祭にご協賛いただいた企業・団体をご紹介します。
        </p>
      )}
      <div id="sponsor-banners">
        {tiers.map((tier) => (
          <div
            key={tier}
            className={`sponsor-group sponsor-grid sponsor-grid--${tier}`}
            data-sponsor-tier={tier}
          >
            {banners
              .filter((b) => b.tier === tier)
              .map((b) => {
                const content = (
                  <>
                    <img
                      src={assetUrl(b.image)}
                      alt={`${b.name}の${b.imageKind === 'logo' ? 'ロゴマーク' : '広告'}`}
                      width={b.width}
                      height={b.height}
                      loading="lazy"
                    />
                    <span>
                      {b.name}
                      {b.url && <b aria-hidden="true">↗</b>}
                    </span>
                  </>
                )
                return b.url ? (
                  <a
                    key={b.id}
                    className="sponsor-card"
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${b.name}の公式サイト（新しいタブ）`}
                  >
                    {content}
                  </a>
                ) : (
                  <article key={b.id} className="sponsor-card">
                    {content}
                  </article>
                )
              })}
          </div>
        ))}
      </div>
      {compact && (
        <a className="button more" href={pageUrl('sponsors')}>
          すべてのスポンサーを見る ↗
        </a>
      )}
    </section>
  )
}
