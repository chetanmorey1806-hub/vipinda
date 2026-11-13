import { createContext, useContext, useEffect, useState } from 'react'
import { STRINGS, LANGS } from './strings'

const LangContext = createContext(null)

const initial = () => {
  try {
    const saved = localStorage.getItem('vt-lang')
    if (saved && STRINGS[saved]) return saved
  } catch {}
  return 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initial)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('vt-lang', lang)
    } catch {}
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang, t: STRINGS[lang], langs: LANGS }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

// The hero waits for the intro loader only on the very first render;
// after a language switch it animates straight away.
let introDone = false
export const markIntroDone = () => {
  introDone = true
}
export const getIntroDelay = () => (introDone ? 0.15 : 1.9)
