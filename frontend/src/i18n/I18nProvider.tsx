import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DICT, LANGS, RTL_LANGS, type Lang } from './dict'
import { I18nContext } from './I18nContext'

const STORAGE_KEY = 'app.lang'

function detectInitial(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (LANGS as string[]).includes(saved)) return saved as Lang
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || 'tr').slice(0, 2).toLowerCase()
  return (LANGS as string[]).includes(nav) ? (nav as Lang) : 'tr'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitial)
  const dir: 'ltr' | 'rtl' = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    setLangState(next)
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const table = DICT[lang]
      let value = table[key] ?? DICT.tr[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
        }
      }
      return value
    },
    [lang],
  )

  const contextValue = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t])

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}
