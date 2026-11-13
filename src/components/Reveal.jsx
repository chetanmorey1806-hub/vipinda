import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export const ease = [0.7, 0, 0.2, 1]

/** Fades + slides children in when they scroll into view. */
export function Reveal({ children, delay = 0, y = 40, as = 'div', className, ...rest }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Splits a heading into words that slide up from a mask.
 *  The in-view trigger sits on the wrapper: the words start clipped,
 *  so an observer on them would never fire. */
export function SplitWords({ text, className, delay = 0 }) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      aria-label={text}
      style={{ display: 'inline' }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.05em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Animated counter. */
export function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <b ref={ref}>
      {val}
      {suffix}
    </b>
  )
}

export function SectionHead({ eyebrow, children }) {
  return (
    <>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <h2 className="h2">{children}</h2>
    </>
  )
}
