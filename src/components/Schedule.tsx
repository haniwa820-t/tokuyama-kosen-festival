import { useState } from 'react'
import schedule from '../data/schedule.json'
export default function Schedule() {
  const [day,setDay] = useState(0)
  return <>
    <div className="day-tabs" aria-label="日程の選択">{['10月31日（土）','11月1日（日）'].map((date,index) => <button key={date} aria-label={date} aria-pressed={day === index} onClick={() => setDay(index)}><span>DAY 0{index + 1}</span>{date}</button>)}</div>
    <div className="schedule-layout"><div><p className="table-caption">ステージ企画 / 第一体育館（後夜祭を除く）</p>
      <div className="timetable">{schedule.filter(e => e.day === day).map(e => <div className="time-row" key={e.id}><time>{e.start}<span>— {e.end}</span></time><div><h3>{e.title}</h3>{'note' in e && <p className="restricted">{e.note}</p>}{e.title === '後夜祭' && <p className="small">会場は当日の在校生向け案内をご確認ください。</p>}</div></div>)}</div>
    </div><aside className="all-day"><p className="eyebrow">こちらもチェック</p><h3>この日の企画</h3>{day === 0 ? <ul><li>周南ロボコン <span>9:30〜15:00</span></li><li>実習工場開放 <span>10:00〜15:00</span></li><li>高専祭茶会 <span>10:00〜15:00</span></li><li>献血 <span>9:30〜11:45 / 13:00〜15:30</span></li></ul> : <ul><li>実習工場開放 <span>10:00〜15:00</span></li><li>なつかしの機械展示 <span>10:00〜15:00</span></li><li>土木建築工学科企画 <span>9:45〜15:00</span></li></ul>}<a href="#related-events">併催企画の案内へ ↓</a></aside></div>
    <p className="note">後夜祭は在校生のみ参加可能です。準備版パンフレットに基づく予定です。日程は変更する場合がございます。</p>
  </>
}
