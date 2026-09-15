import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { listReservations } from '../../api/reservations'
import { BoardSection, BoardStrip, ReservationMiniTable } from '../../components/Board'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import './HotelAdminDashboard.css'

export function HotelAdminDashboard() {
  const { t } = useT()
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
          { label: t('common.roomType'), value: roomTypeList.length, to: '/hotel/rooms' },
          { label: t('dashboard.totalRooms'), value: totalRooms, to: '/hotel/rooms' },
          { label: t('dashboard.pendingApproval'), value: pending.length, to: '/hotel/reservations' },
          {
            label: t('status.confirmed'),
            value: list.filter((r) => r.status === 'CONFIRMED').length,
            to: '/hotel/reservations',
          },
        ]}
      />

      {pending.length > 0 && (
        <BoardSection title={t('dashboard.reservationsAwaitingApproval')} count={pending.length}>
          <ReservationMiniTable items={pending} showHotel={false} emptyLabel="" />
        </BoardSection>
      )}

      <BoardSection title={t('dashboard.checkingInToday')} count={checkingInToday.length}>
        <ReservationMiniTable
          items={checkingInToday}
          showHotel={false}
          emptyLabel={t('dashboard.noCheckInsToday')}
        />
      </BoardSection>

      <BoardSection title={t('dashboard.checkingOutToday')} count={checkingOutToday.length}>
        <ReservationMiniTable
          items={checkingOutToday}
          showHotel={false}
          emptyLabel={t('dashboard.noCheckOutsToday')}
        />
      </BoardSection>

      <BoardSection title={t('dashboard.next7Days')} count={upcoming.length}>
        <ReservationMiniTable items={upcoming} showHotel={false} emptyLabel={t('dashboard.noUpcomingCheckIns')} />
      </BoardSection>
    </div>
  )
}
