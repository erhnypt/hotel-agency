import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCustomers } from '../../api/customers'
import { listHotels } from '../../api/hotels'
import { listServices } from '../../api/services'
import { createReservation, searchAvailableRooms } from '../../api/reservations'
import type { ApiErrorResponse } from '../../auth/types'
import { roleHomePath } from '../../auth/roleHome'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import type { AvailableRoomResponse, HotelStatus } from '../../api/types'
import { detectBrand, digitsOnly } from '../../lib/card'
import '../../components/crud.css'
import './NewReservationPage.css'

export function NewReservationPage() {
  const { t } = useT()
  const navigate = useNavigate()
  const { user } = useAuth()
  const hotels = useAsync(listHotels, [])
  const activeHotels = hotels.data?.filter((h) => h.status === 'ACTIVE' satisfies HotelStatus) ?? []
  const customers = useAsync(listCustomers, [])

  const [hotelId, setHotelId] = useState('')
  const services = useAsync(() => (hotelId ? listServices(Number(hotelId)) : Promise.resolve([])), [hotelId])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')

  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [availableRooms, setAvailableRooms] = useState<AvailableRoomResponse[] | null>(null)
  /** roomTypeId -> quantity; supports booking several room types in one reservation. */
  const [selectedRooms, setSelectedRooms] = useState<Record<number, number>>({})
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])

  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing')
  const [customerId, setCustomerId] = useState('')
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newCardHolder, setNewCardHolder] = useState('')
  const [newCardNumber, setNewCardNumber] = useState('')
  const [newCardExpiry, setNewCardExpiry] = useState('')
  const [newCardNote, setNewCardNote] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [reservationNumber, setReservationNumber] = useState<string | null>(null)

  if (hotels.loading || customers.loading) return <LoadingState />
  if (hotels.error) return <ErrorState message={hotels.error} />
  if (customers.error) return <ErrorState message={customers.error} />

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchError(null)
    setAvailableRooms(null)
    setSelectedRooms({})
    setSelectedServiceIds([])
    setSearching(true)
    try {
      const rooms = await searchAvailableRooms(Number(hotelId), checkIn, checkOut, Number(guests))
      setAvailableRooms(rooms)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setSearchError(err.response.data.message)
      } else {
        setSearchError(t('newReservation.searchError'))
      }
    } finally {
      setSearching(false)
    }
  }

  const resetForNewReservation = () => {
    setHotelId('')
    setCheckIn('')
    setCheckOut('')
    setGuests('2')
    setAvailableRooms(null)
    setSelectedRooms({})
    setSelectedServiceIds([])
    setCustomerMode('existing')
    setCustomerId('')
    setNewCardHolder('')
    setNewCardNumber('')
    setNewCardExpiry('')
    setNewCardNote('')
    setNewFirstName('')
    setNewLastName('')
    setNewPhone('')
    setNewEmail('')
    setReservationNumber(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (Object.keys(selectedRooms).length === 0) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const response = await createReservation({
        hotelId: Number(hotelId),
        roomTypeId: Number(Object.keys(selectedRooms)[0]),
        checkIn,
        checkOut,
        guests: Number(guests),
        rooms: Object.entries(selectedRooms).map(([roomTypeId, quantity]) => ({
          roomTypeId: Number(roomTypeId),
          quantity,
        })),
        serviceIds: selectedServiceIds,
        customerId: customerMode === 'existing' ? Number(customerId) : null,
        newCustomer:
          customerMode === 'new'
            ? {
                firstName: newFirstName,
                lastName: newLastName,
                phone: newPhone,
                email: newEmail || null,
                cardHolder: newCardHolder.trim() || null,
                cardBrand: digitsOnly(newCardNumber) ? detectBrand(newCardNumber) : null,
                cardNumber: digitsOnly(newCardNumber) || null,
                cardExpiry: /^(0[1-9]|1[0-2])\/\d{2}$/.test(newCardExpiry.trim())
                  ? newCardExpiry.trim()
                  : null,
                cardNote: newCardNote.trim() || null,
              }
            : null,
      })
      setReservationNumber(response.reservationNumber)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setSubmitError(err.response.data.message)
      } else {
        setSubmitError(t('newReservation.createError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (reservationNumber) {
    return (
      <div className="reservation-success">
        <h2>{t('newReservation.successTitle')}</h2>
        <p className="reservation-success__number">{reservationNumber}</p>
        <div className="form-actions form-actions--start">
          <button type="button" className="btn btn--primary" onClick={resetForNewReservation}>
            {t('newReservation.newReservationButton')}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate(`${roleHomePath(user!.role)}/reservations`)}
          >
            {t('newReservation.goToReservationsButton')}
          </button>
        </div>
      </div>
    )
  }

  const selectedCustomerValid =
    customerMode === 'existing' ? customerId !== '' : newFirstName !== '' && newLastName !== '' && newPhone !== ''

  const selectedRoomIds = Object.keys(selectedRooms).map(Number)
  const selectedCurrency =
    availableRooms?.find((room) => selectedRoomIds.includes(room.roomTypeId))?.currency ?? null
  const bookableServices = (services.data ?? []).filter(
    (service) => !selectedCurrency || service.currency === selectedCurrency,
  )
  const selectedServices = bookableServices.filter((service) => selectedServiceIds.includes(service.id))
  const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const roomsTotal = (availableRooms ?? [])
    .filter((room) => selectedRoomIds.includes(room.roomTypeId))
    .reduce((sum, room) => sum + room.totalPrice * (selectedRooms[room.roomTypeId] ?? 0), 0)
  const totalPreview = roomsTotal + servicesTotal

  return (
    <div>
      <div className="page-header">
        <h2>{t('newReservation.title')}</h2>
      </div>

      <form onSubmit={handleSearch} className="inline-form">
        <label className="select-field">
          <span>{t('common.hotel')}</span>
          <select value={hotelId} onChange={(e) => setHotelId(e.target.value)} required>
            <option value="" disabled>
              {t('newReservation.selectPlaceholder')}
            </option>
            {activeHotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>{t('common.checkIn')}</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>{t('common.checkOut')}</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>{t('newReservation.guestsLabel')}</span>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn--primary" disabled={searching || !hotelId}>
          {searching ? t('newReservation.searchingLabel') : t('newReservation.searchButton')}
        </button>
      </form>

      {searchError && <p className="form-error">{searchError}</p>}

      {availableRooms && (
        <div className="room-options">
          {availableRooms.length === 0 && (
            <p className="page-state">{t('newReservation.noRoomsFound')}</p>
          )}
          {availableRooms.map((room) => {
            const quantity = selectedRooms[room.roomTypeId] ?? 0
            const currencyChanged =
              selectedCurrency != null && quantity === 0 && room.currency !== selectedCurrency && selectedRoomIds.length > 0
            return (
              <button
                type="button"
                key={room.roomTypeId}
                className={
                  'room-option' + (quantity > 0 ? ' room-option--selected' : '') + (currencyChanged ? ' room-option--disabled' : '')
                }
                disabled={currencyChanged}
                title={currencyChanged ? t('newReservation.currencyMixError') : undefined}
                onClick={() => {
                  setSelectedRooms((rooms) => {
                    const next = { ...rooms }
                    if (quantity > 0) {
                      delete next[room.roomTypeId]
                    } else {
                      next[room.roomTypeId] = 1
                    }
                    return next
                  })
                  setSelectedServiceIds([])
                }}
              >
                <div className="room-option__name">{room.name}</div>
                <div className="room-option__meta">
                  {t('newReservation.roomCapacityLabel', { capacity: room.capacity })} · {room.bedType}
                </div>
                <div className="room-option__price">
                  {room.totalPrice} {room.currency}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selectedRoomIds.length > 0 && (
        <form onSubmit={handleSubmit} className="reservation-customer-form">
          <div className="reservation-rooms__selected">
            {availableRooms
              ?.filter((room) => selectedRoomIds.includes(room.roomTypeId))
              .map((room) => (
                <div key={room.roomTypeId} className="reservation-rooms__row">
                  <span className="reservation-rooms__name">{room.name}</span>
                  <div className="reservation-rooms__qty">
                    <button
                      type="button"
                      className="btn btn--small"
                      aria-label={`- ${room.name}`}
                      disabled={selectedRooms[room.roomTypeId] <= 1}
                      onClick={() =>
                        setSelectedRooms((rooms) => ({
                          ...rooms,
                          [room.roomTypeId]: rooms[room.roomTypeId] - 1,
                        }))
                      }
                    >
                      −
                    </button>
                    <span className="reservation-rooms__count">{selectedRooms[room.roomTypeId]}</span>
                    <button
                      type="button"
                      className="btn btn--small"
                      aria-label={`+ ${room.name}`}
                      onClick={() =>
                        setSelectedRooms((rooms) => ({
                          ...rooms,
                          [room.roomTypeId]: rooms[room.roomTypeId] + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                  <span className="reservation-rooms__price">
                    {room.totalPrice * selectedRooms[room.roomTypeId]} {room.currency}
                  </span>
                </div>
              ))}
          </div>

          {bookableServices.length > 0 && (
            <section className="reservation-services">
              <h3>{t('newReservation.servicesTitle')}</h3>
              <p className="reservation-services__hint">{t('newReservation.servicesHint')}</p>
              <div className="reservation-services__list">
                {bookableServices.map((service) => {
                  const checked = selectedServiceIds.includes(service.id)
                  return (
                    <label
                      key={service.id}
                      className={
                        'reservation-services__item' + (checked ? ' reservation-services__item--selected' : '')
                      }
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedServiceIds((ids) =>
                            checked ? ids.filter((id) => id !== service.id) : [...ids, service.id],
                          )
                        }
                      />
                      <span>{service.name}</span>
                      <span className="reservation-services__price">
                        {service.price} {service.currency}
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="reservation-total">
                {t('newReservation.totalPreview', { total: totalPreview, currency: selectedCurrency ?? '' })}
              </p>
            </section>
          )}

          <div className="page-header">
            <h2>{t('newReservation.customerSectionTitle')}</h2>
          </div>

          <div className="customer-mode-toggle">
            <button
              type="button"
              className={'btn btn--small' + (customerMode === 'existing' ? ' btn--primary' : '')}
              onClick={() => setCustomerMode('existing')}
            >
              {t('newReservation.existingCustomerButton')}
            </button>
            <button
              type="button"
              className={'btn btn--small' + (customerMode === 'new' ? ' btn--primary' : '')}
              onClick={() => setCustomerMode('new')}
            >
              {t('newReservation.newCustomerButton')}
            </button>
          </div>

          {customerMode === 'existing' ? (
            <label className="select-field">
              <span>{t('newReservation.customerSectionTitle')}</span>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="" disabled>
                  {t('newReservation.selectPlaceholder')}
                </option>
                {customers.data?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName} — {customer.phone}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="new-customer-fields">
              <label className="form-field">
                <span>{t('common.name')}</span>
                <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} required />
              </label>
              <label className="form-field">
                <span>{t('newReservation.lastNameLabel')}</span>
                <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} required />
              </label>
              <label className="form-field">
                <span>{t('common.phone')}</span>
                <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
              </label>
              <label className="form-field">
                <span>{t('common.email')}</span>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </label>

              <fieldset className="form-fieldset new-customer-fields__card">
  <legend>{t('newReservation.paymentCardLegend')}</legend>
  <p className="form-hint">
    {t('newReservation.cardHint')}
  </p>
  <label className="form-field">
    <span>{t('newReservation.cardHolderLabel')}</span>
    <input value={newCardHolder} onChange={(e) => setNewCardHolder(e.target.value)} />
  </label>
  <label className="form-field">
    <span>{t('newReservation.cardNumberLabel')}</span>
    <input
      inputMode="numeric"
      autoComplete="off"
      maxLength={16}
      value={newCardNumber}
      onChange={(e) => setNewCardNumber(e.target.value)}
      placeholder="1234567812345678"
    />
  </label>
  <label className="form-field">
    <span>{t('newReservation.cardExpiryLabel')}</span>
    <input
      inputMode="numeric"
      maxLength={5}
      value={newCardExpiry}
      onChange={(e) => {
        const d = digitsOnly(e.target.value).slice(0, 4)
        setNewCardExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
      }}
      placeholder="12/29"
    />
  </label>
  <label className="form-field">
    <span>CVV</span>
    <input
      type="text"
      maxLength={255}
      value={newCardNote}
      onChange={(e) => setNewCardNote(e.target.value)}
      placeholder="CCV"
    />
  </label>
</fieldset>
            </div>
          )}

          {submitError && <p className="form-error">{submitError}</p>}

          <div className="form-actions form-actions--start">
            <button type="submit" className="btn btn--primary" disabled={submitting || !selectedCustomerValid}>
              {submitting ? t('newReservation.submittingLabel') : t('newReservation.submitButton')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
