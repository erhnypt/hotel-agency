import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { hasSavedLangPreference } from '../i18n/I18nProvider'
import { useT } from '../i18n/useT'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const { lang, setLang } = useT()

  // The public landing page guesses a language from the browser locale,
  // which defaults many Turkish-locale machines to Turkish. The operator
  // app (agency/hotel staff) should default to English instead — but only
  // when nobody has explicitly picked a language yet via the switcher.
  useEffect(() => {
    if (isAuthenticated && !hasSavedLangPreference() && lang !== 'en') {
      setLang('en')
    }
  }, [isAuthenticated, lang, setLang])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
