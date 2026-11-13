import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, CONTACT } from '../data'
import { useLang } from '../i18n'
import ThemeToggle from './ThemeToggle'
import LangSwitch, { LangDropdown } from './LangSwitch'

const ease = [0.16, 1, 0.3, 1]

function Logo({ onClick }) {
  return (
    <a href="#top" className="logo" onClick={onClick} aria-label="Vipin Tatad — home">
      {'VIPIN'.split('').map((c, i) => (
        <span key={i} style={{ '--i': i }} aria-hidden>
          {c}
        </span>
      ))}
      <b aria-hidden>.</b>
    </a>
  )
}

export default function Navbar() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [hovered, setHovered] = useState(null)
  const lastY = useRef(0)

  // floating capsule after a little scroll; hide while scrolling down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 30)
      const goingDown = y > lastY.current + 4
      const goingUp = y < lastY.current - 4
      const busy = document.querySelector('.lang-dd.open')
      if (goingDown && y > 400 && !busy) setHidden(true)
      else if (goingUp || y < 400) setHidden(false)
      if (Math.abs(y - lastY.current) > 4) lastY.current = y
    }
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
        initial={{ y: -100 }}
        animate={{ y: hidden && !open ? '-120%' : 0 }}
        transition={{ duration: 0.6, ease, delay: hidden ? 0 : 0.05 }}
      >
        <div className="container nav-inner">
          <Logo onClick={() => setOpen(false)} />
          <ul className="nav-links" onMouseLeave={() => setHovered(null)}>
            {NAV.map((id, i) => (
              <motion.li
                key={id}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.5 + i * 0.05 }}
                onMouseEnter={() => setHovered(id)}
              >
                <a href={`#${id}`} className={active === id ? 'active' : ''}>
                  {hovered === id && <motion.span layoutId="nav-hover" className="nav-hover" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="nav-label">{t.nav[id]}</span>
                  {active === id && <motion.span layoutId="nav-active" className="nav-active" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="nav-right">
            <LangDropdown />
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
            <motion.img
              className="mm-bg"
              src="/images/stage-red.jpg"
              alt=""
              aria-hidden
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 1 }}
              transition={{ scale: { duration: 6, ease: 'easeOut' }, opacity: { duration: 0.8 } }}
            />
            <div className="mm-shade" aria-hidden />
            <ul>
              {NAV.map((id, i) => (
                <li key={id}>
                  <motion.a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%', rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.25 + i * 0.05 }}
                  >
                    <small>0{i + 1}</small>
                    <span>{t.nav[id]}</span>
                    <i aria-hidden>→</i>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div className="mm-foot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <LangSwitch id="menu" />
              <p>{CONTACT.email}</p>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
