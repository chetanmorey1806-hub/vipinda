import { motion } from 'framer-motion'
import { useLang } from '../i18n'

/** EN / हिं / मरा pill with a sliding highlight. `full` shows full names (mobile menu). */
export default function LangSwitch({ full = false, id = 'nav' }) {
  const { lang, setLang, langs } = useLang()
  return (
    <div className={`lang-switch ${full ? 'full' : ''}`} role="group" aria-label="Language">
      {langs.map((l) => (
        <button
          key={l.code}
          className={lang === l.code ? 'on' : ''}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          lang={l.code}
          title={l.name}
        >
          {lang === l.code && (
            <motion.span layoutId={`lang-pill-${id}`} className="lang-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
          )}
          <span className="lang-label">{full ? l.name : l.short}</span>
        </button>
      ))}
    </div>
  )
}
