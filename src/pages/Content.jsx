import { useState } from 'react'

const PLATFORMS = ['ALL', 'TIKTOK', 'IG REEL', 'YT SHORT', 'X']

const INITIAL_STAGES = [
  {
    id: 'ideas',
    name: 'Ideas',
    cards: [
      { id:1, title:'Funded trader payout reaction',    platform:'TIKTOK',    priority:'HIGH',  hook:'Proof hook', notes:'' },
      { id:2, title:'Rebate math in 30 sec',            platform:'IG REEL',   priority:'MED',   hook:'Education',  notes:'' },
      { id:3, title:'"Brokers hate this" hook',         platform:'YT SHORT',  priority:'MED',   hook:'Curiosity',  notes:'' },
      { id:4, title:'5 prop firm myths debunked',       platform:'TIKTOK',    priority:'LOW',   hook:'List hook',  notes:'' },
    ]
  },
  {
    id: 'drafting',
    name: 'Drafting',
    cards: [
      { id:5, title:'Smart Money Concepts pt.4',        platform:'TIKTOK',    priority:'HIGH',  hook:'Series',     notes:'Script 80% done' },
      { id:6, title:'Client case study thread',         platform:'X',         priority:'MED',   hook:'Social proof',notes:'' },
    ]
  },
  {
    id: 'seo',
    name: 'SEO Review',
    cards: [
      { id:7, title:'Volume Profile myth-bust',         platform:'YT SHORT',  priority:'HIGH',  hook:'Myth bust',  notes:'SEO score 8.4/10' },
    ]
  },
  {
    id: 'scheduled',
    name: 'Scheduled',
    cards: [
      { id:8, title:'Volume Profile myth (trim)',       platform:'YT SHORT',  priority:'HIGH',  hook:'Myth bust',  notes:'8:00 PM MYT' },
    ]
  },
  {
    id: 'posted',
    name: 'Posted',
    cards: [
      { id:9, title:'"RM0 → RM10k" v2',                platform:'TIKTOK',    priority:'HIGH',  hook:'Proof hook', notes:'2h ago · 12k views' },
    ]
  },
  {
    id: 'analyzed',
    name: 'Analyzed',
    cards: [
      { id:10, title:'MACD strategy reel',              platform:'IG REEL',   priority:'MED',   hook:'Education',  notes:'ER 8.4% → memory.md ✓' },
    ]
  },
]

const PRIORITY_COLOR = {
  HIGH: { bg:'rgba(246,70,93,.1)',   color:'var(--loss)' },
  MED:  { bg:'rgba(240,185,11,.1)',  color:'var(--warn)' },
  LOW:  { bg:'rgba(74,85,104,.2)',   color:'var(--dim)'  },
}

const STAGE_ACCENT = {
  ideas:     'var(--dim)',
  drafting:  'var(--warn)',
  seo:       'var(--gold)',
  scheduled: '#7B68EE',
  posted:    'var(--profit)',
  analyzed:  'var(--profit)',
}

let nextId = 20

