import { Link } from 'react-router-dom'
import { listReservations } from '../../api/reservations'
import { BoardSection, BoardStrip, ReservationMiniTable } from '../../components/Board'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import './AgencyStaffDashboard.css'

export function AgencyStaffDashboard() {
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
        <h2 className="staff-dashboard__title">Bugünün Panosu</h2>
        <Link to="/staff/reservations/new" className="btn btn--primary">
          + Yeni Rezervasyon
        </Link>
      </div>

      <BoardStrip
        items={[
          { label: 'Toplam Rezervasyonum', value: list.length, to: '/staff/reservations' },
          { label: 'Bekliyor', value: list.filter((r) => r.status === 'PENDING').length, to: '/staff/reservations' },
          {
            label: 'Onaylandı',
            value: list.filter((r) => r.status === 'CONFIRMED').length,
            to: '/staff/reservations',
          },
          {
            label: 'İptal Edildi',
            value: list.filter((r) => r.status === 'CANCELLED').length,
            to: '/staff/reservations',
          },
        ]}
      />

      <BoardSection title="Bugün Giriş" count={checkingInToday.length}>
        <ReservationMiniTable items={checkingInToday} emptyLabel="Bugün giriş yapacak rezervasyon yok." />
      </BoardSection>

      <BoardSection title="Bugün Çıkış" count={checkingOutToday.length}>
        <ReservationMiniTable items={checkingOutToday} emptyLabel="Bugün çıkış yapacak rezervasyon yok." />
      </BoardSection>

      <BoardSection title="Önümüzdeki 7 Gün" count={upcoming.length}>
        <ReservationMiniTable items={upcoming} emptyLabel="Önümüzdeki 7 günde giriş yok." />
      </BoardSection>

      <BoardSection title="Son Rezervasyonlar" count={recent.length}>
        <ReservationMiniTable items={recent} emptyLabel="Henüz rezervasyon yok." />
      </BoardSection>
    </div>
  )
}
