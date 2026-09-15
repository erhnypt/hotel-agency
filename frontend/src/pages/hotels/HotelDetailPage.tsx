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
import { useT } from '../../i18n/useT'
import { HotelRoomImagesModal } from './HotelRoomImagesModal'
import '../../components/crud.css'

export function HotelDetailPage() {
  const { t } = useT()
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
        setError(t('hotels.actionFailed'))
      }
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!hotel.data) return
    if (!window.confirm(t('hotels.deleteConfirm', { name: hotel.data.name }))) {
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
        setError(t('hotels.actionFailed'))
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
          ← {t('hotels.title')}
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="info-grid">
        <span className="info-grid__label">{t('common.status')}</span>
        <span className="info-grid__value">
          <StatusBadge status={h.status} />
        </span>
        <span className="info-grid__label">{t('common.email')}</span>
        <span className="info-grid__value">{h.email}</span>
        <span className="info-grid__label">{t('common.phone')}</span>
        <span className="info-grid__value">{h.phone}</span>
        <span className="info-grid__label">{t('hotelDetail.contactLabel')}</span>
        <span className="info-grid__value">{h.contactPerson}</span>
        <span className="info-grid__label">{t('hotelDetail.addressLabel')}</span>
        <span className="info-grid__value">
          {h.address}, {h.city}, {h.country}
        </span>
        {h.website && (
          <>
            <span className="info-grid__label">{t('hotelDetail.websiteLabel')}</span>
            <span className="info-grid__value">{h.website}</span>
          </>
        )}
        {h.description && (
          <>
            <span className="info-grid__label">{t('common.description')}</span>
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
                {t('common.confirm')}
              </button>
              <button
                type="button"
                className="btn btn--small btn--danger"
                disabled={busy}
                onClick={() => runAction(() => rejectHotel(id))}
              >
                {t('common.reject')}
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
              {t('hotels.deactivateButton')}
            </button>
          )}
          {h.status === 'INACTIVE' && (
            <button
              type="button"
              className="btn btn--small"
              disabled={busy}
              onClick={() => runAction(() => reactivateHotel(id))}
            >
              {t('hotels.activateButton')}
            </button>
          )}
          <button type="button" className="btn btn--small btn--danger" disabled={busy} onClick={handleDelete}>
            {t('common.delete')}
          </button>
        </div>
      )}

      <div className="page-header">
        <h2>{t('hotelDetail.roomTypesTitle')}</h2>
      </div>

      {roomTypes.loading && <LoadingState />}
      {roomTypes.error && <ErrorState message={roomTypes.error} />}

      {roomTypes.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.name')}</th>
                <th>{t('hotelDetail.columnCapacity')}</th>
                <th>{t('hotelDetail.columnBedType')}</th>
                <th>{t('hotelDetail.columnRoomCount')}</th>
                <th>{t('hotelDetail.columnNightlyPrice')}</th>
                <th>m²</th>
                <th>{t('hotelDetail.columnImages')}</th>
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
                      {t('hotelDetail.imageCount', { count: roomType.images.length })}
                    </button>
                  </td>
                </tr>
              ))}
              {roomTypes.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="data-table__empty">
                    {t('hotelDetail.noRoomTypes')}
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
