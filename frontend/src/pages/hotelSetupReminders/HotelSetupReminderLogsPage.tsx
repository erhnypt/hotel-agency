import axios from 'axios'
import { useState } from 'react'
import {
  listHotelSetupReminderLogs,
  listIncompleteHotels,
  sendManualSetupReminder,
} from '../../api/hotelSetupReminderLogs'
import type { ApiErrorResponse } from '../../auth/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

export function HotelSetupReminderLogsPage() {
  const { t, lang } = useT()
  const [refreshKey, setRefreshKey] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const incompleteHotels = useAsync(listIncompleteHotels, [refreshKey])
  const logs = useAsync(listHotelSetupReminderLogs, [refreshKey])

  const refresh = () => setRefreshKey((key) => key + 1)

  const handleSend = async (hotelId: number) => {
    setError(null)
    setBusyId(hotelId)
    try {
      await sendManualSetupReminder(hotelId)
      refresh()
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError(t('setupReminders.sendError'))
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>{t('setupReminders.title')}</h2>
      </div>

      {error && <p className="form-error">{error}</p>}

      <h3>{t('setupReminders.incompleteHotelsTitle')}</h3>
      {incompleteHotels.loading && <LoadingState />}
      {incompleteHotels.error && <ErrorState message={incompleteHotels.error} />}
      {incompleteHotels.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.hotel')}</th>
                <th>{t('common.email')}</th>
                <th>{t('setupReminders.approvalDate')}</th>
                <th>{t('setupReminders.lastReminder')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {incompleteHotels.data.map((hotel) => (
                <tr key={hotel.hotelId}>
                  <td>{hotel.hotelName}</td>
                  <td>{hotel.hotelEmail}</td>
                  <td>{hotel.approvedAt ? new Date(hotel.approvedAt).toLocaleString(lang) : '—'}</td>
                  <td>
                    {hotel.lastReminderSentAt
                      ? new Date(hotel.lastReminderSentAt).toLocaleString(lang)
                      : '—'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--small btn--primary"
                      disabled={busyId === hotel.hotelId}
                      onClick={() => handleSend(hotel.hotelId)}
                    >
                      {t('setupReminders.sendButton')}
                    </button>
                  </td>
                </tr>
              ))}
              {incompleteHotels.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="data-table__empty">
                    {t('setupReminders.noIncompleteHotels')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <h3>{t('setupReminders.logsTitle')}</h3>
      {logs.loading && <LoadingState />}
      {logs.error && <ErrorState message={logs.error} />}
      {logs.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.hotel')}</th>
                <th>{t('setupReminders.recipients')}</th>
                <th>{t('setupReminders.sentAt')}</th>
              </tr>
            </thead>
            <tbody>
              {logs.data.map((log) => (
                <tr key={log.id}>
                  <td>{log.hotelName}</td>
                  <td>{log.recipients}</td>
                  <td>{new Date(log.sentAt).toLocaleString(lang)}</td>
                </tr>
              ))}
              {logs.data.length === 0 && (
                <tr>
                  <td colSpan={3} className="data-table__empty">
                    {t('setupReminders.noLogs')}
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
