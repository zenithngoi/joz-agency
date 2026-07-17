import { useState } from 'react'

const WEEKLY_DATA = [
  { week:'W1 Jun', posts:18, leads:62,  spend:880,  roas:3.8, followers:1240 },
  { week:'W2 Jun', posts:22, leads:71,  spend:940,  roas:4.1, followers:1580 },
  { week:'W3 Jun', posts:20, leads:68,  spend:910,  roas:4.4, followers:1810 },
  { week:'W4 Jun', posts:24, leads:141, spend:1870, roas:4.9, followers:2240 },
]

const CLIENT_REPORTS = [
  {
    name:'Demo Broker', period:'Jun 2026',
    kpis:[
      { label:'Posts Published', val:60,          target:60,  unit:'' },
      { label:'Total Reach',     val:'2.31M',      target:'—', unit:'' },
      { label:'Leads Generated', val:342,          target:20,  unit:'/mo' },
      { label:'Ad Spend',        val:'RM 2,600',   target:'—', unit:'' },
      { label:'ROAS',            val:'4.2×',       target:'3×', unit:'' },
      { label:'Follower Growth', val:'+6,870',     target:'+5%', unit:'' },
    ],
    highlights:['TikTok "RM0→RM10k" boosted hit 284k views, 6.8× ROAS','Volume Profile myth-bust series: ER 8.4% avg','Funnel: 2.31M views → 342 leads → 8 clients'],
    issues:['X promoted campaign underperformed (1.9× ROAS) — paused','Generic IG awareness killed (0.8× ROAS)'],
  },
  {
    name:'E-Shop MY', period:'Jun 2026',
    kpis:[
      { label:'Posts Published', val:55,          target:80,  unit:'' },
      { label:'Total Reach',     val:'1.04M',      target:'—', unit:'' },
      { label:'Leads Generated', val:194,          target:40,  unit:'/mo' },
      { label:'Ad Spend',        val:'RM 1,800',   target:'—', unit:'' },
      { label:'ROAS',            val:'3.8×',       target:'4×', unit:'' },
      { label:'Follower Growth', val:'+3,120',     target:'+5%', unit:'' },
    ],
    highlights:['Instagram Reels best performer: avg 6.1% ER','Phase 2 content calendar fully operational'],
    issues:['ROAS 3.8× still below 4× target — scaling tests ongoing','Post volume 55 vs 80 target — capacity constrained'],
  },
  {
    name:'PropFirm SG', period:'Jun 2026',
    kpis:[
      { label:'Posts Published', val:12,          target:40,  unit:'' },
      { label:'Total Reach',     val:'41k',        target:'—', unit:'' },
      { label:'Leads Generated', val:41,           target:15,  unit:'/mo' },
      { label:'Ad Spend',        val:'RM 400',     target:'—', unit:'' },
      { label:'ROAS',            val:'—',          target:'2×', unit:'' },
      { label:'Follower Growth', val:'+720',       target:'+5%', unit:'' },
    ],
    highlights:['Onboarding complete — first content cycle live','41 leads ahead of 15/mo target in half-month'],
    issues:['Ads not yet live — pending creative approval','Post volume low (12) — scaling content production'],
  },
]

