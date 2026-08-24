import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { listReservations } from '../../api/reservations'
import { StatCard } from '../../components/StatCard'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import './HotelAdminDashboard.css'

export function HotelAdminDashboard() {
  const hotel = useAsync(getMyHotel, [])
  const roomTypes = useAsync(
    () => (hotel.data ? listRoomTypes(hotel.data.id) : Promise.resolve([])),
    [hotel.data?.id],
  )
  const reservations = useAsync(listReservations, [])

  if (hotel.loading || reservations.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />
  if (reservations.error) return <ErrorState message={reservations.error} />

  const roomTypeList = roomTypes.data ?? []
  const reservationList = reservations.data ?? []
  const totalRooms = roomTypeList.reduce((sum, roomType) => sum + roomType.numberOfRooms, 0)
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = reservationList.filter((r) => r.status === 'CONFIRMED' && r.checkIn >= today).length

  return (
    <div>
      <h2 className="hotel-dashboard__hotel-name">{hotel.data?.name}</h2>
      <div className="stat-grid">
        <StatCard label="Oda Tipi Sayısı" value={roomTypeList.length} />
        <StatCard label="Toplam Oda" value={totalRooms} />
        <StatCard
          label="Bekleyen Rezervasyon"
          value={reservationList.filter((r) => r.status === 'PENDING').length}
        />
        <StatCard
          label="Onaylanan Rezervasyon"
          value={reservationList.filter((r) => r.status === 'CONFIRMED').length}
        />
        <StatCard label="Yaklaşan Rezervasyon" value={upcoming} />
      </div>
    </div>
  )
}
