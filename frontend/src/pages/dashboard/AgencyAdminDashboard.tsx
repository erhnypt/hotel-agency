import { listHotels } from '../../api/hotels'
import { listReservations } from '../../api/reservations'
import { StatCard } from '../../components/StatCard'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'

export function AgencyAdminDashboard() {
  const hotels = useAsync(listHotels, [])
  const reservations = useAsync(listReservations, [])

  if (hotels.loading || reservations.loading) return <LoadingState />
  if (hotels.error) return <ErrorState message={hotels.error} />
  if (reservations.error) return <ErrorState message={reservations.error} />

  const hotelList = hotels.data ?? []
  const reservationList = reservations.data ?? []

  return (
    <div className="stat-grid">
      <StatCard label="Toplam Otel" value={hotelList.length} />
      <StatCard label="Aktif Otel" value={hotelList.filter((h) => h.status === 'ACTIVE').length} />
      <StatCard label="Bekleyen Otel" value={hotelList.filter((h) => h.status === 'PENDING').length} />
      <StatCard label="Toplam Rezervasyon" value={reservationList.length} />
      <StatCard
        label="Bekleyen Rezervasyon"
        value={reservationList.filter((r) => r.status === 'PENDING').length}
      />
      <StatCard
        label="Onaylanan Rezervasyon"
        value={reservationList.filter((r) => r.status === 'CONFIRMED').length}
      />
    </div>
  )
}
