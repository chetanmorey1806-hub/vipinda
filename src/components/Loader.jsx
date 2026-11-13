import { motion } from 'framer-motion'

const WORD = 'VIPIN'

export default function Loader() {
  return (
    <motion.div
      className="loader"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
    >
      <div className="loader-word">
        {WORD.split('').map((c, i) => (
          <motion.span
            key={i}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 }}
            style={{ color: i === WORD.length - 1 ? 'var(--accent)' : undefined }}
          >
            {c}
          </motion.span>
        ))}
      </div>
      <div className="loader-bar">
        <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
      </div>
    </motion.div>
  )
}
