import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import type { CustomerRequest, CustomerResponse } from '../../api/types'
import '../../components/crud.css'

export function CustomerFormModal({
  customer,
  onClose,
  onSave,
}: {
  customer: CustomerResponse | null
  onClose: () => void
  onSave: (request: CustomerRequest) => Promise<void>
}) {
  const [firstName, setFirstName] = useState(customer?.firstName ?? '')
  const [lastName, setLastName] = useState(customer?.lastName ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  const [passportNumber, setPassportNumber] = useState(customer?.passportNumber ?? '')
  const [nationality, setNationality] = useState(customer?.nationality ?? '')
  const [notes, setNotes] = useState(customer?.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSave({
        firstName,
        lastName,
        phone,
        email: email || null,
        passportNumber: passportNumber || null,
        nationality: nationality || null,
        notes: notes || null,
      })
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
    <Modal title={customer ? 'Müşteriyi Düzenle' : 'Yeni Müşteri'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Ad</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoFocus />
        </label>
        <label className="form-field">
          <span>Soyad</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Telefon</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>E-posta</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="form-field">
          <span>Pasaport No</span>
          <input value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />
        </label>
        <label className="form-field">
          <span>Uyruk</span>
          <input value={nationality} onChange={(e) => setNationality(e.target.value)} />
        </label>
        <label className="form-field">
          <span>Notlar</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
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
