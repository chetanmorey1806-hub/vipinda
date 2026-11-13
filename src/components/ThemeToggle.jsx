import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const getTheme = () => document.documentElement.dataset.theme || 'dark'

const Sun = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
const Moon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)

function apply(next) {
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem('vt-theme', next)
  } catch {}
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', next === 'light' ? '#f3ede3' : '#0b0a09')
}

export function useTheme() {
  const [theme, setTheme] = useState(getTheme)

  useEffect(() => {
    apply(theme)
  }, [theme])

  // keep every toggle on the page in sync
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(getTheme()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const toggle = (e) => {
    const next = getTheme() === 'dark' ? 'light' : 'dark'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
      setTheme(next)
      return
    }
    // circular wipe expanding from the button
    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const vt = document.startViewTransition(() => {
      apply(next)
      setTheme(next)
    })
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      )
    })
  }

  return [theme, toggle]
}

export default function ThemeToggle({ className = 'theme-btn', label = false }) {
  const [theme, toggle] = useTheme()
  const isDark = theme === 'dark'
  return (
    <button className={className} onClick={toggle} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} title="Toggle theme">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          style={{ display: 'grid', placeItems: 'center' }}
          initial={{ y: 20, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -20, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {isDark ? Moon : Sun}
        </motion.span>
      </AnimatePresence>
      {label && <span>{isDark ? 'Dark' : 'Light'} mode</span>}
    </button>
  )
}
