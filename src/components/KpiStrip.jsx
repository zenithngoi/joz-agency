import { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'
import Skeleton from './Skeleton.jsx'

function timeAgo(iso) {
  if (!iso) return 'Never'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Never'
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function KpiStrip() {
  const [clients, setClients]   = useState([])
  const [loop, setLoop]         = useState(null)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    try {
      const [clientData, loopData] = await Promise.all([api.getClients(), api.getLoopStatus()])
      setClients(clientData || [])
      setLoop(loopData || null)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 8000)
    return () => clearInterval(t)
  }, [load])

  const totalFollowers = clients.reduce((sum, c) => {
    const f = c.followers || {}
    return sum + Object.values(f).reduce((s, v) => s + (Number(v) || 0), 0)
  }, 0)
  const totalLeads     = clients.reduce((s, c) => s + (Number(c.leads) || 0), 0)
  const totalConverted = clients.reduce((s, c) => s + (Number(c.clients_converted) || 0), 0)
  const totalSpend     = clients.reduce((s, c) => s + (Number(c.adSpend) || 0), 0)
  const roasValues     = clients.map(c => c.roas).filter(r => typeof r === 'number' && !Number.isNaN(r))
  const blendedRoas     = roasValues.length > 0 ? (roasValues.reduce((a, b) => a + b, 0) / roasValues.length) : null
  const leadToClientPct = totalLeads > 0 ? (totalConverted / totalLeads * 100) : null

  const KPIS = [
    { lbl:'Total Followers', val: totalFollowers.toLocaleString(), sub: `${clients.length} client${clients.length === 1 ? '' : 's'}`, color:'text' },
    { lbl:'Loop Status', val: loop ? `#${loop.loopNumber ?? '—'}` : '—', sub: loop?.running ? `RUNNING · ${loop.currentAgent || '...'}` : 'IDLE', color: loop?.running ? 'profit' : 'dim' },
    { lbl:'Last Run', val: loop ? timeAgo(loop.startedAt) : '—', sub:'loop start', color:'dim' },
    { lbl:'Leads (MTD)', val: totalLeads.toLocaleString(), sub: `${totalConverted} converted`, color:'profit' },
    { lbl:'Lead → Client', val: leadToClientPct !== null ? `${leadToClientPct.toFixed(1)}%` : '—', sub:'conversion', color:'profit' },
    { lbl:'Ad Spend (MTD)', val: `RM ${totalSpend.toLocaleString()}`, sub:'across all clients', color:'gold' },
    { lbl:'Blended ROAS', val: blendedRoas !== null ? `${blendedRoas.toFixed(1)}×` : '—', sub: blendedRoas !== null ? (blendedRoas >= 3 ? 'above target' : 'below target') : 'no data', color: blendedRoas !== null ? (blendedRoas >= 3 ? 'profit' : 'warn') : 'dim' },
  ]

  const COLOR_MAP = {
    text: 'var(--text)', profit: 'var(--profit)', gold: 'var(--gold-bright)', warn: 'var(--warn)', dim: 'var(--dim)',
  }

  return (
    <div className="kpi-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 1,
      background: 'var(--line)',
      borderBottom: '1px solid var(--line)',
    }}>
      {error && (
        <div style={{ background:'var(--ink)', padding:'14px 18px', gridColumn:'1 / -1', fontSize:11, color:'var(--loss)', fontFamily:"'IBM Plex Mono',monospace" }}>
          ⚠ Backend error: {error}
        </div>
      )}
      {loading ? (
        Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--ink)', padding: '14px 18px' }}>
            <Skeleton width={70} height={9} style={{ marginBottom: 8 }} />
            <Skeleton width={90} height={22} style={{ marginBottom: 6 }} />
            <Skeleton width={60} height={10} />
          </div>
        ))
      ) : KPIS.map(k => (
        <div key={k.lbl} style={{ background: 'var(--ink)', padding: '14px 18px' }}>
          <div style={{ fontSize: 9, letterSpacing: 1.5, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 6 }}>
            {k.lbl}
          </div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: COLOR_MAP[k.color] || 'var(--text)' }}>
            {k.val}
          </div>
          <div className="mono" style={{ fontSize: 10, marginTop: 3, color: 'var(--muted)' }}>
            {k.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
