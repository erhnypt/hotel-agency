import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { roleHomePath } from '../auth/roleHome'
import { useAuth } from '../auth/useAuth'
import { BrandMark } from '../components/BrandMark'
import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { useT } from '../i18n/useT'
import './LoginPage.css'

export function LoginPage() {
  const { isAuthenticated, user, login } = useAuth()
  const navigate = useNavigate()
  const { t } = useT()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [slow, setSlow] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    setSlow(false)
    // The backend can be cold-started (Render free-tier spin-down) and take a
    // while to respond — reassure the user after a few seconds so a slow
    // login doesn't read as a frozen/broken page.
    const slowTimer = setTimeout(() => setSlow(true), 4000)
    try {
      const loggedInUser = await login(email, password)
      navigate(roleHomePath(loggedInUser.role), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.error'))
    } finally {
      clearTimeout(slowTimer)
      setSubmitting(false)
      setSlow(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__lang">
        <LanguageSwitcher />
      </div>
      <form className="login-card" onSubmit={handleSubmit}>
        <BrandMark size={44} className="login-card__mark" />
        <h1 className="login-card__brand">Travel Sites</h1>
        <p className="login-card__subtitle">{t('login.subtitle')}</p>

        <label className="login-field">
          <span>{t('login.email')}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </label>

        <label className="login-field">
          <span>{t('login.password')}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <p className="login-card__forgot">
          <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
        </p>

        {error && (
          <p className="login-card__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="login-card__submit" disabled={submitting}>
          {submitting ? t('login.submitting') : t('login.submit')}
        </button>

        {submitting && slow && <p className="login-card__hint">{t('login.submittingSlow')}</p>}

        <p className="login-card__footer">
          {t('login.footer')} <Link to="/register">{t('login.register')}</Link>
        </p>
      </form>
    </div>
  )
}
