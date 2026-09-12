import { Link, useParams } from 'react-router-dom'
import { getHotel } from '../../api/hotels'
import { ErrorState, LoadingState } from '../../components/PageState'
import { SupportChatThread } from '../../components/SupportChatThread'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../auth/useAuth'

export function AgencyHotelSupportPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const { user } = useAuth()
  const id = Number(hotelId)

  const hotel = useAsync(() => getHotel(id), [id])

  const backPath = user?.role === 'AGENCY_ADMIN' ? '/admin/hotels' : '/staff/hotels'

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  return (
    <div>
      <div className="page-header">
        <h2>{hotel.data ? `${hotel.data.name} — Destek` : 'Destek'}</h2>
        <Link to={backPath} className="btn btn--small">
          Otellere Dön
        </Link>
      </div>
      {hotel.data && <SupportChatThread hotelId={hotel.data.id} />}
    </div>
  )
}
