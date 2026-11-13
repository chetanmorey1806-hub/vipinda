import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal, SplitWords, Counter, SectionHead } from './Reveal'
import { LANGUAGES, GENRES, CREDITS, BEYOND, COLLABS } from '../data'

/* ───────────────── ABOUT ───────────────── */
export function About() {
  return (
    <section id="about">
      <div className="container">
        <SectionHead eyebrow="About Vipin">
          <SplitWords text="More than" /> <SplitWords className="outline" text="entertainment" delay={0.15} />
        </SectionHead>

        <div className="about-grid">
          <div className="about-text">
            <Reveal>
              <p className="lead">
                An independent hip-hop artist known for sharp lyricism, research-driven writing, poetic expression and a
                cinematic performance style.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="muted">
                His journey is deeply influenced by culture, history, social experiences and the realities of everyday
                life. Through his music he explores identity, equality, emotions, society and the human experience.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="muted">
                With an academic background in Mass Communication and Journalism (MJMC), Vipin approaches music as a
                storyteller and documentarian — and his expertise in video editing and visual storytelling shapes the
                identity of every project.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="muted">
                Coming from Maharashtra’s underground hip-hop scene, he represents a new generation of Indian hip-hop
                artists who believe rap is a medium of expression, documentation and storytelling.
              </p>
            </Reveal>
          </div>

          <div>
            <motion.figure
              className="about-photo"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, ease: [0.7, 0, 0.2, 1] }}
            >
              <img src="/images/portrait-bw.jpg" alt="Portrait of Vipin Tatad" loading="lazy" />
              <figcaption>Independent · Underground · Maharashtra</figcaption>
            </motion.figure>
            <Reveal className="stats">
              <div className="stat">
                <Counter to={3} />
                <span>Languages on the mic</span>
              </div>
              <div className="stat">
                <Counter to={2} />
                <span>Film &amp; OTT credits</span>
              </div>
              <div className="stat">
                <Counter to={7} suffix="+" />
                <span>Styles of expression</span>
              </div>
              <div className="stat">
                <b>MJMC</b>
                <span>Mass Comm. &amp; Journalism</span>
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
  return (
    <section id="music" className="music">
      <div className="container">
        <SectionHead eyebrow="Music & Artistic Identity">
          <SplitWords text="Every verse" /> <span className="hl"><SplitWords text="tells a story" delay={0.15} /></span>
        </SectionHead>
        <Reveal delay={0.1}>
          <p className="lead muted" style={{ marginTop: 24 }}>
            Underground authenticity, contemporary sounds, poetic depth and socially conscious storytelling — a
            multilingual approach that connects with diverse audiences while staying rooted.
          </p>
        </Reveal>

        <div className="genre-list">
          {GENRES.map((g, i) => (
            <motion.div
              key={g.title}
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
            Every song carries a <span>perspective</span>. Every project reflects a part of his identity.
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
  return (
    <section id="credits">
      <div className="container">
        <SectionHead eyebrow="Film & OTT Credits">
          <SplitWords text="On the" /> <span className="outline"><SplitWords text="big screen" delay={0.12} /></span>
        </SectionHead>
        <div className="credits-grid">
          {CREDITS.map((c, i) => (
            <CreditCard key={c.title} c={c} i={i} />
          ))}
        </div>
        <Reveal>
          <p className="credits-note">
            Working across independent music, cinema and digital entertainment.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── BEYOND ───────────────── */
export function Beyond() {
  return (
    <section id="beyond" className="beyond">
      <div className="container">
        <div className="beyond-head">
          <div>
            <SectionHead eyebrow="Beyond Music">
              <SplitWords text="Not just" /> <span className="hl"><SplitWords text="a rapper" delay={0.12} /></span>
            </SectionHead>
          </div>
          <Reveal delay={0.1}>
            <p className="muted">
              A creative professional with a deep understanding of visual communication. His background in Mass
              Communication &amp; Journalism and his video editing skills let him work across multiple creative formats.
            </p>
          </Reveal>
        </div>

        <div className="skills">
          {BEYOND.map((s, i) => (
            <motion.div
              key={s.title}
              className="skill"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="ic" aria-hidden>{s.icon}</span>
              <h4>{s.title}</h4>
            </motion.div>
          ))}
        </div>

        <Reveal>
          <p className="beyond-quote">
            Powerful storytelling does not end with sound — visuals, emotions and context complete the experience.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── PHILOSOPHY ───────────────── */
const WORDS = ['Identity', 'Freedom', 'Resistance', 'Expression']

export function Philosophy() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <section id="philosophy" className="philosophy" ref={ref}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">Artistic Philosophy</span>
        </Reveal>
        <Reveal>
          <p className="lead" style={{ margin: '0 auto' }}>For Vipin, hip-hop is a language of</p>
        </Reveal>

        <div className="philo-words">
          <motion.div style={{ x: x1, display: 'flex', gap: '8px 28px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            {WORDS.slice(0, 2).map((w, i) => (
              <Reveal as="span" key={w} delay={i * 0.1}>{w}</Reveal>
            ))}
          </motion.div>
          <motion.div style={{ x: x2, display: 'flex', gap: '8px 28px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            {WORDS.slice(2).map((w, i) => (
              <Reveal as="span" key={w} delay={0.2 + i * 0.1}>{w}</Reveal>
            ))}
          </motion.div>
        </div>

        <Reveal>
          <p className="philo-text">
            His music aims to document realities, preserve cultural perspectives, question social structures, and
            express emotions that often remain unheard.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="philo-text">
            Rather than following trends, he creates music with meaning, originality and a lasting connection with
            listeners.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="vision">
            <span className="corner c1" /><span className="corner c2" /><span className="corner c3" /><span className="corner c4" />
            <small>The Vision</small>
            <p>
              Stay rooted. Think beyond boundaries.
              <br />
              <span style={{ color: 'var(--accent)' }}>Let the art speak.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────── LIVE & COLLABS ───────────────── */
export function Live() {
  return (
    <section id="live">
      <div className="container">
        <SectionHead eyebrow="Live Performances & Collaborations">
          <SplitWords text="Let's take it" /> <span className="outline"><SplitWords text="further" delay={0.15} /></span>
        </SectionHead>

        <div className="live-grid">
          <div className="live-text">
            <Reveal>
              <p className="lead">
                Expanding his artistic presence through independent live performances, cultural events and
                collaborations.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="muted">
                The mission: take Marathi and Indian underground hip-hop to wider audiences through multi-city
                performances and high-quality creative productions.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="muted">Open to collaborations and professional opportunities with:</p>
            </Reveal>
          </div>
          <ul className="collab-list">
            {COLLABS.map((c, i) => (
              <motion.li
                key={c}
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
