const STAGES = [
  {
    name:'Ideas', count:3,
    cards:[
      { title:'Funded trader payout reaction', platform:'TIKTOK' },
      { title:'Rebate math in 30 sec',         platform:'IG REEL' },
      { title:'"Brokers hate this" hook',       platform:'YT SHORT' },
    ]
  },
  {
    name:'Drafting', count:2,
    cards:[
      { title:'Smart Money Concepts pt.4', platform:'TIKTOK · script 80%' },
      { title:'Client case study thread',  platform:'X' },
    ]
  },
  {
    name:'SEO Review', count:1,
    cards:[
      { title:'Volume Profile myth-bust',  platform:'YT · SEO score 8.4/10' },
    ]
  },
  {
    name:'Scheduled', count:1,
    cards:[
      { title:'Volume Profile myth', platform:'YT · 8:00 PM MYT' },
    ]
  },
  {
    name:'Posted', count:1,
    cards:[
      { title:'"RM0 → RM10k" v2', platform:'TIKTOK · 2h ago' },
    ]
  },
  {
    name:'Analyzed', count:1,
    cards:[
      { title:'MACD strategy reel', platform:'ER 8.4% → memory.md ✓' },
    ]
  },
]

export default function ContentPipeline() {
  return (
    <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:'var(--radius)', overflow:'hidden' }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid var(--line)' }}>
        <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
          <b style={{ color:'var(--gold)' }}>CONTENT PIPELINE</b> — Kanban
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ fontSize:9.5, padding:'3px 8px', borderRadius:20, border:'1px solid var(--line)', color:'var(--muted)', letterSpacing:.5 }}>
            9 IN FLIGHT
          </div>
          <button style={{
            fontSize:9.5, padding:'3px 10px', borderRadius:5,
            border:'1px solid rgba(212,175,55,.4)', background:'var(--gold-dim)',
            color:'var(--gold)', fontWeight:600, letterSpacing:1, textTransform:'uppercase', cursor:'pointer'
          }}>+ New</button>
        </div>
      </div>

      {/* kanban board */}
      <div style={{
        display:'grid',
        gridTemplateColumns:`repeat(${STAGES.length}, minmax(130px, 1fr))`,
        gap:1, background:'var(--line)',
        fontSize:11, overflowX:'auto'
      }}>
        {STAGES.map(stage => (
          <div key={stage.name} style={{ background:'var(--ink)', padding:'12px 10px' }}>
            {/* column header */}
            <div style={{
              fontSize:9, letterSpacing:1.5, color:'var(--dim)', textTransform:'uppercase',
              fontWeight:600, marginBottom:8, display:'flex', justifyContent:'space-between'
            }}>
              <span>{stage.name}</span>
              <span className="mono" style={{ color:'var(--gold)' }}>{stage.count}</span>
            </div>
            {/* cards */}
            {stage.cards.map((card, i) => (
              <div key={i} style={{
                background:'var(--panel-2)',
                border:'1px solid var(--line)',
                borderLeft:'2px solid var(--gold)',
                borderRadius:5, padding:'7px 9px', marginBottom:6,
                cursor:'pointer', transition:'.15s',
                lineHeight:1.4
              }}
              onMouseEnter={e => e.currentTarget.style.borderLeftColor='var(--gold-bright)'}
              onMouseLeave={e => e.currentTarget.style.borderLeftColor='var(--gold)'}
              >
                <div style={{ fontSize:11, fontWeight:500, color:'var(--text)', marginBottom:3 }}>{card.title}</div>
                <div style={{ fontSize:9.5, color:'var(--dim)', letterSpacing:.5, fontFamily:"'IBM Plex Mono', monospace" }}>{card.platform}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
