import { motion, useInView, animate, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export const ease = [0.7, 0, 0.2, 1]

/** Fades + slides children in when they scroll into view. */
export function Reveal({ children, delay = 0, y = 40, as = 'div', className, ...rest }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
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
        <span key={i} aria-hidden className="sw-mask">
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

const GLYPHS = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/** Latin text "decodes" from random glyphs when it scrolls into view.
 *  Devanagari (or reduced motion) is shown as-is — scrambled conjuncts look broken. */
export function Scramble({ text, className, duration = 900 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const latin = /^[\x20-\x7E·—–’]+$/.test(text)
  const [out, setOut] = useState(latin ? text.replace(/[^ ]/g, '\u00A0') : text)
  useEffect(() => {
    if (!inView || !latin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text)
      return
    }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const done = Math.floor(p * text.length)
      setOut(
        text
          .split('')
          .map((c, i) => (i < done || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join('')
      )
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, text, latin, duration])
  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  )
}

export function SectionHead({ eyebrow, children }) {
  return (
    <>
      <Reveal>
        <Scramble className="eyebrow" text={eyebrow} />
      </Reveal>
      <h2 className="h2">{children}</h2>
    </>
  )
}

/** Clip-path reveal on scroll.
 *  The in-view trigger sits on an unclipped wrapper: an element that starts
 *  fully clipped is never reported as visible on some (mobile) browsers. */
export function ClipReveal({ as = 'div', className, from, scale = 1, duration = 1.2, children }) {
  const Inner = motion[as]
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      <Inner
        className={className}
        variants={{
          hidden: { clipPath: from, scale },
          show: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, transition: { duration, ease: [0.7, 0, 0.2, 1] } },
        }}
      >
        {children}
      </Inner>
    </motion.div>
  )
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span aria-hidden style={{ opacity }}>
      {children}{' '}
    </motion.span>
  )
}
