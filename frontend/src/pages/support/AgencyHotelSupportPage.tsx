import { Link, useParams } from 'react-router-dom'
import { getHotel } from '../../api/hotels'
import { ErrorState, LoadingState } from '../../components/PageState'
import { SupportChatThread } from '../../components/SupportChatThread'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../auth/useAuth'
import { useT } from '../../i18n/useT'

export function AgencyHotelSupportPage() {
  const { t } = useT()
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
        <h2>{hotel.data ? t('hotelSupport.titleWithHotel', { hotelName: hotel.data.name }) : t('hotelSupport.title')}</h2>
        <Link to={backPath} className="btn btn--small">
          {t('hotelSupport.backToHotels')}
        </Link>
      </div>
      {hotel.data && <SupportChatThread hotelId={hotel.data.id} />}
    </div>
  )
}
