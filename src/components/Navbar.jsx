import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, CONTACT } from '../data'
import { useLang } from '../i18n'
import ThemeToggle from './ThemeToggle'
import LangSwitch from './LangSwitch'

export default function Navbar() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the section currently in view (re-observe when content remounts on language change)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    const id = setTimeout(() => {
      NAV.forEach((s) => {
        const el = document.getElementById(s)
        if (el) obs.observe(el)
      })
    }, 50)
    return () => {
      clearTimeout(id)
      obs.disconnect()
    }
  }, [t])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="container nav-inner">
          <a href="#top" className="logo" onClick={() => setOpen(false)}>
            VIPIN<b>.</b>
          </a>
          <ul className="nav-links">
            {NAV.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={active === id ? 'active' : ''}>
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-right">
            <LangSwitch />
            <ThemeToggle />
            <button className={`burger ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          >
            <ul>
              {NAV.map((id, i) => (
                <li key={id}>
                  <motion.a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.05 }}
                  >
                    <small>0{i + 1}</small>
                    {t.nav[id]}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div className="mm-foot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <LangSwitch full id="menu" />
              <p>{CONTACT.email}</p>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
