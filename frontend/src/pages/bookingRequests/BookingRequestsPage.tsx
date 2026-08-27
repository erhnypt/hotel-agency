import { useState } from 'react'
import { listBookingRequests, updateBookingRequestStatus } from '../../api/bookingRequests'
import type { BookingRequestResponse, BookingRequestStatus } from '../../api/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

const NEXT_ACTIONS: Record<BookingRequestStatus, { label: string; to: BookingRequestStatus }[]> = {
  NEW: [{ label: 'İşleme al', to: 'IN_PROGRESS' }, { label: 'Kapat', to: 'CLOSED' }],
  IN_PROGRESS: [{ label: 'Kapat', to: 'CLOSED' }, { label: 'Yeniye al', to: 'NEW' }],
  CLOSED: [{ label: 'Yeniden aç', to: 'IN_PROGRESS' }],
}

export function BookingRequestsPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)
  const requests = useAsync(listBookingRequests, [refreshKey])

  const refresh = () => setRefreshKey((k) => k + 1)

  const changeStatus = async (req: BookingRequestResponse, to: BookingRequestStatus) => {
    setBusyId(req.id)
    try {
      await updateBookingRequestStatus(req.id, to)
      refresh()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Talepler</h2>
      </div>
      <p className="page-state">
        Ana sayfadaki otel aramasından gelen rezervasyon talepleri. İnceleyip müşteriyle iletişime geçin.
      </p>

      {requests.loading && <LoadingState />}
      {requests.error && <ErrorState message={requests.error} />}

      {requests.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Otel</th>
                <th>Destinasyon</th>
                <th>Konaklama</th>
                <th>Misafir</th>
                <th>İletişim</th>
                <th>Not</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.data.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td>
                    {r.propertyName}
                    <br />
                    <span className="data-table__muted">{r.hotelType}</span>
                  </td>
                  <td>{r.countryName ?? '—'}</td>
                  <td>
                    {r.checkIn} → {r.checkOut}
                  </td>
                  <td>{r.guests}</td>
                  <td>
                    {r.contactName}
                    <br />
                    <span className="data-table__muted">{r.contactEmail}</span>
                    <br />
                    <span className="data-table__muted">{r.contactPhone}</span>
                  </td>
                  <td className="data-table__wrap">{r.message ?? '—'}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    <div className="data-table__actions">
                      {NEXT_ACTIONS[r.status].map((a) => (
                        <button
                          key={a.to}
                          type="button"
                          className="btn btn--small"
                          disabled={busyId === r.id}
                          onClick={() => changeStatus(r, a.to)}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {requests.data.length === 0 && (
                <tr>
                  <td colSpan={9} className="data-table__empty">
                    Henüz talep yok.
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
