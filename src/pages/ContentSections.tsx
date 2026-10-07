import festival from '../data/festival.json'
import departments from '../data/departments.json'
import sponsors from '../data/sponsors.json'
import { assetUrl } from '../lib/catalog'
import { sectionUrl } from '../lib/pages'
import BoothCatalog from '../components/BoothCatalog'
import Schedule from '../components/Schedule'
function SectionTitle({
  number,
  en,
  children,
}: {
  number: string
  en: string
  children: React.ReactNode
}) {
  return (
    <div className="section-title">
      <p className="eyebrow">
        <span>{number}</span> {en}
      </p>
      <h2>{children}</h2>
    </div>
  )
}

export function TopSection() {
  return (
    <section id="top" className="hero">
      <div className="hero-rings" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">TOKUYAMA KOSEN FESTIVAL 2026</p>
          <h1>
            第52回 <span>徳山高専 高専祭</span>
          </h1>
          <p className="echo-word" aria-hidden="true">
            Echo<span>.</span>
          </p>
          <p className="hero-tagline">あの感動をもう一度</p>
          <div className="hero-dates">
            {festival.days.map((d, index) => (
              <div className="hero-date" key={d.day}>
                <span className="day-label">DAY 0{index + 1}</span>
                <strong>
                  {d.month}
                  <span>/</span>
                  {String(d.day).padStart(2, '0')}
                </strong>
                <div>
                  <b>
                    {d.weekday === '土' ? 'SAT' : 'SUN'}
                    <span>（{d.weekday}）</span>
                  </b>
                  <time>
                    {d.opensAt} — {d.closesAt}
                  </time>
                </div>
              </div>
            ))}
          </div>
          <p className="hero-venue">
            徳山工業高等専門学校 <span>山口県周南市学園台</span>
          </p>
          <a className="button" href={sectionUrl('schedule')}>
            2日間の予定を見る <span>↓</span>
          </a>
        </div>
        <figure className="hero-poster">
          <img
            src={assetUrl('images/main-poster.webp')}
            alt="第52回徳山高専高専祭のメインポスター。青とピンクのEchoの図案。"
            width="1168"
            height="1568"
            fetchPriority="high"
          />
          <figcaption>第52回高専祭 メインビジュアル</figcaption>
        </figure>
      </div>
      <div className="hero-bottom">
        <span>10.31 — 11.01 / 2026</span>
        <a href={sectionUrl('theme')}>SCROLL TO EXPLORE ↓</a>
      </div>
    </section>
  )
}

export function ThemeSection() {
  return (
    <section id="theme" className="container theme section">
      <SectionTitle number="01" en="THEME">
        今年のテーマ
      </SectionTitle>
      <div className="theme-layout">
        <figure>
          <img
            src={assetUrl('images/echo-logo.webp')}
            alt="テーマロゴ Echo あの感動をもう一度"
            loading="lazy"
            width="1168"
            height="626"
          />
        </figure>
        <div>
          <h3>あの感動をもう一度</h3>
          <p>{festival.theme.description}</p>
          <a
            className="text-link"
            href={festival.theme.descriptionSource}
            target="_blank"
            rel="noreferrer"
          >
            実行委員会のテーマ紹介 ↗
          </a>
        </div>
      </div>
    </section>
  )
}

export function ScheduleSection() {
  return (
    <section id="schedule" className="schedule section">
      <div className="container">
        <SectionTitle number="02" en="TWO DAYS">
          ステージと開催企画
        </SectionTitle>
        <Schedule />
      </div>
    </section>
  )
}

export function MainEventsSection() {
  return (
    <section id="main-events" className="container section">
      <SectionTitle number="03" en="MAIN EVENT">
        メイン企画
      </SectionTitle>
      <div className="feature">
        <figure>
          <img
            src={assetUrl('images/cornhole.webp')}
            alt="メイン企画 コーンホールのポスター"
            width="564"
            height="795"
            loading="lazy"
          />
        </figure>
        <div>
          <p className="eyebrow">MAIN EVENT / 柔道場</p>
          <h3>コーンホール</h3>
          <p>
            袋を投げて、ボードの穴をねらう。初めてでも楽しめるコーンホールが、今年のメイン企画です。
          </p>
          <dl className="facts">
            <div>
              <dt>開催日</dt>
              <dd>10月31日（土）・11月1日（日）</dd>
            </div>
            <div>
              <dt>会場</dt>
              <dd>柔道場</dd>
            </div>
          </dl>
          <a className="text-link" href={sectionUrl('campus-map')}>
            会場マップで場所を確認 ↓
          </a>
        </div>
      </div>
      <aside id="stamp-rally" className="rally">
        <span aria-hidden="true">↺</span>
        <div>
          <p className="eyebrow">STAMP RALLY</p>
          <h3>会場をめぐる、スタンプラリー。</h3>
          <p>
            景品をご用意しています（先着順）。受付や参加方法の詳細は準備中です。
          </p>
        </div>
      </aside>
    </section>
  )
}

