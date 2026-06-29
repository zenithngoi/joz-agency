import { useState, useMemo } from 'react'

const MEMORY_ENTRIES = [
  { id:1,  tag:'HOOK',   client:'Demo Broker',  date:'Jun 16', title:'"RM0 → RM10k" proof hook',           body:'Shows real payout screenshot in first 1.5s. ER 8.4% vs 3.1% baseline. Triggered social proof cascade — 300+ comments asking how.', uses:6,  wins:5 },
  { id:2,  tag:'TIMING', client:'Demo Broker',  date:'Jun 15', title:'Post at 8–9 PM MYT for TikTok',      body:'3 tests: 8 PM avg 18k reach, 12 PM avg 6k reach, 6 AM avg 4k reach. Audience is working adults checking phones after dinner.', uses:12, wins:10 },
  { id:3,  tag:'ADS',    client:'Demo Broker',  date:'Jun 14', title:'Boosted organic > cold creative',     body:'Boosting existing viral organic content (>50k views) delivers 4–6× ROAS vs cold ad creative (1.2–1.8× ROAS). Always boost first.', uses:4,  wins:4 },
  { id:4,  tag:'FAIL',   client:'E-Shop MY',    date:'Jun 13', title:'Generic brand awareness KILLED',      body:'Brand awareness campaign ran 5 days, RM 350 spend, 0.8× ROAS. Root cause: no specific CTA, targeted too broadly (18-55 MY). Auto-rule triggered kill.', uses:1,  wins:0 },
  { id:5,  tag:'HOOK',   client:'All',          date:'Jun 12', title:'Myth-bust format outperforms lists',  body:'3-part test: myth-bust avg 7.1% ER, list avg 4.2% ER, tutorial avg 3.8% ER. Audience responds to being told they are wrong.', uses:8,  wins:7 },
  { id:6,  tag:'CLIENT', client:'Demo Broker',  date:'Jun 11', title:'Brand voice: never say "guaranteed"', body:'Compliance flag from client Jun 11. Replace with "historically", "backtested", "potential". All agents must filter before publish.', uses:0,  wins:0 },
  { id:7,  tag:'TIMING', client:'All',          date:'Jun 10', title:'YouTube Shorts best at 7–8 PM MYT',  body:'4-week analysis. Shorts posted 7–8 PM: avg 9.2k views in 24h. Same content at noon: 3.1k views. Weekend = +22% reach vs weekday.', uses:5,  wins:5 },
  { id:8,  tag:'HOOK',   client:'PropFirm SG',  date:'Jun 09', title:'Aspirational income lifestyle hook',  body:'Early test: showing "trader lifestyle" (freedom, numbers) before CTA gets 2.3× profile visits vs direct pitch. Still validating n=2.', uses:2,  wins:1 },
  { id:9,  tag:'FAIL',   client:'Demo Broker',  date:'Jun 08', title:'X promoted thread underperformed',    body:'5-day X promoted campaign, 1.9× ROAS. Audience does not convert from X → Telegram funnel. Better for brand/reach only, not leads.', uses:1,  wins:0 },
  { id:10, tag:'ADS',    client:'All',          date:'Jun 07', title:'Scale rule: +20% per day cap',        body:'Tested +50% single-day scale on one campaign — delivery dropped 40% as algorithm re-learned audience. +20%/day is optimal ceiling.', uses:3,  wins:3 },
]

const TAGS = ['ALL', 'HOOK', 'TIMING', 'ADS', 'FAIL', 'CLIENT']

const TAG_STYLE = {
  HOOK:   { bg:'rgba(212,175,55,.12)', color:'var(--gold)' },
  TIMING: { bg:'rgba(46,189,133,.12)', color:'var(--profit)' },
  ADS:    { bg:'rgba(240,185,11,.12)', color:'var(--warn)' },
  FAIL:   { bg:'rgba(246,70,93,.12)',  color:'var(--loss)' },
  CLIENT: { bg:'rgba(232,199,102,.12)','color':'var(--gold-bright, var(--gold))' },
}

const CLIENTS = ['All clients', 'Demo Broker', 'E-Shop MY', 'PropFirm SG']

