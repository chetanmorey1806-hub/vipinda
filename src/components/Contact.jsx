import { motion } from 'framer-motion'
import { Reveal, SplitWords } from './Reveal'
import { CONTACT } from '../data'
import { useLang } from '../i18n'

export const icons = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.1V8.9l5.8 3.1-5.8 3.1Z" /></svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" /></svg>
  ),
  Spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm5 15.9a.7.7 0 0 1-1 .2c-2.7-1.6-6-2-10-1.1a.7.7 0 1 1-.3-1.3c4.3-1 8-.6 11 1.2.3.2.4.7.3 1Zm1.4-3.1a.9.9 0 0 1-1.2.3c-3-1.9-7.7-2.4-11.3-1.3a.9.9 0 1 1-.5-1.7c4.1-1.2 9.2-.6 12.7 1.5.4.3.5.8.3 1.2Zm.1-3.2C14.9 8.4 8.9 8.2 5.4 9.3a1 1 0 1 1-.6-2c4-1.2 10.7-1 14.8 1.5a1 1 0 1 1-1.1 1.8Z" /></svg>
  ),
}

export default function Contact() {
  const { t } = useLang()
  const c = t.contact
  const socials = [
    { name: 'Instagram', href: CONTACT.instagram },
    { name: 'YouTube', href: CONTACT.youtube },
    { name: 'Facebook', href: CONTACT.facebook },
    { name: 'Spotify', href: CONTACT.spotify },
  ]
  return (
    <section id="contact" className="contact">
      <div className="container">
        <Reveal>
          <span className="eyebrow">{c.eyebrow}</span>
        </Reveal>
        <h2 className="contact-title">
          <SplitWords text={c.title[0]} />
          <br />
          <span className="outline"><SplitWords text={c.title[1]} delay={0.12} /></span>
          <br />
          <SplitWords text={c.title[2]} delay={0.24} />
        </h2>
        <Reveal delay={0.1}>
          <p className="contact-sub">{c.sub}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <a className="mail" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email} <span>→</span>
          </a>
        </Reveal>

        <div className="socials">
          {socials.map((s, i) => (
            <motion.a
              key={s.name}
              className="social"
              href={s.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {icons[s.name]}
                {s.name}
              </span>
              <span>↗</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
