import { useState } from 'react'

const INITIAL_ADS = [
  { id:1, rank:1, name:'"RM0 → RM10k Shop" hook', platform:'TIKTOK · boosted organic viral', spend:'RM 920', cpa:'RM 8.40', roas:6.8, status:'SCALING', scaled:true },
  { id:2, rank:2, name:'IB Rebate explainer v3',   platform:'YOUTUBE · shorts',               spend:'RM 640', cpa:'RM 11.20',roas:4.9, status:'LIVE',    scaled:false },
  { id:3, rank:3, name:'"Trade higher. Earn higher."',platform:'INSTAGRAM · reels',            spend:'RM 480', cpa:'RM 14.70',roas:3.4, status:'LIVE',    scaled:false },
  { id:4, rank:4, name:'Prop firm myth-bust thread', platform:'X · promoted',                  spend:'RM 210', cpa:'RM 26.90',roas:1.9, status:'WATCH',   scaled:false },
  { id:5, rank:5, name:'Generic brand awareness',    platform:'INSTAGRAM · feed',              spend:'RM 350', cpa:'RM 41.00',roas:0.8, status:'FLAGGED', scaled:false },
]

const STATUS_STYLE = {
  SCALING: { bg:'rgba(46,189,133,.12)', color:'var(--profit)' },
  LIVE:    { bg:'rgba(46,189,133,.12)', color:'var(--profit)' },
  WATCH:   { bg:'rgba(240,185,11,.12)', color:'var(--warn)' },
  FLAGGED: { bg:'rgba(246,70,93,.12)',  color:'var(--loss)' },
  KILLED:  { bg:'rgba(246,70,93,.08)',  color:'var(--loss)' },
  QUEUED:  { bg:'rgba(212,175,55,.12)', color:'var(--gold)' },
}

const roasColor = r => r >= 3 ? 'var(--profit)' : r >= 1.5 ? 'var(--warn)' : 'var(--loss)'

