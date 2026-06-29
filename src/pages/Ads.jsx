import { useState } from 'react'

const INITIAL_ADS = [
  { id:1, rank:1, name:'"RM0 → RM10k Shop" hook',        platform:'TIKTOK',    type:'Boosted organic', client:'Demo Broker', spend:920,  cpa:8.40,  roas:6.8, status:'SCALING', budget:1200, impressions:'284k', ctr:'3.2%', history:[{date:'Jun 14',action:'Created',val:''},{date:'Jun 15',action:'Scale +20%',val:'RM 800→960'},{date:'Jun 16',action:'Scale +20%',val:'RM 960→1,152'}] },
  { id:2, rank:2, name:'IB Rebate explainer v3',           platform:'YOUTUBE',   type:'Shorts',          client:'Demo Broker', spend:640,  cpa:11.20, roas:4.9, status:'LIVE',    budget:640,  impressions:'91k',  ctr:'2.1%', history:[{date:'Jun 12',action:'Created',val:''},{date:'Jun 14',action:'Budget +10%',val:'RM 580→640'}] },
  { id:3, rank:3, name:'"Trade higher. Earn higher."',     platform:'INSTAGRAM', type:'Reels',           client:'Demo Broker', spend:480,  cpa:14.70, roas:3.4, status:'LIVE',    budget:480,  impressions:'67k',  ctr:'1.8%', history:[{date:'Jun 10',action:'Created',val:''}] },
  { id:4, rank:4, name:'Prop firm myth-bust thread',       platform:'X',         type:'Promoted',        client:'PropFirm SG', spend:210,  cpa:26.90, roas:1.9, status:'WATCH',   budget:210,  impressions:'22k',  ctr:'0.9%', history:[{date:'Jun 13',action:'Created',val:''},{date:'Jun 15',action:'Flagged watch',val:'ROAS < 2×'}] },
  { id:5, rank:5, name:'Generic brand awareness',          platform:'INSTAGRAM', type:'Feed',            client:'E-Shop MY',   spend:350,  cpa:41.00, roas:0.8, status:'FLAGGED', budget:350,  impressions:'44k',  ctr:'0.6%', history:[{date:'Jun 11',action:'Created',val:''},{date:'Jun 16',action:'Auto-flagged',val:'ROAS 0.8×'}] },
]

const STATUS_STYLE = {
  SCALING: { bg:'rgba(46,189,133,.12)',  color:'var(--profit)' },
  LIVE:    { bg:'rgba(46,189,133,.12)',  color:'var(--profit)' },
  WATCH:   { bg:'rgba(240,185,11,.12)', color:'var(--warn)' },
  FLAGGED: { bg:'rgba(246,70,93,.12)',  color:'var(--loss)' },
  KILLED:  { bg:'rgba(246,70,93,.06)',  color:'var(--loss)' },
  PAUSED:  { bg:'rgba(74,85,104,.2)',   color:'var(--dim)' },
}

const roasColor = r => !r ? 'var(--dim)' : r >= 3 ? 'var(--profit)' : r >= 1.5 ? 'var(--warn)' : 'var(--loss)'

