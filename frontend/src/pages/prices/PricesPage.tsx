import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { deletePrice, listPrices, upsertPrice } from '../../api/prices'
import type { ApiErrorResponse } from '../../auth/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function PricesPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const hotel = useAsync(getMyHotel, [])
  const roomTypes = useAsync(
    () => (hotel.data ? listRoomTypes(hotel.data.id) : Promise.resolve([])),
    [hotel.data?.id],
  )

  const roomTypeId = selectedRoomTypeId ?? roomTypes.data?.[0]?.id ?? null

  const prices = useAsync(
    () => (roomTypeId ? listPrices(roomTypeId) : Promise.resolve([])),
    [roomTypeId, refreshKey],
  )

  const refresh = () => setRefreshKey((key) => key + 1)

  if (hotel.loading || roomTypes.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />
  if (roomTypes.error) return <ErrorState message={roomTypes.error} />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!roomTypeId) return
    setError(null)
    setSubmitting(true)
    try {
      await upsertPrice(roomTypeId, { date, price: Number(price), currency })
      setDate('')
      setPrice('')
      refresh()
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

  const handleDelete = async (id: number) => {
    await deletePrice(id)
    refresh()
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
          <label className="select-field">
            <span>Oda Tipi</span>
            <select
              value={roomTypeId ?? ''}
              onChange={(e) => setSelectedRoomTypeId(Number(e.target.value))}
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
              <span>Tarih</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label className="form-field">
              <span>Fiyat</span>
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
              <span>Para Birimi</span>
              <input
                className="form-field__input--tiny"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                required
              />
            </label>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              Kaydet
            </button>
          </form>

          {error && <p className="form-error">{error}</p>}

          {prices.loading && <LoadingState />}
          {prices.error && <ErrorState message={prices.error} />}

          {prices.data && (
            <div className="data-table-wrapper"><table className="data-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Fiyat</th>
                  <th>Para Birimi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...prices.data]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((p) => (
                    <tr key={p.id}>
                      <td>{p.date}</td>
                      <td>{p.price}</td>
                      <td>{p.currency}</td>
                      <td>
                        <div className="data-table__actions">
                          <button type="button" className="btn btn--small btn--danger" onClick={() => handleDelete(p.id)}>
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {prices.data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="data-table__empty">
                      Henüz fiyat girilmemiş.
                    </td>
                  </tr>
                )}
              </tbody>
            </table></div>
          )}
        </>
      )}
    </div>
  )
}