function MemoryCard({ entry, onSelect }) {
  const ts = TAG_STYLE[entry.tag] || {}
  const winRate = entry.uses > 0 ? Math.round(entry.wins / entry.uses * 100) : null
  return (
    <div onClick={() => onSelect(entry)} style={{
      background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8,
      padding:16, cursor:'pointer', transition:'border-color .15s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(212,175,55,.35)'}
    onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <span style={{ fontSize:9, padding:'2px 7px', borderRadius:4, fontWeight:700, letterSpacing:.5, fontFamily:"'IBM Plex Mono',monospace", background: ts.bg, color: ts.color }}>{entry.tag}</span>
        <span style={{ fontSize:9.5, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace" }}>{entry.date}</span>
      </div>
      <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:6, lineHeight:1.4 }}>{entry.title}</div>
      <div style={{ fontSize:11.5, color:'var(--muted)', lineHeight:1.55, marginBottom:10 }}>
        {entry.body.length > 120 ? entry.body.slice(0, 120) + '…' : entry.body}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:10, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace" }}>{entry.client}</span>
        {winRate !== null && (
          <span style={{ fontSize:10, fontFamily:"'IBM Plex Mono',monospace", color: winRate >= 75 ? 'var(--profit)' : winRate >= 50 ? 'var(--warn)' : 'var(--dim)' }}>
            {winRate}% win · {entry.uses} uses
          </span>
        )}
      </div>
    </div>
  )
}

function EntryModal({ entry, onClose }) {
  const ts = TAG_STYLE[entry.tag] || {}
  const winRate = entry.uses > 0 ? Math.round(entry.wins / entry.uses * 100) : null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={onClose}>
      <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:10, padding:26, width:500, maxWidth:'92vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <span style={{ fontSize:9, padding:'2px 7px', borderRadius:4, fontWeight:700, letterSpacing:.5, fontFamily:"'IBM Plex Mono',monospace", background: ts.bg, color: ts.color }}>{entry.tag}</span>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'var(--dim)', fontSize:20, cursor:'pointer' }}>×</button>
        </div>
        <div style={{ fontSize:15, fontWeight:600, marginBottom:10, lineHeight:1.4 }}>{entry.title}</div>
        <div style={{ fontSize:12.5, color:'var(--muted)', lineHeight:1.65, marginBottom:16 }}>{entry.body}</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {[
            { label:'Client', val: entry.client },
            { label:'Added',  val: entry.date },
            { label:'Win Rate', val: winRate !== null ? `${winRate}% (${entry.wins}/${entry.uses})` : 'No data' },
          ].map(m => (
            <div key={m.label} style={{ background:'var(--ink)', borderRadius:5, padding:'8px 10px' }}>
              <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>{m.label}</div>
              <div style={{ fontSize:11.5, color:'var(--text)', fontFamily:"'IBM Plex Mono',monospace" }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Memory() {
  const [tagFilter, setTagFilter]       = useState('ALL')
  const [clientFilter, setClientFilter] = useState('All clients')
  const [search, setSearch]             = useState('')
  const [selected, setSelected]         = useState(null)

  const filtered = useMemo(() => MEMORY_ENTRIES.filter(e => {
    if (tagFilter !== 'ALL' && e.tag !== tagFilter) return false
    if (clientFilter !== 'All clients' && e.client !== clientFilter && e.client !== 'All') return false
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.body.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [tagFilter, clientFilter, search])

  const stats = {
    hooks:   MEMORY_ENTRIES.filter(e=>e.tag==='HOOK').length,
    timing:  MEMORY_ENTRIES.filter(e=>e.tag==='TIMING').length,
    fails:   MEMORY_ENTRIES.filter(e=>e.tag==='FAIL').length,
    avgWin:  Math.round(MEMORY_ENTRIES.filter(e=>e.uses>0).reduce((s,e)=>s+e.wins/e.uses,0) / MEMORY_ENTRIES.filter(e=>e.uses>0).length * 100),
  }

  return (
    <div style={{ padding:16, maxWidth:1300, margin:'0 auto' }}>
      {selected && <EntryModal entry={selected} onClose={() => setSelected(null)} />}

      {/* summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px,1fr))', gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
        {[
          { label:'Total Entries',  val: MEMORY_ENTRIES.length,    color:'var(--text)' },
          { label:'Hooks',          val: stats.hooks,              color:'var(--gold)' },
          { label:'Timing Rules',   val: stats.timing,             color:'var(--profit)' },
          { label:'Failure Logs',   val: stats.fails,              color:'var(--loss)' },
          { label:'Avg Win Rate',   val:`${stats.avgWin}%`,        color: stats.avgWin >= 70 ? 'var(--profit)' : 'var(--warn)' },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--panel)', padding:'12px 16px' }}>
            <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:4 }}>{k.label}</div>
            <div className="mono" style={{ fontSize:17, fontWeight:600, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* filters row */}
      <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        {/* search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search memory..."
          style={{
            background:'var(--panel)', border:'1px solid var(--line)', borderRadius:6,
            padding:'7px 12px', color:'var(--text)', fontSize:12, outline:'none',
            fontFamily:'inherit', width:220,
          }}
        />
        {/* tag filter */}
        <div style={{ display:'flex', gap:4 }}>
          {TAGS.map(t => (
            <button key={t} onClick={() => setTagFilter(t)} style={{
              padding:'4px 10px', borderRadius:5, fontSize:9.5, fontWeight:700, letterSpacing:.5,
              textTransform:'uppercase', cursor:'pointer', transition:'.15s',
              border: tagFilter===t ? `1px solid ${TAG_STYLE[t]?.color || 'rgba(212,175,55,.6)'}` : '1px solid var(--line)',
              background: tagFilter===t ? (TAG_STYLE[t]?.bg || 'rgba(212,175,55,.1)') : 'transparent',
              color: tagFilter===t ? (TAG_STYLE[t]?.color || 'var(--gold)') : 'var(--dim)',
            }}>{t}</button>
          ))}
        </div>
        {/* client filter */}
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} style={{
          background:'var(--panel)', border:'1px solid var(--line)', borderRadius:5,
          padding:'5px 10px', color:'var(--muted)', fontSize:11, outline:'none', cursor:'pointer',
        }}>
          {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize:11, color:'var(--dim)', marginLeft:'auto' }}>{filtered.length} entries</span>
      </div>

      {/* grid */}
      {filtered.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:12 }}>
          {filtered.map(e => <MemoryCard key={e.id} entry={e} onSelect={setSelected} />)}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--dim)', fontSize:13, fontStyle:'italic' }}>
          No memory entries match this filter.
        </div>
      )}

      {/* agent note */}
      <div style={{ marginTop:20, padding:'10px 16px', background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, fontSize:11, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.7 }}>
        <b style={{ color:'var(--gold)' }}>MEMORY AGENT:</b> All agents read this library before every draft. Hooks with ≥3 wins are promoted to Tier-1. Failures are mandatory pre-read. New learnings are written to <b style={{ color:'var(--muted)' }}>memory.md</b> after every Analyzed cycle.
      </div>
    </div>
  )
}
