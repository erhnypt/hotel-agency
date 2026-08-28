import { LANGS, LANG_NAMES, type Lang } from './dict'
import { useT } from './useT'
import './LanguageSwitcher.css'

export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { lang, setLang, t } = useT()
  return (
    <label className={`lang-switcher lang-switcher--${variant}`}>
      <span className="lang-switcher__label">{t('lang.label')}</span>
      <svg className="lang-switcher__icon" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M2.5 12h19M12 2.5c3 3 3 15 0 19M12 2.5c-3 3-3 15 0 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
      <select
        className="lang-switcher__select"
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label={t('lang.label')}
      >
        {LANGS.map((l) => (
          <option key={l} value={l}>
            {LANG_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  )
}
