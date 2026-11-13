import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CONTACT, NAV } from '../data'
import { useLang } from '../i18n'
import { icons } from './Contact'

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
})

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  const ref = useRef(null)

  // the giant name fills with orange as you scroll to the very bottom
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // one text layer: orange half of a 200%-wide gradient slides in behind the outline
  const fill = useTransform(scrollYProgress, [0.25, 1], ['100% 0%', '0% 0%'])
  const nameY = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])

  // cursor spotlight (desktop)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--fx', `${e.clientX - r.left}px`)
    el.style.setProperty('--fy', `${e.clientY - r.top}px`)
  }

  const socials = [
    { name: 'Instagram', href: CONTACT.instagram },
    { name: 'YouTube', href: CONTACT.youtube },
    { name: 'Facebook', href: CONTACT.facebook },
    { name: 'Spotify', href: CONTACT.spotify },
  ]

  return (
    <footer className="footer" ref={ref} onMouseMove={onMove}>
      <div className="footer-glow" aria-hidden />
      <div className="footer-line" aria-hidden />

      <div className="container footer-grid">
        <motion.div className="f-brand" {...rise(0)}>
          <a href="#top" className="logo f-logo">
            VIPIN<b>.</b>
          </a>
          <p className="f-blurb">{f.blurb}</p>
          <p className="f-avail">
            <span className="live-dot" aria-hidden />
            {f.available}
          </p>
        </motion.div>

        <motion.div className="f-col" {...rise(0.1)}>
          <h4>{f.navTitle}</h4>
          <ul className="f-nav">
            {NAV.map((id, i) => (
              <li key={id}>
                <a href={`#${id}`} className="f-link">
                  <small>0{i + 1}</small>
                  <span>{t.nav[id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="f-col" {...rise(0.2)}>
          <h4>{f.connectTitle}</h4>
          <ul className="f-socials">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="f-social">
                  <span className="f-ic">{icons[s.name]}</span>
                  <span>{s.name}</span>
                  <i aria-hidden>↗</i>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="f-col" {...rise(0.3)}>
          <h4>{f.contactTitle}</h4>
          <a href={`mailto:${CONTACT.email}`} className="f-mail">
            {CONTACT.email}
          </a>
          <p className="f-loc">{t.hero.location}</p>
          <a href="#contact" className="btn primary f-cta">
            {t.hero.cta2} <span className="arr">→</span>
          </a>
        </motion.div>
      </div>

      <motion.div className="footer-name" style={{ y: nameY }}>
        <motion.span className="fn-text" style={{ backgroundPosition: fill }}>
          Vipin Tatad
        </motion.span>
      </motion.div>

      <div className="container footer-bottom">
        <b>{f.tag}</b>
        <span>
          © {new Date().getFullYear()} Vipin Tatad. {f.rights}
        </span>
        <a href="#top" className="to-top-ring" aria-label={f.top} title={f.top}>
          <svg viewBox="0 0 100 100" aria-hidden>
            <defs>
              <path id="ring-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
            </defs>
            <text>
              <textPath href="#ring-path" textLength="230" lengthAdjust="spacing">
                {f.ring}
              </textPath>
            </text>
          </svg>
          <span className="ring-arrow">↑</span>
        </a>
      </div>
    </footer>
  )
}
