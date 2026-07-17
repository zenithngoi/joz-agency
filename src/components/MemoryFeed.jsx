import { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'
import Skeleton from './Skeleton.jsx'

const TAG_COLORS = {
  HOOK:   'var(--gold)',
  TIMING: 'var(--profit)',
  ADS:    'var(--warn)',
  FAIL:   'var(--loss)',
  CLIENT: 'var(--gold-bright)',
}

function isToday(dateStr) {
  if (!dateStr) return false
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

export default function MemoryFeed() {
  const [entries, setEntries] = useState([])
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    api.getMemory()
      .then(data => { setEntries(data || []); setError(null) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [load])

  // Most recent first. Entries are unshifted server-side on create, but sort
  // defensively by id (fallback timestamp-ish) so the feed is stable regardless.
  const latest = [...entries]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 3)
  const todayCount = entries.filter(e => isToday(e.date)).length

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          <b style={{ color: 'var(--gold)' }}>MEMORY.MD</b> — latest learnings
        </div>
        <div style={{ fontSize: 9.5, padding: '3px 8px', borderRadius: 20, border: '1px solid var(--line)', color: 'var(--muted)', letterSpacing: .5 }}>
          +{todayCount} TODAY
        </div>
      </div>

      {error && (
        <div style={{ padding:'10px 14px', fontSize:11, color:'var(--loss)', fontFamily:"'IBM Plex Mono',monospace" }}>
          ⚠ Backend error: {error}
        </div>
      )}

      {loading && (
        <div style={{ display:'flex', flexDirection:'column' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ padding:'9px 14px', borderBottom: i < 2 ? '1px solid var(--line-2)' : 'none' }}>
              <Skeleton width={110} height={9} style={{ marginBottom: 6 }} />
              <Skeleton width="90%" height={12} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && latest.length === 0 && (
        <div style={{ padding:'18px 14px', fontSize:11, color:'var(--dim)', textAlign:'center', fontStyle:'italic' }}>No memory entries yet.</div>
      )}

      {/* feed */}
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {!loading && latest.map((e, i) => (
          <div key={e.id ?? i} style={{
            padding: '9px 14px',
            borderBottom: i < latest.length - 1 ? '1px solid var(--line-2)' : 'none',
            fontSize: 11.5, lineHeight: 1.6
          }}>
            <div className="mono" style={{ fontSize: 9.5, color: 'var(--dim)', letterSpacing: .5, marginBottom: 3 }}>
              {e.date || '—'} · {e.client}
            </div>
            <span style={{ color: TAG_COLORS[e.tag] || 'var(--gold)', fontSize: 9.5, fontWeight: 700, letterSpacing: 1, marginRight: 6 }}>
              {e.tag}
            </span>
            <span style={{ color: 'var(--muted)' }}>{e.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
