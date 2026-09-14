import { useEffect } from 'react'
import { listCardViewLogs, markCardViewLogsRead } from '../../api/cardViewLogs'
import { notifyCardViewRead } from '../../hooks/cardViewEvents'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function CardViewLogsPage() {
  const logs = useAsync(listCardViewLogs, [])

  useEffect(() => {
    markCardViewLogsRead()
      .then(notifyCardViewRead)
      .catch(() => {
        // Best-effort — the badge just stays lit until the next successful mark-read.
      })
  }, [])

  return (
    <div>
      <div className="page-header">
        <h2>Kart Görüntüleme Bildirimleri</h2>
      </div>
      <p className="data-table__muted">
        Bir otel bir rezervasyonun kart bilgilerini görüntülediğinde burada listelenir.
      </p>

      {logs.loading && <LoadingState />}
      {logs.error && <ErrorState message={logs.error} />}
      {logs.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rezervasyon</th>
                <th>Otel</th>
                <th>Müşteri</th>
                <th>Görüntüleyen</th>
                <th>Zaman</th>
              </tr>
            </thead>
            <tbody>
              {logs.data.map((log) => (
                <tr key={log.id}>
                  <td>{log.reservationNumber}</td>
                  <td>{log.hotelName}</td>
                  <td>{log.customerName}</td>
                  <td>{log.viewedByName}</td>
                  <td>{new Date(log.viewedAt).toLocaleString('tr-TR')}</td>
                </tr>
              ))}
              {logs.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="data-table__empty">
                    Henüz kart görüntüleme kaydı yok.
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