function ApprovalModal({ action, ad, onConfirm, onCancel }) {
  const isScale = action === 'scale'
  const isKill  = action === 'kill'
  const newBudget = isScale ? Math.round(ad.budget * 1.2) : 0
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={onCancel}>
      <div style={{ background:'var(--panel)', border:`1px solid ${isKill ? 'rgba(246,70,93,.5)' : 'rgba(212,175,55,.5)'}`, borderRadius:10, padding:28, width:400, maxWidth:'90vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color: isKill ? 'var(--loss)' : 'var(--gold)', fontWeight:700, marginBottom:16 }}>
          {isKill ? '⚠️ KILL CONFIRMATION' : '📋 SCALE APPROVAL'}
        </div>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:10 }}>{ad.name}</div>
        <div style={{ background:'var(--ink)', borderRadius:6, padding:'12px 14px', marginBottom:16, display:'flex', flexDirection:'column', gap:8 }}>
          {isScale && <>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'var(--dim)' }}>Current budget</span>
              <span className="mono">RM {ad.budget.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'var(--dim)' }}>New budget (+20%)</span>
              <span className="mono" style={{ color:'var(--profit)' }}>RM {newBudget.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'var(--dim)' }}>Current ROAS</span>
              <span className="mono" style={{ color:'var(--profit)' }}>{ad.roas}×</span>
            </div>
          </>}
          {isKill && <>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'var(--dim)' }}>Current ROAS</span>
              <span className="mono" style={{ color:'var(--loss)' }}>{ad.roas}×</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'var(--dim)' }}>Spend to date</span>
              <span className="mono">RM {ad.spend.toLocaleString()}</span>
            </div>
            <div style={{ fontSize:11, color:'var(--warn)', marginTop:4 }}>
              ⚠️ Auto-rule triggered: ROAS &lt; 1.5× after RM50 minimum spend
            </div>
          </>}
        </div>
        <div style={{ fontSize:11, color:'var(--dim)', marginBottom:18, lineHeight:1.6 }}>
          This action requires human approval. By confirming, you authorise this budget change. All actions are logged.
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'9px 0', borderRadius:6, border:'1px solid var(--line)', background:'transparent', color:'var(--muted)', fontSize:12, cursor:'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex:2, padding:'9px 0', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer',
            border: isKill ? '1px solid rgba(246,70,93,.6)' : '1px solid rgba(212,175,55,.6)',
            background: isKill ? 'rgba(246,70,93,.1)' : 'rgba(212,175,55,.1)',
            color: isKill ? 'var(--loss)' : 'var(--gold)',
          }}>{isKill ? 'Confirm Kill' : 'Approve Scale'}</button>
        </div>
      </div>
    </div>
  )
}

