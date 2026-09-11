import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../api/passwordReset'
import type { ApiErrorResponse } from '../auth/types'
import { BrandMark } from '../components/BrandMark'
import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { useT } from '../i18n/useT'
import './LoginPage.css'

export function ForgotPasswordPage() {
  const { t } = useT()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError(t('forgotPassword.error'))
      }
    } finally {
      setSubmitting(false)
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
        <p className="login-card__subtitle">{t('forgotPassword.subtitle')}</p>

        {sent ? (
          <p className="login-card__success">{t('forgotPassword.sent')}</p>
        ) : (
          <>
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

            {error && (
              <p className="login-card__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-card__submit" disabled={submitting}>
              {submitting ? t('login.submitting') : t('forgotPassword.submit')}
            </button>
          </>
        )}

        <p className="login-card__footer">
          <Link to="/login">{t('forgotPassword.backToLogin')}</Link>
        </p>
      </form>
    </div>
  )
}
