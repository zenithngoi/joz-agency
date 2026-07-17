import { useState, useEffect, useMemo } from 'react'
import { api } from '../api.js'

const TAGS = ['ALL', 'HOOK', 'TIMING', 'ADS', 'FAIL', 'CLIENT']

const TAG_STYLE = {
  HOOK:   { bg:'rgba(212,175,55,.12)', color:'var(--gold)' },
  TIMING: { bg:'rgba(46,189,133,.12)', color:'var(--profit)' },
  ADS:    { bg:'rgba(240,185,11,.12)', color:'var(--warn)' },
  FAIL:   { bg:'rgba(246,70,93,.12)',  color:'var(--loss)' },
  CLIENT: { bg:'rgba(232,199,102,.12)', color:'var(--gold)' },
}

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
  const [entries, setEntries]            = useState([])
  const [tagFilter, setTagFilter]        = useState('ALL')
  const [clientFilter, setClientFilter]  = useState('All clients')
  const [search, setSearch]              = useState('')
  const [selected, setSelected]          = useState(null)
  const [error, setError]                = useState(null)
  const [loading, setLoading]            = useState(true)

  // Derive client list from loaded entries
  const clients = useMemo(() => {
    const names = [...new Set(entries.map(e => e.client).filter(c => c && c !== 'All'))]
    return ['All clients', ...names]
  }, [entries])

  useEffect(() => {
    setLoading(true)
    api.getMemory()
      .then(data => { setEntries(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  // Re-fetch when filters change (server-side filtering)
  useEffect(() => {
    const params = {}
    if (tagFilter !== 'ALL') params.tag = tagFilter
    if (clientFilter !== 'All clients') params.client = clientFilter
    if (search) params.q = search
    api.getMemory(params)
      .then(setEntries)
      .catch(() => {})
  }, [tagFilter, clientFilter, search])

  const stats = useMemo(() => {
    const all = entries
    const withUses = all.filter(e => e.uses > 0)
    return {
      total:  all.length,
      hooks:  all.filter(e => e.tag === 'HOOK').length,
      timing: all.filter(e => e.tag === 'TIMING').length,
      fails:  all.filter(e => e.tag === 'FAIL').length,
      avgWin: withUses.length > 0
        ? Math.round(withUses.reduce((s, e) => s + e.wins / e.uses, 0) / withUses.length * 100)
        : 0,
    }
  }, [entries])

  if (loading) {
    return <div style={{ padding:32, textAlign:'center', color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace", fontSize:12 }}>Loading memory...</div>
  }

  return (
    <div style={{ padding:16, maxWidth:1300, margin:'0 auto' }}>
      {selected && <EntryModal entry={selected} onClose={() => setSelected(null)} />}

      {error && (
        <div style={{ marginBottom:12, padding:'10px 14px', background:'rgba(246,70,93,.1)', border:'1px solid rgba(246,70,93,.3)', borderRadius:6, fontSize:12, color:'var(--loss)', fontFamily:"'IBM Plex Mono',monospace" }}>
          ⚠ Backend error: {error} — check Railway is running
        </div>
      )}

      {/* summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px,1fr))', gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
        {[
          { label:'Total Entries',  val: stats.total,        color:'var(--text)' },
          { label:'Hooks',          val: stats.hooks,        color:'var(--gold)' },
          { label:'Timing Rules',   val: stats.timing,       color:'var(--profit)' },
          { label:'Failure Logs',   val: stats.fails,        color:'var(--loss)' },
          { label:'Avg Win Rate',   val: `${stats.avgWin}%`, color: stats.avgWin >= 70 ? 'var(--profit)' : 'var(--warn)' },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--panel)', padding:'12px 16px' }}>
            <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:4 }}>{k.label}</div>
            <div className="mono" style={{ fontSize:17, fontWeight:600, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* filters row */}
      <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search memory..."
          style={{
            background:'var(--panel)', border:'1px solid var(--line)', borderRadius:6,
            padding:'7px 12px', color:'var(--text)', fontSize:12, outline:'none',
            fontFamily:'inherit', width:220,
          }}
        />
        <div style={{ display:'flex', gap:4 }}>
          {TAGS.map(t => (
            <button key={t} onClick={() => setTagFilter(t)} style={{
              padding:'4px 10px', borderRadius:5, fontSize:9.5, fontWeight:700, letterSpacing:.5,
              textTransform:'uppercase', cursor:'pointer', transition:'.15s',
              border: tagFilter === t ? `1px solid ${TAG_STYLE[t]?.color || 'rgba(212,175,55,.6)'}` : '1px solid var(--line)',
              background: tagFilter === t ? (TAG_STYLE[t]?.bg || 'rgba(212,175,55,.1)') : 'transparent',
              color: tagFilter === t ? (TAG_STYLE[t]?.color || 'var(--gold)') : 'var(--dim)',
            }}>{t}</button>
          ))}
        </div>
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} style={{
          background:'var(--panel)', border:'1px solid var(--line)', borderRadius:5,
          padding:'5px 10px', color:'var(--muted)', fontSize:11, outline:'none', cursor:'pointer',
        }}>
          {clients.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize:11, color:'var(--dim)', marginLeft:'auto' }}>{entries.length} entries</span>
      </div>

      {/* grid */}
      {entries.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:12 }}>
          {entries.map(e => <MemoryCard key={e.id} entry={e} onSelect={setSelected} />)}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--dim)', fontSize:13, fontStyle:'italic' }}>
          No memory entries match this filter.
        </div>
      )}

      <div style={{ marginTop:20, padding:'10px 16px', background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, fontSize:11, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.7 }}>
        <b style={{ color:'var(--gold)' }}>MEMORY AGENT:</b> All agents read this library before every draft. Hooks with ≥3 wins are promoted to Tier-1. Failures are mandatory pre-read. New learnings are written after every Analyzed cycle.
      </div>
    </div>
  )
}
