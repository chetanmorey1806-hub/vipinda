import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from '../data'
import { useLang } from '../i18n'
import { WaIcon, waLink } from './WhatsApp'

/** id of the section currently in the middle of the screen */
export function useActiveSection(ids, deps = []) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    const t = setTimeout(() => ids.forEach((id) => document.getElementById(id) && obs.observe(document.getElementById(id))), 60)
    return () => {
      clearTimeout(t)
      obs.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return active
}

/* ───────────────── share (native sheet on phones, copy link elsewhere) ───────────────── */
let toastFn = null
export function Toast() {
  const [msg, setMsg] = useState(null)
  useEffect(() => {
    let t
    toastFn = (m) => {
      setMsg(m)
      clearTimeout(t)
      t = setTimeout(() => setMsg(null), 2200)
    }
    return () => (toastFn = null)
  }, [])
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          className="toast"
          role="status"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        >
          <span className="toast-tick">✓</span> {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useShare() {
  const { t } = useLang()
  return async () => {
    const url = window.location.origin + window.location.pathname
    const data = { title: 'Vipin Tatad', text: t.share.text, url }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
    } catch (e) {
      if (e?.name === 'AbortError') return
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    toastFn?.(t.share.copied)
  }
}

export const ShareIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </svg>
)

export function ShareButton({ className = 'btn share-btn' }) {
  const { t } = useLang()
  const share = useShare()
  return (
    <button type="button" className={className} onClick={share} aria-label={t.share.label}>
      <span className="share-ic">{ShareIcon}</span>
      <span>{t.share.label}</span>
    </button>
  )
}

/* ───────────────── mobile bottom bar ───────────────── */
const I = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="8.5" y="2.5" width="7" height="11.5" rx="3.5" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21.5M8.5 21.5h7" />
    </svg>
  ),
  gallery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  ),
}

export function MobileDock() {
  const { t } = useLang()
  const active = useActiveSection(['top', 'about', 'music', 'release', 'credits', 'press', 'beyond', 'gallery', 'philosophy', 'live', 'contact'], [t])
  // map every section to one of the four tabs
  const tab = { top: 'top', about: 'top', music: 'music', release: 'music', credits: 'music', press: 'music', beyond: 'gallery', gallery: 'gallery', philosophy: 'gallery', live: 'contact', contact: 'contact' }[active] || 'top'
  const items = [
    { id: 'top', label: t.nav.home, icon: I.home },
    { id: 'music', label: t.nav.music, icon: I.music },
    { id: 'wa' },
    { id: 'gallery', label: t.nav.gallery, icon: I.gallery },
    { id: 'contact', label: t.nav.contact, icon: I.contact },
  ]
  return (
    <motion.nav
      className="dock"
      aria-label="Quick navigation"
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 2.2 }}
    >
      {items.map((it) =>
        it.id === 'wa' ? (
          <a key="wa" className="dock-wa" href={waLink(t.wa.quick)} target="_blank" rel="noreferrer" aria-label={t.wa.fab}>
            <span className="dock-wa-ring" aria-hidden />
            {WaIcon}
          </a>
        ) : (
          <a key={it.id} href={`#${it.id}`} className={`dock-item ${tab === it.id ? 'on' : ''}`} aria-current={tab === it.id ? 'true' : undefined}>
            {tab === it.id && <motion.span layoutId="dock-pill" className="dock-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
            <motion.span className="dock-ic" animate={tab === it.id ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}>
              {it.icon}
            </motion.span>
            <span className="dock-label">{it.label}</span>
          </a>
        )
      )}
    </motion.nav>
  )
}

/* ───────────────── desktop side dots ───────────────── */
export function SideDots() {
  const { t } = useLang()
  const ids = ['top', ...NAV]
  const active = useActiveSection(ids, [t])
  return (
    <motion.nav
      className="side-dots"
      aria-label="Sections"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.4, duration: 0.8 }}
    >
      {ids.map((id, i) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-label={t.nav[id === 'top' ? 'home' : id]}>
          <span className="sd-label">
            <small>0{i}</small> {t.nav[id === 'top' ? 'home' : id]}
          </span>
          <span className="sd-dot">{active === id && <motion.i layoutId="sd-active" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}</span>
        </a>
      ))}
    </motion.nav>
  )
}