function NewCardModal({ stageId, onClose, onAdd }) {
  const [form, setForm] = useState({ title:'', platform:'TIKTOK', priority:'MED', hook:'', notes:'' })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const inputStyle = {
    width:'100%', background:'var(--ink)', border:'1px solid var(--line)',
    borderRadius:5, padding:'8px 10px', color:'var(--text)', fontSize:13,
    fontFamily:'inherit', outline:'none', boxSizing:'border-box',
  }
  const selectStyle = { ...inputStyle }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={onClose}>
      <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:10, padding:26, width:400, maxWidth:'90vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', fontWeight:700, marginBottom:18 }}>NEW CONTENT CARD</div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:5 }}>Title</div>
          <input style={inputStyle} placeholder="e.g. 5 funded trader myths" value={form.title} onChange={set('title')} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:5 }}>Platform</div>
            <select style={selectStyle} value={form.platform} onChange={set('platform')}>
              {['TIKTOK','IG REEL','YT SHORT','X'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:5 }}>Priority</div>
            <select style={selectStyle} value={form.priority} onChange={set('priority')}>
              {['HIGH','MED','LOW'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:5 }}>Hook Type</div>
          <input style={inputStyle} placeholder="e.g. Proof hook, Curiosity, List" value={form.hook} onChange={set('hook')} />
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:5 }}>Notes</div>
          <input style={inputStyle} placeholder="Optional" value={form.notes} onChange={set('notes')} />
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'9px 0', borderRadius:6, border:'1px solid var(--line)', background:'transparent', color:'var(--muted)', fontSize:12, cursor:'pointer' }}>Cancel</button>
          <button onClick={() => { if(form.title){ onAdd(stageId, { ...form, id: ++nextId }); onClose() }}} style={{
            flex:2, padding:'9px 0', borderRadius:6, border:'1px solid rgba(212,175,55,.5)',
            background:'rgba(212,175,55,.1)', color:'var(--gold)', fontSize:12, fontWeight:700, cursor:'pointer',
          }}>Add Card →</button>
        </div>
      </div>
    </div>
  )
}

function CardDetail({ card, stages, onClose, onMove, onDelete }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={onClose}>
      <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:10, padding:26, width:420, maxWidth:'90vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)', fontWeight:700 }}>CARD DETAIL</div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'var(--dim)', fontSize:18, cursor:'pointer', lineHeight:1 }}>×</button>
        </div>
        <div style={{ fontSize:15, fontWeight:600, marginBottom:14, lineHeight:1.4 }}>{card.title}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            { label:'Platform', val: card.platform },
            { label:'Hook',     val: card.hook || '—' },
            { label:'Priority', val: card.priority },
          ].map(f => (
            <div key={f.label} style={{ background:'var(--ink)', borderRadius:5, padding:'8px 10px' }}>
              <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>{f.label}</div>
              <div style={{ fontSize:12, color:'var(--text)', fontFamily:"'IBM Plex Mono',monospace" }}>{f.val}</div>
            </div>
          ))}
        </div>
        {card.notes && (
          <div style={{ background:'var(--ink)', borderRadius:5, padding:'10px 12px', marginBottom:14, fontSize:12, color:'var(--muted)', fontStyle:'italic' }}>
            {card.notes}
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:8 }}>Move to Stage</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {stages.map(s => (
              <button key={s.id} onClick={() => { onMove(card.id, s.id); onClose() }} style={{
                padding:'5px 12px', borderRadius:5, fontSize:10, fontWeight:600, letterSpacing:.5, textTransform:'uppercase',
                border:`1px solid ${STAGE_ACCENT[s.id] || 'var(--line)'}`,
                background:'transparent', color: STAGE_ACCENT[s.id] || 'var(--muted)', cursor:'pointer',
              }}>{s.name}</button>
            ))}
          </div>
        </div>
        <button onClick={() => { onDelete(card.id); onClose() }} style={{
          width:'100%', padding:'8px 0', borderRadius:6, border:'1px solid rgba(246,70,93,.3)',
          background:'transparent', color:'var(--loss)', fontSize:11, cursor:'pointer', letterSpacing:1,
        }}>Delete Card</button>
      </div>
    </div>
  )
}

