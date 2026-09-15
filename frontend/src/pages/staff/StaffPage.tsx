import { useState } from 'react'
import { createStaff, deleteStaff, listStaff } from '../../api/staff'
import type { StaffRequest, StaffResponse } from '../../api/types'
import { Modal } from '../../components/Modal'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

function StaffFormModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (req: StaffRequest) => Promise<void>
  onClose: () => void
}) {
  const { t } = useT()
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
      setError(axiosError?.response?.data?.message ?? axiosError?.message ?? t('staff.genericError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={t('staff.newStaffModalTitle')} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>{t('staff.fullNameLabel')}</span>
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label className="form-field">
          <span>{t('staff.emailLabel')}</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label className="form-field">
          <span>{t('staff.passwordLabel')}</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? t('common.saving') : t('common.create')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export function StaffPage() {
  const { t, lang } = useT()
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
    if (!window.confirm(t('staff.deleteConfirm', { name: member.fullName }))) return
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
        <h2>{t('staff.title')}</h2>
        <button type="button" className="btn btn--primary" onClick={() => setShowCreate(true)}>
          {t('staff.addButton')}
        </button>
      </div>

      {staff.loading && <LoadingState />}
      {staff.error && <ErrorState message={staff.error} />}

      {staff.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('staff.columnFullName')}</th>
                <th>{t('common.email')}</th>
                <th>{t('staff.columnJoined')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staff.data.map((member) => (
                <tr key={member.id}>
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{new Date(member.createdAt).toLocaleDateString(lang)}</td>
                  <td>
                    <div className="data-table__actions">
                      <button
                        type="button"
                        className="btn btn--small btn--danger"
                        onClick={() => handleDelete(member)}
                        disabled={deleting === member.id}
                      >
                        {deleting === member.id ? '...' : t('common.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staff.data.length === 0 && (
                <tr>
                  <td colSpan={4} className="data-table__empty">
                    {t('staff.emptyMessage')}
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
