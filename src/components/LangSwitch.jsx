import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n'

const ENGLISH_LABEL = { en: 'English', hi: 'Hindi', mr: 'Marathi' }

const Globe = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5s-1.3 6.7-3.9 9.5c-2.6-2.8-3.9-6-3.9-9.5s1.3-6.7 3.9-9.5Z" />
  </svg>
)

/** Navbar language dropdown — full language names. */
export function LangDropdown() {
  const { lang, setLang, langs } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = langs.find((l) => l.code === lang)

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (code) => {
    setOpen(false)
    if (code !== lang) setLang(code)
  }

  return (
    <div className={`lang-dd ${open ? 'open' : ''}`} ref={ref}>
      <button
        className="lang-dd-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.name}`}
      >
        <span className="lang-dd-globe">{Globe}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={lang}
            className="lang-dd-current"
            lang={lang}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {current.name}
          </motion.span>
        </AnimatePresence>
        <motion.svg className="lang-dd-chev" viewBox="0 0 12 12" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} aria-hidden>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="lang-dd-menu"
            role="listbox"
            aria-label="Choose language"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {langs.map((l, i) => (
              <motion.li
                key={l.code}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05 }}
              >
                <button
                  role="option"
                  aria-selected={l.code === lang}
                  className={l.code === lang ? 'on' : ''}
                  onClick={() => choose(l.code)}
                  lang={l.code}
                >
                  <span className="lang-dd-name">{l.name}</span>
                  {l.code !== 'en' && <small>{ENGLISH_LABEL[l.code]}</small>}
                  {l.code === lang && (
                    <motion.span layoutId="lang-dd-check" className="lang-dd-check" aria-hidden>
                      ✓
                    </motion.span>
                  )}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Full-width pill with full names — used inside the mobile menu. */
export default function LangSwitch({ id = 'menu' }) {
  const { lang, setLang, langs } = useLang()
  return (
    <div className="lang-switch full" role="group" aria-label="Language">
      {langs.map((l) => (
        <button key={l.code} className={lang === l.code ? 'on' : ''} onClick={() => setLang(l.code)} aria-pressed={lang === l.code} lang={l.code}>
          {lang === l.code && (
            <motion.span layoutId={`lang-pill-${id}`} className="lang-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
          )}
          <span className="lang-label">{l.name}</span>
        </button>
      ))}
    </div>
  )
}