function CampaignDetail({ ad, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={onClose}>
      <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:10, padding:26, width:480, maxWidth:'92vw', maxHeight:'80vh', overflowY:'auto' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', fontWeight:700 }}>CAMPAIGN DETAIL</div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'var(--dim)', fontSize:20, cursor:'pointer' }}>×</button>
        </div>
        <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>{ad.name}</div>
        <div style={{ fontSize:11, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace", marginBottom:16 }}>{ad.platform} · {ad.type} · {ad.client}</div>

        {/* metrics */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
          {[
            { label:'Spend',       val:`RM ${ad.spend.toLocaleString()}` },
            { label:'CPA',         val:`RM ${ad.cpa.toFixed(2)}` },
            { label:'ROAS',        val:`${ad.roas}×`,           color: roasColor(ad.roas) },
            { label:'Budget',      val:`RM ${ad.budget.toLocaleString()}` },
            { label:'Impressions', val: ad.impressions },
            { label:'CTR',         val: ad.ctr },
          ].map(m => (
            <div key={m.label} style={{ background:'var(--ink)', borderRadius:5, padding:'9px 11px' }}>
              <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>{m.label}</div>
              <div className="mono" style={{ fontSize:14, fontWeight:600, color: m.color || 'var(--text)' }}>{m.val}</div>
            </div>
          ))}
        </div>

        {/* history */}
        <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:8 }}>Action History</div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {ad.history.map((h, i) => (
            <div key={i} style={{ display:'flex', gap:14, padding:'8px 0', borderBottom: i < ad.history.length-1 ? '1px solid var(--line-2, var(--line))' : 'none', fontSize:12 }}>
              <div className="mono" style={{ color:'var(--dim)', width:60, flexShrink:0, fontSize:10 }}>{h.date}</div>
              <div style={{ color:'var(--muted)', flex:1 }}>{h.action}</div>
              {h.val && <div className="mono" style={{ color:'var(--gold)', fontSize:10 }}>{h.val}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Ads() {
  const [ads, setAds] = useState(INITIAL_ADS)
  const [approval, setApproval] = useState(null) // { action, ad }
  const [detail, setDetail] = useState(null)
  const [filterClient, setFilterClient] = useState('ALL')

  const clients = ['ALL', ...new Set(INITIAL_ADS.map(a => a.client))]

  const handleApprove = () => {
    const { action, ad } = approval
    setAds(prev => prev.map(a => {
      if (a.id !== ad.id) return a
      if (action === 'kill')  return { ...a, status:'KILLED', budget:0, history:[...a.history, { date:'Jun 17', action:'KILLED (approved)', val:'' }] }
      if (action === 'scale') return { ...a, status:'SCALING', budget:Math.round(a.budget*1.2), history:[...a.history, { date:'Jun 17', action:'Scale +20% approved', val:`RM ${a.budget}→${Math.round(a.budget*1.2)}` }] }
      return a
    }))
    setApproval(null)
  }

  const filtered = filterClient === 'ALL' ? ads : ads.filter(a => a.client === filterClient)

  const totalSpend = ads.filter(a=>a.status!=='KILLED').reduce((s,a)=>s+a.spend,0)
  const avgRoas    = ads.filter(a=>a.roas && a.status!=='KILLED').reduce((s,a,_,arr)=>s+a.roas/arr.length,0)
  const liveCount  = ads.filter(a=>!['KILLED','PAUSED'].includes(a.status)).length

  return (
    <div style={{ padding:16, maxWidth:1400, margin:'0 auto' }}>
      {approval && <ApprovalModal action={approval.action} ad={approval.ad} onConfirm={handleApprove} onCancel={() => setApproval(null)} />}
      {detail   && <CampaignDetail ad={detail} onClose={() => setDetail(null)} />}

      {/* summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))', gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
        {[
          { label:'Live Campaigns', val: liveCount,                           color:'var(--profit)' },
          { label:'Total Spend MTD', val:`RM ${totalSpend.toLocaleString()}`, color:'var(--text)' },
          { label:'Avg ROAS',        val:`${avgRoas.toFixed(1)}×`,            color: avgRoas >= 3 ? 'var(--profit)' : 'var(--warn)' },
          { label:'Auto-rules',      val:'ARMED',                             color:'var(--gold)' },
          { label:'Pending Approval',val: ads.filter(a=>a.status==='FLAGGED').length, color:'var(--loss)' },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--panel)', padding:'12px 16px' }}>
            <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:4 }}>{k.label}</div>
            <div className="mono" style={{ fontSize:17, fontWeight:600, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* header + filters */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:8 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--dim)', marginBottom:2 }}>ADS BOOK</div>
          <div style={{ fontSize:13, color:'var(--muted)' }}>Ranked by ROAS · human approval required for all actions</div>
        </div>
        <div style={{ display:'flex', gap:5 }}>
          {clients.map(c => (
            <button key={c} onClick={() => setFilterClient(c)} style={{
              padding:'4px 10px', borderRadius:5, fontSize:9.5, fontWeight:600, textTransform:'uppercase',
              letterSpacing:.5, cursor:'pointer', transition:'.15s',
              border: filterClient===c ? '1px solid rgba(212,175,55,.6)' : '1px solid var(--line)',
              background: filterClient===c ? 'rgba(212,175,55,.1)' : 'transparent',
              color: filterClient===c ? 'var(--gold)' : 'var(--dim)',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* table */}
      <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr>
                {['#','Campaign','Client','Platform','Spend','CPA','ROAS','Impressions','CTR','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:9, letterSpacing:1.2, textTransform:'uppercase', color:'var(--dim)', borderBottom:'1px solid var(--line)', fontWeight:700, fontFamily:"'IBM Plex Mono',monospace", whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ad, i) => {
                const killed = ad.status === 'KILLED'
                const sep = i < filtered.length-1 ? '1px solid rgba(34,42,59,.6)' : 'none'
                return (
                  <tr key={ad.id} style={{ opacity: killed ? .35 : 1 }}
                    onMouseEnter={e => !killed && (e.currentTarget.style.background='var(--panel-2)')}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding:'11px 14px', borderBottom:sep }}>
                      <span style={{
                        display:'inline-grid', placeItems:'center', width:22, height:22, borderRadius:5,
                        fontSize:10, fontWeight:700, fontFamily:"'IBM Plex Mono',monospace",
                        background: ad.rank===1 ? 'rgba(212,175,55,.15)' : 'var(--ink)',
                        color: ad.rank===1 ? 'var(--gold)' : 'var(--dim)',
                        border: `1px solid ${ad.rank===1 ? 'rgba(212,175,55,.4)' : 'var(--line)'}`,
                      }}>{ad.rank}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:sep }}>
                      <div style={{ fontWeight:600, color:'var(--text)', cursor:'pointer', textDecoration: killed ? 'line-through' : 'none' }}
                        onClick={() => setDetail(ad)}>{ad.name}</div>
                      <div style={{ fontSize:9.5, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace", marginTop:2 }}>{ad.type}</div>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:sep, fontSize:11, color:'var(--muted)' }}>{ad.client}</td>
                    <td style={{ padding:'11px 14px', borderBottom:sep, fontSize:10, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace" }}>{ad.platform}</td>
                    <td style={{ padding:'11px 14px', borderBottom:sep, fontFamily:"'IBM Plex Mono',monospace", color:'var(--muted)' }}>RM {ad.spend.toLocaleString()}</td>
                    <td style={{ padding:'11px 14px', borderBottom:sep, fontFamily:"'IBM Plex Mono',monospace", color:'var(--muted)' }}>RM {ad.cpa.toFixed(2)}</td>
                    <td style={{ padding:'11px 14px', borderBottom:sep, fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, color: roasColor(ad.roas) }}>{ad.roas}×</td>
                    <td style={{ padding:'11px 14px', borderBottom:sep, fontFamily:"'IBM Plex Mono',monospace", color:'var(--dim)' }}>{ad.impressions}</td>
                    <td style={{ padding:'11px 14px', borderBottom:sep, fontFamily:"'IBM Plex Mono',monospace", color:'var(--dim)' }}>{ad.ctr}</td>
                    <td style={{ padding:'11px 14px', borderBottom:sep }}>
                      <span style={{ fontSize:9.5, padding:'3px 7px', borderRadius:4, fontWeight:600, fontFamily:"'IBM Plex Mono',monospace", letterSpacing:.5, ...STATUS_STYLE[ad.status] }}>{ad.status}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:sep }}>
                      {!killed && (
                        <div style={{ display:'flex', gap:6 }}>
                          {ad.roas >= 3 && (
                            <button onClick={() => setApproval({ action:'scale', ad })} style={{
                              fontSize:9.5, padding:'4px 9px', borderRadius:4,
                              border:'1px solid rgba(46,189,133,.45)', background:'transparent',
                              color:'var(--profit)', fontWeight:700, letterSpacing:.5, textTransform:'uppercase', cursor:'pointer',
                            }}>Scale</button>
                          )}
                          {ad.roas < 1.5 && (
                            <button onClick={() => setApproval({ action:'kill', ad })} style={{
                              fontSize:9.5, padding:'4px 9px', borderRadius:4,
                              border:'1px solid rgba(246,70,93,.45)', background:'transparent',
                              color:'var(--loss)', fontWeight:700, letterSpacing:.5, textTransform:'uppercase', cursor:'pointer',
                            }}>Kill</button>
                          )}
                          <button onClick={() => setDetail(ad)} style={{
                            fontSize:9.5, padding:'4px 9px', borderRadius:4,
                            border:'1px solid var(--line)', background:'transparent',
                            color:'var(--dim)', cursor:'pointer',
                          }}>Detail</button>
                        </div>
                      )}
                      {killed && <span style={{ fontSize:10, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace" }}>killed</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* auto-rules footer */}
        <div style={{ padding:'10px 16px', borderTop:'1px solid var(--line)', display:'flex', gap:16, flexWrap:'wrap' }}>
          {[
            { rule:'KILL', cond:'ROAS < 1.5× after RM50 spend', color:'var(--loss)' },
            { rule:'KILL', cond:'CTR < 0.8% @ 1k impressions',  color:'var(--loss)' },
            { rule:'SCALE', cond:'ROAS > 3× for 48h → +20%/day', color:'var(--profit)' },
            { rule:'BOOST', cond:'Organic top-10% velocity in 3h', color:'var(--gold)' },
          ].map((r,i) => (
            <div key={i} style={{ fontSize:10.5, fontFamily:"'IBM Plex Mono',monospace", color:'var(--dim)' }}>
              <b style={{ color: r.color }}>{r.rule}:</b> {r.cond}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
