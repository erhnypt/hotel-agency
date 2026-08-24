import axios from 'axios'
import { useState } from 'react'
import { cancelReservation, confirmReservation, listReservations, rejectReservation } from '../../api/reservations'
import type { ApiErrorResponse } from '../../auth/types'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function ReservationsPage() {
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reservations = useAsync(listReservations, [refreshKey])

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
      </div>

      {error && <p className="form-error">{error}</p>}
      {reservations.loading && <LoadingState />}
      {reservations.error && <ErrorState message={reservations.error} />}

      {reservations.data && (
        <div className="data-table-wrapper"><table className="data-table">
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
            {reservations.data.map((r) => (
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
                    {user?.role === 'AGENCY_STAFF' && (r.status === 'PENDING' || r.status === 'CONFIRMED') && (
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
            {reservations.data.length === 0 && (
              <tr>
                <td colSpan={10} className="data-table__empty">
                  Henüz rezervasyon yok.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      )}
    </div>
  )
}
