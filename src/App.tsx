import { useState } from 'react'
import festival from './data/festival.json'
import { assetUrl } from './lib/catalog'
import { pageById, pageUrl, sectionUrl } from './lib/pages'
import Countdown from './components/Countdown'
import Sponsors from './components/Sponsors'
import Reveal from './components/Reveal'
import {
  TopSection,
  ThemeSection,
  ScheduleSection,
  MainEventsSection,
  DepartmentsSection,
  BoothsSection,
  RelatedEventsSection,
  CampusMapSection,
  AccessSection,
  PamphletSection,
  NewsSection,
  SponsorNames,
} from './pages/ContentSections'
const nav = [
  ['schedule', '日程'],
  ['events', '企画'],
  ['booths', '模擬店'],
  ['guide', '来場ガイド'],
  ['sponsors', 'スポンサー'],
]
function GuideCards() {
  return (
    <div className="guide-grid">
      {['map', 'access', 'pamphlet'].map((id) => {
        const p = pageById(id)
        return (
          <a className="guide-card" href={pageUrl(id)} key={id}>
            <p className="eyebrow">{p.en}</p>
            <h2>
              {p.title} <span>↗</span>
            </h2>
            <p>{p.description}</p>
          </a>
        )
      })}
    </div>
  )
}
function PageHeading({ pageId }: { pageId: string }) {
  const page = pageById(pageId)
  const parent = pageById(page.parent!)
  return (
    <div className="page-heading container">
      <nav className="breadcrumbs" aria-label="パンくず">
        <a href={pageUrl('home')}>ホーム</a>
        {parent.id !== 'home' && (
          <>
            <span aria-hidden="true">/</span>
            <a href={pageUrl(parent.id)}>{parent.label}</a>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{page.label}</span>
      </nav>
      <p className="eyebrow">{page.en}</p>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
    </div>
  )
}
function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <p className="footer-echo" aria-hidden="true">
            Echo.
          </p>
          <p>第52回 徳山高専 高専祭</p>
        </div>
        <div>
          <p>お問い合わせ</p>
          <a className="phone" href="tel:0834296235">
            0834-29-6235
          </a>
          <p className="small">徳山工業高等専門学校 学生支援係</p>
          <a
            href="https://www.tokuyama.ac.jp/"
            target="_blank"
            rel="noreferrer"
          >
            学校公式サイト ↗
          </a>
        </div>
      </div>
      <nav className="container footer-nav" aria-label="フッターメニュー">
        {[
          'home',
          'schedule',
          'events',
          'booths',
          'map',
          'access',
          'pamphlet',
          'sponsors',
        ].map((id) => (
          <a href={pageUrl(id)} key={id}>
            {pageById(id).label}
          </a>
        ))}
      </nav>
      <div className="container footer-bottom">
        <span>2026 TOKUYAMA KOSEN FESTIVAL</span>
        <a href="#page-top">ページの先頭へ ↑</a>
      </div>
    </footer>
  )
}
export default function App({ pageId = 'home' }: { pageId?: string }) {
  const [menu, setMenu] = useState(false)
  const page = pageById(pageId)
  return (
    <Reveal>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <header id="page-top" className="header">
        <a className="brand" href={pageUrl('home')}>
          <span className="brand-mark" aria-hidden="true">
            e.
          </span>
          <span>
            徳山高専 高専祭<small>52nd · 2026</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          aria-label={menu ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={menu}
          aria-controls="main-nav"
          onClick={() => setMenu(!menu)}
        >
          {menu ? 'CLOSE ×' : 'MENU ＋'}
        </button>
        <nav
          id="main-nav"
          aria-label="メインメニュー"
          className={menu ? 'nav is-open' : 'nav'}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMenu(false)
          }}
        >
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={pageUrl(id)}
              aria-current={page.id === id ? 'page' : undefined}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-pdf"
            href={pageUrl('pamphlet')}
            onClick={() => setMenu(false)}
          >
            パンフレット ↗
          </a>
        </nav>
      </header>
      <main id="main">
        {page.id !== 'home' && <PageHeading pageId={page.id} />}
        {page.id === 'home' && (
          <>
            <TopSection />
            <Countdown />
            <div className="quick-links container">
              <a href={pageUrl('booths')}>
                <span>01 / EAT & PLAY</span>模擬店・展示・体験 <b>↗</b>
              </a>
              <a href={pageUrl('map')}>
                <span>02 / FIND YOUR WAY</span>会場マップ <b>↗</b>
              </a>
              <a href={pageUrl('pamphlet')}>
                <span>03 / TAKE A LOOK</span>パンフレット <b>↗</b>
              </a>
            </div>
            <ThemeSection />
            <section className="container section home-programs">
              <div className="section-title">
                <p className="eyebrow">PLAN YOUR TWO DAYS</p>
                <h2>今年の高専祭を、見つけよう。</h2>
              </div>
              <div className="guide-grid">
                <a className="guide-card" href={pageUrl('schedule')}>
                  <p className="eyebrow">SCHEDULE</p>
                  <h3>2日間の予定 ↗</h3>
                  <p>ステージと、日ごとの開催企画をチェック。</p>
                </a>
                <a className="guide-card" href={pageUrl('events')}>
                  <p className="eyebrow">PROGRAMS</p>
                  <h3>高専祭の企画 ↗</h3>
                  <p>コーンホール、学科企画、周南ロボコン。</p>
                </a>
                <a className="guide-card" href={pageUrl('guide')}>
                  <p className="eyebrow">VISITOR GUIDE</p>
                  <h3>来場ガイド ↗</h3>
                  <p>会場図とアクセスをまとめて確認。</p>
                </a>
              </div>
              <a
                className="text-link"
                href={assetUrl(festival.pamphlet.path)}
                download
              >
                準備版PDFをダウンロード ↓
              </a>
            </section>
            <NewsSection />
            <Sponsors compact />
          </>
        )}
        {page.id === 'schedule' && <ScheduleSection />}
        {page.id === 'events' && (
          <>
            <div className="container child-nav">
              <a className="button" href={pageUrl('booths')}>
                模擬店・展示・体験を探す ↗
              </a>
              <a href={sectionUrl('departments')}>学科企画 ↓</a>
              <a href={sectionUrl('related-events')}>併催企画 ↓</a>
            </div>
            <MainEventsSection />
            <DepartmentsSection />
            <RelatedEventsSection />
          </>
        )}
        {page.id === 'booths' && <BoothsSection />}
        {page.id === 'guide' && (
          <section id="guide" className="container section">
            <GuideCards />
            <p className="note">
              会場図とパンフレットは準備版です。バス時刻表・駐車場の詳しい運用は準備中です。
            </p>
          </section>
        )}
        {page.id === 'map' && <CampusMapSection />}
        {page.id === 'access' && <AccessSection />}
        {page.id === 'pamphlet' && <PamphletSection />}
        {page.id === 'sponsors' && (
          <>
            <Sponsors />
            <div className="container sponsor-directory">
              <SponsorNames />
            </div>
          </>
        )}
        {page.id === 'not-found' && (
          <div className="container section">
            <a className="button" href={pageUrl('home')}>
              ホームへ戻る →
            </a>
          </div>
        )}
        {['map', 'access', 'pamphlet'].includes(page.id) && (
          <aside
            className="container sibling-nav"
            aria-label="来場ガイドの関連ページ"
          >
            <p className="eyebrow">VISITOR GUIDE</p>
            <GuideCards />
          </aside>
        )}
      </main>
      <Footer />
    </Reveal>
  )
}
