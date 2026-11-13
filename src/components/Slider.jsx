import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { SLIDES } from '../data'

const DURATION = 5.5 // seconds per slide
const ease = [0.7, 0, 0.2, 1]

// direction-aware wipe: new slide is revealed from the side it comes from
const slideVariants = {
  enter: (dir) => ({ clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', zIndex: 2 }),
  center: { clipPath: 'inset(0 0 0 0%)', zIndex: 2, transition: { duration: 1.1, ease } },
  exit: { zIndex: 1, transition: { duration: 1.1 } },
}

const pad = (n) => String(n).padStart(2, '0')

export default function Slider() {
  const [[index, dir], setState] = useState([0, 1])
  const [hover, setHover] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const paused = hover || !inView

  const paginate = useCallback(
    (d) => setState(([i]) => [(i + d + SLIDES.length) % SLIDES.length, d]),
    []
  )
  const goTo = (i) => setState(([cur]) => (i === cur ? [cur, 1] : [i, i > cur ? 1 : -1]))

  // keyboard arrows while the slider is on screen
  useEffect(() => {
    if (!inView) return
    const onKey = (e) => {
      if (document.querySelector('.lightbox')) return
      if (e.key === 'ArrowRight') paginate(1)
      if (e.key === 'ArrowLeft') paginate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inView, paginate])

  const s = SLIDES[index]

  return (
    <section
      className="slider"
      ref={ref}
      aria-roledescription="carousel"
      aria-label="Photo highlights"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="slider-stage">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            className="slide"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -400) paginate(1)
              else if (info.offset.x > 70 || info.velocity.x > 400) paginate(-1)
            }}
          >
            {/* Ken Burns: slow zoom + drift while the slide is shown */}
            <motion.img
              src={s.src}
              alt={s.title}
              draggable={false}
              style={{ objectPosition: s.pos }}
              initial={{ scale: 1.25, x: dir > 0 ? '4%' : '-4%' }}
              animate={{ scale: 1.04, x: '0%' }}
              transition={{ duration: DURATION + 1.5, ease: 'easeOut' }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="slider-shade" aria-hidden />

        {/* caption */}
        <div className="container slider-caption">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial="hidden" animate="show" exit="out">
              <motion.span
                className="slider-kicker"
                variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { delay: 0.5 } }, out: { opacity: 0 } }}
              >
                <b>{pad(index + 1)}</b> — {s.kicker}
              </motion.span>
              <h3 className="slider-title">
                {s.title.split(' ').map((w, i) => (
                  <span key={i} className="mask">
                    <motion.span
                      variants={{
                        hidden: { y: '110%' },
                        show: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 + i * 0.08 } },
                        out: { y: '-110%', transition: { duration: 0.35, ease } },
                      }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </h3>
              <motion.p
                className="slider-text"
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { delay: 0.8 } }, out: { opacity: 0 } }}
              >
                {s.text}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* arrows */}
        <div className="slider-arrows">
          <button className="s-arrow" onClick={() => paginate(-1)} aria-label="Previous slide">←</button>
          <button className="s-arrow" onClick={() => paginate(1)} aria-label="Next slide">→</button>
        </div>
      </div>

      {/* progress bars + counter + thumbnails */}
      <div className="container slider-bar">
        <div className="s-progress">
          {SLIDES.map((sl, i) => (
            <button
              key={sl.src}
              className={`s-seg ${i < index ? 'done' : ''} ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${sl.title}`}
            >
              <i
                key={i === index ? `a${index}` : 'idle'}
                style={{ animationDuration: `${DURATION}s`, animationPlayState: paused ? 'paused' : 'running' }}
                onAnimationEnd={() => i === index && paginate(1)}
              />
            </button>
          ))}
        </div>
        <div className="s-count">
          <b>{pad(index + 1)}</b> / {pad(SLIDES.length)}
          <span className={`s-state ${paused ? 'is-paused' : ''}`}>{paused ? 'Paused' : 'Auto'}</span>
        </div>
        <div className="s-thumbs">
          {SLIDES.map((sl, i) => (
            <button key={sl.src} className={`s-thumb ${i === index ? 'on' : ''}`} onClick={() => goTo(i)} aria-label={`Show ${sl.title}`}>
              <img src={sl.src} alt="" loading="lazy" style={{ objectPosition: sl.pos }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
