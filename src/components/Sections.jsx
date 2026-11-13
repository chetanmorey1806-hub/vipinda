import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Reveal, SplitWords, Counter, SectionHead, ClipReveal, ScrollWords } from './Reveal'
import { LANGUAGES, BEYOND_ICONS, ABOUT_PHOTOS } from '../data'
import { Tilt } from './FX'
import { useLang } from '../i18n'

/* ───────────────── ABOUT ───────────────── */
const FADE_TIME = 3500

/** Cross-fading photo slider with a slow Ken Burns zoom. */
function FadeSlider({ alt }) {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 })
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setI((x) => (x + 1) % ABOUT_PHOTOS.length), FADE_TIME)
    return () => clearInterval(id)
  }, [inView, i])
  const p = ABOUT_PHOTOS[i]
  return (
    <div className="fade-slider" ref={ref}>
      <AnimatePresence initial={false}>
        <motion.img
          key={p.src}
          src={p.src}
          alt={alt}
          style={{ objectPosition: p.pos }}
          initial={{ opacity: 0, scale: 1.14 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: 'easeInOut' }, scale: { duration: FADE_TIME / 1000 + 1.5, ease: 'easeOut' } }}
        />
      </AnimatePresence>
      <div className="fs-dots">
        {ABOUT_PHOTOS.map((ph, k) => (
          <button key={ph.src} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`}>
            {k === i && <motion.i layoutId="fs-dot" />}
          </button>
        ))}
      </div>
    </div>
  )
}

export function About() {
  const { t } = useLang()
  const a = t.about
  return (
    <section id="about">
      <div className="container">
        <SectionHead eyebrow={a.eyebrow}>
          <SplitWords text={a.h1} /> <SplitWords className="outline" text={a.h2} delay={0.15} />
        </SectionHead>

        <div className="about-grid">
          <div className="about-text">
            <ScrollWords className="lead" text={a.lead} />
            {a.p.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p className="muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <div>
            <Tilt className="about-visual" depth max={7} scale={1} glare={false}>
              <ClipReveal as="figure" className="about-photo" from="inset(0% 100% 0% 0%)">
                <FadeSlider alt="Vipin Tatad" />
                <figcaption>{a.photoCap}</figcaption>
              </ClipReveal>
              <motion.div
                className="about-ring"
                style={{ z: 70 }}
                initial={{ opacity: 0, scale: 0.4, rotate: -120 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.6 }}
                aria-hidden
              >
                <svg viewBox="0 0 100 100">
                  <defs>
                    <path id="about-ring-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text>
                    <textPath href="#about-ring-path" textLength="236" lengthAdjust="spacing">{a.ring}</textPath>
                  </text>
                </svg>
                <span>VIP</span>
              </motion.div>
              <motion.span
                className="about-sign"
                style={{ z: 50 }}
                initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.9 }}
              >
                {a.signature}
              </motion.span>
            </Tilt>
            <Reveal className="stats">
              <div className="stat">
                <Counter to={3} />
                <span>{a.stats[0]}</span>
              </div>
              <div className="stat">
                <Counter to={2} />
                <span>{a.stats[1]}</span>
              </div>
              <div className="stat">
                <Counter to={7} suffix="+" />
                <span>{a.stats[2]}</span>
              </div>
              <div className="stat">
                <b>MJMC</b>
                <span>{a.stats[3]}</span>
              </div>
            </Reveal>

            <div className="langs">
              {LANGUAGES.map((l, i) => (
                <motion.div
                  key={l.label}
                  className="lang"
                  initial={{ opacity: 0, rotateX: -90 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, borderColor: 'var(--accent)' }}
                >
                  <div className={`w ${l.word === 'English' ? 'en' : ''}`}>{l.word}</div>
                  <small>{l.label}</small>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── MUSIC ───────────────── */
export function Music() {
  const { t } = useLang()
  const m = t.music
  return (
    <section id="music" className="music">
      <div className="container">
        <SectionHead eyebrow={m.eyebrow}>
          <SplitWords text={m.h1} /> <span className="hl"><SplitWords text={m.h2} delay={0.15} /></span>
        </SectionHead>
        <Reveal delay={0.1}>
          <p className="lead muted" style={{ marginTop: 24 }}>{m.lead}</p>
        </Reveal>

        <div className="genre-list">
          {m.genres.map((g, i) => (
            <motion.div
              key={i}
              className="genre"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{g.title}</h3>
              <p>{g.note}</p>
            </motion.div>
          ))}
        </div>

        <Reveal>
          <p className="music-quote">
            {m.quote[0]}<span>{m.quote[1]}</span>{m.quote[2]}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── CREDITS ───────────────── */
function CreditCard({ c, i }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="credit" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: 'transform 0.2s ease-out' }}>
        <div className="shine" />
        <span className="bg-num">0{i + 1}</span>
        <span className="tag">
          <span className="eq" aria-hidden><i /><i /><i /></span>
          {c.tag}
        </span>
        <div>
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </div>
      </div>
    </motion.article>
  )
}

export function Credits() {
  const { t } = useLang()
  const c = t.credits
  return (
    <section id="credits">
      <div className="container">
        <SectionHead eyebrow={c.eyebrow}>
          <SplitWords text={c.h1} /> <span className="outline"><SplitWords text={c.h2} delay={0.12} /></span>
        </SectionHead>
        <div className="credits-grid">
          {c.items.map((item, i) => (
            <CreditCard key={i} c={item} i={i} />
          ))}
        </div>
        <Reveal>
          <p className="credits-note">{c.note}</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── BEYOND ───────────────── */
export function Beyond() {
  const { t } = useLang()
  const b = t.beyond
  return (
    <section id="beyond" className="beyond">
      <div className="container">
        <div className="beyond-head">
          <div>
            <SectionHead eyebrow={b.eyebrow}>
              <SplitWords text={b.h1} /> <span className="hl"><SplitWords text={b.h2} delay={0.12} /></span>
            </SectionHead>
          </div>
          <Reveal delay={0.1}>
            <p className="muted">{b.para}</p>
          </Reveal>
        </div>

        <div className="skills">
          {b.skills.map((s, i) => (
            <motion.div
              key={i}
              className="skill"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="ic" aria-hidden>{BEYOND_ICONS[i]}</span>
              <h4>{s}</h4>
            </motion.div>
          ))}
        </div>

        <Reveal>
          <p className="beyond-quote">{b.quote}</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── PHILOSOPHY ───────────────── */
export function Philosophy() {
  const { t } = useLang()
  const p = t.philo
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const row = { display: 'flex', gap: '8px 28px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }

  return (
    <section id="philosophy" className="philosophy" ref={ref}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">{p.eyebrow}</span>
        </Reveal>
        <Reveal>
          <p className="lead" style={{ margin: '0 auto' }}>{p.intro}</p>
        </Reveal>

        <div className="philo-words">
          <motion.div style={{ x: x1, ...row }}>
            {p.words.slice(0, 2).map((w, i) => (
              <Reveal as="span" key={w} delay={i * 0.1}>{w}</Reveal>
            ))}
          </motion.div>
          <motion.div style={{ x: x2, ...row }}>
            {p.words.slice(2).map((w, i) => (
              <Reveal as="span" key={w} delay={0.2 + i * 0.1}>{w}</Reveal>
            ))}
          </motion.div>
        </div>

        {p.p.map((txt, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <p className="philo-text">{txt}</p>
          </Reveal>
        ))}

        <Reveal delay={0.15}>
          <div className="vision">
            <span className="corner c1" /><span className="corner c2" /><span className="corner c3" /><span className="corner c4" />
            <small>{p.visionLabel}</small>
            <p>
              {p.vision1}
              <br />
              <span style={{ color: 'var(--accent)' }}>{p.vision2}</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── LIVE & COLLABS ───────────────── */
export function Live() {
  const { t } = useLang()
  const l = t.live
  return (
    <section id="live">
      <div className="container">
        <SectionHead eyebrow={l.eyebrow}>
          <SplitWords text={l.h1} /> <span className="outline"><SplitWords text={l.h2} delay={0.15} /></span>
        </SectionHead>

        <div className="live-grid">
          <div className="live-text">
            <Reveal>
              <p className="lead">{l.lead}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="muted">{l.p}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="muted">{l.open}</p>
            </Reveal>
          </div>
          <ul className="collab-list">
            {l.collabs.map((c, i) => (
              <motion.li
                key={i}
                className="chip"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                {c}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
