import { Link } from 'react-router-dom'
import { listReservations } from '../../api/reservations'
import { StatCard } from '../../components/StatCard'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import './AgencyStaffDashboard.css'

export function AgencyStaffDashboard() {
  const reservations = useAsync(listReservations, [])

  if (reservations.loading) return <LoadingState />
  if (reservations.error) return <ErrorState message={reservations.error} />

  const reservationList = reservations.data ?? []

  return (
    <div>
      <Link to="/staff/reservations/new" className="staff-dashboard__cta">
        + Yeni Rezervasyon
      </Link>

      <div className="stat-grid">
        <StatCard label="Toplam Rezervasyonum" value={reservationList.length} />
        <StatCard
          label="Bekleyen"
          value={reservationList.filter((r) => r.status === 'PENDING').length}
        />
        <StatCard
          label="Onaylanan"
          value={reservationList.filter((r) => r.status === 'CONFIRMED').length}
        />
        <StatCard
          label="İptal Edilen"
          value={reservationList.filter((r) => r.status === 'CANCELLED').length}
        />
      </div>
    </div>
  )
}
