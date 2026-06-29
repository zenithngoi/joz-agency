const KPIS = [
  { lbl: 'Total Followers', val: '48,217', chg: '▲ +1,184 today', up: true },
  { lbl: 'Reach (7d)', val: '2.31M', chg: '▲ +18.4% WoW', up: true },
  { lbl: 'Leads (MTD)', val: '342', chg: '▲ 14 today', up: true },
  { lbl: 'Lead → Client', val: '7.9%', chg: '▲ +0.6 pts', up: true },
  { lbl: 'Ad Spend (MTD)', val: 'RM 4,820', chg: 'cap RM 6,000', gold: true },
  { lbl: 'Blended ROAS', val: '4.2×', chg: '▲ from 3.6×', up: true },
]

export default function KpiStrip() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 1,
      background: 'var(--line)',
      borderBottom: '1px solid var(--line)',
    }}>
      {KPIS.map(k => (
        <div key={k.lbl} style={{ background: 'var(--ink)', padding: '14px 18px' }}>
          <div style={{ fontSize: 9, letterSpacing: 1.5, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 6 }}>
            {k.lbl}
          </div>
          <div className="mono" style={{
            fontSize: 22, fontWeight: 600,
            color: k.gold ? 'var(--gold-bright)' : k.up ? 'var(--text)' : 'var(--text)'
          }}>
            {k.val}
          </div>
          <div className="mono" style={{
            fontSize: 10, marginTop: 3,
            color: k.gold ? 'var(--dim)' : k.up ? 'var(--profit)' : 'var(--loss)'
          }}>
            {k.chg}
          </div>
        </div>
      ))}
    </div>
  )
}
