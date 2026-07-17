const FUNNEL = [
  { label:'Views',         val:'2.31M', pct:100, rate:null },
  { label:'Profile visits',val:'61,400', pct:46,  rate:'2.7%' },
  { label:'Link clicks',   val:'8,920',  pct:22,  rate:'14.5%' },
  { label:'Leads',         val:'96',     pct:8,   rate:'1.1%' },
  { label:'Clients',       val:'8',      pct:3,   rate:'8.3% ✦' },
]

export default function LeadsFunnel() {
  return (
    <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:'var(--radius)', overflow:'hidden' }}>
      {/* header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid var(--line)' }}>
        <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
          <b style={{ color:'var(--gold)' }}>LEADS FUNNEL</b> — 7 day
        </div>
        <div style={{ fontSize:9.5, padding:'3px 8px', borderRadius:20, border:'1px solid var(--line)', color:'var(--muted)', letterSpacing:.5 }}>
          ATTRIBUTED
        </div>
      </div>

      {/* funnel bars */}
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
        {FUNNEL.map(f => (
          <div key={f.label} style={{ display:'flex', alignItems:'center', gap:10, fontSize:11.5 }}>
            <div style={{ width:96, color:'var(--muted)', flexShrink:0, fontSize:11 }}>{f.label}</div>
            <div style={{
              height:16, width:`${f.pct}%`,
              background:'linear-gradient(90deg, rgba(212,175,55,.75), rgba(212,175,55,.2))',
              borderRadius:3, minWidth:6, transition:'width .6s'
            }}/>
            <div className="mono" style={{ fontSize:11.5, color:'var(--text)' }}>{f.val}</div>
            {f.rate && <div className="mono" style={{ fontSize:10, color:'var(--dim)' }}>{f.rate}</div>}
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{ padding:'8px 14px', fontSize:11, color:'var(--dim)', borderTop:'1px solid var(--line)', fontFamily:"'IBM Plex Mono', monospace", lineHeight:1.7 }}>
        <b style={{ color:'var(--muted)' }}>TOP SOURCE:</b> TikTok boosted viral → 61% of leads · <b style={{ color:'var(--muted)' }}>BEST CLOSER:</b> payout-proof content
      </div>
    </div>
  )
}
