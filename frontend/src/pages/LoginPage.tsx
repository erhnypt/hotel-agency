import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { roleHomePath } from '../auth/roleHome'
import { useAuth } from '../auth/useAuth'
import { BrandMark } from '../components/BrandMark'
import './LoginPage.css'

export function LoginPage() {
  const { isAuthenticated, user, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const loggedInUser = await login(email, password)
      navigate(roleHomePath(loggedInUser.role), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız oldu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <BrandMark size={40} className="login-card__mark" />
        <h1 className="login-card__brand">Cassidy Travel</h1>
        <p className="login-card__subtitle">Hesabınıza giriş yapın</p>

        <label className="login-field">
          <span>E-posta</span>
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
          <span>Şifre</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="login-card__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="login-card__submit" disabled={submitting}>
          {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <p className="login-card__footer">
          Yeni otel kaydı? <Link to="/register">Kayıt Ol</Link>
        </p>
      </form>
    </div>
  )
}
