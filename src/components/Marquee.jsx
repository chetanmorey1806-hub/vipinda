export default function Marquee({ items, variant = '', speed = 30 }) {
  const row = (
    <div className="marquee-item" aria-hidden>
      {items.map((t, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span className={/[ऀ-ॿ]/.test(t) ? 'deva' : ''}>{t}</span>
          <span className="star"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="8.5" y="2" width="7" height="12" rx="3.5" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 17.5V22M8.5 22h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`marquee ${variant}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {row}
        {row}
      </div>
    </div>
  )
}
