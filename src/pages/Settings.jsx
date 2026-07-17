import { useState, useEffect } from 'react'
import { api } from '../api.js'

const AGENTS = [
  { id:'orchestrator', name:'Orchestrator',    desc:'Coordinates all agents, reads heartbeat, writes summary', icon:'⚙', enabled:true,  status:'READY' },
  { id:'research',     name:'Research',        desc:'Trend research, competitor analysis, topic discovery',    icon:'🔍', enabled:true,  status:'READY' },
  { id:'content',      name:'Content',         desc:'Script, caption, hook generation per platform',          icon:'✍', enabled:true,  status:'READY' },
  { id:'seo',          name:'SEO / GEO',       desc:'SEO optimisation + Generative Engine Optimisation',      icon:'📈', enabled:true,  status:'READY' },
  { id:'publishing',   name:'Publishing',      desc:'Schedules and queues approved content',                  icon:'📤', enabled:true,  status:'READY' },
  { id:'analytics',    name:'Analytics',       desc:'Reads performance data, updates memory.md',              icon:'📊', enabled:true,  status:'READY' },
  { id:'ads',          name:'Ads',             desc:'Monitors ROAS, flags kill/scale — human approval only',  icon:'💸', enabled:true,  status:'READY' },
  { id:'memory',       name:'Memory',          desc:'Writes hooks + failures to library, syncs Obsidian',     icon:'🧠', enabled:true,  status:'READY' },
]

const HEARTBEAT_LOG = [
  { time:'18:02', event:'Loop #12 complete — all 8 agents done', level:'OK' },
  { time:'17:58', event:'Memory Agent: 2 new hooks written to library', level:'OK' },
  { time:'17:44', event:'Ads Agent: Generic IG awareness FLAGGED (ROAS 0.8×)', level:'WARN' },
  { time:'17:31', event:'Publishing Agent: 3 pieces scheduled (8 PM, 9 PM, 10 PM)', level:'OK' },
  { time:'17:19', event:'SEO Agent: Volume Profile reel scored 8.4/10', level:'OK' },
  { time:'17:08', event:'Content Agent: 5 new drafts generated', level:'OK' },
  { time:'17:01', event:'Research Agent: 3 trending topics identified', level:'OK' },
  { time:'17:00', event:'Loop #12 started — Orchestrator init', level:'OK' },
  { time:'16:01', event:'Loop #11 complete', level:'OK' },
  { time:'14:32', event:'Obsidian sync failed — REST API offline', level:'ERR' },
]

const LEVEL_STYLE = {
  OK:   { color:'var(--profit)' },
  WARN: { color:'var(--warn)' },
  ERR:  { color:'var(--loss)' },
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width:38, height:20, borderRadius:10, cursor:'pointer', position:'relative',
      background: value ? 'rgba(46,189,133,.4)' : 'var(--line)',
      border: `1px solid ${value ? 'rgba(46,189,133,.6)' : 'var(--dim)'}`,
      transition:'.2s', flexShrink:0,
    }}>
      <div style={{
        position:'absolute', top:2, left: value ? 19 : 2,
        width:14, height:14, borderRadius:7,
        background: value ? 'var(--profit)' : 'var(--dim)',
        transition:'.2s',
      }}/>
    </div>
  )
}

function Section({ title, children, right }) {
  return (
    <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
      <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--line)', fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <b style={{ color:'var(--gold)' }}>{title}</b>
        {right}
      </div>
      <div style={{ padding:16 }}>{children}</div>
    </div>
  )
}

