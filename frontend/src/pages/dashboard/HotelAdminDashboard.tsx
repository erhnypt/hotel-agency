import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { listReservations } from '../../api/reservations'
import { BoardSection, BoardStrip, ReservationMiniTable } from '../../components/Board'
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
  const list = reservations.data ?? []
  const totalRooms = roomTypeList.reduce((sum, roomType) => sum + roomType.numberOfRooms, 0)
  const today = new Date().toISOString().slice(0, 10)
  const weekAhead = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)

  const pending = list.filter((r) => r.status === 'PENDING')
  const checkingInToday = list.filter((r) => r.status === 'CONFIRMED' && r.checkIn === today)
  const checkingOutToday = list.filter((r) => r.status === 'CONFIRMED' && r.checkOut === today)
  const upcoming = list
    .filter((r) => r.status === 'CONFIRMED' && r.checkIn > today && r.checkIn <= weekAhead)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))

  return (
    <div>
      <h2 className="hotel-dashboard__hotel-name">{hotel.data?.name}</h2>

      <BoardStrip
        items={[
          { label: 'Oda Tipi', value: roomTypeList.length, to: '/hotel/rooms' },
          { label: 'Toplam Oda', value: totalRooms, to: '/hotel/rooms' },
          { label: 'Onay Bekliyor', value: pending.length, to: '/hotel/reservations' },
          {
            label: 'Onaylandı',
            value: list.filter((r) => r.status === 'CONFIRMED').length,
            to: '/hotel/reservations',
          },
        ]}
      />

      {pending.length > 0 && (
        <BoardSection title="Onay Bekleyen Rezervasyonlar" count={pending.length}>
          <ReservationMiniTable items={pending} showHotel={false} emptyLabel="" />
        </BoardSection>
      )}

      <BoardSection title="Bugün Giriş" count={checkingInToday.length}>
        <ReservationMiniTable items={checkingInToday} showHotel={false} emptyLabel="Bugün giriş yapacak rezervasyon yok." />
      </BoardSection>

      <BoardSection title="Bugün Çıkış" count={checkingOutToday.length}>
        <ReservationMiniTable
          items={checkingOutToday}
          showHotel={false}
          emptyLabel="Bugün çıkış yapacak rezervasyon yok."
        />
      </BoardSection>

      <BoardSection title="Önümüzdeki 7 Gün" count={upcoming.length}>
        <ReservationMiniTable items={upcoming} showHotel={false} emptyLabel="Önümüzdeki 7 günde giriş yok." />
      </BoardSection>
    </div>
  )
}
