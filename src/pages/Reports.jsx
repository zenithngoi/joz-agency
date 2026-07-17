import { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'
import Skeleton from '../components/Skeleton.jsx'

const TAG_STYLE = {
  HOOK:   { bg:'rgba(212,175,55,.12)', color:'var(--gold)' },
  TIMING: { bg:'rgba(46,189,133,.12)', color:'var(--profit)' },
  ADS:    { bg:'rgba(240,185,11,.12)', color:'var(--warn)' },
  FAIL:   { bg:'rgba(246,70,93,.12)',  color:'var(--loss)' },
  CLIENT: { bg:'rgba(232,199,102,.12)', color:'var(--gold)' },
}

const LEVEL_COLOR = { OK:'var(--profit)', WARN:'var(--warn)', ERR:'var(--loss)' }

const STAGE_LABELS = { ideas:'Ideas', drafting:'Drafting', seo:'SEO', scheduled:'Scheduled', posted:'Posted', analyzed:'Analyzed' }

function fmtMoney(n) {
  return `RM ${Number(n || 0).toLocaleString()}`
}
function fmtRoas(v) {
  return (v === null || v === undefined) ? '—' : `${Number(v).toFixed(1)}×`
}
function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
}
function fmtDateTime(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
}

function KpiCard({ label, val, color }) {
  return (
    <div style={{ background:'var(--panel)', padding:'12px 16px' }}>
      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:4 }}>{label}</div>
      <div className="mono" style={{ fontSize:17, fontWeight:600, color: color || 'var(--text)' }}>{val}</div>
    </div>
  )
}

function Section({ title, children, right }) {
  return (
    <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
      <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
        <span><b style={{ color:'var(--gold)' }}>{title.split(' ')[0]}</b> {title.split(' ').slice(1).join(' ')}</span>
        {right}
      </div>
      {children}
    </div>
  )
}

