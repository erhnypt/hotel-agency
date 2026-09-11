import { listHotelSetupReminderLogs } from '../../api/hotelSetupReminderLogs'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function HotelSetupReminderLogsPage() {
  const logs = useAsync(listHotelSetupReminderLogs, [])

  return (
    <div>
      <div className="page-header">
        <h2>Kurulum Hatırlatma Logları</h2>
      </div>

      {logs.loading && <LoadingState />}
      {logs.error && <ErrorState message={logs.error} />}

      {logs.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Otel</th>
                <th>Alıcılar</th>
                <th>Gönderim Zamanı</th>
              </tr>
            </thead>
            <tbody>
              {logs.data.map((log) => (
                <tr key={log.id}>
                  <td>{log.hotelName}</td>
                  <td>{log.recipients}</td>
                  <td>{new Date(log.sentAt).toLocaleString('tr-TR')}</td>
                </tr>
              ))}
              {logs.data.length === 0 && (
                <tr>
                  <td colSpan={3} className="data-table__empty">
                    Henüz hatırlatma gönderilmedi.
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
