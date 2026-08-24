import axios from 'axios'
import { useState } from 'react'
import { approveHotel, listHotels, rejectHotel } from '../../api/hotels'
import type { ApiErrorResponse } from '../../auth/types'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function HotelsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'AGENCY_ADMIN'

  const [refreshKey, setRefreshKey] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const hotels = useAsync(listHotels, [refreshKey])

  const handleDecision = async (id: number, decide: (id: number) => Promise<unknown>) => {
    setError(null)
    setBusyId(id)
    try {
      await decide(id)
      setRefreshKey((key) => key + 1)
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
        <h2>Oteller</h2>
      </div>

      {error && <p className="form-error">{error}</p>}
      {hotels.loading && <LoadingState />}
      {hotels.error && <ErrorState message={hotels.error} />}

      {hotels.data && (
        <div className="data-table-wrapper"><table className="data-table">
          <thead>
            <tr>
              <th>Otel</th>
              <th>Şehir</th>
              <th>İletişim</th>
              <th>Durum</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {hotels.data.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>
                  {hotel.city}, {hotel.country}
                </td>
                <td>{hotel.email}</td>
                <td>
                  <StatusBadge status={hotel.status} />
                </td>
                {isAdmin && (
                  <td>
                    {hotel.status === 'PENDING' && (
                      <div className="data-table__actions">
                        <button
                          type="button"
                          className="btn btn--small"
                          disabled={busyId === hotel.id}
                          onClick={() => handleDecision(hotel.id, approveHotel)}
                        >
                          Onayla
                        </button>
                        <button
                          type="button"
                          className="btn btn--small btn--danger"
                          disabled={busyId === hotel.id}
                          onClick={() => handleDecision(hotel.id, rejectHotel)}
                        >
                          Reddet
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {hotels.data.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="data-table__empty">
                  Henüz otel yok.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      )}
    </div>
  )
}
