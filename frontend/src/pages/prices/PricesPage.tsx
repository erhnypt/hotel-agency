import axios from 'axios'
import { useEffect, useState, type FormEvent } from 'react'
import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { getPrice, setPrice } from '../../api/prices'
import type { ApiErrorResponse } from '../../auth/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function PricesPage() {
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null)
  const [price, setPriceValue] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const hotel = useAsync(getMyHotel, [])
  const roomTypes = useAsync(
    () => (hotel.data ? listRoomTypes(hotel.data.id) : Promise.resolve([])),
    [hotel.data?.id],
  )

  const roomTypeId = selectedRoomTypeId ?? roomTypes.data?.[0]?.id ?? null

  useEffect(() => {
    if (!roomTypeId) return
    let active = true
    setError(null)
    setSaved(false)
    getPrice(roomTypeId)
      .then((p) => {
        if (!active) return
        setPriceValue(p.basePrice != null ? String(p.basePrice) : '')
        setCurrency(p.currency || 'EUR')
      })
      .catch(() => {
        if (active) setError('Fiyat yüklenemedi.')
      })
    return () => {
      active = false
    }
  }, [roomTypeId])

  if (hotel.loading || roomTypes.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />
  if (roomTypes.error) return <ErrorState message={roomTypes.error} />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!roomTypeId) return
    setError(null)
    setSaved(false)
    setSubmitting(true)
    try {
      await setPrice(roomTypeId, { price: Number(price), currency })
      setSaved(true)
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
    <div>
      <div className="page-header">
        <h2>Fiyatlar</h2>
      </div>

      {(roomTypes.data?.length ?? 0) === 0 ? (
        <p className="page-state">Fiyat girmek için önce bir oda tipi oluşturmalısınız.</p>
      ) : (
        <>
          <p className="page-state">
            Her oda tipi için tek bir gecelik fiyat girin. Rezervasyon tutarı bu fiyatın gece
            sayısıyla çarpımıdır.
          </p>

          <label className="select-field">
            <span>Oda Tipi</span>
            <select
              value={roomTypeId ?? ''}
              onChange={(e) => {
                setSelectedRoomTypeId(Number(e.target.value))
                setSaved(false)
              }}
            >
              {roomTypes.data?.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </label>

          <form onSubmit={handleSubmit} className="inline-form">
            <label className="form-field">
              <span>Gecelik Fiyat</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => {
                  setPriceValue(e.target.value)
                  setSaved(false)
                }}
                required
              />
            </label>
            <label className="form-field">
              <span>Para Birimi</span>
              <select
                className="form-field__select--tiny"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value)
                  setSaved(false)
                }}
              >
                <option value="TRY">TRY</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </label>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>

          {error && <p className="form-error">{error}</p>}
          {saved && <p className="form-success">Fiyat kaydedildi.</p>}
        </>
      )}
    </div>
  )
}
