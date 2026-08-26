import { useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { roleHomePath } from '../auth/roleHome'
import { apiClient } from '../api/client'
import { BrandMark } from '../components/BrandMark'
import './LoginPage.css'

export function HotelRegisterPage() {
  const { isAuthenticated, user } = useAuth()

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
      setError(axiosError?.response?.data?.message ?? axiosError?.message ?? 'Bir hata oluştu.')
    } finally {
      setSubmitting(false)
    }
  }

  if (registered) {
    return (
      <div className="login-page">
        <div className="login-card">
          <BrandMark size={40} className="login-card__mark" />
          <h1 className="login-card__title">Kaydınız Alındı</h1>
          <p className="login-card__subtitle">
            <strong>{formData.name}</strong> için otel başvurunuz alınmıştır. Başvurunuz acente ekibimiz
            tarafından incelenmektedir; onay durumu <strong>{formData.email}</strong> adresine e-posta ile
            bildirilecektir.
          </p>
          <p className="login-card__footer">
            Onaylandıktan sonra belirlediğiniz şifre ile <Link to="/login">giriş yapabilirsiniz</Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <BrandMark size={40} className="login-card__mark" />
        <h1 className="login-card__brand">Santral</h1>
        <p className="login-card__subtitle">Yeni Otel Kaydı</p>

        <label className="login-field">
          <span>Otel Adı *</span>
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
          <span>İletişim Kişi Adı *</span>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>E-posta *</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>Şifre (En az 8 karakter) *</span>
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
          <span>Telefon *</span>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>

        <label className="login-field">
          <span>Adres *</span>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>Şehir *</span>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>

        <label className="login-field">
          <span>Ülke *</span>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </label>

        <label className="login-field">
          <span>Açıklama</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Otel hakkında kısa bilgi..."
          />
        </label>

        {error && (
          <p className="login-card__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="login-card__submit" disabled={submitting}>
          {submitting ? 'Kaydediliyor...' : 'Otel Kaydı Yap'}
        </button>

        <p className="login-card__footer">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </form>
    </div>
  )
}
