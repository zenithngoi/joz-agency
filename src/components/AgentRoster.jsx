import { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'
import Skeleton from './Skeleton.jsx'

const AGENT_META = {
  orchestrator: { emoji: '🧭', role: 'Command & Control' },
  research:     { emoji: '🔎', role: 'Intel & Trends' },
  content:      { emoji: '✍️', role: 'Creation' },
  seo:          { emoji: '🔍', role: 'Visibility' },
  publishing:   { emoji: '📤', role: 'Distribution' },
  analytics:    { emoji: '📊', role: 'Intelligence' },
  ads:          { emoji: '🎯', role: 'Paid Growth' },
  memory:       { emoji: '🧠', role: 'Intelligence' },
}

const STATE_COLOR = {
  WORKING: 'var(--profit)',
  DONE:    'var(--dim)',
  QUEUED:  'var(--dim)',
  IDLE:    'var(--dim)',
  ERROR:   'var(--loss)',
}

function timeAgo(iso) {
  if (!iso) return 'never run'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'never run'
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function AgentRoster() {
  const [agents, setAgents] = useState([])
  const [error, setError]   = useState(null)

  const load = useCallback(() => {
    api.getAgents()
      .then(data => { setAgents(data || []); setError(null) })
      .catch(e => setError(e.message))
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [load])

  const activeCount = agents.filter(a => a.status === 'WORKING' || a.status === 'QUEUED').length

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          <b style={{ color: 'var(--gold)' }}>AGENT</b> ROSTER
        </div>
        <div style={{ fontSize: 9.5, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(46,189,133,.4)', color: 'var(--profit)', letterSpacing: .5 }}>
          ● {agents.length} TOTAL{activeCount > 0 ? ` · ${activeCount} ACTIVE` : ''}
        </div>
      </div>

      {error && (
        <div style={{ padding:'10px 14px', fontSize:11, color:'var(--loss)', fontFamily:"'IBM Plex Mono',monospace" }}>
          ⚠ Backend error: {error}
        </div>
      )}

      {!error && agents.length === 0 && (
        <div style={{ display:'flex', flexDirection:'column' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderBottom: i < 3 ? '1px solid var(--line-2)' : 'none' }}>
              <Skeleton width={28} height={28} radius={7} />
              <div style={{ flex:1 }}>
                <Skeleton width="55%" height={12} style={{ marginBottom: 6 }} />
                <Skeleton width="80%" height={10} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* agents */}
      {agents.map((a, i) => {
        const meta = AGENT_META[a.id] || { emoji: '●', role: '' }
        return (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px',
            borderBottom: i < agents.length - 1 ? '1px solid var(--line-2)' : 'none'
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'var(--panel-2)', border: '1px solid var(--line)',
              display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0
            }}>{meta.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: 'var(--dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {meta.role}{meta.role ? ' · ' : ''}loop #{a.loopCount ?? 0} · {timeAgo(a.lastRun)}
              </div>
            </div>
            <div className="mono" style={{ fontSize: 9, letterSpacing: 1, fontWeight: 600, color: STATE_COLOR[a.status] || 'var(--dim)', flexShrink: 0 }}>
              {a.status}
            </div>
          </div>
        )
      })}
    </div>
  )
}
