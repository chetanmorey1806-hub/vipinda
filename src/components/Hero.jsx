import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useFinePointer } from './FX'
import { SLIDES } from '../data'
import { useLang, getIntroDelay } from '../i18n'

const SLIDE_TIME = 2 // seconds per photo
const ease = [0.7, 0, 0.2, 1]
const pad = (n) => String(n).padStart(2, '0')

// direction-aware wipe: the new photo is revealed from the side it comes from
const wipe = {
  enter: (dir) => ({ clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)', zIndex: 2 }),
  center: { clipPath: 'inset(0% 0% 0% 0%)', zIndex: 2, transition: { duration: 0.8, ease } },
  exit: { zIndex: 1, transition: { duration: 0.8 } },
}

function Chars({ text, delay }) {
  return text.split('').map((c, i) => (
    <motion.span
      key={i}
      className="char"
      initial={{ y: '105%', rotate: 8 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.06 }}
    >
      {c}
    </motion.span>
  ))
}

export default function Hero() {
  const { t, lang } = useLang()
  const [D] = useState(getIntroDelay)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.25 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const devaY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])

  // mouse parallax — layers drift at different depths
  const fine = useFinePointer()
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })
  const titleX = useTransform(mx, (v) => v * -18)
  const titleY = useTransform(my, (v) => v * -10)
  const photoX = useTransform(mx, (v) => v * 14)
  const devaX = useTransform(mx, (v) => v * 34)
  const glowX = useTransform(mx, (v) => v * 60)
  const glowY = useTransform(my, (v) => v * 40)
  const onPointerMove = (e) => {
    if (!fine) return
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  // rotating role word
  const [role, setRole] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setRole((i) => (i + 1) % t.hero.roles.length), 2400)
    return () => clearInterval(id)
  }, [t])

  // photo slider
  const N = SLIDES.length
  const [[slide, dir], setSlide] = useState([0, 1])
  const go = (d) => setSlide(([i]) => [(i + d + N) % N, d])
  const goTo = (i) => setSlide(([c]) => [i, i >= c ? 1 : -1])
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setStarted(true), (D + 1) * 1000)
    return () => clearTimeout(id)
  }, [D])
  const paused = !started || !inView
  const cap = t.slides[slide]

  const fade = (d) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: D + d },
  })

  return (
    <section className="hero" id="top" ref={ref} onPointerMove={onPointerMove}>
      <motion.div className="hero-glow" style={{ x: glowX, y: glowY }} />
      <div className="hero-glow two" />

      {/* auto photo slider */}
      <motion.div
        className="hero-photo"
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.4, ease, delay: Math.max(0, D - 0.4) }}
      >
        <motion.div className="hero-photo-inner" style={{ y: photoY, x: photoX }}>
          <AnimatePresence initial={false} custom={dir}>
            <motion.div key={slide} className="hero-slide" custom={dir} variants={wipe} initial="enter" animate="center" exit="exit">
              <motion.img
                src={SLIDES[slide].src}
                alt={cap.title}
                draggable={false}
                style={{ objectPosition: SLIDES[slide].pos }}
                initial={{ scale: 1.14, x: dir > 0 ? '2%' : '-2%' }}
                animate={{ scale: 1.04, x: '0%' }}
                transition={{ duration: SLIDE_TIME + 1.5, ease: 'easeOut' }}
                fetchpriority={slide === 0 ? 'high' : 'auto'}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div className="hero-deva" style={{ y: devaY, x: devaX }} aria-hidden>
        हिप-हॉप
      </motion.div>

      <motion.div className="container hero-content" style={{ y, opacity }}>
        <motion.div className="hero-top" {...fade(-0.3)}>
          <span className="dot" />
          <span>{t.hero.location}</span>
          <span className="aka">{t.hero.aka}</span>
          <span className="eq" aria-hidden>
            <i /><i /><i /><i />
          </span>
        </motion.div>

        <motion.h1 className="hero-title" aria-label="Vipin Tatad" style={{ x: titleX, y: titleY }}>
          <span className="line" aria-hidden>
            <Chars text="Vipin" delay={D - 0.2} />
          </span>
          <span className="line second" aria-hidden>
            <Chars text="Tatad" delay={D} />
          </span>
        </motion.h1>

        <motion.div className="hero-roles" {...fade(0.5)}>
          <span>{t.hero.multilingual}</span>
          <span className="sep">/</span>
          <span className="rotator">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${lang}-${role}`}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block' }}
              >
                {t.hero.roles[role % t.hero.roles.length]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p className="hero-tagline" {...fade(0.65)}>
          <b>{t.hero.taglineStrong}</b> {t.hero.taglineRest}
        </motion.p>

        <motion.div className="hero-ctas" {...fade(0.8)}>
          <a href="#music" className="btn primary">
            {t.hero.cta1} <span className="arr">→</span>
          </a>
          <a href="#contact" className="btn">
            {t.hero.cta2}
          </a>
        </motion.div>
      </motion.div>

      {/* slider caption + controls */}
      <motion.div className="hero-slider-ui" {...fade(1)}>
        <div className="hs-caption" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${lang}-${slide}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <span className="hs-kicker">
                <b>{pad(slide + 1)}</b> / {pad(N)} — {cap.kicker}
              </span>
              <span className="hs-title">{cap.title}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="hs-row">
          <div className="s-progress">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                className={`s-seg ${i < slide ? 'done' : ''} ${i === slide ? 'active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Photo ${i + 1}`}
              >
                <i
                  key={i === slide ? `a${slide}` : 'idle'}
                  style={{ animationDuration: `${SLIDE_TIME}s`, animationPlayState: paused ? 'paused' : 'running' }}
                  onAnimationEnd={() => i === slide && go(1)}
                />
              </button>
            ))}
          </div>
          <div className="hs-arrows">
            <button className="s-arrow" onClick={() => go(-1)} aria-label="Previous photo">←</button>
            <button className="s-arrow" onClick={() => go(1)} aria-label="Next photo">→</button>
          </div>
        </div>
      </motion.div>

      <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 1.2 }}>
        {t.hero.scroll}
        <i />
      </motion.div>
    </section>
  )
}
