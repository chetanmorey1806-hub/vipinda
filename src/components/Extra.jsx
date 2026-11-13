import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, SplitWords, SectionHead, ClipReveal } from './Reveal'
import { CONTACT, PRESS, GALLERY } from '../data'
import { useLang } from '../i18n'

/* ───────────────── LATEST RELEASE ───────────────── */
export function Release() {
  const { t } = useLang()
  const r = t.release
  return (
    <section id="release" className="release">
      <div className="container release-grid">
        <ClipReveal className="poster" from="inset(100% 0% 0% 0%)" scale={1.1} duration={1.3}>
          <img src="/images/release-poster.jpg" alt="चर्चेत — Raptoli presents, rapper Vipin Tatad VIP" />
          <span className="poster-badge">
            <span className="dot" /> {r.badge}
          </span>
        </ClipReveal>

        <div>
          <SectionHead eyebrow={r.eyebrow}>
            <span className="deva-head">चर्चेत</span> <span className="hl"><SplitWords text={r.out} delay={0.12} /></span>
          </SectionHead>
          <Reveal delay={0.1}>
            <p className="lead muted" style={{ marginTop: 24 }}>{r.para}</p>
          </Reveal>
          <Reveal delay={0.2} className="hero-ctas">
            <a href={CONTACT.youtube} target="_blank" rel="noreferrer" className="btn primary">
              {r.watch} <span className="arr">→</span>
            </a>
            <a href={CONTACT.spotify} target="_blank" rel="noreferrer" className="btn">
              Spotify
            </a>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="spotify">
              <iframe
                title="Vipin Tatad on Spotify"
                src={CONTACT.spotifyEmbed}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── PRESS ───────────────── */
export function Press() {
  const { t } = useLang()
  const p = t.press
  return (
    <section id="press" className="press">
      <div className="container">
        <SectionHead eyebrow={p.eyebrow}>
          <SplitWords text={p.h1} /> <span className="outline"><SplitWords text={p.h2} delay={0.12} /></span>
        </SectionHead>
        <Reveal delay={0.1}>
          <p className="lead muted" style={{ marginTop: 24 }}>{p.lead}</p>
        </Reveal>

        <div className="press-list">
          {PRESS.map((item, i) => (
            <motion.a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="press-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="press-outlet">{item.outlet}</span>
              <span className={`press-title ${item.deva ? 'deva' : ''}`} lang={item.deva ? 'mr' : 'en'}>{item.title}</span>
              <span className="press-arrow" aria-hidden>↗</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────── GALLERY ───────────────── */
export function Gallery() {
  const { t } = useLang()
  const g = t.gallery
  const [open, setOpen] = useState(null)

  const go = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length)), [])

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, go])

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <SectionHead eyebrow={g.eyebrow}>
          <SplitWords text={g.words[0]} /> <span className="hl"><SplitWords text={g.words[1]} delay={0.1} /></span>{' '}
          <span className="outline"><SplitWords text={g.words[2]} delay={0.2} /></span>
        </SectionHead>

        <div className="masonry">
          {GALLERY.map((src, i) => (
            <motion.button
              key={src}
              className="shot"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              aria-label={g.caps[i]}
            >
              <img src={src} alt={g.caps[i]} loading="lazy" />
              <span className="shot-cap">{g.caps[i]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={open}
                src={GALLERY[open]}
                alt={g.caps[open]}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1)
                  else if (info.offset.x > 60) go(-1)
                }}
              />
            </AnimatePresence>
            <p className="lb-cap">
              {g.caps[open]} <span>{open + 1} / {GALLERY.length}</span>
            </p>
            <button className="lb-btn lb-close" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous">←</button>
            <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next">→</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
