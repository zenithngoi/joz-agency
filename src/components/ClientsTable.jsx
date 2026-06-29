import { useNavigate } from 'react-router-dom'

const CLIENTS = [
  { name: 'Demo Broker',    industry: 'Forex',       market: 'MY/SG', phase: 'Phase 1', followers: '48,217', roas: '4.2×',  leads: 342,  status: 'ACTIVE' },
  { name: 'E-Shop MY',      industry: 'E-Commerce',  market: 'MY',    phase: 'Phase 2', followers: '22,440', roas: '3.8×',  leads: 194,  status: 'ACTIVE' },
  { name: 'PropFirm SG',    industry: 'Prop Firm',   market: 'SG/ID', phase: 'Phase 1', followers: '9,100',  roas: '—',     leads: 41,   status: 'ONBOARDING' },
]

const STATUS_STYLE = {
  ACTIVE:      { bg: 'rgba(46,189,133,.12)', color: 'var(--profit)' },
  ONBOARDING:  { bg: 'rgba(240,185,11,.12)', color: 'var(--warn)' },
  PAUSED:      { bg: 'rgba(246,70,93,.12)',  color: 'var(--loss)' },
}

export default function ClientsTable() {
  const navigate = useNavigate()

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
            {CLIENTS.map((c, i) => (
              <tr key={c.name}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/clients')}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--panel-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none', color: 'var(--muted)' }}>{c.industry}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--dim)' }}>{c.market}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none', color: 'var(--dim)' }}>{c.phase}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace" }}>{c.followers}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--profit)' }}>{c.roas}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none', fontFamily: "'IBM Plex Mono', monospace" }}>{c.leads}</td>
                <td style={{ padding: '11px 14px', borderBottom: i < CLIENTS.length-1 ? '1px solid var(--line-2)' : 'none' }}>
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
