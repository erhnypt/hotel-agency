import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/passwordReset'
import type { ApiErrorResponse } from '../auth/types'
import { BrandMark } from '../components/BrandMark'
import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { useT } from '../i18n/useT'
import './LoginPage.css'

export function ResetPasswordPage() {
  const { t } = useT()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <div className="login-page">
        <form className="login-card">
          <BrandMark size={44} className="login-card__mark" />
          <h1 className="login-card__brand">Travel Sites</h1>
          <p className="login-card__error" role="alert">
            {t('resetPassword.missingToken')}
          </p>
          <p className="login-card__footer">
            <Link to="/forgot-password">{t('resetPassword.requestNewLink')}</Link>
          </p>
        </form>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.mismatch'))
      return
    }

    setSubmitting(true)
    try {
      await resetPassword(token, newPassword)
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError(t('resetPassword.error'))
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
        <p className="login-card__subtitle">{t('resetPassword.subtitle')}</p>

        {done ? (
          <p className="login-card__success">{t('resetPassword.success')}</p>
        ) : (
          <>
            <label className="login-field">
              <span>{t('resetPassword.newPassword')}</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                autoFocus
              />
            </label>

            <label className="login-field">
              <span>{t('resetPassword.confirmPassword')}</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>

            {error && (
              <p className="login-card__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-card__submit" disabled={submitting}>
              {submitting ? t('login.submitting') : t('resetPassword.submit')}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
