import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, CONTACT } from '../data'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the section currently in view
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

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
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className={active === n.id ? 'active' : ''}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-right">
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
              {NAV.map((n, i) => (
                <li key={n.id}>
                  <motion.a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.05 }}
                  >
                    <small>0{i + 1}</small>
                    {n.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div className="mm-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {CONTACT.email}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