export default function Content() {
  const [stages, setStages] = useState(INITIAL_STAGES)
  const [platformFilter, setPlatformFilter] = useState('ALL')
  const [dragCard, setDragCard] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [newCardStage, setNewCardStage] = useState(null)
  const [detailCard, setDetailCard] = useState(null)
  const [agentToast, setAgentToast] = useState(false)

  const totalCards = stages.reduce((a, s) => a + s.cards.length, 0)

  const addCard = (stageId, card) => {
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, cards:[...s.cards, card] } : s))
  }

  const moveCard = (cardId, targetStageId) => {
    let found = null
    const without = stages.map(s => {
      const c = s.cards.find(c => c.id === cardId)
      if (c) found = c
      return { ...s, cards: s.cards.filter(c => c.id !== cardId) }
    })
    if (!found) return
    setStages(without.map(s => s.id === targetStageId ? { ...s, cards:[...s.cards, found] } : s))
  }

  const deleteCard = cardId => {
    setStages(prev => prev.map(s => ({ ...s, cards: s.cards.filter(c => c.id !== cardId) })))
  }

  const onDragStart = (card) => setDragCard(card)
  const onDragEnd   = ()     => { setDragCard(null); setDragOver(null) }
  const onDrop      = (stageId) => { if (dragCard) moveCard(dragCard.id, stageId); setDragOver(null) }

  const filterCards = cards => platformFilter === 'ALL' ? cards : cards.filter(c => c.platform === platformFilter)

  const triggerAgent = () => {
    setAgentToast(true)
    setTimeout(() => setAgentToast(false), 3500)
  }

  return (
    <div style={{ padding:16, maxWidth:1600, margin:'0 auto' }}>
      {newCardStage && <NewCardModal stageId={newCardStage} onClose={() => setNewCardStage(null)} onAdd={addCard} />}
      {detailCard   && <CardDetail card={detailCard} stages={stages} onClose={() => setDetailCard(null)} onMove={moveCard} onDelete={deleteCard} />}

      {/* agent toast */}
      {agentToast && (
        <div style={{
          position:'fixed', top:70, right:20, zIndex:300,
          background:'var(--panel)', border:'1px solid var(--gold)',
          borderRadius:8, padding:'10px 18px', fontSize:12, color:'var(--gold)',
          fontFamily:"'IBM Plex Mono',monospace",
        }}>⚡ Content Agent triggered — generating 5 ideas...</div>
      )}

      {/* header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>CONTENT PIPELINE</div>
          <div style={{ fontSize:13, color:'var(--muted)' }}>{totalCards} cards in flight · Kanban view</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* platform filter */}
          <div style={{ display:'flex', gap:4 }}>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatformFilter(p)} style={{
                padding:'4px 10px', borderRadius:5, fontSize:9.5, fontWeight:600, letterSpacing:.5,
                textTransform:'uppercase', cursor:'pointer', transition:'.15s',
                border: platformFilter === p ? '1px solid rgba(212,175,55,.6)' : '1px solid var(--line)',
                background: platformFilter === p ? 'rgba(212,175,55,.1)' : 'transparent',
                color: platformFilter === p ? 'var(--gold)' : 'var(--dim)',
              }}>{p}</button>
            ))}
          </div>
          {/* trigger agent */}
          <button onClick={triggerAgent} style={{
            padding:'6px 14px', borderRadius:6, border:'1px solid rgba(46,189,133,.4)',
            background:'rgba(46,189,133,.08)', color:'var(--profit)', fontSize:10,
            fontWeight:700, letterSpacing:1, textTransform:'uppercase', cursor:'pointer',
          }}>⚡ Run Content Agent</button>
          {/* new card (goes to ideas) */}
          <button onClick={() => setNewCardStage('ideas')} style={{
            padding:'6px 14px', borderRadius:6, border:'1px solid rgba(212,175,55,.5)',
            background:'rgba(212,175,55,.08)', color:'var(--gold)', fontSize:10,
            fontWeight:700, letterSpacing:1, textTransform:'uppercase', cursor:'pointer',
          }}>+ New Card</button>
        </div>
      </div>

      {/* kanban board */}
      <div style={{
        display:'grid',
        gridTemplateColumns:`repeat(${stages.length}, minmax(180px,1fr))`,
        gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', overflowX:'auto',
      }}>
        {stages.map(stage => {
          const filtered = filterCards(stage.cards)
          const accent = STAGE_ACCENT[stage.id]
          const isOver = dragOver === stage.id
          return (
            <div
              key={stage.id}
              onDragOver={e => { e.preventDefault(); setDragOver(stage.id) }}
              onDrop={() => onDrop(stage.id)}
              style={{
                background: isOver ? 'var(--panel-2)' : 'var(--ink)',
                padding:'12px 10px', minHeight:420,
                transition:'background .15s',
              }}
            >
              {/* column header */}
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                marginBottom:10, paddingBottom:8, borderBottom:`1px solid ${accent}33`,
              }}>
                <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'var(--dim)', fontWeight:700 }}>{stage.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span className="mono" style={{ fontSize:11, color: accent, fontWeight:600 }}>{filtered.length}</span>
                  <button onClick={() => setNewCardStage(stage.id)} style={{
                    width:18, height:18, borderRadius:4, border:`1px solid ${accent}55`,
                    background:'transparent', color: accent, fontSize:13, cursor:'pointer',
                    display:'grid', placeItems:'center', lineHeight:1, padding:0,
                  }}>+</button>
                </div>
              </div>

              {/* cards */}
              {filtered.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => onDragStart(card)}
                  onDragEnd={onDragEnd}
                  onClick={() => setDetailCard(card)}
                  style={{
                    background:'var(--panel-2)', border:'1px solid var(--line)',
                    borderLeft:`2px solid ${accent}`, borderRadius:5,
                    padding:'8px 10px', marginBottom:6, cursor:'grab',
                    transition:'border-color .15s, opacity .15s',
                    opacity: dragCard?.id === card.id ? .4 : 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderLeftColor = accent === 'var(--dim)' ? 'var(--gold)' : accent}
                  onMouseLeave={e => e.currentTarget.style.borderLeftColor = accent}
                >
                  <div style={{ fontSize:11.5, fontWeight:600, color:'var(--text)', marginBottom:5, lineHeight:1.35 }}>{card.title}</div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                    <span style={{ fontSize:9, padding:'2px 6px', borderRadius:3, background:'rgba(212,175,55,.08)', color:'var(--gold)', fontFamily:"'IBM Plex Mono',monospace", letterSpacing:.3 }}>{card.platform}</span>
                    <span style={{ fontSize:9, padding:'2px 6px', borderRadius:3, letterSpacing:.3, fontFamily:"'IBM Plex Mono',monospace", ...PRIORITY_COLOR[card.priority] }}>{card.priority}</span>
                  </div>
                  {card.hook && (
                    <div style={{ fontSize:9.5, color:'var(--dim)', marginTop:5, fontStyle:'italic' }}>{card.hook}</div>
                  )}
                  {card.notes && (
                    <div style={{ fontSize:9.5, color:'var(--muted)', marginTop:4, fontFamily:"'IBM Plex Mono',monospace" }}>{card.notes}</div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <div style={{ fontSize:10, color:'var(--dim)', textAlign:'center', paddingTop:20, fontStyle:'italic' }}>
                  {isOver ? 'Drop here' : 'Empty'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* stats footer */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px,1fr))',
        gap:1, background:'var(--line)', borderRadius:8, overflow:'hidden', marginTop:14,
      }}>
        {stages.map(s => (
          <div key={s.id} style={{ background:'var(--panel)', padding:'10px 14px' }}>
            <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>{s.name}</div>
            <div className="mono" style={{ fontSize:16, fontWeight:600, color: STAGE_ACCENT[s.id] }}>{s.cards.length}</div>
          </div>
        ))}
        <div style={{ background:'var(--panel)', padding:'10px 14px' }}>
          <div style={{ fontSize:9, letterSpacing:1, textTransform:'uppercase', color:'var(--dim)', marginBottom:3 }}>TOTAL</div>
          <div className="mono" style={{ fontSize:16, fontWeight:600, color:'var(--text)' }}>{totalCards}</div>
        </div>
      </div>
    </div>
  )
}
