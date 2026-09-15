import { Link } from 'react-router-dom'
import { listHotels } from '../../api/hotels'
import { listReservations } from '../../api/reservations'
import { BoardSection, BoardStrip, ReservationMiniTable } from '../../components/Board'
import { ErrorState, LoadingState } from '../../components/PageState'
import { StatusBadge } from '../../components/StatusBadge'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

export function AgencyAdminDashboard() {
  const { t } = useT()
  const hotels = useAsync(listHotels, [])
  const reservations = useAsync(listReservations, [])

  if (hotels.loading || reservations.loading) return <LoadingState />
  if (hotels.error) return <ErrorState message={hotels.error} />
  if (reservations.error) return <ErrorState message={reservations.error} />

  const hotelList = hotels.data ?? []
  const list = reservations.data ?? []
  const pendingHotels = hotelList.filter((h) => h.status === 'PENDING')

  const today = new Date().toISOString().slice(0, 10)
  const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)

  const checkingInToday = list.filter((r) => r.status === 'CONFIRMED' && r.checkIn === today)
  const checkingOutToday = list.filter((r) => r.status === 'CONFIRMED' && r.checkOut === today)
  const upcoming = list
    .filter((r) => r.status === 'CONFIRMED' && r.checkIn > today && r.checkIn <= weekAhead)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 24 }}>{t('dashboard.todaysBoard')}</h2>

      <BoardStrip
        items={[
          { label: t('dashboard.totalHotels'), value: hotelList.length, to: '/admin/hotels' },
          {
            label: t('dashboard.activeHotels'),
            value: hotelList.filter((h) => h.status === 'ACTIVE').length,
            to: '/admin/hotels',
          },
          { label: t('dashboard.pendingHotels'), value: pendingHotels.length, to: '/admin/hotels' },
          { label: t('dashboard.totalReservations'), value: list.length, to: '/admin/reservations' },
          {
            label: t('dashboard.pendingReservations'),
            value: list.filter((r) => r.status === 'PENDING').length,
            to: '/admin/reservations',
          },
        ]}
      />

      {pendingHotels.length > 0 && (
        <BoardSection title={t('dashboard.hotelsAwaitingApproval')} count={pendingHotels.length}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.hotel')}</th>
                  <th>{t('common.city')}</th>
                  <th>{t('common.status')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendingHotels.map((h) => (
                  <tr key={h.id}>
                    <td>{h.name}</td>
                    <td>
                      {h.city}, {h.country}
                    </td>
                    <td>
                      <StatusBadge status={h.status} />
                    </td>
                    <td>
                      <Link to={`/admin/hotels/${h.id}`} className="btn btn--small">
                        {t('common.review')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BoardSection>
      )}

      <BoardSection title={t('dashboard.checkingInToday')} count={checkingInToday.length}>
        <ReservationMiniTable items={checkingInToday} emptyLabel={t('dashboard.noCheckInsToday')} />
      </BoardSection>

      <BoardSection title={t('dashboard.checkingOutToday')} count={checkingOutToday.length}>
        <ReservationMiniTable items={checkingOutToday} emptyLabel={t('dashboard.noCheckOutsToday')} />
      </BoardSection>

      <BoardSection title={t('dashboard.next7Days')} count={upcoming.length}>
        <ReservationMiniTable items={upcoming} emptyLabel={t('dashboard.noUpcomingCheckIns')} />
      </BoardSection>
    </div>
  )
}
