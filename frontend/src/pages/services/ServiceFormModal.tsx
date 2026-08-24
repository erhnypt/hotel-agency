import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import type { ServiceRequest } from '../../api/types'
import '../../components/crud.css'

export function ServiceFormModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (request: ServiceRequest) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSave({ name, description: description || null })
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('Kaydedilemedi. Lütfen tekrar deneyin.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Yeni Hizmet" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Ad</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus placeholder="ör. Free Wi-Fi" />
        </label>
        <label className="form-field">
          <span>Açıklama</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
