import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  approveHotel,
  deactivateHotel,
  deleteHotel,
  getHotel,
  listRoomTypes,
  reactivateHotel,
  rejectHotel,
} from '../../api/hotels'
import type { ApiErrorResponse } from '../../auth/types'
import type { RoomTypeResponse } from '../../api/types'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import { HotelRoomImagesModal } from './HotelRoomImagesModal'
import '../../components/crud.css'

export function HotelDetailPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const id = Number(hotelId)
  const { user } = useAuth()
  const isAdmin = user?.role === 'AGENCY_ADMIN'
  const basePath = isAdmin ? '/admin/hotels' : '/staff/hotels'
  const navigate = useNavigate()

  const [refreshKey, setRefreshKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewingImagesFor, setViewingImagesFor] = useState<RoomTypeResponse | null>(null)

  const hotel = useAsync(() => getHotel(id), [id, refreshKey])
  const roomTypes = useAsync(() => listRoomTypes(id), [id, refreshKey])

  const runAction = async (action: () => Promise<unknown>) => {
    setError(null)
    setBusy(true)
    try {
      await action()
      setRefreshKey((k) => k + 1)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('İşlem başarısız oldu.')
      }
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!hotel.data) return
    if (
      !window.confirm(
        `${hotel.data.name} otelini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      )
    ) {
      return
    }
    setError(null)
    setBusy(true)
    try {
      await deleteHotel(id)
      navigate(basePath)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('İşlem başarısız oldu.')
      }
      setBusy(false)
    }
  }

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />
  if (!hotel.data) return null

  const h = hotel.data

  return (
    <div>
      <div className="page-header">
        <h2>{h.name}</h2>
        <Link to={basePath} className="btn btn--small">
          ← Oteller
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="info-grid">
        <span className="info-grid__label">Durum</span>
        <span className="info-grid__value">
          <StatusBadge status={h.status} />
        </span>
        <span className="info-grid__label">E-posta</span>
        <span className="info-grid__value">{h.email}</span>
        <span className="info-grid__label">Telefon</span>
        <span className="info-grid__value">{h.phone}</span>
        <span className="info-grid__label">Yetkili</span>
        <span className="info-grid__value">{h.contactPerson}</span>
        <span className="info-grid__label">Adres</span>
        <span className="info-grid__value">
          {h.address}, {h.city}, {h.country}
        </span>
        {h.website && (
          <>
            <span className="info-grid__label">Website</span>
            <span className="info-grid__value">{h.website}</span>
          </>
        )}
        {h.description && (
          <>
            <span className="info-grid__label">Açıklama</span>
            <span className="info-grid__value">{h.description}</span>
          </>
        )}
      </div>

      {isAdmin && (
        <div className="data-table__actions" style={{ marginBottom: 24 }}>
          {h.status === 'PENDING' && (
            <>
              <button
                type="button"
                className="btn btn--small"
                disabled={busy}
                onClick={() => runAction(() => approveHotel(id))}
              >
                Onayla
              </button>
              <button
                type="button"
                className="btn btn--small btn--danger"
                disabled={busy}
                onClick={() => runAction(() => rejectHotel(id))}
              >
                Reddet
              </button>
            </>
          )}
          {h.status === 'ACTIVE' && (
            <button
              type="button"
              className="btn btn--small btn--danger"
              disabled={busy}
              onClick={() => runAction(() => deactivateHotel(id))}
            >
              Pasife Al
            </button>
          )}
          {h.status === 'INACTIVE' && (
            <button
              type="button"
              className="btn btn--small"
              disabled={busy}
              onClick={() => runAction(() => reactivateHotel(id))}
            >
              Aktifleştir
            </button>
          )}
          <button type="button" className="btn btn--small btn--danger" disabled={busy} onClick={handleDelete}>
            Sil
          </button>
        </div>
      )}

      <div className="page-header">
        <h2>Oda Tipleri</h2>
      </div>

      {roomTypes.loading && <LoadingState />}
      {roomTypes.error && <ErrorState message={roomTypes.error} />}

      {roomTypes.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Kapasite</th>
                <th>Yatak Tipi</th>
                <th>Oda Sayısı</th>
                <th>Gecelik Fiyat</th>
                <th>m²</th>
                <th>Görseller</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.data.map((roomType) => (
                <tr key={roomType.id}>
                  <td>{roomType.name}</td>
                  <td>{roomType.capacity}</td>
                  <td>{roomType.bedType}</td>
                  <td>{roomType.numberOfRooms}</td>
                  <td>{roomType.basePrice != null ? `${roomType.basePrice} ${roomType.currency}` : '—'}</td>
                  <td>{roomType.roomSize ?? '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--small"
                      disabled={roomType.images.length === 0}
                      onClick={() => setViewingImagesFor(roomType)}
                    >
                      {roomType.images.length} görsel
                    </button>
                  </td>
                </tr>
              ))}
              {roomTypes.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="data-table__empty">
                    Henüz oda tipi eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewingImagesFor && (
        <HotelRoomImagesModal roomType={viewingImagesFor} onClose={() => setViewingImagesFor(null)} />
      )}
    </div>
  )
}
