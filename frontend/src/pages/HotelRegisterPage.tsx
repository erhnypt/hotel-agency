import { useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { roleHomePath } from '../auth/roleHome'
import { apiClient } from '../api/client'
import { BrandMark } from '../components/BrandMark'
import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { useT } from '../i18n/useT'
import './LoginPage.css'

export function HotelRegisterPage() {
  const { isAuthenticated, user } = useAuth()
  const { t } = useT()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    contactPerson: '',
    description: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await apiClient.post('/hotels', formData)
      setRegistered(true)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      setError(axiosError?.response?.data?.message ?? axiosError?.message ?? t('register.error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (registered) {
    return (
      <div className="login-page">
        <div className="login-card">
          <BrandMark size={40} className="login-card__mark" />
          <h1 className="login-card__title">{t('register.doneTitle')}</h1>
          <p className="login-card__subtitle">
            {t('register.doneBody', { name: formData.name, email: formData.email })}
          </p>
          <p className="login-card__footer">
            {t('register.doneFooterPre')} <Link to="/login">{t('register.doneFooterLink')}</Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-page__lang">
        <LanguageSwitcher />
      </div>
      <form className="login-card" onSubmit={handleSubmit}>
        <BrandMark size={40} className="login-card__mark" />
        <h1 className="login-card__brand">Cassidy Travel</h1>
        <p className="login-card__subtitle">{t('register.subtitle')}</p>

        <label className="login-field">
          <span>{t('register.name')} *</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoFocus
          />
        </label>

        <label className="login-field">
          <span>{t('register.contactPerson')} *</span>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>{t('register.email')} *</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>{t('register.password')} *</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </label>

        <label className="login-field">
          <span>{t('register.phone')} *</span>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>

        <label className="login-field">
          <span>{t('register.address')} *</span>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>{t('register.city')} *</span>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>

        <label className="login-field">
          <span>{t('register.country')} *</span>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>{t('register.description')}</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder={t('register.descriptionPlaceholder')}
          />
        </label>

        {error && (
          <p className="login-card__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="login-card__submit" disabled={submitting}>
          {submitting ? t('register.submitting') : t('register.submit')}
        </button>

        <p className="login-card__footer">
          {t('login.haveAccount')} <Link to="/login">{t('login.submit')}</Link>
        </p>
      </form>
    </div>
  )
}
