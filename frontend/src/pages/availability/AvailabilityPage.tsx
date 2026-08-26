import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { deleteAvailability, listAvailability, upsertAvailability } from '../../api/availability'
import type { ApiErrorResponse } from '../../auth/types'
import type { RoomAvailabilityResponse } from '../../api/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function AvailabilityPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null)
  const [editingAvailability, setEditingAvailability] = useState<RoomAvailabilityResponse | null>(null)
  const [date, setDate] = useState('')
  const [availableRooms, setAvailableRooms] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setEditingAvailability(null)
    setDate('')
    setAvailableRooms('')
  }

  const hotel = useAsync(getMyHotel, [])
  const roomTypes = useAsync(
    () => (hotel.data ? listRoomTypes(hotel.data.id) : Promise.resolve([])),
    [hotel.data?.id],
  )

  const roomTypeId = selectedRoomTypeId ?? roomTypes.data?.[0]?.id ?? null

  const availability = useAsync(
    () => (roomTypeId ? listAvailability(roomTypeId) : Promise.resolve([])),
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
      await upsertAvailability(roomTypeId, { date, availableRooms: Number(availableRooms) })
      resetForm()
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
    await deleteAvailability(id)
    if (editingAvailability?.id === id) resetForm()
    refresh()
  }

  const handleEdit = (a: RoomAvailabilityResponse) => {
    setEditingAvailability(a)
    setDate(a.date)
    setAvailableRooms(String(a.availableRooms))
  }

  return (
    <div>
      <div className="page-header">
        <h2>Müsaitlik</h2>
      </div>

      {(roomTypes.data?.length ?? 0) === 0 ? (
        <p className="page-state">Müsaitlik girmek için önce bir oda tipi oluşturmalısınız.</p>
      ) : (
        <>
          <label className="select-field">
            <span>Oda Tipi</span>
            <select
              value={roomTypeId ?? ''}
              onChange={(e) => {
                setSelectedRoomTypeId(Number(e.target.value))
                resetForm()
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
              <span>Tarih</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label className="form-field">
              <span>Müsait Oda Sayısı</span>
              <input
                type="number"
                min={0}
                value={availableRooms}
                onChange={(e) => setAvailableRooms(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Kaydediliyor...' : editingAvailability ? 'Güncelle' : 'Ekle'}
            </button>
            {editingAvailability && (
              <button type="button" className="btn btn--small" onClick={resetForm}>
                Vazgeç
              </button>
            )}
          </form>

          {error && <p className="form-error">{error}</p>}

          {availability.loading && <LoadingState />}
          {availability.error && <ErrorState message={availability.error} />}

          {availability.data && (
            <div className="data-table-wrapper"><table className="data-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Müsait Oda</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...availability.data]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((a) => (
                    <tr key={a.id} className={editingAvailability?.id === a.id ? 'data-table__row--editing' : undefined}>
                      <td>{a.date}</td>
                      <td>{a.availableRooms}</td>
                      <td>
                        <div className="data-table__actions">
                          <button type="button" className="btn btn--small" onClick={() => handleEdit(a)}>
                            Düzenle
                          </button>
                          <button type="button" className="btn btn--small btn--danger" onClick={() => handleDelete(a.id)}>
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {availability.data.length === 0 && (
                  <tr>
                    <td colSpan={3} className="data-table__empty">
                      Henüz müsaitlik girilmemiş.
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
