import axios from 'axios'
import { useMemo, useState } from 'react'
import { cancelReservation, confirmReservation, listReservations, rejectReservation } from '../../api/reservations'
import type { ReservationResponse, ReservationStatus } from '../../api/types'
import type { ApiErrorResponse } from '../../auth/types'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import { cardLabel } from '../../lib/card'
import '../../components/crud.css'
import './ReservationsPage.css'

const STATUS_LABELS: Record<ReservationStatus | 'ALL', string> = {
  ALL: 'Tümü',
  PENDING: 'Bekliyor',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal Edildi',
  REJECTED: 'Reddedildi',
}

export function ReservationsPage() {
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'ALL'>('ALL')
  const [hotelFilter, setHotelFilter] = useState<number | 'ALL'>('ALL')

  const reservations = useAsync(listReservations, [refreshKey])

  const hotelOptions = useMemo(() => {
    if (!reservations.data) return []
    const names = new Map<number, string>()
    for (const r of reservations.data) names.set(r.hotelId, r.hotelName)
    return [...names.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  }, [reservations.data])

  const statusFiltered = useMemo(() => {
    if (!reservations.data) return []
    if (statusFilter === 'ALL') return reservations.data
    return reservations.data.filter((r) => r.status === statusFilter)
  }, [reservations.data, statusFilter])

  const filtered = useMemo(
    () => (hotelFilter === 'ALL' ? statusFiltered : statusFiltered.filter((r) => r.hotelId === hotelFilter)),
    [statusFiltered, hotelFilter],
  )

  const groups = useMemo(() => {
    if (hotelFilter !== 'ALL' || hotelOptions.length <= 1) return null
    const byHotel = new Map<number, ReservationResponse[]>()
    for (const r of filtered) {
      const list = byHotel.get(r.hotelId) ?? []
      list.push(r)
      byHotel.set(r.hotelId, list)
    }
    return hotelOptions.filter((h) => byHotel.has(h.id)).map((h) => ({ hotel: h, items: byHotel.get(h.id)! }))
  }, [filtered, hotelFilter, hotelOptions])

  const refresh = () => setRefreshKey((key) => key + 1)

  const handleAction = async (id: number, action: (id: number) => Promise<unknown>) => {
    setError(null)
    setBusyId(id)
    try {
      await action(id)
      refresh()
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('İşlem başarısız oldu.')
      }
    } finally {
      setBusyId(null)
    }
  }

  const emptyMessage =
    statusFilter === 'ALL' ? 'Bu otelde rezervasyon yok.' : `"${STATUS_LABELS[statusFilter]}" durumunda rezervasyon yok.`

  const renderTable = (items: ReservationResponse[]) => (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Oda Tipi</th>
            <th>Müşteri</th>
            <th>Kart</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Misafir</th>
            <th>Toplam</th>
            <th>Durum</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.reservationNumber}</td>
              <td>{r.roomTypeName}</td>
              <td>
                {r.customer.firstName} {r.customer.lastName}
              </td>
              <td>
                {cardLabel(r.customer.cardBrand, r.customer.cardNumber) ?? '—'}
                {r.customer.cardExpiry && (
                  <>
                    <br />
                    <span className="data-table__muted">SKT {r.customer.cardExpiry}</span>
                  </>
                )}
              </td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut}</td>
              <td>{r.guests}</td>
              <td>
                {r.totalPrice} {r.currency}
              </td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>
                <div className="data-table__actions">
                  {user?.role === 'HOTEL_ADMIN' && r.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        className="btn btn--small"
                        disabled={busyId === r.id}
                        onClick={() => handleAction(r.id, confirmReservation)}
                      >
                        Onayla
                      </button>
                      <button
                        type="button"
                        className="btn btn--small btn--danger"
                        disabled={busyId === r.id}
                        onClick={() => handleAction(r.id, rejectReservation)}
                      >
                        Reddet
                      </button>
                    </>
                  )}
                  {(user?.role === 'AGENCY_STAFF' || user?.role === 'AGENCY_ADMIN') &&
                    r.createdByUserId === user?.id &&
                    (r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                      <button
                        type="button"
                        className="btn btn--small btn--danger"
                        disabled={busyId === r.id}
                        onClick={() => handleAction(r.id, cancelReservation)}
                      >
                        İptal Et
                      </button>
                    )}
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={10} className="data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h2>Rezervasyonlar</h2>
        <div className="status-filter-bar">
          {(Object.keys(STATUS_LABELS) as Array<ReservationStatus | 'ALL'>).map((s) => (
            <button
              key={s}
              type="button"
              className={`btn btn--small${statusFilter === s ? ' btn--primary' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {STATUS_LABELS[s]}
              {s !== 'ALL' && reservations.data
                ? ` (${reservations.data.filter((r) => r.status === s).length})`
                : ''}
            </button>
          ))}
        </div>
      </div>

      {hotelOptions.length > 1 && (
        <label className="select-field select-field--hotel">
          <span>Otel</span>
          <select
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
          >
            <option value="ALL">Tüm Oteller ({statusFiltered.length})</option>
            {hotelOptions.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({statusFiltered.filter((r) => r.hotelId === h.id).length})
              </option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="form-error">{error}</p>}
      {reservations.loading && <LoadingState />}
      {reservations.error && <ErrorState message={reservations.error} />}

      {reservations.data &&
        (groups ? (
          groups.length === 0 ? (
            <p className="data-table__empty">{emptyMessage}</p>
          ) : (
            groups.map(({ hotel, items }) => (
              <div key={hotel.id} className="reservation-group">
                <h3 className="reservation-group__title">
                  {hotel.name}
                  <span className="reservation-group__count">{items.length}</span>
                </h3>
                {renderTable(items)}
              </div>
            ))
          )
        ) : (
          renderTable(filtered)
        ))}
    </div>
  )
}
