import { createContext } from 'react'
import type { Lang } from './dict'

export interface I18nValue {
  lang: Lang
  dir: 'ltr' | 'rtl'
  setLang: (lang: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18nValue | null>(null)
