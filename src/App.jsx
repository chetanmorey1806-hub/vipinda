import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import { About, Music, Credits, Beyond, Philosophy, Live } from './components/Sections'
import Contact, { Footer } from './components/Contact'
import { Release, Press, Gallery } from './components/Extra'

export default function App() {
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setLoading(false)
      document.body.style.overflow = ''
    }, 1700)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <div className="grain" aria-hidden />
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
      <motion.div className="progress" style={{ scaleX }} />

      <Navbar />
      <main>
        <Hero />
        <Marquee items={['Marathi', 'मराठी हिप-हॉप', 'Hindi', 'हिंदी रैप', 'English', 'Storytelling', 'शब्द · आवाज · कथा']} />
        <About />
        <Music />
        <Release />
        <Marquee variant="accent" speed={22} items={['Jhund', 'Nagraj Manjule', 'Netflix', 'Murder In a Courtroom', 'Title Rap']} />
        <Credits />
        <Press />
        <Beyond />
        <Gallery />
        <Philosophy />
        <Marquee variant="reverse" items={['Stay Rooted', 'Think Beyond Boundaries', 'Let the Art Speak']} />
        <Live />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
