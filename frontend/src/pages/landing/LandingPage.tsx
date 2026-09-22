import axios from 'axios'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { submitBookingRequest } from '../../api/bookingRequests'
import { listPublicHotelRooms } from '../../api/publicHotels'
import type { ApiErrorResponse } from '../../auth/types'
import { roleHomePath } from '../../auth/roleHome'
import { useAuth } from '../../auth/useAuth'
import { SearchSelect } from '../../components/SearchSelect'
import { TicketCard } from '../../components/TicketCard'
import { useT } from '../../i18n/useT'
import { PublicFooter, PublicHeader } from '../public/PublicChrome'
import { loadCatalog, loadRealHotels, mergeRealHotels, type CatalogHotel, type HotelCatalog } from '../../data/catalog'
import type { PublicHotelResponse } from '../../api/types'
import './LandingPage.css'

const REAL_HOTEL_PREFIX = 'hotel-'
const isRealHotel = (h: CatalogHotel) => h.id.startsWith(REAL_HOTEL_PREFIX)
const realHotelId = (h: CatalogHotel) => Number(h.id.slice(REAL_HOTEL_PREFIX.length))

/** A room offered for the currently selected hotel — from the live API (real hotels) or embedded in the seed catalog (demo hotels). */
interface DisplayRoom {
  id: string | number
  name: string
  capacity: number
  bedType: string
  price: number
  currency: string
  images: string[]
}

const today = new Date().toISOString().slice(0, 10)
const starLabel = (n: number | null) => (n ? '★'.repeat(n) : '')
const hotelType = (n: number | null) => (n ? `${n}★` : 'Hotel')

