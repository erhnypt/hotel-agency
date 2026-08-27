import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import type { CustomerRequest, CustomerResponse } from '../../api/types'
import { detectBrand, digitsOnly, formatCardNumber, last4, maskedCard } from '../../lib/card'
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

  const [cardHolder, setCardHolder] = useState(customer?.cardHolder ?? '')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState(customer?.cardExpiry ?? '')

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const existingMasked = maskedCard(customer?.cardBrand, customer?.cardLast4)
  const typedDigits = digitsOnly(cardNumber)
  const liveBrand = typedDigits.length >= 4 ? detectBrand(cardNumber) : null

  const handleExpiry = (raw: string) => {
    const d = digitsOnly(raw).slice(0, 4)
    setCardExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    // Never send the full number or a CVV — only brand + last 4 + expiry.
    let brand = customer?.cardBrand ?? null
    let l4 = customer?.cardLast4 ?? null
    if (typedDigits.length >= 13) {
      brand = detectBrand(cardNumber)
      l4 = last4(cardNumber)
    }
    const expiry = cardExpiry.trim() || null
    if (expiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      setError('Son kullanma tarihi AA/YY biçiminde olmalı.')
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
        cardBrand: brand,
        cardLast4: l4,
        cardExpiry: expiry,
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

        <fieldset className="form-fieldset">
          <legend>Ödeme Kartı (opsiyonel)</legend>
          <p className="form-hint">
            Otele iletilmek üzere kartın <strong>yalnızca markası, son 4 hanesi ve son kullanma
            tarihi</strong> saklanır. Tam kart numarası ve CVV kaydedilmez, hiçbir yere gönderilmez.
          </p>
          <label className="form-field">
            <span>Kart Sahibi</span>
            <input value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Kart üzerindeki isim" />
          </label>
          <label className="form-field">
            <span>Kart Numarası {liveBrand && <em className="form-field__hint">{liveBrand}</em>}</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder={existingMasked ?? '•••• •••• •••• ••••'}
            />
          </label>
          <label className="form-field">
            <span>Son Kullanma (AA/YY)</span>
            <input
              inputMode="numeric"
              value={cardExpiry}
              onChange={(e) => handleExpiry(e.target.value)}
              placeholder="12/29"
              maxLength={5}
            />
          </label>
          {existingMasked && typedDigits.length < 13 && (
            <p className="form-hint">Kayıtlı kart: {existingMasked}. Değiştirmek için yeni numara girin.</p>
          )}
        </fieldset>

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
