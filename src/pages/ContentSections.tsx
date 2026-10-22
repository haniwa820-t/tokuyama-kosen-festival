import campusMaps from '../data/campus-maps.json'
import festival from '../data/festival.json'
import busTimetable from '../data/bus-timetable.json'
import bloodDonation from '../data/blood-donation.json'
import departments from '../data/departments.json'
import sponsors from '../data/sponsors.json'
import { assetUrl } from '../lib/catalog'
import { sectionUrl } from '../lib/pages'
import BoothCatalog from '../components/BoothCatalog'
import Schedule from '../components/Schedule'
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-title">
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
          <p className="hero-year">TOKUYAMA KOSEN FESTIVAL 2026</p>
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
            徳山工業高等専門学校<span>山口県周南市学園台</span>
          </p>
          <a className="button" href={sectionUrl('schedule')}>
            2日間の予定を見る <span>↓</span>
          </a>
        </div>
        <figure className="hero-poster">
          <a
            href={assetUrl('images/main-poster.webp')}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={assetUrl('images/main-poster.webp')}
              alt="第52回徳山高専高専祭のメインポスター。青とピンクのEchoの図案。"
              width="1168"
              height="1568"
              fetchPriority="high"
            />
          </a>
          <figcaption>第52回高専祭 メインビジュアル</figcaption>
        </figure>
      </div>
      <div className="hero-poster-note container">
        <span>10.31 — 11.01 / 2026</span>
        <a href={sectionUrl('theme')}>今年のテーマについて ↓</a>
      </div>
    </section>
  )
}

export function ThemeSection() {
  return (
    <section id="theme" className="container theme section">
      <SectionTitle>今年のテーマ</SectionTitle>
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
        <SectionTitle>ステージと開催企画</SectionTitle>
        <Schedule />
      </div>
    </section>
  )
}

export function MainEventsSection() {
  return (
    <section id="main-events" className="container section">
      <SectionTitle>メイン企画</SectionTitle>
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
          <p className="eyebrow">会場：柔道場</p>
          <h3>コーンホール</h3>
          <p>
            袋を投げてボードの穴をねらう。初めてでも楽しめるコーンホールが、今年のメイン企画です。
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
          <p className="eyebrow">スタンプラリー</p>
          <h3>会場をめぐるスタンプラリー</h3>
          <p>
            {festival.stampRally.description}
            会場マップの星マークがスタンプ設置場所です。
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
        <SectionTitle>高専ならではの学科企画</SectionTitle>
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
      <SectionTitle>気になる企画を探そう</SectionTitle>
      <p className="section-lead">
        クラス、部活、研究室。それぞれの企画を、ポスターから探してみてください。
      </p>
      <BoothCatalog />
      <p className="note">IE2の会場は教室・管理棟3階です。</p>
    </section>
  )
}

