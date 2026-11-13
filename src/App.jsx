import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import { About, Music, Credits, Beyond, Philosophy, Live } from './components/Sections'
import Contact, { Footer } from './components/Contact'
import { Release, Press, Gallery } from './components/Extra'
import { useLang, markIntroDone } from './i18n'

export default function App() {
  const { t, lang } = useLang()
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const id = setTimeout(() => {
      setLoading(false)
      markIntroDone()
      document.body.style.overflow = ''
    }, 1700)
    return () => clearTimeout(id)
  }, [])

  return (
    <>
      <div className="grain" aria-hidden />
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
      <motion.div className="progress" style={{ scaleX }} />

      <Navbar />
      {/* remount on language change so every text animation replays in the new language */}
      <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <main>
          <Hero />
          <Marquee items={t.marquee1} />
          <About />
          <Music />
          <Release />
          <Marquee variant="accent" speed={22} items={['Jhund', 'Nagraj Manjule', 'Netflix', 'Murder In a Courtroom', 'Title Rap']} />
          <Credits />
          <Press />
          <Beyond />
          <Gallery />
          <Philosophy />
          <Marquee variant="reverse" items={t.marquee3} />
          <Live />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  )
}
