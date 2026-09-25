import axios from 'axios'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  approveHotel,
  deactivateHotel,
  deleteHotel,
  listHotels,
  reactivateHotel,
  rejectHotel,
} from '../../api/hotels'
import type { HotelResponse, HotelStatus } from '../../api/types'
import type { ApiErrorResponse } from '../../auth/types'
import { useAuth } from '../../auth/useAuth'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import { useSupportUnread } from '../../hooks/useSupportUnread'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'
import './HotelsPage.css'

const STATUS_ORDER: HotelStatus[] = ['PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED']

export function HotelsPage() {
  const { t } = useT()
  const { user } = useAuth()
  const isAdmin = user?.role === 'AGENCY_ADMIN'

  const [refreshKey, setRefreshKey] = useState(0)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const hotels = useAsync(listHotels, [refreshKey])
  const { unreadHotelIds } = useSupportUnread()
  const hotelsBasePath = isAdmin ? '/admin/hotels' : '/staff/hotels'

  const STATUS_LABELS: Record<HotelStatus, string> = {
    PENDING: t('status.pending'),
    ACTIVE: t('status.active'),
    INACTIVE: t('status.inactive'),
    REJECTED: t('status.rejected'),
  }

  const groups = useMemo(() => {
    if (!hotels.data) return []
    const byStatus = new Map<HotelStatus, HotelResponse[]>()
    for (const hotel of hotels.data) {
      const list = byStatus.get(hotel.status) ?? []
      list.push(hotel)
      byStatus.set(hotel.status, list)
    }
    return STATUS_ORDER.filter((status) => byStatus.has(status)).map((status) => ({
      status,
      items: byStatus.get(status)!,
    }))
  }, [hotels.data])

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
        setError(t('hotels.actionFailed'))
      }
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(t('hotels.deleteConfirm', { name }))) {
      return
    }
    handleDecision(id, deleteHotel)
  }

  const renderTable = (items: HotelResponse[]) => (
    <div className="data-table-wrapper"><table className="data-table">
      <thead>
        <tr>
          <th>{t('common.hotel')}</th>
          <th>{t('common.city')}</th>
          <th>{t('hotels.columnContact')}</th>
          <th>{t('common.status')}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((hotel) => (
          <tr key={hotel.id}>
            <td>{hotel.name}</td>
            <td>
              {hotel.city}, {hotel.country}
            </td>
            <td>{hotel.email}</td>
            <td>
              <StatusBadge status={hotel.status} />
            </td>
            <td>
              <div className="data-table__actions">
                <Link to={`${hotelsBasePath}/${hotel.id}`} className="btn btn--small">
                  {t('hotels.detailLink')}
                </Link>
                {isAdmin && hotel.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      className="btn btn--small"
                      disabled={busyId === hotel.id}
                      onClick={() => handleDecision(hotel.id, approveHotel)}
                    >
                      {t('common.confirm')}
                    </button>
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      disabled={busyId === hotel.id}
                      onClick={() => handleDecision(hotel.id, rejectHotel)}
                    >
                      {t('common.reject')}
                    </button>
                  </>
                )}
                {isAdmin && hotel.status === 'ACTIVE' && (
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    disabled={busyId === hotel.id}
                    onClick={() => handleDecision(hotel.id, deactivateHotel)}
                  >
                    {t('hotels.deactivateButton')}
                  </button>
                )}
                {isAdmin && hotel.status === 'INACTIVE' && (
                  <button
                    type="button"
                    className="btn btn--small"
                    disabled={busyId === hotel.id}
                    onClick={() => handleDecision(hotel.id, reactivateHotel)}
                  >
                    {t('hotels.activateButton')}
                  </button>
                )}
                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    disabled={busyId === hotel.id}
                    onClick={() => handleDelete(hotel.id, hotel.name)}
                  >
                    {t('common.delete')}
                  </button>
                )}
                <Link to={`${hotelsBasePath}/${hotel.id}/support`} className="btn btn--small">
                  {t('hotels.supportLink')}
                  {unreadHotelIds.includes(hotel.id) && (
                    <span className="badge-dot" aria-label={t('hotels.newMessageAriaLabel')} />
                  )}
                </Link>
              </div>
            </td>
          </tr>
        ))}
        {items.length === 0 && (
          <tr>
            <td colSpan={5} className="data-table__empty">
              {t('hotels.noHotels')}
            </td>
          </tr>
        )}
      </tbody>
    </table></div>
  )

  return (
    <div>
      <div className="page-header">
        <h2>{t('hotels.title')}</h2>
      </div>

      {error && <p className="form-error">{error}</p>}
      {hotels.loading && <LoadingState />}
      {hotels.error && <ErrorState message={hotels.error} />}

      {hotels.data &&
        (groups.length === 0 ? (
          <p className="data-table__empty">{t('hotels.noHotels')}</p>
        ) : (
          groups.map(({ status, items }) => (
            <div key={status} className="hotel-status-group">
              <h3 className="hotel-status-group__title">
                {STATUS_LABELS[status]}
                <span className="hotel-status-group__count">{items.length}</span>
              </h3>
              {renderTable(items)}
            </div>
          ))
        ))}
    </div>
  )
}
