import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** Marquee that reacts to scrolling: faster + skewed while you scroll, flips direction when you scroll up. */
export default function Marquee({ items, variant = '', speed = 30 }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(vel, [-2500, 0, 2500], [-4, 0, 4], { clamp: false })
  const skew = useTransform(vel, [-3000, 0, 3000], [8, 0, -8])
  const dir = useRef(variant.includes('reverse') ? 1 : -1)
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  // 50% of the track (one full row) every `speed` seconds at rest
  useAnimationFrame((_, delta) => {
    const b = boost.get()
    if (!reduce) {
      if (b < -0.05) dir.current = variant.includes('reverse') ? -1 : 1
      else if (b > 0.05) dir.current = variant.includes('reverse') ? 1 : -1
    }
    const factor = reduce ? 0.4 : 1 + Math.abs(b)
    base.set(base.get() + dir.current * (50 / speed) * (delta / 1000) * factor)
  })

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
      <motion.div className="marquee-track" style={{ x, skewX: reduce ? 0 : skew }}>
        {row}
        {row}
      </motion.div>
    </div>
  )
}
