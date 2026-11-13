import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

/** true on mouse/trackpad devices (not touch) and when motion is allowed */
export function useFinePointer() {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine && !reduce
}

/* ───────────────── 3D tilt with glare ───────────────── */
export function Tilt({ children, className = '', max = 10, scale = 1.02, glare = true, depth = false, ...rest }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const spring = { stiffness: 180, damping: 18, mass: 0.6 }
  const rx = useSpring(0, spring)
  const ry = useSpring(0, spring)
  const s = useSpring(1, spring)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const go = useSpring(0, { stiffness: 200, damping: 25 })
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.32), transparent 55%)`

  const onMove = (e) => {
    if (!fine || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set((0.5 - py) * max * 2)
    gx.set(px * 100)
    gy.set(py * 100)
    go.set(1)
    s.set(scale)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    go.set(0)
    s.set(1)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt ${depth ? 'tilt-depth' : ''} ${className}`}
      style={{ rotateX: rx, rotateY: ry, scale: s, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      {children}
      {glare && <motion.span className="tilt-glare" style={{ background: glareBg, opacity: go }} aria-hidden />}
    </motion.div>
  )
}

/* ───────────────── 3D rotating photo ring (drag to spin) ───────────────── */
export function Ring3D({ items, onOpen, label }) {
  const N = items.length
  const stage = useRef(null)
  const inView = useInView(stage, { amount: 0.2 })
  const reduce = useReducedMotion()
  const rot = useMotionValue(0)
  const drag = useRef(null)
  const [grabbing, setGrabbing] = useState(false)
  const [hovered, setHovered] = useState(false)

  // auto-spin (slows down while hovered)
  useAnimationFrame((_, delta) => {
    if (drag.current || !inView || reduce) return
    rot.set(rot.get() - delta * (hovered ? 0.0025 : 0.012))
  })

  const onDown = (e) => {
    drag.current = { x: e.clientX, r: rot.get(), moved: 0 }
    setGrabbing(true)
  }
  useEffect(() => {
    const move = (e) => {
      if (!drag.current) return
      const dx = e.clientX - drag.current.x
      drag.current.moved = Math.max(drag.current.moved, Math.abs(dx))
      rot.set(drag.current.r + dx * 0.35)
    }
    const up = () => {
      if (!drag.current) return
      const moved = drag.current.moved
      setTimeout(() => (drag.current = null), moved > 6 ? 50 : 0)
      setGrabbing(false)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [rot])

  const transform = useTransform(rot, (r) => `translateZ(calc(var(--radius) * -1)) rotateY(${r}deg)`)

  return (
    <div
      className={`ring-stage ${grabbing ? 'grabbing' : ''}`}
      ref={stage}
      onPointerDown={onDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label={label}
    >
      <motion.div className="ring" style={{ transform }}>
        {items.map((g, i) => (
          <div key={g.src} className="ring-card" style={{ transform: `rotateY(${(i * 360) / N}deg) translateZ(var(--radius))` }}>
            <button
              onClick={() => {
                if (drag.current && drag.current.moved > 6) return
                onOpen(i)
              }}
              aria-label={g.alt}
            >
              <img src={g.src} alt="" loading="lazy" draggable={false} />
            </button>
          </div>
        ))}
      </motion.div>
      <div className="ring-floor" aria-hidden />
    </div>
  )
}

/* ───────────────── custom cursor ───────────────── */
export function Cursor() {
  const fine = useFinePointer()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 })
  const [mode, setMode] = useState('') // '', 'link', 'view'
  const [down, setDown] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!fine) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      const t = e.target
      if (!(t instanceof Element)) return
      if (t.closest('.shot, .ring-card, .ribbon-item, .poster, .hero-photo')) setMode('view')
      else if (t.closest('a, button, input, textarea, [role="option"], label')) setMode('link')
      else setMode('')
    }
    const leave = () => setHidden(true)
    const d = () => setDown(true)
    const u = () => setDown(false)
    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', d)
    window.addEventListener('pointerup', u)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', d)
      window.removeEventListener('pointerup', u)
    }
  }, [fine, x, y])

  if (!fine) return null
  return (
    <>
      <motion.div className={`cursor-dot ${hidden ? 'hide' : ''}`} style={{ x, y }} aria-hidden />
      <motion.div className={`cursor-ring ${mode} ${down ? 'down' : ''} ${hidden ? 'hide' : ''}`} style={{ x: rx, y: ry }} aria-hidden>
        <span className="cursor-ring-inner">{mode === 'view' && <b>VIEW</b>}</span>
      </motion.div>
    </>
  )
}

/* ───────────────── magnetic buttons (event delegation) ───────────────── */
const MAGNETIC = '.btn, .wa-send, .s-arrow, .theme-btn, .lang-dd-btn, .wa-fab, .to-top-ring, .f-ic, .burger'

export function useMagnetic() {
  const fine = useFinePointer()
  useEffect(() => {
    if (!fine) return
    let current = null
    const release = (el) => {
      const from = el.style.translate || '0px 0px'
      el.style.translate = ''
      el.animate([{ translate: from }, { translate: '0px 0px' }], { duration: 450, easing: 'cubic-bezier(.2,.9,.3,1.3)' })
    }
    const move = (e) => {
      const el = e.target instanceof Element ? e.target.closest(MAGNETIC) : null
      if (current && current !== el) {
        release(current)
        current = null
      }
      if (!el) return
      current = el
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.translate = `${dx * 0.22}px ${dy * 0.3}px`
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      if (current) release(current)
    }
  }, [fine])
}
