import axios from 'axios'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { submitBookingRequest } from '../../api/bookingRequests'
import type { ApiErrorResponse } from '../../auth/types'
import { roleHomePath } from '../../auth/roleHome'
import { useAuth } from '../../auth/useAuth'
import { BrandMark } from '../../components/BrandMark'
import { SearchSelect } from '../../components/SearchSelect'
import { loadCatalog, type CatalogHotel, type HotelCatalog } from '../../data/catalog'
import './LandingPage.css'

const today = new Date().toISOString().slice(0, 10)
const starLabel = (n: number | null) => (n ? '★'.repeat(n) : '')
const hotelTypeLabel = (n: number | null) => (n ? `${n}★ Otel` : 'Otel')

const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`

const HERO_IMG = UNSPLASH('1507525428034-b723cf961d3e', 1600)

// Curated destination photography (Unsplash). Cities not listed fall back to a
// gradient card. Illustrative only — not tied to any specific property.
const DEST_PHOTOS: Record<string, string> = {
  'İstanbul': '1541432901042-2d8bd64b4a9b',
  'Londra': '1513635269975-59663e0ac1ad',
  'Paris': '1502602898657-3e91760cbb34',
  'Roma': '1552832230-c0197dd311b5',
  'Barselona': '1509840841025-9088ba78a826',
  'Amsterdam': '1534351590666-13e3e96b5017',
  'Dublin': '1549918864-48ac978761a4',
  'Madrid': '1539037116277-4db20889f2d4',
  'Berlin': '1560969184-10fe8719e047',
  'Viyana': '1516550893923-42d28e5677af',
  'Lizbon': '1585208798174-6cedd86e019a',
  'Porto': '1555881400-74d7acaacd8b',
  'Prag': '1541849546-216549ae216d',
  'Budapeşte': '1518604666860-9ed391f76460',
  'Atina': '1555993539-1732b0258235',
  'Milano': '1520440229-6469a149ac59',
  'Venedik': '1514890547357-a9ee288728e0',
  'Floransa': '1541370976299-4d24ebbc9077',
  'Münih': '1595867818082-083862f3d630',
  'Antalya': '1589308078059-be1415eab4c3',
  'Dubai': '1512453979798-5ea266f8880c',
  'New York': '1496442226666-8d4d0e62e6e9',
  'Bangkok': '1508009603885-50cf7c579365',
  'Sidney': '1506973035872-a4ec16b8e8d9',
  'Marakeş': '1597212618440-806262de4f6b',
}
const cityImg = (city: string) =>
  DEST_PHOTOS[city] ? UNSPLASH(DEST_PHOTOS[city], 640) : null

const TRUST = [
  {
    title: 'Ön ödeme yok',
    body: 'Ödemeyi otelde yaparsınız. Biz uygunluğu ve en iyi fiyatı ayarlarız.',
    icon: (
      <path d="M4 7h16v10H4z M4 11h16 M8 15h4" />
    ),
  },
  {
    title: '24 saatte yanıt',
    body: 'Talebiniz bir danışmana düşer, aynı iş günü içinde dönüş yapılır.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
  },
  {
    title: 'Binlerce otel',
    body: 'Şehir merkezinden sahil resort’a, dünyanın dört bir yanından seçenek.',
    icon: (
      <>
        <path d="M4 20V9l8-5 8 5v11" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
  },
]

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  const [catalog, setCatalog] = useState<HotelCatalog | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [hotel, setHotel] = useState<CatalogHotel | null>(null)
  const [cityFilter, setCityFilter] = useState<string | null>(null)
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

  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCatalog().then(setCatalog).catch((e) => setCatalogError(e.message ?? 'Katalog yüklenemedi.'))
  }, [])

  const items = useMemo(() => {
    if (!catalog) return []
    const list = cityFilter ? catalog.hotels.filter((h) => h.city === cityFilter) : catalog.hotels
    return [...list].sort(
      (a, b) => a.city.localeCompare(b.city, 'tr') || (b.stars ?? 0) - (a.stars ?? 0),
    )
  }, [catalog, cityFilter])

  const destinations = useMemo(() => {
    if (!catalog) return []
    return catalog.cities.slice(0, 8).map((c) => {
      const prices = catalog.hotels.filter((h) => h.city === c.name).map((h) => h.priceFrom)
      return { ...c, priceFrom: prices.length ? Math.min(...prices) : null }
    })
  }, [catalog])

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  const datesValid = checkIn !== '' && checkOut !== '' && checkOut > checkIn
  const canContinue = hotel !== null && datesValid && Number(guests) >= 1
  const nights = datesValid
    ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000)
    : 0
  const estimate = hotel && nights > 0 ? hotel.priceFrom * nights : null

  const focusSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const pickCity = (city: string) => {
    setCityFilter(city)
    setHotel(null)
    focusSearch()
  }

  const handleContinue = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (canContinue) setStep('contact')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!hotel) return
    setError(null)
    setSubmitting(true)
    try {
      const created = await submitBookingRequest({
        propertyId: hotel.id,
        propertyName: hotel.name,
        hotelType: hotelTypeLabel(hotel.stars),
        propertyCity: hotel.city,
        countryCode: hotel.iso2,
        countryName: hotel.country,
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
    setHotel(null)
    setCityFilter(null)
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

  const summary = hotel
    ? `${hotel.name} · ${hotel.city} — ${checkIn} / ${checkOut}, ${guests} misafir`
    : ''

  return (
    <div className="lp">
      <header className="lp-header">
        <div className="lp-brand">
          <BrandMark size={24} className="lp-brand__mark" />
          <span className="lp-brand__name">Cassidy Travel</span>
        </div>
        <Link to="/login" className="lp-header__login">
          Personel Girişi
        </Link>
      </header>

      <section className="lp-hero">
        <img className="lp-hero__img" src={HERO_IMG} alt="" aria-hidden="true" loading="eager" />
        <div className="lp-hero__scrim" />
        <span className="lp-hero__blob lp-hero__blob--sun" aria-hidden="true" />
        <span className="lp-hero__blob lp-hero__blob--teal" aria-hidden="true" />

        <div className="lp-hero__inner">
          <h1 className="lp-hero__title">
            Bir sonraki tatiliniz
            <br />
            <em>bir talep uzağınızda</em>
          </h1>
          <p className="lp-hero__lede">
            {catalog ? `${catalog.count.toLocaleString('tr-TR')} otel` : 'Binlerce otel'} arasından seçin,
            gerisini Cassidy Travel danışmanları halletsin. Uygunluk ve fiyat teyidi 24 saat içinde,
            ön ödemesiz.
          </p>
        </div>

        <div className="lp-search" ref={searchRef}>
          {reference !== null ? (
            <div className="lp-done">
              <span className="lp-done__badge" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 28 28">
                  <path
                    d="M6 14.5 11.5 20 22 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2>Talebiniz alındı</h2>
              <p className="lp-done__ref">
                Referans no <strong>#{reference}</strong>
              </p>
              <p className="lp-done__note">
                {hotel?.name} — {hotel?.city}, {hotel?.country}. {checkIn} / {checkOut}, {guests} misafir.
                E-postanıza bir onay göndereceğiz.
              </p>
              <button type="button" className="lp-btn lp-btn--ghost" onClick={reset}>
                Yeni talep oluştur
              </button>
            </div>
          ) : step === 'search' ? (
            <form className="lp-form" onSubmit={handleContinue}>
              <div className="lp-form__head">
                <h2>Otel arayın</h2>
                {cityFilter && (
                  <button type="button" className="lp-pill lp-pill--clear" onClick={() => setCityFilter(null)}>
                    {cityFilter}
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>

              <label className="lp-field lp-field--wide">
                <span className="lp-field__label">Otel</span>
                {catalogError ? (
                  <span className="lp-inline-error">{catalogError}</span>
                ) : !catalog ? (
                  <span className="lp-loading">Oteller yükleniyor…</span>
                ) : (
                  <SearchSelect<CatalogHotel>
                    items={items}
                    value={hotel}
                    onChange={setHotel}
                    getKey={(h) => h.id}
                    getLabel={(h) => h.name}
                    getMeta={(h) =>
                      `${h.city}, ${h.country}${h.stars ? ` · ${starLabel(h.stars)}` : ''} · ${h.priceFrom} ${catalog.currency}'den`
                    }
                    getSearchText={(h) => `${h.name} ${h.city} ${h.country}`}
                    placeholder="Otel adı veya şehir…"
                  />
                )}
              </label>

              <div className="lp-form__row">
                <label className="lp-field">
                  <span className="lp-field__label">Giriş</span>
                  <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </label>
                <label className="lp-field">
                  <span className="lp-field__label">Çıkış</span>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </label>
                <label className="lp-field lp-field--narrow">
                  <span className="lp-field__label">Misafir</span>
                  <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} />
                </label>
              </div>

              {estimate !== null && (
                <p className="lp-estimate">
                  <span>Tahmini tutar</span>
                  <strong>~{estimate.toLocaleString('tr-TR')} {catalog?.currency}</strong>
                  <span className="lp-estimate__note">{nights} gece · gösterge, teyitle kesinleşir</span>
                </p>
              )}

              {error && <p className="lp-inline-error">{error}</p>}

              <button type="submit" className="lp-btn lp-btn--block" disabled={!canContinue}>
                Devam et
              </button>
            </form>
          ) : (
            <form className="lp-form" onSubmit={handleSubmit}>
              <button
                type="button"
                className="lp-back"
                onClick={() => {
                  setStep('search')
                  setError(null)
                }}
              >
                ← Arama
              </button>
              <div className="lp-form__head">
                <h2>İletişim bilgileriniz</h2>
              </div>
              <p className="lp-form__summary">{summary}</p>

              <label className="lp-field lp-field--wide">
                <span className="lp-field__label">Ad Soyad</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <div className="lp-form__row lp-form__row--2">
                <label className="lp-field">
                  <span className="lp-field__label">E-posta</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className="lp-field">
                  <span className="lp-field__label">Telefon</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
              </div>
              <label className="lp-field lp-field--wide">
                <span className="lp-field__label">Not (opsiyonel)</span>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Oda tercihi, özel istekler…"
                />
              </label>

              {error && <p className="lp-inline-error">{error}</p>}

              <button type="submit" className="lp-btn lp-btn--block" disabled={submitting}>
                {submitting ? 'Gönderiliyor…' : 'Talebi gönder'}
              </button>
            </form>
          )}
        </div>
      </section>

      {destinations.length > 0 && (
        <section className="lp-dest">
          <h2 className="lp-dest__title">Popüler destinasyonlar</h2>
          <div className="lp-dest__grid">
            {destinations.map((d) => {
              const img = cityImg(d.name)
              return (
                <button key={d.name} type="button" className="lp-card" onClick={() => pickCity(d.name)}>
                  {img && (
                    <img
                      className="lp-card__img"
                      src={img}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <span className="lp-card__shade" />
                  <span className="lp-card__body">
                    <span className="lp-card__city">{d.name}</span>
                    <span className="lp-card__meta">
                      {d.country}
                      {d.priceFrom != null && ` · ${d.priceFrom} EUR'den`}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <section className="lp-trust">
        <div className="lp-trust__lead">
          <h2>Neden bir acente?</h2>
          <p>
            Yüzlerce otel arasından sizin adınıza karşılaştırır, pazarlığı yapar ve rezervasyonu
            baştan sona takip ederiz. Siz sadece nereye gitmek istediğinizi söyleyin.
          </p>
        </div>
        <ul className="lp-trust__list">
          {TRUST.map((t) => (
            <li key={t.title} className="lp-trust__item">
              <svg
                className="lp-trust__icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {t.icon}
              </svg>
              <div>
                <strong>{t.title}</strong>
                <span>{t.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="lp-band">
        <h2>Aradığınız oteli bulamadınız mı?</h2>
        <p>Aklınızdaki oteli veya bölgeyi yazın; danışmanlarımız sizin için araştırsın.</p>
        <button type="button" className="lp-btn lp-btn--on-dark" onClick={focusSearch}>
          Talep oluştur
        </button>
      </section>

      <footer className="lp-footer">
        <div className="lp-brand lp-brand--footer">
          <BrandMark size={20} className="lp-brand__mark" />
          <span className="lp-brand__name">Cassidy Travel</span>
        </div>
        <p className="lp-footer__note">
          {catalog
            ? `${catalog.count.toLocaleString('tr-TR')} otel · ${catalog.cities.length} destinasyon. Katalog kaynağı: ${catalog.source}. Görseller: Unsplash (temsilîdir).`
            : 'Görseller: Unsplash (temsilîdir).'}
        </p>
        <Link to="/login" className="lp-footer__login">
          Personel Girişi
        </Link>
      </footer>
    </div>
  )
}
