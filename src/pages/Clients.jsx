import { useState } from 'react'

const CLIENTS = [
  {
    id: 1,
    name: 'Demo Broker',
    industry: 'Forex / CFD',
    market: 'MY / SG',
    phase: 'Phase 1',
    startDate: '2026-04-01',
    status: 'ACTIVE',
    followers: { tiktok: 21480, youtube: 9860, instagram: 12340, x: 4537 },
    growth:    { tiktok: '+9.1%', youtube: '+5.4%', instagram: '+6.7%', x: '+3.2%' },
    roas: 4.2,
    leads: 342,
    clients_converted: 8,
    spend: 'RM 2,600',
    cpl: 'RM 7.60',
    voice: 'Professional · Educational · Trust-first',
    targets: ['60+ pieces/mo', '20+ leads/mo', '3×+ ROAS'],
  },
  {
    id: 2,
    name: 'E-Shop MY',
    industry: 'E-Commerce',
    market: 'MY',
    phase: 'Phase 2',
    startDate: '2026-02-15',
    status: 'ACTIVE',
    followers: { tiktok: 18200, youtube: 3400, instagram: 22440, x: 1100 },
    growth:    { tiktok: '+6.2%', youtube: '+2.1%', instagram: '+8.4%', x: '+0.9%' },
    roas: 3.8,
    leads: 194,
    clients_converted: 22,
    spend: 'RM 1,800',
    cpl: 'RM 9.28',
    voice: 'Friendly · Trendy · Conversion-focused',
    targets: ['80+ pieces/mo', '40+ leads/mo', '4×+ ROAS'],
  },
  {
    id: 3,
    name: 'PropFirm SG',
    industry: 'Prop Trading',
    market: 'SG / ID',
    phase: 'Phase 1',
    startDate: '2026-06-01',
    status: 'ONBOARDING',
    followers: { tiktok: 9100, youtube: 2200, instagram: 4800, x: 890 },
    growth:    { tiktok: '+2.1%', youtube: '+1.4%', instagram: '+3.0%', x: '+0.6%' },
    roas: null,
    leads: 41,
    clients_converted: 0,
    spend: 'RM 400',
    cpl: '—',
    voice: 'Aspirational · Data-driven · Elite',
    targets: ['40+ pieces/mo', '15+ leads/mo', '2×+ ROAS'],
  },
]

const PLATFORMS = ['tiktok', 'youtube', 'instagram', 'x']
const PLATFORM_LABELS = { tiktok: 'TikTok', youtube: 'YouTube', instagram: 'Instagram', x: 'X' }

const STATUS_STYLE = {
  ACTIVE:     { bg: 'rgba(46,189,133,.12)',  color: 'var(--profit)' },
  ONBOARDING: { bg: 'rgba(240,185,11,.12)',  color: 'var(--warn)' },
  PAUSED:     { bg: 'rgba(246,70,93,.12)',   color: 'var(--loss)' },
}

function AddClientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name:'', industry:'', market:'', voice:'' })
  const set = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }))
  const inputStyle = {
    width:'100%', background:'var(--ink)', border:'1px solid var(--line)',
    borderRadius:5, padding:'8px 10px', color:'var(--text)', fontSize:13,
    fontFamily:'inherit', outline:'none', boxSizing:'border-box',
  }
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center'
    }} onClick={onClose}>
      <div style={{
        background:'var(--panel)', border:'1px solid var(--line)', borderRadius:10,
        padding:28, width:420, maxWidth:'90vw'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', fontWeight:700, marginBottom:18 }}>
          NEW CLIENT BRIEF
        </div>
        {[
          { label:'Client Name',  key:'name',     placeholder:'e.g. Alpha Capital SG' },
          { label:'Industry',     key:'industry', placeholder:'e.g. Forex, E-Commerce, SaaS' },
          { label:'Market',       key:'market',   placeholder:'e.g. MY / SG / ID' },
          { label:'Brand Voice',  key:'voice',    placeholder:'e.g. Professional · Trust-first' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:5 }}>{f.label}</div>
            <input style={inputStyle} placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)} />
          </div>
        ))}
        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <button onClick={onClose} style={{
            flex:1, padding:'9px 0', borderRadius:6, border:'1px solid var(--line)',
            background:'transparent', color:'var(--muted)', fontSize:12, cursor:'pointer',
          }}>Cancel</button>
          <button onClick={() => { if(form.name){ onAdd(form); onClose() } }} style={{
            flex:2, padding:'9px 0', borderRadius:6,
            border:'1px solid rgba(212,175,55,.5)', background:'rgba(212,175,55,.1)',
            color:'var(--gold)', fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:1,
          }}>Create Client →</button>
        </div>
      </div>
    </div>
  )
}

