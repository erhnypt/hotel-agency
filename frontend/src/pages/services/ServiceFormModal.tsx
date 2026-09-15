import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import type { ServiceRequest, ServiceResponse } from '../../api/types'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

export function ServiceFormModal({
  service,
  onClose,
  onSave,
}: {
  service: ServiceResponse | null
  onClose: () => void
  onSave: (request: ServiceRequest) => Promise<void>
}) {
  const { t } = useT()
  const [name, setName] = useState(service?.name ?? '')
  const [description, setDescription] = useState(service?.description ?? '')
  const [price, setPrice] = useState(service ? String(service.price) : '')
  const [currency, setCurrency] = useState(service?.currency ?? 'TRY')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSave({ name, description: description || null, price: Number(price), currency })
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError(t('serviceForm.saveError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={service ? t('serviceForm.editTitle') : t('serviceForm.createTitle')} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>{t('common.name')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus placeholder={t('serviceForm.namePlaceholder')} />
        </label>
        <label className="form-field">
          <span>{t('common.description')}</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </label>
        <label className="form-field">
          <span>{t('common.price')}</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>{t('common.currency')}</span>
          <select
            className="form-field__select--tiny"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="TRY">TRY</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
