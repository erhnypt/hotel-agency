import { useState } from 'react'
import { createStaff, deleteStaff, listStaff } from '../../api/staff'
import type { StaffRequest, StaffResponse } from '../../api/types'
import { Modal } from '../../components/Modal'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

function StaffFormModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (req: StaffRequest) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<StaffRequest>({ fullName: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSubmit(form)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      setError(axiosError?.response?.data?.message ?? axiosError?.message ?? 'Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Yeni Çalışan" onClose={onClose}>
      <form className="crud-form" onSubmit={handleSubmit}>
        <label className="crud-form__field">
          <span>Ad Soyad *</span>
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label className="crud-form__field">
          <span>E-posta *</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label className="crud-form__field">
          <span>Şifre (en az 8 karakter) *</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </label>
        {error && <p className="crud-form__error">{error}</p>}
        <div className="crud-form__actions">
          <button type="button" className="btn" onClick={onClose}>
            İptal
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Oluştur'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export function StaffPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const staff = useAsync(listStaff, [refreshKey])
  const refresh = () => setRefreshKey((k) => k + 1)

  const handleCreate = async (req: StaffRequest) => {
    await createStaff(req)
    setShowCreate(false)
    refresh()
  }

  const handleDelete = async (member: StaffResponse) => {
    if (!window.confirm(`"${member.fullName}" çalışanını silmek istiyor musunuz?`)) return
    setDeleting(member.id)
    try {
      await deleteStaff(member.id)
      refresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Çalışanlar</h2>
        <button type="button" className="btn btn--primary" onClick={() => setShowCreate(true)}>
          + Yeni Çalışan
        </button>
      </div>

      {staff.loading && <LoadingState />}
      {staff.error && <ErrorState message={staff.error} />}

      {staff.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Kayıt Tarihi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staff.data.map((member) => (
                <tr key={member.id}>
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{new Date(member.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <div className="data-table__actions">
                      <button
                        type="button"
                        className="btn btn--small btn--danger"
                        onClick={() => handleDelete(member)}
                        disabled={deleting === member.id}
                      >
                        {deleting === member.id ? '...' : 'Sil'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staff.data.length === 0 && (
                <tr>
                  <td colSpan={4} className="data-table__empty">
                    Henüz çalışan yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <StaffFormModal onSubmit={handleCreate} onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}
