import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api.js'
import Skeleton from './Skeleton.jsx'

const STATUS_STYLE = {
  ACTIVE:      { bg: 'rgba(46,189,133,.12)', color: 'var(--profit)' },
  ONBOARDING:  { bg: 'rgba(240,185,11,.12)', color: 'var(--warn)' },
  PAUSED:      { bg: 'rgba(246,70,93,.12)',  color: 'var(--loss)' },
}

function totalFollowers(c) {
  const f = c.followers || {}
  return Object.values(f).reduce((s, v) => s + (Number(v) || 0), 0)
}

export default function ClientsTable() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.getClients()
      .then(data => { setClients(data || []); setError(null) })
      .catch(e => setError(e.message))
  }, [])

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          <b style={{ color: 'var(--gold)' }}>ACTIVE</b> CLIENTS
        </div>
        <button
          onClick={() => navigate('/clients')}
          style={{
            fontSize: 10, padding: '4px 10px', borderRadius: 5,
            border: '1px solid var(--line)', background: 'transparent',
            color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600
          }}
        >
          + Add Client
        </button>
      </div>

      {/* table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {['Client', 'Industry', 'Market', 'Phase', 'Followers', 'ROAS', 'Leads MTD', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '8px 14px', textAlign: 'left',
                  fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase',
                  color: 'var(--dim)', borderBottom: '1px solid var(--line)', fontWeight: 600,
                  fontFamily: "'IBM Plex Mono', monospace"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr><td colSpan={8} style={{ padding:'16px 14px', fontSize:11, color:'var(--loss)', fontFamily:"'IBM Plex Mono',monospace" }}>⚠ Backend error: {error}</td></tr>
            )}
            {!error && clients.length === 0 && (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={8} style={{ padding:'11px 14px', borderBottom: i < 3 ? '1px solid var(--line-2)' : 'none' }}>
                    <Skeleton height={12} />
                  </td>
                </tr>
              ))
            )}
            {clients.map((c, i) => (
              <tr key={c.id ?? c.name}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/clients')}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--panel-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none', color: 'var(--muted)' }}>{c.industry || '—'}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--dim)' }}>{c.market || '—'}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none', color: 'var(--dim)' }}>{c.phase || '—'}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace" }}>{totalFollowers(c).toLocaleString()}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace", color: c.roas != null && c.roas >= 3 ? 'var(--profit)' : c.roas != null ? 'var(--warn)' : 'var(--dim)' }}>{c.roas != null ? `${c.roas}×` : '—'}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace" }}>{c.leads ?? 0}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < clients.length-1 ? '1px solid var(--line-2)' : 'none' }}>
                  <span style={{
                    fontSize: 9.5, padding: '3px 8px', borderRadius: 5,
                    background: STATUS_STYLE[c.status]?.bg,
                    color: STATUS_STYLE[c.status]?.color,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: .5, fontWeight: 600
                  }}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
