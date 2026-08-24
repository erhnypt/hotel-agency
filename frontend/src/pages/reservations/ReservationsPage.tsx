import axios from 'axios'
import { useState, useMemo } from 'react'
import { cancelReservation, confirmReservation, listReservations, rejectReservation } from '../../api/reservations'
import type { ReservationStatus } from '../../api/types'
import type { ApiErrorResponse } from '../../auth/types'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

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

  const reservations = useAsync(listReservations, [refreshKey])

  const filtered = useMemo(() => {
    if (!reservations.data) return []
    if (statusFilter === 'ALL') return reservations.data
    return reservations.data.filter((r) => r.status === statusFilter)
  }, [reservations.data, statusFilter])

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

  return (
    <div>
      <div className="page-header">
        <h2>Rezervasyonlar</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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

      {error && <p className="form-error">{error}</p>}
      {reservations.loading && <LoadingState />}
      {reservations.error && <ErrorState message={reservations.error} />}

      {reservations.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Otel</th>
                <th>Oda Tipi</th>
                <th>Müşteri</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Misafir</th>
                <th>Toplam</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.reservationNumber}</td>
                  <td>{r.hotelName}</td>
                  <td>{r.roomTypeName}</td>
                  <td>
                    {r.customer.firstName} {r.customer.lastName}
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="data-table__empty">
                    {statusFilter === 'ALL'
                      ? 'Henüz rezervasyon yok.'
                      : `"${STATUS_LABELS[statusFilter]}" durumunda rezervasyon yok.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
