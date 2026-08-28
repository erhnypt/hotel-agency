import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCustomers } from '../../api/customers'
import { listHotels } from '../../api/hotels'
import { createReservation, searchAvailableRooms } from '../../api/reservations'
import type { ApiErrorResponse } from '../../auth/types'
import { roleHomePath } from '../../auth/roleHome'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import type { AvailableRoomResponse } from '../../api/types'
import { detectBrand, digitsOnly } from '../../lib/card'
import '../../components/crud.css'
import './NewReservationPage.css'

export function NewReservationPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const hotels = useAsync(listHotels, [])
  const customers = useAsync(listCustomers, [])

  const [hotelId, setHotelId] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')

  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [availableRooms, setAvailableRooms] = useState<AvailableRoomResponse[] | null>(null)
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null)

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
  const [newCardNote2, setNewCardNote2] = useState('')

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
    setSelectedRoomTypeId(null)
    setSearching(true)
    try {
      const rooms = await searchAvailableRooms(Number(hotelId), checkIn, checkOut, Number(guests))
      setAvailableRooms(rooms)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setSearchError(err.response.data.message)
      } else {
        setSearchError('Müsait odalar aranamadı.')
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
    setSelectedRoomTypeId(null)
    setCustomerMode('existing')
    setCustomerId('')
    setNewCardHolder('')
    setNewCardNumber('')
    setNewCardExpiry('')
    setNewCardNote('')
    setNewCardNote2('')
    setNewFirstName('')
    setNewLastName('')
    setNewPhone('')
    setNewEmail('')
    setReservationNumber(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedRoomTypeId) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const response = await createReservation({
        hotelId: Number(hotelId),
        roomTypeId: selectedRoomTypeId,
        checkIn,
        checkOut,
        guests: Number(guests),
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
                cardNote2: newCardNote2.trim() || null,
              }
            : null,
      })
      setReservationNumber(response.reservationNumber)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setSubmitError(err.response.data.message)
      } else {
        setSubmitError('Rezervasyon oluşturulamadı.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (reservationNumber) {
    return (
      <div className="reservation-success">
        <h2>Rezervasyon Oluşturuldu</h2>
        <p className="reservation-success__number">{reservationNumber}</p>
        <div className="form-actions form-actions--start">
          <button type="button" className="btn btn--primary" onClick={resetForNewReservation}>
            Yeni Rezervasyon Oluştur
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate(`${roleHomePath(user!.role)}/reservations`)}
          >
            Rezervasyonlara Git
          </button>
        </div>
      </div>
    )
  }

  const selectedCustomerValid =
    customerMode === 'existing' ? customerId !== '' : newFirstName !== '' && newLastName !== '' && newPhone !== ''

  return (
    <div>
      <div className="page-header">
        <h2>Yeni Rezervasyon</h2>
      </div>

      <form onSubmit={handleSearch} className="inline-form">
        <label className="select-field">
          <span>Otel</span>
          <select value={hotelId} onChange={(e) => setHotelId(e.target.value)} required>
            <option value="" disabled>
              Seçiniz
            </option>
            {hotels.data?.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Check-in</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Check-out</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Misafir Sayısı</span>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn--primary" disabled={searching || !hotelId}>
          {searching ? 'Aranıyor...' : 'Müsait Odaları Göster'}
        </button>
      </form>

      {searchError && <p className="form-error">{searchError}</p>}

      {availableRooms && (
        <div className="room-options">
          {availableRooms.length === 0 && (
            <p className="page-state">Bu tarihlerde ve misafir sayısında müsait oda bulunamadı.</p>
          )}
          {availableRooms.map((room) => (
            <button
              type="button"
              key={room.roomTypeId}
              className={
                'room-option' + (selectedRoomTypeId === room.roomTypeId ? ' room-option--selected' : '')
              }
              onClick={() => setSelectedRoomTypeId(room.roomTypeId)}
            >
              <div className="room-option__name">{room.name}</div>
              <div className="room-option__meta">
                {room.capacity} kişi · {room.bedType}
              </div>
              <div className="room-option__price">
                {room.totalPrice} {room.currency}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedRoomTypeId && (
        <form onSubmit={handleSubmit} className="reservation-customer-form">
          <div className="page-header">
            <h2>Müşteri</h2>
          </div>

          <div className="customer-mode-toggle">
            <button
              type="button"
              className={'btn btn--small' + (customerMode === 'existing' ? ' btn--primary' : '')}
              onClick={() => setCustomerMode('existing')}
            >
              Mevcut Müşteri
            </button>
            <button
              type="button"
              className={'btn btn--small' + (customerMode === 'new' ? ' btn--primary' : '')}
              onClick={() => setCustomerMode('new')}
            >
              Yeni Müşteri
            </button>
          </div>

          {customerMode === 'existing' ? (
            <label className="select-field">
              <span>Müşteri</span>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="" disabled>
                  Seçiniz
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
                <span>Ad</span>
                <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} required />
              </label>
              <label className="form-field">
                <span>Soyad</span>
                <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} required />
              </label>
              <label className="form-field">
                <span>Telefon</span>
                <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
              </label>
              <label className="form-field">
                <span>E-posta</span>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </label>

              <fieldset className="form-fieldset new-customer-fields__card">
  <legend>Ödeme Kartı (opsiyonel)</legend>
  <p className="form-hint">
    Otele iletilmek üzere kart bilgileri saklanır.
  </p>
  <label className="form-field">
    <span>Kart Sahibi</span>
    <input value={newCardHolder} onChange={(e) => setNewCardHolder(e.target.value)} />
  </label>
  <label className="form-field">
    <span>Kart Numarası</span>
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
    <span>Son Kullanma (AA/YY)</span>
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
    <span>Kart Notu</span>
    <input
      type="text"
      maxLength={255}
      value={newCardNote}
      onChange={(e) => setNewCardNote(e.target.value)}
      placeholder="Kısa not (ör. kapıda ödeme)"
    />
  </label>
  <label className="form-field">
    <span>Kart Notu 2</span>
    <input
      type="text"
      maxLength={255}
      value={newCardNote2}
      onChange={(e) => setNewCardNote2(e.target.value)}
      placeholder="İkinci kısa not"
    />
  </label>
</fieldset>
            </div>
          )}

          {submitError && <p className="form-error">{submitError}</p>}

          <div className="form-actions form-actions--start">
            <button type="submit" className="btn btn--primary" disabled={submitting || !selectedCustomerValid}>
              {submitting ? 'Oluşturuluyor...' : 'Rezervasyonu Oluştur'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
