import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { roleHomePath } from '../auth/roleHome'
import { apiClient } from '../api/client'
import './LoginPage.css'

export function HotelRegisterPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

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
      const { data } = await apiClient.post<{ auth: { accessToken: string; refreshToken: string; user: { id: number; email: string; fullName: string; role: string } } }>('/hotels', formData)
      const { auth } = data

      // Store token and redirect
      localStorage.setItem('authToken', auth.accessToken)
      localStorage.setItem('refreshToken', auth.refreshToken)
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: auth.user.id,
          email: auth.user.email,
          fullName: auth.user.fullName,
          role: auth.user.role,
        })
      )

      navigate('/hotel', { replace: true })
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      setError(axiosError?.response?.data?.message ?? axiosError?.message ?? 'Bir hata oluştu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-card__title">Hotel Reservation Agency</h1>
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

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          Zaten hesabın var mı?{' '}
          <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none' }}>
            Giriş Yap
          </Link>
        </p>
      </form>
    </div>
  )
}
