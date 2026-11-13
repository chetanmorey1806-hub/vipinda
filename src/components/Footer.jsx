import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CONTACT, NAV } from '../data'
import { useLang } from '../i18n'
import { icons } from './Contact'
import { waLink } from './WhatsApp'

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
    { name: 'WhatsApp', href: waLink(t.wa.quick) },
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
          © {new Date().getFullYear()} Vipin Tatad. {f.rights}{' '}
          <a href="#admin" className="admin-link" title="Manage gallery photos">
            🔒 Manage photos
          </a>
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

      {/* developer credit — very bottom */}
      <motion.div
        className="dev-credit"
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        lang="en"
      >
        <span className="dev-code" aria-hidden>&lt;/&gt;</span>
        <span className="dev-by">Developed by</span>
        <span className="dev-name">ER. Chetan D Morey</span>
        <span className="dev-spark" aria-hidden><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 3.7 4.3 7.2C19.5 16.4 12 21 12 21Z" /></svg></span>
      </motion.div>
    </footer>
  )
}