function ClientCard({ client, onClick }) {
  const totalFollowers = Object.values(client.followers).reduce((a,b) => a+b, 0)
  return (
    <div onClick={onClick} style={{
      background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8,
      padding:20, cursor:'pointer', transition:'border-color .15s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(212,175,55,.4)'}
    onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:3 }}>{client.name}</div>
          <div style={{ fontSize:11, color:'var(--dim)', fontFamily:"'IBM Plex Mono', monospace" }}>
            {client.industry} · {client.market}
          </div>
        </div>
        <span style={{
          fontSize:9.5, padding:'3px 8px', borderRadius:5, fontWeight:600,
          fontFamily:"'IBM Plex Mono', monospace", letterSpacing:.5,
          background: STATUS_STYLE[client.status]?.bg,
          color: STATUS_STYLE[client.status]?.color,
        }}>{client.status}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
        {[
          { label:'Followers', val: totalFollowers.toLocaleString(), color:'var(--text)' },
          { label:'Leads MTD', val: client.leads, color:'var(--text)' },
          { label:'ROAS',      val: client.roas ? `${client.roas}×` : '—', color: client.roas >= 3 ? 'var(--profit)' : 'var(--warn)' },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--ink)', borderRadius:5, padding:'8px 10px' }}>
            <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>{k.label}</div>
            <div className="mono" style={{ fontSize:14, fontWeight:600, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
        {PLATFORMS.map(p => (
          <div key={p} style={{ textAlign:'center', background:'var(--ink)', borderRadius:5, padding:'6px 4px' }}>
            <div style={{ fontSize:8.5, color:'var(--dim)', textTransform:'uppercase', letterSpacing:.5, marginBottom:2 }}>{PLATFORM_LABELS[p]}</div>
            <div className="mono" style={{ fontSize:11, fontWeight:600 }}>{(client.followers[p]/1000).toFixed(1)}k</div>
            <div style={{ fontSize:9.5, color:'var(--profit)', fontFamily:"'IBM Plex Mono',monospace" }}>{client.growth[p]}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:10, padding:'7px 10px', background:'var(--ink)', borderRadius:5, fontSize:11, color:'var(--muted)', fontStyle:'italic' }}>
        {client.phase} · {client.voice}
      </div>
    </div>
  )
}

function ClientProfile({ client, onBack }) {
  const totalFollowers = Object.values(client.followers).reduce((a,b) => a+b, 0)
  const kpis = [
    { label:'Total Followers', val: totalFollowers.toLocaleString() },
    { label:'Leads MTD',       val: client.leads },
    { label:'Converted',       val: client.clients_converted, color:'var(--profit)' },
    { label:'Ad Spend MTD',    val: client.spend },
    { label:'CPL',             val: client.cpl },
    { label:'ROAS',            val: client.roas ? `${client.roas}×` : '—', color: client.roas >= 3 ? 'var(--profit)' : client.roas ? 'var(--warn)' : 'var(--dim)' },
  ]
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <button onClick={onBack} style={{
          background:'transparent', border:'1px solid var(--line)', borderRadius:5,
          color:'var(--muted)', fontSize:11, padding:'5px 12px', cursor:'pointer', letterSpacing:1,
        }}>← ALL CLIENTS</button>
        <span style={{ fontSize:11, color:'var(--dim)' }}>/</span>
        <span style={{ fontSize:13, fontWeight:600 }}>{client.name}</span>
        <span style={{
          marginLeft:'auto', fontSize:9.5, padding:'3px 8px', borderRadius:5, fontWeight:600,
          fontFamily:"'IBM Plex Mono', monospace", letterSpacing:.5,
          background: STATUS_STYLE[client.status]?.bg,
          color: STATUS_STYLE[client.status]?.color,
        }}>{client.status}</span>
      </div>

      {/* KPI strip */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))',
        gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14,
      }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background:'var(--panel)', padding:'12px 16px' }}>
            <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:4 }}>{k.label}</div>
            <div className="mono" style={{ fontSize:17, fontWeight:600, color: k.color || 'var(--text)' }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14, marginBottom:14 }}>
        {/* platform breakdown */}
        <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--line)', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
            <b style={{ color:'var(--gold)' }}>PLATFORM</b> BREAKDOWN
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'var(--line)' }}>
            {PLATFORMS.map(p => (
              <div key={p} style={{ background:'var(--panel)', padding:'14px 16px' }}>
                <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'var(--muted)', fontWeight:600, marginBottom:6 }}>{PLATFORM_LABELS[p]}</div>
                <div className="mono" style={{ fontSize:20, fontWeight:700, marginBottom:2 }}>{client.followers[p].toLocaleString()}</div>
                <div style={{ fontSize:11, color:'var(--profit)', fontFamily:"'IBM Plex Mono',monospace" }}>{client.growth[p]} 30d</div>
              </div>
            ))}
          </div>
        </div>

        {/* brief */}
        <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--line)', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
            <b style={{ color:'var(--gold)' }}>CLIENT</b> BRIEF
          </div>
          <div style={{ padding:16, display:'flex', flexDirection:'column', gap:11 }}>
            {[
              { label:'Industry',    val: client.industry },
              { label:'Market',      val: client.market },
              { label:'Phase',       val: client.phase },
              { label:'Start Date',  val: client.startDate },
              { label:'Brand Voice', val: client.voice },
            ].map(row => (
              <div key={row.label} style={{ display:'flex', gap:10 }}>
                <div style={{ width:90, fontSize:10, letterSpacing:.5, textTransform:'uppercase', color:'var(--dim)', flexShrink:0, paddingTop:1 }}>{row.label}</div>
                <div style={{ fontSize:12, color:'var(--text)' }}>{row.val}</div>
              </div>
            ))}
            <div style={{ borderTop:'1px solid var(--line)', paddingTop:10, marginTop:2 }}>
              <div style={{ fontSize:10, letterSpacing:.5, textTransform:'uppercase', color:'var(--dim)', marginBottom:6 }}>30-Day Targets</div>
              {client.targets.map(t => (
                <div key={t} style={{ fontSize:11.5, color:'var(--muted)', padding:'3px 0', fontFamily:"'IBM Plex Mono',monospace" }}>▸ {t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* leads funnel */}
      <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden' }}>
        <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--line)', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:600 }}>
          <b style={{ color:'var(--gold)' }}>LEADS FUNNEL</b> — {client.name} · 30 day
        </div>
        <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { label:'Views',          val:'—',                        pct:100 },
            { label:'Profile Visits', val:'—',                        pct:52 },
            { label:'Link Clicks',    val:'—',                        pct:24 },
            { label:'Leads',          val:String(client.leads),       pct:10 },
            { label:'Clients',        val:String(client.clients_converted), pct: client.leads > 0 ? Math.min(Math.round(client.clients_converted/client.leads*200), 100) : 0 },
          ].map(f => (
            <div key={f.label} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12 }}>
              <div style={{ width:110, color:'var(--muted)', flexShrink:0 }}>{f.label}</div>
              <div style={{
                height:14, width:`${f.pct}%`,
                background:'linear-gradient(90deg, rgba(212,175,55,.75), rgba(212,175,55,.15))',
                borderRadius:3, minWidth:4,
              }}/>
              <div className="mono" style={{ fontSize:12, color:'var(--text)', minWidth:30 }}>{f.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Clients() {
  const [clients, setClients] = useState(CLIENTS)
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const addClient = form => {
    setClients(prev => [...prev, {
      id: prev.length + 1,
      name: form.name,
      industry: form.industry || '—',
      market: form.market || '—',
      phase: 'Phase 1',
      startDate: new Date().toISOString().split('T')[0],
      status: 'ONBOARDING',
      followers: { tiktok:0, youtube:0, instagram:0, x:0 },
      growth:    { tiktok:'—', youtube:'—', instagram:'—', x:'—' },
      roas: null, leads:0, clients_converted:0,
      spend:'RM 0', cpl:'—',
      voice: form.voice || '—',
      targets:['TBD after briefing'],
    }])
  }

  const activeClient = selected !== null ? clients.find(c => c.id === selected) : null

  return (
    <div style={{ padding:16, maxWidth:1400, margin:'0 auto' }}>
      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} onAdd={addClient} />}

      {activeClient ? (
        <ClientProfile client={activeClient} onBack={() => setSelected(null)} />
      ) : (
        <>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>CLIENT ROSTER</div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>
                {clients.filter(c=>c.status==='ACTIVE').length} active · {clients.filter(c=>c.status==='ONBOARDING').length} onboarding
              </div>
            </div>
            <button onClick={() => setShowAdd(true)} style={{
              padding:'8px 18px', borderRadius:6,
              border:'1px solid rgba(212,175,55,.5)', background:'rgba(212,175,55,.08)',
              color:'var(--gold)', fontSize:11, fontWeight:700, letterSpacing:1,
              textTransform:'uppercase', cursor:'pointer',
            }}>+ Add Client</button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:14 }}>
            {clients.map(c => (
              <ClientCard key={c.id} client={c} onClick={() => setSelected(c.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
