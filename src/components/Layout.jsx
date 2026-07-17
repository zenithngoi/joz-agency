import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { api } from '../api.js'

const NAV = [
  { to: '/dashboard', icon: '⬛', label: 'Dashboard' },
  { to: '/clients',   icon: '👥', label: 'Clients' },
  { to: '/content',   icon: '✍️', label: 'Content' },
  { to: '/ads',       icon: '🎯', label: 'Ads' },
  { to: '/memory',    icon: '🧠', label: 'Memory' },
  { to: '/reports',   icon: '📊', label: 'Reports' },
  { to: '/settings',  icon: '⚙️', label: 'Settings' },
]

const TICKER_MSGS = [
  'Analytics: "RM0→RM10k" v2 hit top-10% velocity — boost flagged',
  'Memory Agent: 3 new insights staged · compound value growing',
  'Ads Manager: ROAS 4.2× → scale +20% queued for Campaign #1',
  'SEO & GEO Agent: brand now appearing in Perplexity answers',
  'Research Agent: 4 trending hooks found → research/today.md',
  'Content Agent: TikTok script drafted · hook score 94/100',
]

const STATUS_COLOR = { WORKING:'var(--profit)', DONE:'var(--dim)', QUEUED:'var(--dim)', IDLE:'var(--dim)', ERROR:'var(--loss)', 'NEEDS YOU':'var(--warn)' }

export default function Layout() {
  const [tick, setTick]           = useState(0)
  const [agents, setAgents]       = useState([])
  const [loopStatus, setLoop]     = useState({ running:false, loopNumber:12 })
  const [backendOk, setBackendOk] = useState(null) // null=checking, true, false
  const location = useLocation()

  // rotate ticker every 4.5s
  useEffect(() => {
    const t = setInterval(() => setTick(i => (i + 1) % TICKER_MSGS.length), 4500)
    return () => clearInterval(t)
  }, [])

  // poll backend every 5s
  const pollBackend = useCallback(async () => {
    try {
      const [agentData, loopData] = await Promise.all([api.getAgents(), api.getLoopStatus()])
      setAgents(agentData)
      setLoop(loopData)
      setBackendOk(true)
    } catch {
      setBackendOk(false)
    }
  }, [])

  useEffect(() => {
    pollBackend()
    const t = setInterval(pollBackend, 5000)
    return () => clearInterval(t)
  }, [pollBackend])

  const triggerLoop = async () => {
    try {
      await api.startLoop('demo-broker')
      pollBackend()
    } catch (e) {
      alert(e.message)
    }
  }

  const pageTitle = NAV.find(n => location.pathname.startsWith(n.to))?.label || 'Dashboard'

  // sidebar agents: show first 4 or live agents from backend
  const sidebarAgents = agents.length > 0
    ? agents.slice(0, 4).map(a => ({ emoji: '●', name: a.name, state: a.status, color: STATUS_COLOR[a.status] || 'var(--dim)' }))
    : [
        { emoji:'🧭', name:'Orchestrator', state:'IDLE', color:'var(--dim)' },
        { emoji:'🔎', name:'Research',     state:'IDLE', color:'var(--dim)' },
        { emoji:'✍️', name:'Content',      state:'IDLE', color:'var(--dim)' },
        { emoji:'🎯', name:'Ads',          state:'IDLE', color:'var(--dim)' },
      ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* TOPBAR */}
      <header style={{
        height: 'var(--topbar-h)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: '1px solid var(--line)',
        background: 'linear-gradient(180deg,#0E1220,var(--ink))',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, border: '1.5px solid var(--gold)',
            borderRadius: 8, display: 'grid', placeItems: 'center',
            color: 'var(--gold)', fontWeight: 700, fontSize: 15, letterSpacing: 1
          }}>J</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: 2 }}>
              JOZ<span style={{ color: 'var(--gold)' }}>MARKETING</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              AI Command Center
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: 1 }}>OPERATING DAY</div>
            <div className="mono" style={{ fontSize: 13, color: 'var(--gold)' }}>001</div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--gold-dim)', border: '1px solid rgba(212,175,55,.3)',
            display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700, color: 'var(--gold)'
          }}>Z</div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 'var(--sidebar-w)', flexShrink: 0,
          borderRight: '1px solid var(--line)',
          background: 'var(--panel)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <nav style={{ flex: 1, padding: '12px 0' }}>
            {NAV.map(({ to, icon, label }) => (
              <NavLink key={to} to={to} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 18px',
                fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--gold-bright)' : 'var(--muted)',
                borderRight: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                background: isActive ? 'var(--gold-dim)' : 'transparent',
                letterSpacing: '.5px', transition: '.15s'
              })}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* sidebar footer — live agent status + loop trigger */}
          <div style={{ borderTop: '1px solid var(--line)', padding: '12px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={{ fontSize: 9, letterSpacing: 1.5, color: 'var(--dim)', textTransform: 'uppercase' }}>
                Loop #{loopStatus.loopNumber}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:6, height:6, borderRadius:3, background: backendOk===true ? 'var(--profit)' : backendOk===false ? 'var(--loss)' : 'var(--warn)' }}/>
                <span style={{ fontSize:8.5, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace" }}>
                  {backendOk===true ? 'API' : backendOk===false ? 'OFFLINE' : '...'}
                </span>
              </div>
            </div>
            {sidebarAgents.map(a => (
              <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: a.color }}>●</span>
                <span style={{ fontSize: 10.5, color: 'var(--muted)', flex: 1 }}>{a.name}</span>
                <span className="mono" style={{ fontSize: 9, color: a.color, letterSpacing: .5 }}>{a.state}</span>
              </div>
            ))}
            <button
              onClick={triggerLoop}
              disabled={loopStatus.running}
              style={{
                width:'100%', marginTop:10, padding:'7px 0', borderRadius:6, fontSize:10,
                fontWeight:700, letterSpacing:1, textTransform:'uppercase', cursor: loopStatus.running ? 'not-allowed' : 'pointer',
                border:'1px solid rgba(212,175,55,.5)', background: loopStatus.running ? 'transparent' : 'rgba(212,175,55,.08)',
                color: loopStatus.running ? 'var(--dim)' : 'var(--gold)',
              }}
            >
              {loopStatus.running ? `Running: ${loopStatus.currentAgent || '...'}` : '⚡ Run Loop'}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* page header bar */}
          <div style={{
            padding: '14px 24px', borderBottom: '1px solid var(--line)',
            background: 'var(--panel)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {pageTitle}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: backendOk ? 'var(--profit)' : 'var(--warn)', display: 'inline-block',
                animation: 'pulse 1.6s infinite' }}></span>
              <span className="mono" style={{ fontSize: 10, color: backendOk ? 'var(--profit)' : 'var(--warn)' }}>
                {loopStatus.running ? `LOOP #${loopStatus.loopNumber} RUNNING` : '8 AGENTS READY'}
              </span>
            </div>
          </div>

          {/* page body */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* STICKY TICKER */}
      <div style={{
        height: 34, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px', borderTop: '1px solid var(--line)',
        background: '#0D111B', fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11, color: 'var(--muted)'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--profit)',
          animation: 'pulse 1.4s infinite', flexShrink: 0 }}></span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {TICKER_MSGS[tick]}
        </span>
        <span style={{ color: 'var(--line)', margin: '0 8px' }}>|</span>
        <span style={{ color: 'var(--gold)', flexShrink: 0 }}>3 SLOTS LEFT</span>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  )
}
