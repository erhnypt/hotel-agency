import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import type { CustomerRequest, CustomerResponse } from '../../api/types'
import { detectBrand, digitsOnly, formatCardNumber } from '../../lib/card'
import { useT } from '../../i18n/useT'
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
  const { t } = useT()
  const [firstName, setFirstName] = useState(customer?.firstName ?? '')
  const [lastName, setLastName] = useState(customer?.lastName ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  const [passportNumber, setPassportNumber] = useState(customer?.passportNumber ?? '')
  const [nationality, setNationality] = useState(customer?.nationality ?? '')
  const [notes, setNotes] = useState(customer?.notes ?? '')

  const [cardHolder, setCardHolder] = useState(customer?.cardHolder ?? '')
  const [cardNumber, setCardNumber] = useState(customer?.cardNumber ?? '')
  const [cardExpiry, setCardExpiry] = useState(customer?.cardExpiry ?? '')
  const [cardNote, setCardNote] = useState(customer?.cardNote ?? '')

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const digits = digitsOnly(cardNumber)
  const brand = digits.length >= 4 ? detectBrand(cardNumber) : null

  const handleExpiry = (raw: string) => {
    const d = digitsOnly(raw).slice(0, 4)
    setCardExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const expiry = cardExpiry.trim() || null
    if (expiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setError(t('customerForm.errorExpiryFormat'))
      return
    }
    if (digits && (digits.length < 12 || digits.length > 19)) {
      setError(t('customerForm.errorCardLength'))
      return
    }

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
        cardHolder: cardHolder.trim() || null,
        cardBrand: digits ? brand : null,
        cardNumber: digits || null,
        cardExpiry: expiry,
        cardNote: cardNote.trim() || null,
      })
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError(t('customerForm.errorSaveFailed'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={customer ? t('customerForm.titleEdit') : t('customerForm.titleNew')} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>{t('customerForm.firstName')}</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoFocus />
        </label>
        <label className="form-field">
          <span>{t('customerForm.lastName')}</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>{t('common.phone')}</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>{t('common.email')}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="form-field">
          <span>{t('customerForm.passportNumber')}</span>
          <input value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />
        </label>
        <label className="form-field">
          <span>{t('customerForm.nationality')}</span>
          <input value={nationality} onChange={(e) => setNationality(e.target.value)} />
        </label>
        <label className="form-field">
          <span>{t('customerForm.notes')}</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </label>

        <fieldset className="form-fieldset">
          <legend>{t('customerForm.paymentCardLegend')}</legend>
          <p className="form-hint">
            {t('customerForm.paymentCardHint')}
          </p>
          <label className="form-field">
            <span>{t('customerForm.cardHolder')}</span>
            <input
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder={t('customerForm.cardHolderPlaceholder')}
            />
          </label>
          <label className="form-field">
            <span>{t('customerForm.cardNumber')} {brand && <em className="form-field__hint">{brand}</em>}</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
            />
          </label>
          <label className="form-field">
            <span>{t('customerForm.cardExpiry')}</span>
            <input
              inputMode="numeric"
              value={cardExpiry}
              onChange={(e) => handleExpiry(e.target.value)}
              placeholder="12/29"
              maxLength={5}
            />
          </label>
          <label className="form-field">
            <span>{t('customerForm.cvv')}</span>
            <input
              type="text"
              value={cardNote}
              onChange={(e) => setCardNote(e.target.value)}
              maxLength={255}
              placeholder="CCV"
            />
          </label>
        </fieldset>

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
