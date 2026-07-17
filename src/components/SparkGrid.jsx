const PLATFORMS = [
  { name: 'TikTok',    growth: '+9.1%', followers: '21,480', er: '7.2%', freq: '2 posts/day', pts: '0,30 15,28 30,26 45,21 60,22 75,16 90,12 105,8 120,4' },
  { name: 'YouTube',   growth: '+5.4%', followers: '9,860',  er: '5.8%', freq: '1 short/day', pts: '0,29 20,27 40,26 60,22 80,20 100,15 120,11' },
  { name: 'Instagram', growth: '+6.7%', followers: '12,340', er: '6.1%', freq: '1 reel/day',  pts: '0,31 20,29 40,24 60,25 80,18 100,14 120,9' },
  { name: 'X',         growth: '+3.2%', followers: '4,537',  er: '2.9%', freq: '3 posts/day', pts: '0,30 20,29 40,27 60,26 80,23 100,20 120,17' },
]

export default function SparkGrid() {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          <b style={{ color: 'var(--gold)' }}>PROFILE GROWTH</b> — 30 day
        </div>
        <div style={{ fontSize: 9.5, padding: '3px 8px', borderRadius: 20, border: '1px solid var(--line)', color: 'var(--muted)', letterSpacing: .5 }}>
          4 PLATFORMS
        </div>
      </div>

      {/* spark grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 1, background: 'var(--line)'
      }}>
        {PLATFORMS.map(p => {
          // build polygon area points
          const pts = p.pts
          const polyPts = pts + ` 120,34 0,34`
          return (
            <div key={p.name} style={{ background: 'var(--panel)', padding: '14px 16px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
                color: 'var(--muted)', fontWeight: 600, marginBottom: 6
              }}>
                <span>{p.name}</span>
                <span style={{ color: 'var(--profit)' }}>{p.growth}</span>
              </div>
              <div className="mono" style={{ fontSize: 19, fontWeight: 600 }}>{p.followers}</div>
              <svg viewBox="0 0 120 34" style={{ width: '100%', height: 34, marginTop: 8 }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`g-${p.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#D4AF37" stopOpacity=".35" />
                    <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={polyPts} fill={`url(#g-${p.name})`} opacity=".5" />
                <polyline points={p.pts} fill="none" stroke="var(--gold)" strokeWidth="1.5" />
              </svg>
              <div className="mono" style={{ fontSize: 10, color: 'var(--dim)', marginTop: 6 }}>
                ER {p.er} · {p.freq}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
