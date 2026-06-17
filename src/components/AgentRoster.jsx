const AGENTS = [
  { emoji: '🧭', name: 'Orchestrator',   role: 'Command & Control',   task: 'Running daily loop · step 4/8',              state: 'WORKING',  color: 'var(--profit)' },
  { emoji: '🔎', name: 'Research',        role: 'Intel & Trends',       task: 'Scanning prop-firm trends MY/SG/ID',          state: 'DONE',     color: 'var(--dim)' },
  { emoji: '✍️', name: 'Content',         role: 'Creation',             task: 'Drafting SMC pt.4 TikTok script',             state: 'WORKING',  color: 'var(--profit)' },
  { emoji: '🔍', name: 'SEO & GEO',       role: 'Visibility',           task: 'On-page 8.4/10 · GEO 7.2/10 · 3 wins staged', state: 'QUEUED',   color: 'var(--dim)' },
  { emoji: '📤', name: 'Publishing',      role: 'Distribution',         task: 'Next post: 8:00 PM MYT (YouTube)',            state: 'QUEUED',   color: 'var(--dim)' },
  { emoji: '📊', name: 'Analytics',       role: 'Intelligence',         task: '+24h pull on 6 posts · velocity calc',        state: 'WORKING',  color: 'var(--profit)' },
  { emoji: '🎯', name: 'Ads Manager',     role: 'Paid Growth',          task: 'Awaiting approval: kill campaign #5',          state: 'NEEDS YOU',color: 'var(--warn)' },
  { emoji: '🧠', name: 'Memory',          role: 'Intelligence',         task: '3 new insights staged → memory.md',           state: 'WORKING',  color: 'var(--profit)' },
]

export default function AgentRoster() {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          <b style={{ color: 'var(--gold)' }}>AGENT</b> ROSTER
        </div>
        <div style={{ fontSize: 9.5, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(46,189,133,.4)', color: 'var(--profit)', letterSpacing: .5 }}>
          ● 8 ACTIVE
        </div>
      </div>

      {/* agents */}
      {AGENTS.map((a, i) => (
        <div key={a.name} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 14px',
          borderBottom: i < AGENTS.length - 1 ? '1px solid var(--line-2)' : 'none'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'var(--panel-2)', border: '1px solid var(--line)',
            display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0
          }}>{a.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{a.name}</div>
            <div style={{ fontSize: 10, color: 'var(--dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {a.task}
            </div>
          </div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: 1, fontWeight: 600, color: a.color, flexShrink: 0 }}>
            {a.state}
          </div>
        </div>
      ))}
    </div>
  )
}
