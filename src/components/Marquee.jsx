export default function Marquee({ items, variant = '', speed = 30 }) {
  const row = (
    <div className="marquee-item" aria-hidden>
      {items.map((t, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span className={/[ऀ-ॿ]/.test(t) ? 'deva' : ''}>{t}</span>
          <span className="star">✦</span>
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
