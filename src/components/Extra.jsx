import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, SplitWords, SectionHead, ClipReveal } from './Reveal'
import { CONTACT, PRESS, GALLERY } from '../data'

/* ───────────────── LATEST RELEASE ───────────────── */
export function Release() {
  return (
    <section id="release" className="release">
      <div className="container release-grid">
        <ClipReveal className="poster" from="inset(100% 0% 0% 0%)" scale={1.1} duration={1.3}>
          <img src="/images/release-poster.jpg" alt="Latest release poster — Raptoli presents, rapper Vipin Tatad VIP" />
          <span className="poster-badge">
            <span className="dot" /> Out Now
          </span>
        </ClipReveal>

        <div>
          <SectionHead eyebrow="Latest Release">
            <span className="deva-head">चर्चेत</span> <span className="hl"><SplitWords text="Out now." delay={0.12} /></span>
          </SectionHead>
          <Reveal delay={0.1}>
            <p className="lead muted" style={{ marginTop: 24 }}>
              Raptoli presents <em>चर्चेत</em> (Charchet), the latest Marathi hip-hop drop from Vipin Tatad (VIP) — a street-level crew anthem shot
              in the lanes it speaks for. Streaming now on the Raptoli YouTube channel.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="hero-ctas">
            <a href={CONTACT.youtube} target="_blank" rel="noreferrer" className="btn primary">
              Watch on YouTube <span className="arr">→</span>
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
  return (
    <section id="press" className="press">
      <div className="container">
        <SectionHead eyebrow="Press & Features">
          <SplitWords text="In the" /> <span className="outline"><SplitWords text="headlines" delay={0.12} /></span>
        </SectionHead>
        <Reveal delay={0.1}>
          <p className="lead muted" style={{ marginTop: 24 }}>
            From the Swachh Bharat critique <em>Meri Galli Ki Samasya</em> to protest anthems — his socially conscious rap
            has been covered by national media and recognised at JNU and TISS.
          </p>
        </Reveal>

        <div className="press-list">
          {PRESS.map((p, i) => (
            <motion.a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="press-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="press-outlet">{p.outlet}</span>
              <span className={`press-title ${p.deva ? 'deva' : ''}`}>{p.title}</span>
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
        <SectionHead eyebrow="Gallery">
          <SplitWords text="Live." /> <span className="hl"><SplitWords text="Loud." delay={0.1} /></span>{' '}
          <span className="outline"><SplitWords text="Real." delay={0.2} /></span>
        </SectionHead>

        <div className="masonry">
          {GALLERY.map((g, i) => (
            <motion.button
              key={g.src}
              className="shot"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              aria-label={`Open photo: ${g.alt}`}
            >
              <img src={g.src} alt={g.alt} loading="lazy" />
              <span className="shot-cap">{g.alt}</span>
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
                src={GALLERY[open].src}
                alt={GALLERY[open].alt}
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
              {GALLERY[open].alt} <span>{open + 1} / {GALLERY.length}</span>
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