export default function AdsBook() {
  const [ads, setAds] = useState(INITIAL_ADS)
  const [toast, setToast] = useState(null)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const killAd = id => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, status:'KILLED', killed:true } : a))
    showToast('⚠️ Human approval required — kill queued for review')
  }

  const scaleAd = id => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, status:'SCALING', scaled:true } : a))
    showToast('📋 +20% budget increase queued — pending human approval')
  }

  return (
    <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:'var(--radius)', overflow:'hidden', position:'relative' }}>
      {/* toast */}
      {toast && (
        <div style={{
          position:'absolute', top:12, right:12, zIndex:10,
          background:'var(--panel-2)', border:'1px solid var(--gold)',
          borderRadius:7, padding:'8px 14px', fontSize:12, color:'var(--gold)',
          fontFamily:"'IBM Plex Mono', monospace"
        }}>{toast}</div>
      )}

      {/* header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid var(--line)' }}>
        <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
          <b style={{ color:'var(--gold)' }}>ADS BOOK</b> — ranked by ROAS · auto-rules armed
        </div>
        <div style={{ fontSize:9.5, padding:'3px 8px', borderRadius:20, border:'1px solid rgba(46,189,133,.4)', color:'var(--profit)', letterSpacing:.5 }}>
          ● {ads.filter(a=>a.status!=='KILLED').length} LIVE
        </div>
      </div>

      {/* table */}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr>
              {['#','Campaign','Spend','CPA','ROAS','Status','Action'].map(h => (
                <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:9.5, letterSpacing:1.2, textTransform:'uppercase', color:'var(--dim)', borderBottom:'1px solid var(--line)', fontWeight:600, fontFamily:"'IBM Plex Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ads.map((ad, i) => (
              <tr key={ad.id} style={{ opacity: ad.killed ? .35 : 1, textDecoration: ad.killed ? 'line-through' : 'none' }}>
                <td style={{ padding:'10px 14px', borderBottom: i<ads.length-1?'1px solid var(--line-2)':'none' }}>
                  <span style={{
                    display:'inline-grid', placeItems:'center', width:22, height:22, borderRadius:6, fontSize:11, fontWeight:600,
                    background: ad.rank===1 ? 'rgba(212,175,55,.15)' : 'var(--panel-2)',
                    color: ad.rank===1 ? 'var(--gold)' : 'var(--muted)',
                    border: `1px solid ${ad.rank===1 ? 'rgba(212,175,55,.4)' : 'var(--line)'}`,
                    fontFamily:"'IBM Plex Mono', monospace"
                  }}>{ad.rank}</span>
                </td>
                <td style={{ padding:'10px 14px', borderBottom: i<ads.length-1?'1px solid var(--line-2)':'none' }}>
                  <div style={{ fontWeight:600, color: ad.scaled?'var(--gold-bright)':'var(--text)' }}>{ad.name}</div>
                  <div style={{ fontSize:10, color:'var(--dim)', letterSpacing:.5, marginTop:2, fontFamily:"'IBM Plex Mono', monospace" }}>{ad.platform}</div>
                </td>
                <td style={{ padding:'10px 14px', borderBottom: i<ads.length-1?'1px solid var(--line-2)':'none', fontFamily:"'IBM Plex Mono', monospace", color:'var(--muted)' }}>{ad.spend}</td>
                <td style={{ padding:'10px 14px', borderBottom: i<ads.length-1?'1px solid var(--line-2)':'none', fontFamily:"'IBM Plex Mono', monospace", color:'var(--muted)' }}>{ad.cpa}</td>
                <td style={{ padding:'10px 14px', borderBottom: i<ads.length-1?'1px solid var(--line-2)':'none', fontFamily:"'IBM Plex Mono', monospace", color: roasColor(ad.roas), fontWeight:600 }}>{ad.roas}×</td>
                <td style={{ padding:'10px 14px', borderBottom: i<ads.length-1?'1px solid var(--line-2)':'none' }}>
                  <span style={{ fontSize:9.5, padding:'3px 8px', borderRadius:5, letterSpacing:.5, fontFamily:"'IBM Plex Mono', monospace", fontWeight:600, ...STATUS_STYLE[ad.status] }}>
                    {ad.status}
                  </span>
                </td>
                <td style={{ padding:'10px 14px', borderBottom: i<ads.length-1?'1px solid var(--line-2)':'none' }}>
                  {!ad.killed && (
                    ad.roas >= 3 ? (
                      <button onClick={() => scaleAd(ad.id)} style={{
                        fontSize:10, padding:'4px 10px', borderRadius:5, border:'1px solid rgba(46,189,133,.45)',
                        background:'transparent', color:'var(--profit)', fontWeight:600, letterSpacing:1, textTransform:'uppercase',
                        cursor:'pointer', transition:'.15s'
                      }}>Scale +20%</button>
                    ) : (
                      <button onClick={() => killAd(ad.id)} style={{
                        fontSize:10, padding:'4px 10px', borderRadius:5, border:'1px solid rgba(246,70,93,.45)',
                        background:'transparent', color:'var(--loss)', fontWeight:600, letterSpacing:1, textTransform:'uppercase',
                        cursor:'pointer', transition:'.15s'
                      }}>Kill</button>
                    )
                  )}
                  {ad.killed && <span style={{ fontSize:10, color:'var(--dim)', fontFamily:"'IBM Plex Mono', monospace" }}>killed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* auto-rules footer */}
      <div style={{ padding:'8px 14px', fontSize:11, color:'var(--dim)', borderTop:'1px solid var(--line)', fontFamily:"'IBM Plex Mono', monospace", lineHeight:1.7 }}>
        <b style={{ color:'var(--muted)' }}>AUTO-RULES:</b> KILL if CPA &gt; 2× target after RM50 · KILL if CTR &lt; 0.8% @ 1k impr · SCALE +20%/day if ROAS &gt; 3× for 48h · BOOST organic if top-10% velocity in 3h
      </div>
    </div>
  )
}
