import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WHATSAPP } from '../data'
import { useLang } from '../i18n'

export const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`

export const WaIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z" />
  </svg>
)

/* ───────────────── floating button ───────────────── */
export function WhatsAppFab() {
  const { t } = useLang()
  const [show, setShow] = useState(false)
  const [tip, setTip] = useState(false)

  // appears once the visitor scrolls past the hero (keeps the hero slider controls clear)
  useEffect(() => {
    // …and steps aside at the very bottom so it never covers the footer's back-to-top button
    const onScroll = () => {
      const y = window.scrollY
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 220
      setShow(y > window.innerHeight * 0.6 && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // greet once, a few seconds after it first appears
  const greeted = useRef(false)
  useEffect(() => {
    if (!show || greeted.current) return
    greeted.current = true
    const a = setTimeout(() => setTip(true), 1200)
    const b = setTimeout(() => setTip(false), 7500)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [show])

  const href = waLink(t.wa.quick)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="wa-fab-wrap"
          initial={{ scale: 0, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <AnimatePresence>
            {tip && (
              <motion.a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="wa-tip"
                initial={{ opacity: 0, x: 16, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {t.wa.tip}
              </motion.a>
            )}
          </AnimatePresence>
          <a
            className="wa-fab"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={t.wa.fab}
            title={t.wa.fab}
            onMouseEnter={() => setTip(true)}
            onMouseLeave={() => setTip(false)}
          >
            <span className="wa-ring" aria-hidden />
            <span className="wa-ring two" aria-hidden />
            {WaIcon}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ───────────────── message composer ───────────────── */
export function WhatsAppComposer() {
  const { t } = useLang()
  const w = t.wa
  const [name, setName] = useState('')
  const [org, setOrg] = useState('')
  const [type, setType] = useState(0)
  const [details, setDetails] = useState('')
  const [err, setErr] = useState(false)
  const nameRef = useRef(null)

  const msg = w.template({ name: name.trim(), org: org.trim(), type: w.types[type], details: details.trim() })

  const send = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setErr(true)
      nameRef.current?.focus()
      return
    }
    window.open(waLink(msg), '_blank', 'noopener')
  }

  return (
    <motion.form
      className="wa-card"
      onSubmit={send}
      noValidate
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="wa-head">
        <span className="wa-badge">{WaIcon}</span>
        <div>
          <h3>{w.title}</h3>
          <p>{w.sub}</p>
        </div>
      </div>

      <div className="wa-row">
        <label className={`wa-field ${err ? 'has-err' : ''}`}>
          <span>{w.name} *</span>
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (err) setErr(false)
            }}
            placeholder={w.namePh}
            autoComplete="name"
            aria-invalid={err}
          />
          <AnimatePresence>
            {err && (
              <motion.em initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {w.nameErr}
              </motion.em>
            )}
          </AnimatePresence>
        </label>
        <label className="wa-field">
          <span>{w.org}</span>
          <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder={w.orgPh} autoComplete="organization" />
        </label>
      </div>

      <fieldset className="wa-field">
        <legend>{w.type}</legend>
        <div className="wa-types">
          {w.types.map((ty, i) => (
            <button type="button" key={i} className={i === type ? 'on' : ''} onClick={() => setType(i)} aria-pressed={i === type}>
              {i === type && <motion.span layoutId="wa-type-pill" className="wa-type-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>{ty}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="wa-field">
        <span>{w.details}</span>
        <textarea rows={2} value={details} onChange={(e) => setDetails(e.target.value)} placeholder={w.detailsPh} />
      </label>

      <div className="wa-preview">
        <span className="wa-preview-label">{w.preview}</span>
        <div className="wa-bubble">
          <pre>{msg}</pre>
          <span className="wa-tick" aria-hidden>✓✓</span>
        </div>
      </div>

      <motion.button className="wa-send" type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        {WaIcon}
        <span>{w.send}</span>
        <span className="arr">→</span>
      </motion.button>
    </motion.form>
  )
}
