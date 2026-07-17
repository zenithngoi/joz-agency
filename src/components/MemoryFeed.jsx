const ENTRIES = [
  { time: 'TODAY 14:32', tag: 'HOOK',   text: 'Numbers-in-first-frame ("RM0 → RM10k") beats question hooks by', highlight: '+41% retention', suffix: ' on TikTok. Promoted to hooks-library.' },
  { time: 'TODAY 11:05', tag: 'TIMING', text: 'MY/SG audience peak shifted: 8–10 PM now outperforms lunch slot', highlight: '2.3×', suffix: '. Publishing schedule updated.' },
  { time: 'TODAY 09:48', tag: 'ADS',    text: 'Boosting organic posts after 3h velocity check yields CPA', highlight: '38% lower', suffix: ' than cold creative. Rule confidence: HIGH (n=14).' },
  { time: 'YESTERDAY',   tag: 'FAIL',   text: 'Long-form X threads (>8 posts) underperform 5-post threads. Logged to failures.md — Content Agent capped thread length.', highlight: null, suffix: '' },
  { time: 'JUN 09',      tag: 'CLIENT', text: 'Payout-proof content converts', highlight: '3× better', suffix: ' than education content for lead gen. Updated clients/propfirm.md.' },
]

const TAG_COLORS = {
  HOOK:   'var(--gold)',
  TIMING: 'var(--profit)',
  ADS:    'var(--warn)',
  FAIL:   'var(--loss)',
  CLIENT: 'var(--gold-bright)',
}

export default function MemoryFeed() {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          <b style={{ color: 'var(--gold)' }}>MEMORY.MD</b> — latest learnings
        </div>
        <div style={{ fontSize: 9.5, padding: '3px 8px', borderRadius: 20, border: '1px solid var(--line)', color: 'var(--muted)', letterSpacing: .5 }}>
          +3 TODAY
        </div>
      </div>

      {/* feed */}
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        {ENTRIES.map((e, i) => (
          <div key={i} style={{
            padding: '9px 14px',
            borderBottom: i < ENTRIES.length - 1 ? '1px solid var(--line-2)' : 'none',
            fontSize: 11.5, lineHeight: 1.6
          }}>
            <div className="mono" style={{ fontSize: 9.5, color: 'var(--dim)', letterSpacing: .5, marginBottom: 3 }}>
              {e.time}
            </div>
            <span style={{ color: TAG_COLORS[e.tag] || 'var(--gold)', fontSize: 9.5, fontWeight: 700, letterSpacing: 1, marginRight: 6 }}>
              {e.tag}
            </span>
            <span style={{ color: 'var(--muted)' }}>{e.text} </span>
            {e.highlight && <b style={{ color: 'var(--profit)' }}>{e.highlight}</b>}
            <span style={{ color: 'var(--muted)' }}>{e.suffix}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