const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`

/** The postcard tucked into the hero envelope. */
const ENVELOPE_PHOTO = UNSPLASH('1502602898657-3e91760cbb34', 480)
const ENVELOPE_CITY = 'Paris'

const DEST_PHOTOS: Record<string, string> = {
  'Londra': '1513635269975-59663e0ac1ad',
  'Paris': '1502602898657-3e91760cbb34',
  'Roma': '1552832230-c0197dd311b5',
  'Barselona': '1523531294919-4bcd7c65e216',
  'Amsterdam': '1534351590666-13e3e96b5017',
  'Dublin': '1549918864-48ac978761a4',
  'Madrid': '1539037116277-4db20889f2d4',
  'Berlin': '1560969184-10fe8719e047',
  'Viyana': '1516550893923-42d28e5677af',
  'Lizbon': '1585208798174-6cedd86e019a',
  'Porto': '1555881400-74d7acaacd8b',
  'Prag': '1541849546-216549ae216d',
  'Budapeşte': '1616432902940-b7a1acbc60b3',
  'Atina': '1555993539-1732b0258235',
  'Milano': '1520440229-6469a149ac59',
  'Venedik': '1514890547357-a9ee288728e0',
  'Floransa': '1541370976299-4d24ebbc9077',
  'Münih': '1595867818082-083862f3d630',
  'Dubai': '1512453979798-5ea266f8880c',
  'New York': '1496442226666-8d4d0e62e6e9',
  'Bangkok': '1508009603885-50cf7c579365',
  'Sidney': '1506973035872-a4ec16b8e8d9',
  'Marakeş': '1597212618440-806262de4f6b',
}
const cityImg = (city: string) => (DEST_PHOTOS[city] ? UNSPLASH(DEST_PHOTOS[city], 640) : null)

const TRUST = [
  { key: 1, icon: <path d="M4 7h16v10H4z M4 11h16 M8 15h4" /> },
  {
    key: 2,
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
  },
  {
    key: 3,
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
  const { t, lang } = useT()

  const [seedCatalog, setSeedCatalog] = useState<HotelCatalog | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [realHotels, setRealHotels] = useState<PublicHotelResponse[]>([])

  const [hotel, setHotel] = useState<CatalogHotel | null>(null)
  const [cityFilter, setCityFilter] = useState<string | null>(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [step, setStep] = useState<'search' | 'room' | 'contact'>('search')

  const [rooms, setRooms] = useState<DisplayRoom[] | null>(null)
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsError, setRoomsError] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<DisplayRoom | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<number | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCatalog()
      .then(setSeedCatalog)
      .catch(() => setCatalogError(t('landing.catalogError')))
  }, [t])

  useEffect(() => {
    // Fetched independently of the seed catalog so a slow/cold backend never
    // delays or blocks the (backend-independent) demo catalog from showing.
    loadRealHotels().then(setRealHotels)
  }, [])

  const catalog = useMemo(() => {
    if (!seedCatalog) return null
    return realHotels.length > 0 ? mergeRealHotels(seedCatalog, realHotels) : seedCatalog
  }, [seedCatalog, realHotels])

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

  /** A photogenic slice of the catalog for the PlaceCard showcase — only
   *  hotels in a city we have a photo for, highest star rating first. */
  const featured = useMemo(() => {
    return [...items]
      .filter((h) => cityImg(h.city))
      .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
      .slice(0, 6)
  }, [items])

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  const datesValid = checkIn !== '' && checkOut !== '' && checkOut > checkIn
  const canContinue = hotel !== null && datesValid && Number(guests) >= 1
  const nights = datesValid
    ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000)
    : 0
  const effectivePrice = selectedRoom ? selectedRoom.price : hotel?.priceFrom
  const effectiveCurrency = selectedRoom?.currency ?? hotel?.currency ?? catalog?.currency
  const estimate = nights > 0 && effectivePrice != null ? effectivePrice * nights : null

  const focusSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const pickCity = (city: string) => {
    setCityFilter(city)
    setHotel(null)
    focusSearch()
  }

  const pickHotel = (h: CatalogHotel) => {
    setCityFilter(null)
    setHotel(h)
    focusSearch()
  }

  const handleContinue = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!canContinue || !hotel) return

    if (isRealHotel(hotel)) {
      setStep('room')
      setSelectedRoom(null)
      setRooms(null)
      setRoomsError(null)
      setRoomsLoading(true)
      try {
        const list = await listPublicHotelRooms(realHotelId(hotel))
        setRooms(
          list.map((r) => ({
            id: r.id,
            name: r.name,
            capacity: r.capacity,
            bedType: r.bedType,
            price: Number(r.basePrice),
            currency: r.currency,
            images: r.images.map((image) => image.imageUrl),
          })),
        )
      } catch {
        setRoomsError(t('landing.roomError'))
      } finally {
        setRoomsLoading(false)
      }
    } else if (hotel.rooms && hotel.rooms.length > 0) {
      setSelectedRoom(null)
      setRoomsError(null)
      setRooms(
        hotel.rooms.map((r) => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          bedType: r.bedType,
          price: r.price,
          currency: r.currency,
          images: r.images,
        })),
      )
      setStep('room')
    } else {
      setStep('contact')
    }
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
        hotelType: hotelType(hotel.stars),
        propertyCity: hotel.city,
        countryCode: hotel.iso2,
        countryName: hotel.country,
        roomTypeId: typeof selectedRoom?.id === 'number' ? selectedRoom.id : null,
        roomTypeName: selectedRoom?.name ?? null,
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
        setError(t('landing.errorSubmit'))
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
    setRooms(null)
    setRoomsError(null)
    setSelectedRoom(null)
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setReference(null)
    setError(null)
  }

  const summary = hotel
    ? `${hotel.name}${selectedRoom ? ' · ' + selectedRoom.name : ''} · ${hotel.city} · ${checkIn} → ${checkOut} · ${guests}`
    : ''
  const fromPrice = (price: number, currency: string) => t('landing.fromPrice', { price, currency })

  return (
    <div className="lp">
      <PublicHeader />

      <section className="lp-hero">
        <div className="lp-hero__grid">
          <div className="lp-hero__inner">
            <span className="lp-eyebrow">{t('landing.heroEyebrow')}</span>
            <h1 className="lp-hero__title">
              {t('landing.heroTitle1')}
              <br />
              <em>{t('landing.heroTitle2')}</em>
            </h1>
            <p className="lp-hero__lede">
              {catalog
                ? t('landing.heroLede', { count: catalog.count.toLocaleString(lang) })
                : t('landing.heroLedeNoCount')}
            </p>
          </div>

          <div className="lp-hero__scene" aria-hidden="true">
            <div className="lp-envelope">
              <span className="lp-envelope__flap" />
              <span className="lp-envelope__photo">
                <img src={ENVELOPE_PHOTO} alt="" loading="lazy" />
              </span>
              <span className="lp-envelope__address">
                <span className="lp-envelope__addr-label">{t('landing.envelopeTo')}</span>
                <span className="lp-envelope__addr-city">{ENVELOPE_CITY}</span>
              </span>
              <span className="lp-envelope__postmark">
                <svg viewBox="0 0 96 96" fill="none">
                  <circle cx="48" cy="48" r="43" stroke="var(--l-navy)" strokeWidth="1.2" strokeDasharray="2 4.5" />
                  <circle cx="48" cy="48" r="35" stroke="var(--l-navy)" strokeWidth="1" />
                  <path
                    d="M31 53 43 41 51 48 66 32"
                    stroke="var(--l-coral)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x="48"
                    y="26"
                    textAnchor="middle"
                    fontFamily="var(--mono)"
                    fontSize="6.5"
                    letterSpacing="2"
                    fill="var(--text-dim)"
                  >
                    PAR AVION
                  </text>
                  <text
                    x="48"
                    y="68"
                    textAnchor="middle"
                    fontFamily="var(--mono)"
                    fontSize="7.5"
                    fontWeight="700"
                    letterSpacing="1"
                    fill="var(--l-navy)"
                  >
                    {ENVELOPE_CITY.toUpperCase()}
                  </text>
                </svg>
              </span>
            </div>
          </div>
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
              <h2>{t('landing.doneTitle')}</h2>
              <p className="lp-done__ref">
                {t('landing.doneRef')} <strong>#{reference}</strong>
              </p>
              <p className="lp-done__note">
                {t('landing.doneNote', {
                  hotel: hotel?.name ?? '',
                  city: hotel?.city ?? '',
                  country: hotel?.country ?? '',
                  checkIn,
                  checkOut,
                  guests,
                })}
              </p>
              <button type="button" className="lp-btn lp-btn--ghost" onClick={reset}>
                {t('landing.newRequest')}
              </button>
            </div>
          ) : step === 'search' ? (
            <form className="lp-form" onSubmit={handleContinue}>
              <div className="lp-form__head">
                <h2>{t('landing.searchTitle')}</h2>
                {cityFilter && (
                  <button type="button" className="lp-pill lp-pill--clear" onClick={() => setCityFilter(null)}>
                    {cityFilter}
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>

              <label className="lp-field lp-field--wide">
                <span className="lp-field__label">{t('landing.fieldHotel')}</span>
                {catalogError ? (
                  <span className="lp-inline-error">{catalogError}</span>
                ) : !catalog ? (
                  <span className="lp-loading">{t('landing.loadingHotels')}</span>
                ) : (
                  <SearchSelect<CatalogHotel>
                    items={items}
                    value={hotel}
                    onChange={setHotel}
                    getKey={(h) => h.id}
                    getLabel={(h) => h.name}
                    getMeta={(h) =>
                      `${h.city}, ${h.country}${h.stars ? ` · ${starLabel(h.stars)}` : ''} · ${fromPrice(h.priceFrom, h.currency ?? catalog.currency)}`
                    }
                    getSearchText={(h) => `${h.name} ${h.city} ${h.country}`}
                    placeholder={t('landing.searchPlaceholder')}
                  />
                )}
              </label>

              <div className="lp-form__row">
                <label className="lp-field">
                  <span className="lp-field__label">{t('landing.fieldCheckIn')}</span>
                  <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </label>
                <label className="lp-field">
                  <span className="lp-field__label">{t('landing.fieldCheckOut')}</span>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </label>
                <label className="lp-field lp-field--narrow">
                  <span className="lp-field__label">{t('landing.fieldGuests')}</span>
                  <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} />
                </label>
              </div>

              {estimate !== null && (
                <p className="lp-estimate">
                  <span>{t('landing.estimate')}</span>
                  <strong>
                    ~{estimate.toLocaleString(lang)} {effectiveCurrency}
                  </strong>
                  <span className="lp-estimate__note">{t('landing.estimateNote', { nights })}</span>
                </p>
              )}

              {error && <p className="lp-inline-error">{error}</p>}

              <button type="submit" className="lp-btn lp-btn--block" disabled={!canContinue}>
                {t('landing.continue')}
              </button>
            </form>
          ) : step === 'room' ? (
            <div className="lp-form">
              <button type="button" className="lp-back" onClick={() => setStep('search')}>
                {t('landing.backToSearch')}
              </button>
              <div className="lp-form__head">
                <h2>{t('landing.roomStepTitle')}</h2>
              </div>
              <p className="lp-form__summary">{hotel?.name}</p>

              {roomsLoading && <span className="lp-loading">{t('landing.roomLoading')}</span>}
              {roomsError && <p className="lp-inline-error">{roomsError}</p>}
              {rooms && rooms.length === 0 && !roomsLoading && (
                <p className="lp-loading">{t('landing.roomEmpty')}</p>
              )}

              {rooms && rooms.length > 0 && (
                <div className="lp-room-options">
                  {rooms.map((room) => (
                    <button
                      type="button"
                      key={room.id}
                      className={
                        'lp-room-option' + (selectedRoom?.id === room.id ? ' lp-room-option--selected' : '')
                      }
                      onClick={() => setSelectedRoom(room)}
                    >
                      {room.images[0] && (
                        <img className="lp-room-option__img" src={room.images[0]} alt="" loading="lazy" />
                      )}
                      <span className="lp-room-option__body">
                        <span className="lp-room-option__name">{room.name}</span>
                        <span className="lp-room-option__meta">
                          {room.capacity} {t('landing.roomCapacityUnit')} · {room.bedType}
                        </span>
                        <span className="lp-room-option__price">{fromPrice(room.price, room.currency)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="lp-btn lp-btn--block"
                disabled={!selectedRoom}
                onClick={() => setStep('contact')}
              >
                {t('landing.continue')}
              </button>
            </div>
          ) : (
            <form className="lp-form" onSubmit={handleSubmit}>
              <button
                type="button"
                className="lp-back"
                onClick={() => {
                  setStep(selectedRoom ? 'room' : 'search')
                  setError(null)
                }}
              >
                {t('landing.backToSearch')}
              </button>
              <div className="lp-form__head">
                <h2>{t('landing.contactTitle')}</h2>
              </div>
              <p className="lp-form__summary">{summary}</p>

              <label className="lp-field lp-field--wide">
                <span className="lp-field__label">{t('landing.name')}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <div className="lp-form__row lp-form__row--2">
                <label className="lp-field">
                  <span className="lp-field__label">{t('landing.email')}</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className="lp-field">
                  <span className="lp-field__label">{t('landing.phone')}</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </label>
              </div>
              <label className="lp-field lp-field--wide">
                <span className="lp-field__label">{t('landing.note')}</span>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('landing.notePlaceholder')}
                />
              </label>

              {error && <p className="lp-inline-error">{error}</p>}

              <button type="submit" className="lp-btn lp-btn--block" disabled={submitting}>
                {submitting ? t('landing.submitting') : t('landing.submit')}
              </button>
            </form>
          )}
        </div>
      </section>

      {destinations.length > 0 && (
        <section className="lp-dest">
          <h2 className="lp-dest__title">{t('landing.destTitle')}</h2>
          <div className="lp-dest__grid">
            {destinations.map((d) => {
              const img = cityImg(d.name)
              return (
                <button key={d.name} type="button" className="lp-card" onClick={() => pickCity(d.name)}>
                  <span className="lp-card__photo">
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
                  </span>
                  <span className="lp-card__body">
                    <span className="lp-card__city">{d.name}</span>
                    <span className="lp-card__meta">
                      {d.country}
                      {d.priceFrom != null && ` · ${fromPrice(d.priceFrom, 'EUR')}`}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="lp-dest">
          <h2 className="lp-dest__title">{t('landing.featuredTitle')}</h2>
          <div className="lp-ticket-grid">
            {featured.map((h) => (
              <TicketCard
                key={h.id}
                image={cityImg(h.city)}
                city={h.city}
                country={h.country}
                title={h.name}
                stars={h.stars}
                isTopRated={(h.stars ?? 0) >= 5}
                note={t('landing.featuredNote')}
                priceLabel={fromPrice(h.priceFrom, h.currency ?? catalog?.currency ?? 'EUR')}
                ctaLabel={t('landing.viewHotel')}
                topRatedLabel={t('landing.topRated')}
                onBook={() => pickHotel(h)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="lp-trust">
        <div className="lp-trust__lead">
          <h2>{t('landing.trustHeading')}</h2>
          <p>{t('landing.trustLede')}</p>
        </div>
        <ul className="lp-trust__list">
          {TRUST.map((item) => (
            <li key={item.key} className="lp-trust__item">
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
                {item.icon}
              </svg>
              <div>
                <strong>{t(`landing.trust${item.key}Title`)}</strong>
                <span>{t(`landing.trust${item.key}Body`)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="lp-band">
        <h2>{t('landing.bandTitle')}</h2>
        <p>{t('landing.bandBody')}</p>
        <button type="button" className="lp-btn lp-btn--on-dark" onClick={focusSearch}>
          {t('landing.bandCta')}
        </button>
      </section>

      <PublicFooter />
    </div>
  )
}
