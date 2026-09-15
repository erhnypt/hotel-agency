import { Link } from 'react-router-dom'
import { listReservations } from '../../api/reservations'
import { BoardSection, BoardStrip, ReservationMiniTable } from '../../components/Board'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import './AgencyStaffDashboard.css'

export function AgencyStaffDashboard() {
  const { t } = useT()
  const reservations = useAsync(listReservations, [])

  if (reservations.loading) return <LoadingState />
  if (reservations.error) return <ErrorState message={reservations.error} />

  const list = reservations.data ?? []
  const today = new Date().toISOString().slice(0, 10)
  const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)

  const checkingInToday = list.filter((r) => r.status === 'CONFIRMED' && r.checkIn === today)
  const checkingOutToday = list.filter((r) => r.status === 'CONFIRMED' && r.checkOut === today)
  const upcoming = list
    .filter((r) => r.status === 'CONFIRMED' && r.checkIn > today && r.checkIn <= weekAhead)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
  const recent = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <div>
      <div className="staff-dashboard__head">
        <h2 className="staff-dashboard__title">{t('dashboard.todaysBoard')}</h2>
        <Link to="/staff/reservations/new" className="btn btn--primary">
          {t('dashboard.newReservation')}
        </Link>
      </div>

      <BoardStrip
        items={[
          { label: t('dashboard.myTotalReservations'), value: list.length, to: '/staff/reservations' },
          {
            label: t('status.pending'),
            value: list.filter((r) => r.status === 'PENDING').length,
            to: '/staff/reservations',
          },
          {
            label: t('status.confirmed'),
            value: list.filter((r) => r.status === 'CONFIRMED').length,
            to: '/staff/reservations',
          },
          {
            label: t('status.cancelled'),
            value: list.filter((r) => r.status === 'CANCELLED').length,
            to: '/staff/reservations',
          },
        ]}
      />

      <BoardSection title={t('dashboard.checkingInToday')} count={checkingInToday.length}>
        <ReservationMiniTable items={checkingInToday} emptyLabel={t('dashboard.noCheckInsToday')} />
      </BoardSection>

      <BoardSection title={t('dashboard.checkingOutToday')} count={checkingOutToday.length}>
        <ReservationMiniTable items={checkingOutToday} emptyLabel={t('dashboard.noCheckOutsToday')} />
      </BoardSection>

      <BoardSection title={t('dashboard.next7Days')} count={upcoming.length}>
        <ReservationMiniTable items={upcoming} emptyLabel={t('dashboard.noUpcomingCheckIns')} />
      </BoardSection>

      <BoardSection title={t('dashboard.recentReservations')} count={recent.length}>
        <ReservationMiniTable items={recent} emptyLabel={t('dashboard.noReservationsYet')} />
      </BoardSection>
    </div>
  )
}
