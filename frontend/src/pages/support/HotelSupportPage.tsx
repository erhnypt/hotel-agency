import { getMyHotel } from '../../api/hotels'
import { ErrorState, LoadingState } from '../../components/PageState'
import { SupportChatThread } from '../../components/SupportChatThread'
import { useAsync } from '../../hooks/useAsync'

export function HotelSupportPage() {
  const hotel = useAsync(getMyHotel, [])

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  return (
    <div>
      <div className="page-header">
        <h2>Destek</h2>
      </div>
      {hotel.data && <SupportChatThread hotelId={hotel.data.id} />}
    </div>
  )
}
