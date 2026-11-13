import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ROLES } from '../data'

const D = 1.9 // starts after loader

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
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const devaY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROLES.length), 2400)
    return () => clearInterval(t)
  }, [])

  const fade = (d) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: D + d },
  })

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-glow" />
      <div className="hero-glow two" />
      <motion.div
        className="hero-photo"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1], delay: D - 0.4 }}
      >
        <motion.img src="/images/stage-red.jpg" alt="Vipin Tatad performing live" style={{ y: photoY, scale: photoScale }} fetchpriority="high" />
      </motion.div>
      <motion.div className="hero-deva" style={{ y: devaY }} aria-hidden>
        हिप-हॉप
      </motion.div>

      <motion.div className="container" style={{ y, opacity }}>
        <motion.div className="hero-top" {...fade(-0.3)}>
          <span className="dot" />
          <span>Maharashtra, India</span>
          <span className="aka">aka VIP</span>
          <span className="eq" aria-hidden>
            <i /><i /><i /><i />
          </span>
        </motion.div>

        <h1 className="hero-title" aria-label="Vipin Tatad">
          <span className="line" aria-hidden>
            <Chars text="Vipin" delay={D - 0.2} />
          </span>
          <span className="line second" aria-hidden>
            <Chars text="Tatad" delay={D} />
          </span>
        </h1>

        <motion.div className="hero-roles" {...fade(0.5)}>
          <span>Multilingual</span>
          <span className="sep">/</span>
          <span className="rotator">
            <AnimatePresence mode="wait">
              <motion.span
                key={idx}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block' }}
              >
                {ROLES[idx].replace('Multilingual ', '')}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p className="hero-tagline" {...fade(0.65)}>
          <b>Rooted in Culture. Driven by Stories. Powered by Hip-Hop.</b> Marathi, Hindi &amp; English hip-hop with
          powerful lyricism and cinematic storytelling.
        </motion.p>

        <motion.div className="hero-ctas" {...fade(0.8)}>
          <a href="#music" className="btn primary">
            Explore the Music <span className="arr">→</span>
          </a>
          <a href="#contact" className="btn">
            Book / Collaborate
          </a>
        </motion.div>
      </motion.div>

      <motion.div className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 1.2 }}>
        Scroll
        <i />
      </motion.div>
    </section>
  )
}