export function RelatedEventsSection() {
  return (
    <section id="related-events" className="related section">
      <div className="container">
        <SectionTitle>併催企画</SectionTitle>
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
          <article id="blood-donation">
            <img
              src={assetUrl(bloodDonation.image)}
              alt="パンフレットの献血案内に掲載されたイラスト"
              loading="lazy"
              width={bloodDonation.imageWidth}
              height={bloodDonation.imageHeight}
            />
            <p className="eyebrow">10月31日（土）</p>
            <h3>献血</h3>
            <p>受付時間：9:30〜11:45／13:00〜15:30</p>
            <p className="small">会場：{bloodDonation.venue}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export function CampusMapSection() {
  return (
    <section id="campus-map" className="container section">
      {/* <SectionTitle>会場を歩こう</SectionTitle>
      <p className="section-lead">
        模擬店、体育館、実習工場。行きたい場所を見つけてから出発。
      </p> */}
      <p className="section-lead">
        星マークはスタンプラリーのスタンプ設置場所です。
      </p>
      <p className="note">{festival.stampRally.description}</p>
      <figure className="campus-figure">
        <a href={assetUrl('maps/campus.webp')} target="_blank" rel="noreferrer">
          <img
            src={assetUrl('maps/campus.webp')}
            alt="会場全体図。Aは飲食エリア1、Bは飲食エリア2、Cは屋内模擬店、Dは野球場の体験企画、Eは実習工場とME学科企画。陸上競技場は臨時駐車場。星マークはスタンプ設置場所。"
            width={campusMaps[0].width}
            height={campusMaps[0].height}
            loading="lazy"
          />
        </a>
        <figcaption>会場全体図 / 画像をタップして拡大 ↗</figcaption>
      </figure>
      <ul className="map-legend">
        <li>
          <b>A</b> 飲食エリア1
        </li>
        <li>
          <b>B</b> 飲食エリア2
        </li>
        <li>
          <b>C</b> 屋内模擬店
        </li>
        <li>
          <b>D</b> 野球場の体験企画
        </li>
        <li>
          <b>E</b> 実習工場・ME学科企画
        </li>
        <li>
          <b>☆</b> スタンプ設置場所
        </li>
      </ul>
      <div className="map-details">
        {campusMaps.slice(1).map((map) => (
          <details key={map.image}>
            <summary>
              {map.label}を見る <span>＋</span>
            </summary>
            <a href={assetUrl(map.image)} target="_blank" rel="noreferrer">
              <img
                src={assetUrl(map.image)}
                alt={map.alt}
                width={map.width}
                height={map.height}
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
        <SectionTitle>来場案内</SectionTitle>
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
            <p className="note">開催日のバスは下記の時刻表をご確認ください。</p>
          </div>
          <aside id="parking">
            <p className="eyebrow">駐車場</p>
            <h3>臨時駐車場</h3>
            <p>会場図では、陸上競技場を臨時駐車場として案内しています。</p>
            <a href={sectionUrl('campus-map')}>会場図を見る ↑</a>
            <p className="note">
              駐車場の入口・出口は当日の案内をご確認ください。
            </p>
          </aside>
        </div>
        <section id="bus-timetable" className="section">
          <h3>開催日の防長バス時刻表</h3>
          <p className="note">（臨）は臨時便、（定）は定期便です。</p>
          <dl className="routes">
            {busTimetable.services.map((service) => (
              <div key={service.route}>
                <dt>
                  （{service.kind}）
                  {service.kind === '臨' ? '臨時便' : '定期便'}
                </dt>
                <dd>{service.route}</dd>
              </div>
            ))}
          </dl>
          <p className="note">{busTimetable.afterPartyReturn.description}</p>
        </section>
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
          alt="徳山高専2026高専祭パンフレットの表紙"
          width="600"
          height="846"
          loading="lazy"
        />
      </div>
      <div>
        <SectionTitle>パンフレットPDF</SectionTitle>
        <p>
          日程、会場図、企画のポスター、バス時刻表などをまとめたパンフレットです。
        </p>
        <a
          className="button"
          href={assetUrl(festival.pamphlet.path)}
          download="徳山高専2026高専祭-パンフレット.pdf"
        >
          パンフレットPDFをダウンロード <span>↓</span>
        </a>
        <p className="small">
          PDF / {festival.pamphlet.pages}ページ / 約
          {(festival.pamphlet.bytes / 1_000_000).toFixed(1)} MB
        </p>
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
      <SectionTitle>お知らせ</SectionTitle>
      <div className="news-row">
        <time dateTime="2026-10-21">2026.10.21</time>
        <p>パンフレットと開催日の防長バス時刻表を掲載しました。</p>
      </div>
      <p className="note">
        日程・会場は変更になる場合があります。公式SNSでも最新の案内をご確認ください。
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
        協賛企業・団体一覧<span>＋</span>
      </summary>
      <ul>
        {sponsors.names.map((name, i) => (
          <li key={i}>{name}</li>
        ))}
      </ul>
    </details>
  )
}
