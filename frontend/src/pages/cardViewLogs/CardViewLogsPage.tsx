import { useEffect } from 'react'
import { listCardViewLogs, markCardViewLogsRead } from '../../api/cardViewLogs'
import { notifyCardViewRead } from '../../hooks/cardViewEvents'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

export function CardViewLogsPage() {
  const { t, lang } = useT()
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
        <h2>{t('cardViewLogs.title')}</h2>
      </div>
      <p className="data-table__muted">
        {t('cardViewLogs.subtitle')}
      </p>

      {logs.loading && <LoadingState />}
      {logs.error && <ErrorState message={logs.error} />}
      {logs.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('cardViewLogs.columnReservation')}</th>
                <th>{t('common.hotel')}</th>
                <th>{t('cardViewLogs.columnCustomer')}</th>
                <th>{t('cardViewLogs.columnViewedBy')}</th>
                <th>{t('cardViewLogs.columnTime')}</th>
              </tr>
            </thead>
            <tbody>
              {logs.data.map((log) => (
                <tr key={log.id}>
                  <td>{log.reservationNumber}</td>
                  <td>{log.hotelName}</td>
                  <td>{log.customerName}</td>
                  <td>{log.viewedByName}</td>
                  <td>{new Date(log.viewedAt).toLocaleString(lang)}</td>
                </tr>
              ))}
              {logs.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="data-table__empty">
                    {t('cardViewLogs.emptyState')}
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