function AdsTable({ ads }) {
  const items = ads?.items || []
  const changes = ads?.statusChanges || []
  return (
    <Section title="ADS PERFORMANCE">
      {items.length === 0 ? (
        <div style={{ padding:'24px 16px', textAlign:'center', color:'var(--dim)', fontSize:12, fontStyle:'italic' }}>No ads for this client.</div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr>
                {['Ad','Platform','Status','Spend','ROAS','CPA'].map(h => (
                  <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:9, letterSpacing:1.2, textTransform:'uppercase', color:'var(--dim)', borderBottom:'1px solid var(--line)', fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ padding:'10px 14px', borderBottom: i<items.length-1?'1px solid rgba(34,42,59,.5)':'none', fontWeight:600 }}>{a.name}</td>
                  <td style={{ padding:'10px 14px', borderBottom: i<items.length-1?'1px solid rgba(34,42,59,.5)':'none', color:'var(--muted)', fontFamily:"'IBM Plex Mono',monospace" }}>{a.platform}</td>
                  <td style={{ padding:'10px 14px', borderBottom: i<items.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace" }}>{a.status}</td>
                  <td style={{ padding:'10px 14px', borderBottom: i<items.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace" }}>{fmtMoney(a.spend)}</td>
                  <td style={{ padding:'10px 14px', borderBottom: i<items.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", fontWeight:600, color: a.roas >= 3 ? 'var(--profit)' : a.roas ? 'var(--warn)' : 'var(--dim)' }}>{fmtRoas(a.roas)}</td>
                  <td style={{ padding:'10px 14px', borderBottom: i<items.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", color:'var(--muted)' }}>{a.cpa != null ? `RM ${Number(a.cpa).toFixed(2)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {changes.length > 0 && (
        <div style={{ padding:'10px 16px', borderTop:'1px solid var(--line)' }}>
          <div style={{ fontSize:9.5, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', fontWeight:700, marginBottom:8 }}>Status Changes This Period</div>
          {changes.map((c, i) => (
            <div key={i} style={{ fontSize:11.5, color:'var(--muted)', padding:'3px 0', lineHeight:1.5, fontFamily:"'IBM Plex Mono',monospace" }}>
              <span style={{ color:'var(--dim)' }}>{c.date}</span> — <b style={{ color:'var(--text)' }}>{c.adName}</b>: {c.action}{c.val ? ` (${c.val})` : ''}
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function MemoryList({ memory }) {
  const entries = memory?.entries || []
  return (
    <Section title="MEMORY INSIGHTS ADDED" right={<span style={{ fontSize:9.5 }}>{memory?.count ?? 0} new</span>}>
      {entries.length === 0 ? (
        <div style={{ padding:'24px 16px', textAlign:'center', color:'var(--dim)', fontSize:12, fontStyle:'italic' }}>No new memory entries this period.</div>
      ) : (
        <div>
          {entries.map((e, i) => {
            const ts = TAG_STYLE[e.tag] || {}
            return (
              <div key={e.id ?? i} style={{ padding:'10px 16px', borderBottom: i<entries.length-1 ? '1px solid var(--line-2)' : 'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                  <span style={{ fontSize:9, padding:'2px 7px', borderRadius:4, fontWeight:700, letterSpacing:.5, fontFamily:"'IBM Plex Mono',monospace", background: ts.bg, color: ts.color }}>{e.tag}</span>
                  <span style={{ fontSize:9.5, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace" }}>{e.date}</span>
                </div>
                <div style={{ fontSize:12.5, fontWeight:600, marginBottom:3 }}>{e.title}</div>
                <div style={{ fontSize:11.5, color:'var(--muted)', lineHeight:1.5 }}>{e.body}</div>
              </div>
            )
          })}
        </div>
      )}
    </Section>
  )
}

function PipelineByStage({ pipeline }) {
  const byStage = pipeline?.byStage || {}
  const stages = Object.keys(STAGE_LABELS)
  const max = Math.max(1, ...stages.map(s => byStage[s] || 0))
  return (
    <Section title="CONTENT PIPELINE" right={<span style={{ fontSize:9.5 }}>{pipeline?.total ?? 0} cards</span>}>
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:9 }}>
        {stages.map(s => {
          const count = byStage[s] || 0
          const pct = Math.round((count / max) * 100)
          return (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12 }}>
              <div style={{ width:90, color:'var(--muted)', flexShrink:0 }}>{STAGE_LABELS[s]}</div>
              <div style={{ flex:1, height:12, background:'var(--ink)', borderRadius:3, overflow:'hidden' }}>
                <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg, rgba(212,175,55,.75), rgba(212,175,55,.15))', minWidth: count>0?4:0 }} />
              </div>
              <div className="mono" style={{ fontSize:12, minWidth:20, textAlign:'right' }}>{count}</div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

function HeartbeatSummary({ heartbeat }) {
  const byLevel = heartbeat?.byLevel || { OK:0, WARN:0, ERR:0 }
  const entries = heartbeat?.entries || []
  return (
    <Section title="HEARTBEAT LOG" right={
      <div style={{ display:'flex', gap:8 }}>
        {Object.entries(byLevel).map(([lvl, n]) => (
          <span key={lvl} style={{ fontSize:9.5, color: LEVEL_COLOR[lvl] || 'var(--dim)' }}>{lvl} {n}</span>
        ))}
      </div>
    }>
      {entries.length === 0 ? (
        <div style={{ padding:'24px 16px', textAlign:'center', color:'var(--dim)', fontSize:12, fontStyle:'italic' }}>No heartbeat events for this client in period.</div>
      ) : (
        <div style={{ maxHeight:240, overflowY:'auto' }}>
          {entries.slice(0, 30).map((h, i) => (
            <div key={i} style={{ padding:'7px 16px', borderBottom: i<entries.length-1 ? '1px solid var(--line-2)' : 'none', display:'flex', gap:10, alignItems:'baseline', fontSize:11.5 }}>
              <span className="mono" style={{ fontSize:9.5, color:'var(--dim)', flexShrink:0 }}>{fmtDateTime(h.ts)}</span>
              <span style={{ fontSize:9, fontWeight:700, color: LEVEL_COLOR[h.level] || 'var(--dim)', flexShrink:0 }}>{h.level}</span>
              <span style={{ color:'var(--muted)' }}>{h.msg}</span>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function WeeklyBreakdown({ weeks }) {
  if (!weeks || weeks.length === 0) return null
  return (
    <Section title="WEEKLY BREAKDOWN">
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr>
              {['Week','Memory Insights','Heartbeat Events'].map(h => (
                <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:9, letterSpacing:1.2, textTransform:'uppercase', color:'var(--dim)', borderBottom:'1px solid var(--line)', fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, i) => (
              <tr key={i}>
                <td style={{ padding:'10px 14px', borderBottom: i<weeks.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace" }}>{fmtDate(w.weekStart)} – {fmtDate(w.weekEnd)}</td>
                <td style={{ padding:'10px 14px', borderBottom: i<weeks.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace", color:'var(--gold)' }}>{w.memoryInsightsAdded}</td>
                <td style={{ padding:'10px 14px', borderBottom: i<weeks.length-1?'1px solid rgba(34,42,59,.5)':'none', fontFamily:"'IBM Plex Mono',monospace" }}>{w.heartbeatEvents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export default function Reports() {
  const [clients, setClients]       = useState([])
  const [clientId, setClientId]     = useState('')
  const [period, setPeriod]         = useState('weekly') // 'weekly' | 'monthly'
  const [report, setReport]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [clientsError, setClientsError] = useState(null)

  // load client list once
  useEffect(() => {
    api.getClients()
      .then(list => {
        setClients(list || [])
        if (list && list.length > 0) setClientId(list[0].id)
        else setLoading(false) // no clients — nothing to load a report for
      })
      .catch(e => { setClientsError(e.message); setLoading(false) })
  }, [])

  const loadReport = useCallback(() => {
    if (!clientId) return
    setLoading(true)
    setError(null)
    const call = period === 'weekly' ? api.getWeeklyReport(clientId) : api.getMonthlyReport(clientId)
    call
      .then(data => { setReport(data); setLoading(false) })
      .catch(e => { setError(e.message); setReport(null); setLoading(false) })
  }, [clientId, period])

  useEffect(() => { loadReport() }, [loadReport])

  return (
    <div style={{ padding:16, maxWidth:1300, margin:'0 auto' }}>
      {/* controls */}
      <div className="no-print" style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={{
          background:'var(--panel)', border:'1px solid var(--line)', borderRadius:5,
          padding:'7px 12px', color:'var(--text)', fontSize:12, outline:'none', cursor:'pointer', minWidth:180,
        }}>
          {clients.length === 0 && <option value="">Loading clients...</option>}
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div style={{ display:'flex', gap:6 }}>
          {['weekly','monthly'].map(v => (
            <button key={v} onClick={() => setPeriod(v)} style={{
              padding:'6px 16px', borderRadius:6, fontSize:10, fontWeight:700, letterSpacing:1,
              textTransform:'uppercase', cursor:'pointer', transition:'.15s',
              border: period===v ? '1px solid rgba(212,175,55,.6)' : '1px solid var(--line)',
              background: period===v ? 'rgba(212,175,55,.1)' : 'transparent',
              color: period===v ? 'var(--gold)' : 'var(--dim)',
            }}>{v === 'weekly' ? 'Weekly' : 'Monthly'}</button>
          ))}
        </div>

        <button
          onClick={() => window.print()}
          disabled={!report}
          style={{
            marginLeft:'auto', padding:'7px 16px', borderRadius:6, fontSize:10, fontWeight:700, letterSpacing:1,
            textTransform:'uppercase', cursor: report ? 'pointer' : 'not-allowed',
            border:'1px solid rgba(212,175,55,.5)', background: report ? 'rgba(212,175,55,.08)' : 'transparent',
            color: report ? 'var(--gold)' : 'var(--dim)',
          }}
        >↓ Export PDF</button>
      </div>

      {clientsError && (
        <div style={{ marginBottom:12, padding:'10px 14px', background:'rgba(246,70,93,.1)', border:'1px solid rgba(246,70,93,.3)', borderRadius:6, fontSize:12, color:'var(--loss)', fontFamily:"'IBM Plex Mono',monospace" }}>
          ⚠ Backend error loading clients: {clientsError} — check Railway is running
        </div>
      )}

      {error && (
        <div style={{ marginBottom:12, padding:'10px 14px', background:'rgba(246,70,93,.1)', border:'1px solid rgba(246,70,93,.3)', borderRadius:6, fontSize:12, color:'var(--loss)', fontFamily:"'IBM Plex Mono',monospace" }}>
          ⚠ Backend error: {error}
        </div>
      )}

      {loading && !error && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14 }}>
            <div>
              <Skeleton width={160} height={16} style={{ marginBottom:6 }} />
              <Skeleton width={220} height={11} />
            </div>
          </div>
          <div className="kpi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))', gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background:'var(--panel)', padding:'12px 16px' }}>
                <Skeleton width={70} height={9} style={{ marginBottom:8 }} />
                <Skeleton width={45} height={17} />
              </div>
            ))}
          </div>
          <Skeleton height={180} style={{ marginBottom:14, borderRadius:8 }} />
          <Skeleton height={180} style={{ borderRadius:8 }} />
        </div>
      )}

      {!loading && !error && report && (
        <div className="print-area">
          {/* report header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700 }}>{report.client?.name}</div>
              <div style={{ fontSize:11, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace", marginTop:2, textTransform:'uppercase', letterSpacing:1 }}>
                {period === 'weekly' ? 'Weekly Report' : 'Monthly Report'} · {fmtDate(report.period?.from)} – {fmtDate(report.period?.to)} ({report.period?.days} days)
              </div>
            </div>
          </div>

          {/* KPI grid */}
          <div className="kpi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))', gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
            <KpiCard label="Ad Spend"          val={fmtMoney(report.kpis?.totalSpend)} />
            <KpiCard label="Avg ROAS"          val={fmtRoas(report.kpis?.avgRoas)}      color={report.kpis?.avgRoas >= 3 ? 'var(--profit)' : report.kpis?.avgRoas ? 'var(--warn)' : 'var(--dim)'} />
            <KpiCard label="Leads"             val={report.kpis?.leads ?? 0}            color="var(--profit)" />
            <KpiCard label="Converted"         val={report.kpis?.clientsConverted ?? 0} color="var(--profit)" />
            <KpiCard label="Ads Running"       val={report.kpis?.adsCount ?? 0} />
            <KpiCard label="Memory Insights"   val={report.kpis?.memoryInsightsAdded ?? 0} color="var(--gold)" />
            <KpiCard label="Pipeline Cards"    val={report.kpis?.pipelineCardsTotal ?? 0} />
            <KpiCard label="Heartbeat Events"  val={report.kpis?.heartbeatEvents ?? 0} />
          </div>

          {period === 'monthly' && <WeeklyBreakdown weeks={report.weeklyBreakdown} />}

          <AdsTable ads={report.ads} />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <PipelineByStage pipeline={report.pipeline} />
            <HeartbeatSummary heartbeat={report.heartbeat} />
          </div>

          <MemoryList memory={report.memory} />
        </div>
      )}

      {!loading && !clientsError && clients.length === 0 && (
        <div style={{ padding:'60px 20px', textAlign:'center', color:'var(--dim)', fontSize:13, fontStyle:'italic' }}>
          No clients found. Add a client first.
        </div>
      )}

      {!loading && !error && !report && clients.length > 0 && (
        <div style={{ padding:'60px 20px', textAlign:'center', color:'var(--dim)', fontSize:13, fontStyle:'italic' }}>
          Select a client to view their report.
        </div>
      )}
    </div>
  )
}
