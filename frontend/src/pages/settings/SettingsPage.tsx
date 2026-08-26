import { useState } from 'react'
import { getProfile, updateProfile } from '../../api/profile'
import { useAsync } from '../../hooks/useAsync'
import { LoadingState, ErrorState } from '../../components/PageState'
import '../../components/crud.css'

export function SettingsPage() {
  const profile = useAsync(getProfile, [])

  const [fullName, setFullName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Pre-fill name once loaded
  if (profile.data && !fullName) {
    setFullName(profile.data.fullName)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)
    setErrorMsg(null)

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('Yeni şifreler eşleşmiyor.')
      return
    }

    setSaving(true)
    try {
      await updateProfile({
        fullName,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      })
      setSuccessMsg('Bilgiler başarıyla güncellendi.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      setErrorMsg(axiosError?.response?.data?.message ?? axiosError?.message ?? 'Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  if (profile.loading) return <LoadingState />
  if (profile.error) return <ErrorState message={profile.error} />

  return (
    <div>
      <div className="page-header">
        <h2>Ayarlar</h2>
      </div>

      <form style={{ maxWidth: 480 }} onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Profil Bilgileri</h3>

        <label className="form-field">
          <span>E-posta</span>
          <input type="email" value={profile.data?.email ?? ''} disabled />
        </label>

        <label className="form-field">
          <span>Ad Soyad *</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

        <h3 style={{ margin: '1.5rem 0 1rem', fontWeight: 600 }}>Şifre Değiştir</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakın.
        </p>

        <label className="form-field">
          <span>Mevcut Şifre</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Yeni Şifre (en az 8 karakter)</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
          />
        </label>

        <label className="form-field">
          <span>Yeni Şifre (tekrar)</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        {errorMsg && <p className="form-error">{errorMsg}</p>}
        {successMsg && (
          <p style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>
            {successMsg}
          </p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
