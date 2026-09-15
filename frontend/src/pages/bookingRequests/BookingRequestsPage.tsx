import { useState } from 'react'
import { listBookingRequests, updateBookingRequestStatus } from '../../api/bookingRequests'
import type { BookingRequestResponse, BookingRequestStatus } from '../../api/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

export function BookingRequestsPage() {
  const { t, lang } = useT()
  const [refreshKey, setRefreshKey] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)
  const requests = useAsync(listBookingRequests, [refreshKey])

  const NEXT_ACTIONS: Record<BookingRequestStatus, { label: string; to: BookingRequestStatus }[]> = {
    NEW: [
      { label: t('bookingRequests.actionStart'), to: 'IN_PROGRESS' },
      { label: t('bookingRequests.actionClose'), to: 'CLOSED' },
    ],
    IN_PROGRESS: [
      { label: t('bookingRequests.actionClose'), to: 'CLOSED' },
      { label: t('bookingRequests.actionReopenNew'), to: 'NEW' },
    ],
    CLOSED: [{ label: t('bookingRequests.actionReopen'), to: 'IN_PROGRESS' }],
  }

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
        <h2>{t('bookingRequests.title')}</h2>
      </div>
      <p className="page-state">
        {t('bookingRequests.subtitle')}
      </p>

      {requests.loading && <LoadingState />}
      {requests.error && <ErrorState message={requests.error} />}

      {requests.data && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('bookingRequests.columnDate')}</th>
                <th>{t('common.hotel')}</th>
                <th>{t('bookingRequests.columnCityCountry')}</th>
                <th>{t('bookingRequests.columnStay')}</th>
                <th>{t('common.guest')}</th>
                <th>{t('bookingRequests.columnContact')}</th>
                <th>{t('bookingRequests.columnNote')}</th>
                <th>{t('common.status')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.data.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleDateString(lang)}</td>
                  <td>
                    {r.propertyName}
                    <br />
                    <span className="data-table__muted">{r.hotelType}</span>
                    {r.roomTypeName && (
                      <>
                        <br />
                        <span className="data-table__muted">{r.roomTypeName}</span>
                      </>
                    )}
                  </td>
                  <td>
                    {r.propertyCity ?? '—'}
                    {r.countryName && (
                      <>
                        <br />
                        <span className="data-table__muted">{r.countryName}</span>
                      </>
                    )}
                  </td>
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
                    {t('bookingRequests.emptyState')}
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