function BarChart({ data, metric, label, color='var(--gold)' }) {
  const max = Math.max(...data.map(d => d[metric]))
  return (
    <div>
      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:10 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:80 }}>
        {data.map((d, i) => {
          const h = max > 0 ? Math.round((d[metric] / max) * 72) : 0
          return (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div className="mono" style={{ fontSize:9, color:'var(--muted)' }}>{typeof d[metric] === 'number' && d[metric] >= 1000 ? (d[metric]/1000).toFixed(1)+'k' : d[metric]}</div>
              <div style={{ width:'100%', height:h, background:`linear-gradient(180deg, ${color}, ${color}44)`, borderRadius:'3px 3px 0 0', minHeight:4 }}/>
              <div style={{ fontSize:8.5, color:'var(--dim)', textAlign:'center', fontFamily:"'IBM Plex Mono',monospace" }}>{d.week}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ClientReport({ report }) {
  return (
    <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
      <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontWeight:700, fontSize:14 }}>{report.name}</div>
          <div style={{ fontSize:10, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace", marginTop:2 }}>{report.period}</div>
        </div>
        <button style={{
          padding:'5px 12px', borderRadius:5, border:'1px solid var(--line)',
          background:'transparent', color:'var(--dim)', fontSize:10, cursor:'pointer',
          fontFamily:"'IBM Plex Mono',monospace", letterSpacing:.5,
        }}>↓ Export PDF</button>
      </div>

      {/* KPI table */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))', gap:1, background:'var(--line)' }}>
        {report.kpis.map(k => {
          const hit = k.target !== '—' && k.val !== '—' && Number(String(k.val).replace(/[^0-9.]/g,'')) >= Number(String(k.target).replace(/[^0-9.]/g,''))
          return (
            <div key={k.label} style={{ background:'var(--panel)', padding:'10px 14px' }}>
              <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>{k.label}</div>
              <div className="mono" style={{ fontSize:15, fontWeight:600, color: k.target === '—' ? 'var(--text)' : hit ? 'var(--profit)' : 'var(--warn)' }}>{k.val}</div>
              {k.target !== '—' && <div style={{ fontSize:9.5, color:'var(--dim)', marginTop:2, fontFamily:"'IBM Plex Mono',monospace" }}>target: {k.target}{k.unit}</div>}
            </div>
          )
        })}
      </div>

      {/* highlights + issues */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line)', borderRight:'1px solid var(--line)' }}>
          <div style={{ fontSize:9.5, letterSpacing:1, textTransform:'uppercase', color:'var(--profit)', fontWeight:700, marginBottom:8 }}>✓ Wins</div>
          {report.highlights.map((h,i) => (
            <div key={i} style={{ fontSize:11.5, color:'var(--muted)', padding:'3px 0', lineHeight:1.5 }}>▸ {h}</div>
          ))}
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--line)' }}>
          <div style={{ fontSize:9.5, letterSpacing:1, textTransform:'uppercase', color:'var(--loss)', fontWeight:700, marginBottom:8 }}>⚠ Issues</div>
          {report.issues.map((h,i) => (
            <div key={i} style={{ fontSize:11.5, color:'var(--muted)', padding:'3px 0', lineHeight:1.5 }}>▸ {h}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Reports() {
  const [view, setView] = useState('weekly') // 'weekly' | 'client'
  const [clientIdx, setClientIdx] = useState(0)

  const totals = {
    posts:     WEEKLY_DATA.reduce((s,d)=>s+d.posts,0),
    leads:     WEEKLY_DATA.reduce((s,d)=>s+d.leads,0),
    spend:    `RM ${WEEKLY_DATA.reduce((s,d)=>s+d.spend,0).toLocaleString()}`,
    avgRoas:  (WEEKLY_DATA.reduce((s,d)=>s+d.roas,0)/WEEKLY_DATA.length).toFixed(1)+'×',
    followers: WEEKLY_DATA.reduce((s,d)=>s+d.followers,0).toLocaleString(),
  }

  return (
    <div style={{ padding:16, maxWidth:1300, margin:'0 auto' }}>
      {/* summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px,1fr))', gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
        {[
          { label:'Posts Jun', val: totals.posts,     color:'var(--text)' },
          { label:'Leads Jun', val: totals.leads,     color:'var(--text)' },
          { label:'Ad Spend',  val: totals.spend,     color:'var(--text)' },
          { label:'Avg ROAS',  val: totals.avgRoas,   color:'var(--profit)' },
          { label:'New Followers', val:'+'+totals.followers, color:'var(--profit)' },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--panel)', padding:'12px 16px' }}>
            <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:4 }}>{k.label}</div>
            <div className="mono" style={{ fontSize:17, fontWeight:600, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* view toggle */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {['weekly','client'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding:'6px 16px', borderRadius:6, fontSize:10, fontWeight:700, letterSpacing:1,
            textTransform:'uppercase', cursor:'pointer', transition:'.15s',
            border: view===v ? '1px solid rgba(212,175,55,.6)' : '1px solid var(--line)',
            background: view===v ? 'rgba(212,175,55,.1)' : 'transparent',
            color: view===v ? 'var(--gold)' : 'var(--dim)',
          }}>{v === 'weekly' ? 'Weekly Trend' : 'Client Reports'}</button>
        ))}
      </div>

      {view === 'weekly' && (
        <>
          {/* 4 charts */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:12, marginBottom:14 }}>
            {[
              { metric:'posts',     label:'Posts Published / Week',   color:'var(--gold)' },
              { metric:'leads',     label:'Leads Generated / Week',   color:'var(--profit)' },
              { metric:'spend',     label:'Ad Spend / Week (RM)',     color:'var(--warn)' },
              { metric:'followers', label:'New Followers / Week',     color:'var(--profit)' },
            ].map(c => (
              <div key={c.metric} style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, padding:'14px 16px' }}>
                <BarChart data={WEEKLY_DATA} metric={c.metric} label={c.label} color={c.color} />
              </div>
            ))}
          </div>

          {/* weekly table */}
          <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden' }}>
            <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--line)', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
              <b style={{ color:'var(--gold)' }}>WEEKLY</b> BREAKDOWN — Jun 2026
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr>
                    {['Week','Posts','Leads','Ad Spend','ROAS','New Followers'].map(h => (
                      <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:9, letterSpacing:1.2, textTransform:'uppercase', color:'var(--dim)', borderBottom:'1px solid var(--line)', fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WEEKLY_DATA.map((d, i) => (
                    <tr key={d.week}
                      onMouseEnter={e => e.currentTarget.style.background='var(--panel-2)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <td style={{ padding:'10px 14px', borderBottom: i<WEEKLY_DATA.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", fontWeight:600, color:'var(--gold)' }}>{d.week}</td>
                      <td style={{ padding:'10px 14px', borderBottom: i<WEEKLY_DATA.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace" }}>{d.posts}</td>
                      <td style={{ padding:'10px 14px', borderBottom: i<WEEKLY_DATA.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", color:'var(--profit)' }}>{d.leads}</td>
                      <td style={{ padding:'10px 14px', borderBottom: i<WEEKLY_DATA.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", color:'var(--muted)' }}>RM {d.spend.toLocaleString()}</td>
                      <td style={{ padding:'10px 14px', borderBottom: i<WEEKLY_DATA.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", color: d.roas>=3?'var(--profit)':'var(--warn)', fontWeight:600 }}>{d.roas}×</td>
                      <td style={{ padding:'10px 14px', borderBottom: i<WEEKLY_DATA.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", color:'var(--profit)' }}>+{d.followers.toLocaleString()}</td>
                    </tr>
                  ))}
                  {/* totals row */}
                  <tr style={{ background:'var(--panel-2)' }}>
                    <td style={{ padding:'10px 14px', fontWeight:700, fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)' }}>TOTAL</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontWeight:700 }}>{totals.posts}</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, color:'var(--profit)' }}>{totals.leads}</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontWeight:700 }}>{totals.spend}</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, color:'var(--profit)' }}>{totals.avgRoas}</td>
                    <td style={{ padding:'10px 14px', fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, color:'var(--profit)' }}>+{totals.followers}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === 'client' && (
        <>
          {/* client selector */}
          <div style={{ display:'flex', gap:6, marginBottom:14 }}>
            {CLIENT_REPORTS.map((r,i) => (
              <button key={r.name} onClick={() => setClientIdx(i)} style={{
                padding:'5px 14px', borderRadius:5, fontSize:10, fontWeight:700, letterSpacing:.5,
                textTransform:'uppercase', cursor:'pointer',
                border: clientIdx===i ? '1px solid rgba(212,175,55,.6)' : '1px solid var(--line)',
                background: clientIdx===i ? 'rgba(212,175,55,.1)' : 'transparent',
                color: clientIdx===i ? 'var(--gold)' : 'var(--dim)',
              }}>{r.name}</button>
            ))}
            <button onClick={() => setClientIdx(-1)} style={{
              padding:'5px 14px', borderRadius:5, fontSize:10, fontWeight:700, letterSpacing:.5,
              textTransform:'uppercase', cursor:'pointer',
              border: clientIdx===-1 ? '1px solid rgba(212,175,55,.6)' : '1px solid var(--line)',
              background: clientIdx===-1 ? 'rgba(212,175,55,.1)' : 'transparent',
              color: clientIdx===-1 ? 'var(--gold)' : 'var(--dim)',
            }}>All</button>
          </div>
          {clientIdx === -1
            ? CLIENT_REPORTS.map(r => <ClientReport key={r.name} report={r} />)
            : <ClientReport report={CLIENT_REPORTS[clientIdx]} />
          }
        </>
      )}
    </div>
  )
}