export default function Settings() {
  const [agents, setAgents] = useState(AGENTS)
  const [obsidianUrl, setObsidianUrl]       = useState('http://localhost:27123')
  const [obsidianSync, setObsidianSync]     = useState(true)
  const [loopInterval, setLoopInterval]     = useState('60')
  const [loopEnabled, setLoopEnabled]       = useState(false)
  const [apiKeyVisible, setApiKeyVisible]   = useState(false)
  const [saved, setSaved]                   = useState(false)

  // ── Active client (daily cron) — persisted server-side ──────────────────
  const [clients, setClients]               = useState([])
  const [cronClientId, setCronClientId]     = useState('')
  const [dbMode, setDbMode]                 = useState(null) // 'supabase' | 'in-memory' | null (unknown)
  const [cronLoading, setCronLoading]       = useState(true)
  const [cronSaving, setCronSaving]         = useState(false)
  const [cronStatus, setCronStatus]         = useState(null) // { type:'ok'|'error', msg }

  useEffect(() => {
    Promise.all([api.getClients(), api.getSettings()])
      .then(([clientList, settings]) => {
        setClients(clientList || [])
        setCronClientId(settings?.cronClientId || '')
        setDbMode(settings?.db || null)
      })
      .catch(e => setCronStatus({ type: 'error', msg: e.message }))
      .finally(() => setCronLoading(false))
  }, [])

  const saveCronClient = async () => {
    setCronSaving(true)
    setCronStatus(null)
    try {
      const res = await api.saveSettings({ cronClientId })
      setCronClientId(res.cronClientId || cronClientId)
      setCronStatus({ type: 'ok', msg: '✓ Active client saved' })
      setTimeout(() => setCronStatus(null), 2500)
    } catch (e) {
      setCronStatus({ type: 'error', msg: e.message })
    } finally {
      setCronSaving(false)
    }
  }

  const toggleAgent = id => setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))

  const saveMockSettings = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const inputStyle = {
    background:'var(--ink)', border:'1px solid var(--line)', borderRadius:5,
    padding:'7px 10px', color:'var(--text)', fontSize:12, outline:'none',
    fontFamily:"'IBM Plex Mono',monospace",
  }

  return (
    <div style={{ padding:16, maxWidth:900, margin:'0 auto' }}>

      {/* save toast */}
      {saved && (
        <div style={{
          position:'fixed', top:70, right:20, zIndex:300,
          background:'var(--panel)', border:'1px solid rgba(46,189,133,.5)',
          borderRadius:8, padding:'10px 18px', fontSize:12, color:'var(--profit)',
          fontFamily:"'IBM Plex Mono',monospace",
        }}>✓ Settings saved</div>
      )}

      {/* active client / daily cron — persisted */}
      <Section title="ACTIVE CLIENT (DAILY CRON)" right={
        dbMode && (
          <span style={{
            fontSize:9, padding:'2px 8px', borderRadius:4, fontWeight:700, letterSpacing:.5,
            fontFamily:"'IBM Plex Mono',monospace",
            background: dbMode === 'supabase' ? 'rgba(46,189,133,.12)' : 'rgba(240,185,11,.12)',
            color: dbMode === 'supabase' ? 'var(--profit)' : 'var(--warn)',
          }}>{dbMode === 'supabase' ? 'SUPABASE' : 'IN-MEMORY'}</span>
        )
      }>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ fontSize:11, color:'var(--dim)', lineHeight:1.6 }}>
            The Orchestrator's daily cron runs against a single client. Choose which one before the next scheduled loop.
          </div>

          {dbMode === 'in-memory' && (
            <div style={{ fontSize:10.5, color:'var(--warn)', fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.6, background:'rgba(240,185,11,.08)', border:'1px solid rgba(240,185,11,.25)', borderRadius:6, padding:'8px 10px' }}>
              ⚠ Running on in-memory storage — data resets on restart — complete Supabase setup
            </div>
          )}

          <div style={{ display:'flex', gap:8, alignItems:'flex-end', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:6 }}>Client</div>
              <select
                value={cronClientId}
                onChange={e => setCronClientId(e.target.value)}
                disabled={cronLoading || clients.length === 0}
                style={{ ...inputStyle, width:'100%', cursor: cronLoading ? 'default' : 'pointer' }}
              >
                {cronLoading && <option value="">Loading clients...</option>}
                {!cronLoading && clients.length === 0 && <option value="">No clients available</option>}
                {!cronLoading && clients.length > 0 && !cronClientId && <option value="">— Select a client —</option>}
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button
              onClick={saveCronClient}
              disabled={cronLoading || cronSaving || !cronClientId}
              style={{
                padding:'8px 22px', borderRadius:6,
                border:'1px solid rgba(212,175,55,.6)',
                background: (cronLoading || cronSaving || !cronClientId) ? 'transparent' : 'rgba(212,175,55,.1)',
                color: (cronLoading || cronSaving || !cronClientId) ? 'var(--dim)' : 'var(--gold)',
                fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase',
                cursor: (cronLoading || cronSaving || !cronClientId) ? 'not-allowed' : 'pointer',
              }}
            >{cronSaving ? 'Saving...' : 'Save'}</button>
          </div>

          {cronStatus && (
            <div style={{
              fontSize:11, fontFamily:"'IBM Plex Mono',monospace",
              color: cronStatus.type === 'ok' ? 'var(--profit)' : 'var(--loss)',
            }}>{cronStatus.type === 'ok' ? cronStatus.msg : `⚠ ${cronStatus.msg}`}</div>
          )}
        </div>
      </Section>

      {/* API config */}
      <Section title="API CONFIGURATION">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:6 }}>Claude API Key</div>
            <div style={{ display:'flex', gap:8 }}>
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                placeholder="sk-ant-..."
                style={{ ...inputStyle, flex:1 }}
                defaultValue="sk-ant-••••••••••••••••••••••"
              />
              <button onClick={() => setApiKeyVisible(v=>!v)} style={{
                padding:'7px 12px', borderRadius:5, border:'1px solid var(--line)',
                background:'transparent', color:'var(--dim)', fontSize:11, cursor:'pointer',
              }}>{apiKeyVisible ? 'Hide' : 'Show'}</button>
            </div>
            <div style={{ fontSize:10, color:'var(--dim)', marginTop:5, fontFamily:"'IBM Plex Mono',monospace" }}>
              ⚠ Stored in sessionStorage only — never written to disk or logs
            </div>
          </div>
        </div>
      </Section>

      {/* Obsidian sync */}
      <Section title="OBSIDIAN SYNC">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>Auto-sync to Obsidian</div>
              <div style={{ fontSize:11, color:'var(--dim)' }}>Write memory, heartbeat, and weekly summaries to vault at loop end</div>
            </div>
            <Toggle value={obsidianSync} onChange={setObsidianSync} />
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:6 }}>Local REST API URL</div>
            <input value={obsidianUrl} onChange={e=>setObsidianUrl(e.target.value)} style={{ ...inputStyle, width:'100%', boxSizing:'border-box' }} />
            <div style={{ fontSize:10, color:'var(--dim)', marginTop:5 }}>Requires Obsidian Local REST API plugin on port 27123</div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ width:8, height:8, borderRadius:4, background: obsidianSync ? 'var(--profit)' : 'var(--dim)' }}/>
            <span style={{ fontSize:11, color:'var(--dim)', fontFamily:"'IBM Plex Mono',monospace" }}>
              {obsidianSync ? 'Connected — last sync 18:02' : 'Sync disabled'}
            </span>
          </div>
        </div>
      </Section>

      {/* loop scheduler */}
      <Section title="LOOP SCHEDULER">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>Auto-run loop</div>
              <div style={{ fontSize:11, color:'var(--dim)' }}>Automatically trigger Orchestrator on a schedule</div>
            </div>
            <Toggle value={loopEnabled} onChange={setLoopEnabled} />
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:6 }}>Interval (minutes)</div>
              <select value={loopInterval} onChange={e=>setLoopInterval(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
                {['30','60','120','240','480'].map(v => <option key={v} value={v}>{v} min</option>)}
              </select>
            </div>
            <div style={{ fontSize:11, color:'var(--dim)', marginTop:14 }}>
              Next run: {loopEnabled ? `in ${loopInterval} min` : 'disabled'}
            </div>
          </div>
          <div style={{ fontSize:10, color:'var(--warn)', fontFamily:"'IBM Plex Mono',monospace" }}>
            ⚠ Ad actions always require human approval regardless of scheduler state
          </div>
        </div>
      </Section>

      {/* agent roster */}
      <Section title="AGENT ROSTER">
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {agents.map((a, i) => (
            <div key={a.id} style={{
              display:'flex', alignItems:'center', gap:14, padding:'11px 0',
              borderBottom: i < agents.length-1 ? '1px solid rgba(34,42,59,.6)' : 'none',
            }}>
              <div style={{ fontSize:18, width:28, flexShrink:0, textAlign:'center' }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color: a.enabled ? 'var(--text)' : 'var(--dim)', marginBottom:2 }}>{a.name}</div>
                <div style={{ fontSize:11, color:'var(--dim)' }}>{a.desc}</div>
              </div>
              <span style={{
                fontSize:9, padding:'2px 7px', borderRadius:4, fontFamily:"'IBM Plex Mono',monospace",
                fontWeight:700, letterSpacing:.5,
                background: a.enabled ? 'rgba(46,189,133,.1)' : 'rgba(74,85,104,.2)',
                color: a.enabled ? 'var(--profit)' : 'var(--dim)',
              }}>{a.enabled ? a.status : 'DISABLED'}</span>
              <Toggle value={a.enabled} onChange={() => toggleAgent(a.id)} />
            </div>
          ))}
        </div>
      </Section>

      {/* heartbeat log */}
      <Section title="HEARTBEAT LOG">
        <div style={{ display:'flex', flexDirection:'column', gap:0, maxHeight:280, overflowY:'auto' }}>
          {HEARTBEAT_LOG.map((entry, i) => (
            <div key={i} style={{
              display:'flex', gap:12, alignItems:'flex-start', padding:'7px 0',
              borderBottom: i < HEARTBEAT_LOG.length-1 ? '1px solid rgba(34,42,59,.5)' : 'none',
              fontSize:12,
            }}>
              <div className="mono" style={{ color:'var(--dim)', width:42, flexShrink:0, fontSize:10, paddingTop:1 }}>{entry.time}</div>
              <div style={{ flex:1, color:'var(--muted)', lineHeight:1.4 }}>{entry.event}</div>
              <div style={{ fontSize:9, fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, letterSpacing:.5, ...LEVEL_STYLE[entry.level], flexShrink:0 }}>{entry.level}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* save button */}
      <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
        <button onClick={saveMockSettings} style={{
          padding:'10px 28px', borderRadius:7,
          border:'1px solid rgba(212,175,55,.6)', background:'rgba(212,175,55,.1)',
          color:'var(--gold)', fontSize:12, fontWeight:700, letterSpacing:1,
          textTransform:'uppercase', cursor:'pointer',
        }}>Save Settings</button>
      </div>
    </div>
  )
}