export function DepartmentsSection() {
  return (
    <section id="departments" className="departments section">
      <div className="container">
        <SectionTitle number="04" en="ME / IE / CA">
          高専ならではの学科企画
        </SectionTitle>
        <div className="department-list">
          {departments.map((d) => (
            <article className="department" key={d.id}>
              <span className="department-code">{d.code}</span>
              <div className="department-copy">
                <p className="eyebrow">{d.organization}</p>
                <h3>{d.title}</h3>
                <p>{d.description}</p>
                <p className="small">
                  {d.days}
                  <br />
                  {d.venue}
                </p>
              </div>
              <a
                href={assetUrl(`posters/department-${d.id}.webp`)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${d.organization}の企画ポスターを開く`}
              >
                <img
                  src={assetUrl(`posters/thumbnails/department-${d.id}.webp`)}
                  alt={`${d.title}のポスター`}
                  width="440"
                  height="620"
                  loading="lazy"
                />
                <span>ポスターを見る ↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BoothsSection() {
  return (
    <section id="booths" className="container section">
      <SectionTitle number="05" en="EAT / PLAY / DISCOVER">
        気になる企画を探そう
      </SectionTitle>
      <p className="section-lead">
        クラス、部活、研究室。それぞれの企画を、ポスターから探してみてください。
      </p>
      <BoothCatalog />
      <p className="note">
        会場表記は準備版の配置図に基づきます。IE2の会場階数は資料間で相違があるため確認中です。
      </p>
    </section>
  )
}

export function RelatedEventsSection() {
  return (
    <section id="related-events" className="related section">
      <div className="container">
        <SectionTitle number="06" en="SPECIAL PROGRAMS">
          併催企画
        </SectionTitle>
        <div className="related-grid">
          <article>
            <img
              src={assetUrl('images/robocon.webp')}
              alt="周南ロボコン2026 駆け抜けろ！でこぼこロードのポスター"
              loading="lazy"
              width="850"
              height="1210"
            />
            <p className="eyebrow">10月31日（土）9:30〜15:00</p>
            <h3>周南ロボコン2026</h3>
            <p>駆け抜けろ！でこぼこロード</p>
            <p className="small">
              創造演習スペース2
              <br />
              9:30〜11:30 受付・練習・予選 / 13:00〜15:00 本選
            </p>
            <a
              className="text-link"
              href="https://www.tokuyama.ac.jp/robocon/2026robocon/index.html"
              target="_blank"
              rel="noreferrer"
            >
              学校公式の案内 ↗
            </a>
          </article>
          <article>
            <img
              src={assetUrl('images/factory.webp')}
              alt="実習工場開放となつかしの機械展示の案内"
              loading="lazy"
              width="864"
              height="1136"
            />
            <p className="eyebrow">両日 10:00〜15:00</p>
            <h3>実習工場開放</h3>
            <p>実習工場で、機械加工の様子を見学できます。</p>
            <p className="small">
              なつかしの機械展示：11月1日（日）10:00〜15:00
              <br />
              教室・管理棟前で開催予定
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export function CampusMapSection() {
  return (
    <section id="campus-map" className="container section">
      <SectionTitle number="07" en="CAMPUS MAP">
        会場を歩こう
      </SectionTitle>
      <p className="section-lead">
        模擬店、体育館、実習工場。行きたい場所を見つけてから出発。
      </p>
      <figure className="campus-figure">
        <a href={assetUrl('maps/campus.webp')} target="_blank" rel="noreferrer">
          <img
            src={assetUrl('maps/campus.webp')}
            alt="準備版の会場図。飲食エリアAは教室棟前、Bは専門棟付近。第一体育館はステージ、第二体育館はバレーボール体験、柔道場はコーンホール、実習工場は学科企画。陸上競技場は臨時駐車場。"
            width="905"
            height="864"
            loading="lazy"
          />
        </a>
        <figcaption>準備版パンフレットから / 画像をタップして拡大 ↗</figcaption>
      </figure>
      <ul className="map-legend">
        <li>
          <b>A</b> 飲食エリアA
        </li>
        <li>
          <b>B</b> 飲食エリアB
        </li>
        <li>
          <b>C</b> 教室・管理棟の屋内企画
        </li>
        <li>
          <b>D</b> 野球場の体験企画
        </li>
        <li>
          <b>E</b> 実習工場・ME学科企画
        </li>
      </ul>
      <div className="map-details">
        {[
          ['outdoor', '屋外の模擬店配置'],
          ['indoor-1', '教室・管理棟 1階'],
          ['indoor-2', '教室・管理棟 2階・3階'],
        ].map(([id, label]) => (
          <details key={id}>
            <summary>
              {label}を見る <span>＋</span>
            </summary>
            <a
              href={assetUrl(`maps/${id}.webp`)}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={assetUrl(`maps/${id}.webp`)}
                alt={`準備版の${label}の図`}
                loading="lazy"
              />
            </a>
          </details>
        ))}
      </div>
    </section>
  )
}

export function AccessSection() {
  return (
    <section id="access" className="access section">
      <div className="container">
        <SectionTitle number="08" en="VISITOR GUIDE">
          来場案内
        </SectionTitle>
        <div className="access-layout">
          <div>
            <h3>徳山工業高等専門学校</h3>
            <p>{festival.address}</p>
            <dl className="routes">
              <div>
                <dt>JR徳山駅から</dt>
                <dd>
                  防長バス「久米温泉口」行き →「大学高専下」下車、徒歩約10分。
                  <br />
                  または「徳山高専」行き →「高専正門」下車。
                </dd>
              </div>
              <div>
                <dt>JR櫛ケ浜駅から</dt>
                <dd>防長バス「徳山高専」行き →「高専正門」下車。</dd>
              </div>
              <div>
                <dt>お車で</dt>
                <dd>山陽自動車道 徳山東ICから約5分。</dd>
              </div>
            </dl>
            <a
              className="text-link"
              href={festival.accessSource}
              target="_blank"
              rel="noreferrer"
            >
              学校公式のアクセス案内 ↗
            </a>
            <p className="note">
              開催日のバス時刻表は準備中です。上記は学校公式の通常のアクセス案内です。
            </p>
          </div>
          <aside id="parking">
            <p className="eyebrow">PARKING</p>
            <h3>臨時駐車場</h3>
            <p>
              準備版の会場図では、陸上競技場を臨時駐車場として案内しています。
            </p>
            <a href={sectionUrl('campus-map')}>会場図を見る ↑</a>
            <p className="note">
              入口・出口など、当日の詳しい運用は確認中です。
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function PamphletSection() {
  return (
    <section id="pamphlet" className="container section pamphlet">
      <div className="pamphlet-art">
        <img
          src={assetUrl('images/pamphlet-cover.webp')}
          alt="徳山高専2026高専祭パンフレット準備版の表紙"
          width="600"
          height="846"
          loading="lazy"
        />
      </div>
      <div>
        <SectionTitle number="09" en="PAMPHLET">
          準備版PDF
        </SectionTitle>
        <span className="badge">準備版</span>
        <p>
          日程、会場図、企画のポスターをまとめた冊子です。空欄や調整中のページを含む、現在の準備版を配布しています。
        </p>
        <a
          className="button"
          href={assetUrl(festival.pamphlet.path)}
          download="徳山高専2026高専祭-パンフレット準備版.pdf"
        >
          準備版PDFをダウンロード <span>↓</span>
        </a>
        <p className="small">PDF / 57ページ / 約8.3 MB</p>
        <a
          className="text-link"
          href={assetUrl(festival.pamphlet.path)}
          target="_blank"
          rel="noreferrer"
        >
          ブラウザーで開く ↗
        </a>
      </div>
    </section>
  )
}

export function NewsSection() {
  return (
    <section id="news" className="container section news">
      <SectionTitle number="10" en="INFORMATION">
        お知らせ
      </SectionTitle>
      <div className="news-row">
        <time dateTime="2026-10-08">2026.10.08</time>
        <p>パンフレットの準備版と、現在の開催案内を掲載しました。</p>
      </div>
      <p className="note">
        日程・会場は変更する場合がございます。公式SNSでも最新の案内をご確認ください。
      </p>
      <div className="social-links">
        <a href={festival.social.instagram} target="_blank" rel="noreferrer">
          Instagram <span>@toku_kosensai ↗</span>
        </a>
        <a href={festival.social.x} target="_blank" rel="noreferrer">
          X <span>@toku_kosensai ↗</span>
        </a>
      </div>
      <p className="small">
        昨年度の記録は公式SNSへ。
        <a
          href="https://www.instagram.com/toku_kosensai/p/DQNrXECgV4S/"
          target="_blank"
          rel="noreferrer"
        >
          2025年の企画紹介を見る ↗
        </a>
      </p>
    </section>
  )
}

export function SponsorNames() {
  return (
    <details className="sponsors">
      <summary>
        準備版パンフレットの掲載一覧<span>＋</span>
      </summary>
      <p className="note">
        準備版p43〜44の一覧です。確定情報は完成版で更新します。
      </p>
      <ul>
        {sponsors.names.map((name, i) => (
          <li key={i}>{name}</li>
        ))}
      </ul>
    </details>
  )
}
