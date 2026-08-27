import axios from 'axios'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { submitBookingRequest } from '../../api/bookingRequests'
import type { ApiErrorResponse } from '../../auth/types'
import { roleHomePath } from '../../auth/roleHome'
import { useAuth } from '../../auth/useAuth'
import { BrandMark } from '../../components/BrandMark'
import { SearchSelect } from '../../components/SearchSelect'
import { CATALOG, PEAK_MONTH, type CatalogOffer } from '../../data/catalog'
import './LandingPage.css'

const MONTHS_TR: Record<string, string> = {
  January: 'Ocak', February: 'Şubat', March: 'Mart', April: 'Nisan', May: 'Mayıs', June: 'Haziran',
  July: 'Temmuz', August: 'Ağustos', September: 'Eylül', October: 'Ekim', November: 'Kasım', December: 'Aralık',
}

const typeLabel = (t: string) => (t === 'Resort' ? 'Resort Otel' : 'Şehir Oteli')

const today = new Date().toISOString().slice(0, 10)

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  const [offer, setOffer] = useState<CatalogOffer | null>(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [step, setStep] = useState<'search' | 'contact'>('search')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<number | null>(null)

  const offers = useMemo(
    () => [...CATALOG.offers].sort((a, b) => a.countryName.localeCompare(b.countryName, 'tr')),
    [],
  )

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  const datesValid = checkIn !== '' && checkOut !== '' && checkOut > checkIn
  const canContinue = offer !== null && datesValid && Number(guests) >= 1

  const nights = datesValid
    ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000)
    : 0
  const estimate = offer && nights > 0 ? offer.priceFrom * nights : null

  const handleContinue = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (canContinue) setStep('contact')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!offer) return
    setError(null)
    setSubmitting(true)
    try {
      const created = await submitBookingRequest({
        propertyId: offer.propertyId,
        propertyName: offer.propertyName,
        hotelType: offer.hotelType,
        countryCode: offer.countryCode,
        countryName: offer.countryName,
        checkIn,
        checkOut,
        guests: Number(guests),
        contactName: name,
        contactEmail: email,
        contactPhone: phone,
        message: message || null,
      })
      setReference(created.id)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('Talep gönderilemedi. Lütfen tekrar deneyin.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setOffer(null)
    setCheckIn('')
    setCheckOut('')
    setGuests('2')
    setStep('search')
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setReference(null)
    setError(null)
  }

  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__brand">
          <BrandMark size={26} className="landing__brand-mark" />
          <span className="landing__brand-name">Cassidy Travel</span>
        </div>
        <Link to="/login" className="landing__login-link">
          Personel Girişi
        </Link>
      </header>

      <section className="landing__hero">
        <div className="landing__hero-copy">
          <p className="landing__eyebrow">Cassidy Travel · Otel Acentesi</p>
          <h1 className="landing__title">
            Oteli seçin, rezervasyonu <span>biz tamamlayalım</span>
          </h1>
          <p className="landing__lede">
            Danışmanlarımız talebinizi inceleyip uygunluk ve fiyat teyidiyle 24 saat içinde size döner.
            Ön ödeme gerekmez.
          </p>
        </div>

        <div className="landing__search-card">
          {reference !== null ? (
            <div className="landing__success">
              <div className="landing__success-glyph" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M8.5 14.5 12.5 18.5 20 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2>Talebiniz alındı</h2>
              <p className="landing__success-ref">
                Referans <strong>#{reference}</strong>
              </p>
              <p className="landing__success-note">
                {offer?.countryName} · {offer && typeLabel(offer.hotelType)} — {checkIn} / {checkOut},{' '}
                {guests} misafir. E-postanıza bir onay göndereceğiz.
              </p>
              <button type="button" className="landing__btn landing__btn--ghost" onClick={reset}>
                Yeni talep oluştur
              </button>
            </div>
          ) : step === 'search' ? (
            <form className="landing__form" onSubmit={handleContinue}>
              <h2 className="landing__form-title">Otel araması</h2>

              <label className="landing__label">
                <span>Otel / Destinasyon</span>
                <SearchSelect<CatalogOffer>
                  items={offers}
                  value={offer}
                  onChange={setOffer}
                  getKey={(o) => o.id}
                  getLabel={(o) => `${o.countryName} — ${typeLabel(o.hotelType)}`}
                  getMeta={(o) =>
                    `${o.priceFrom} ${CATALOG.currency}'den başlayan gecelik · ${o.bookings.toLocaleString('tr-TR')} kayıt`
                  }
                  getSearchText={(o) => `${o.countryName} ${o.hotelType} ${o.propertyName} ${o.countryCode}`}
                  placeholder="Ülke veya otel tipi ara..."
                />
              </label>

              <div className="landing__row">
                <label className="landing__label">
                  <span>Giriş</span>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </label>
                <label className="landing__label">
                  <span>Çıkış</span>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </label>
                <label className="landing__label landing__label--narrow">
                  <span>Misafir</span>
                  <input
                    type="number"
                    min={1}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </label>
              </div>

              {estimate !== null && (
                <p className="landing__estimate">
                  Tahmini tutar <strong>~{estimate.toLocaleString('tr-TR')} {CATALOG.currency}</strong>{' '}
                  <span>({nights} gece · gösterge fiyat, teyit sonrası kesinleşir)</span>
                </p>
              )}

              {error && <p className="landing__error">{error}</p>}

              <button type="submit" className="landing__btn" disabled={!canContinue}>
                Devam et
              </button>
            </form>
          ) : (
            <form className="landing__form" onSubmit={handleSubmit}>
              <button
                type="button"
                className="landing__back"
                onClick={() => {
                  setStep('search')
                  setError(null)
                }}
              >
                ← Arama
              </button>
              <h2 className="landing__form-title">İletişim bilgileriniz</h2>
              <p className="landing__form-sub">
                {offer?.countryName} · {offer && typeLabel(offer.hotelType)} — {checkIn} / {checkOut}, {guests} misafir
              </p>

              <label className="landing__label">
                <span>Ad Soyad</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <div className="landing__row">
                <label className="landing__label">
                  <span>E-posta</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className="landing__label">
                  <span>Telefon</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
              </div>
              <label className="landing__label">
                <span>Not (opsiyonel)</span>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Oda tercihi, özel istekler..."
                />
              </label>

              {error && <p className="landing__error">{error}</p>}

              <button type="submit" className="landing__btn" disabled={submitting}>
                {submitting ? 'Gönderiliyor...' : 'Talebi gönder'}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="landing__properties">
        <h2 className="landing__section-title">Otellerimiz</h2>
        <div className="landing__property-grid">
          {CATALOG.properties.map((p) => (
            <article key={p.id} className="landing__property">
              <div className="landing__property-head">
                <h3>{p.name}</h3>
                <span className="landing__tag">{typeLabel(p.type)}</span>
              </div>
              <dl className="landing__property-stats">
                <div>
                  <dt>Gecelik</dt>
                  <dd>
                    {p.priceFrom} {CATALOG.currency}'den
                  </dd>
                </div>
                <div>
                  <dt>Ort. konaklama</dt>
                  <dd>{p.avgStayNights} gece</dd>
                </div>
                <div>
                  <dt>Yoğun sezon</dt>
                  <dd>{MONTHS_TR[PEAK_MONTH[p.id]] ?? '—'}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <footer className="landing__footer">
        <div className="landing__brand">
          <BrandMark size={20} className="landing__brand-mark" />
          <span className="landing__brand-name">Cassidy Travel</span>
        </div>
        <p className="landing__footer-note">
          Katalog verisi: {CATALOG.source}. {CATALOG.offers.length} destinasyon,{' '}
          {CATALOG.rowsProcessed.toLocaleString('tr-TR')} kayıttan derlendi.
        </p>
        <Link to="/login" className="landing__login-link">
          Personel Girişi
        </Link>
      </footer>
    </div>
  )
}
