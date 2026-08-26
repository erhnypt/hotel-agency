import { getMyHotel } from '../api/hotels'
import { useAuth } from '../auth/useAuth'
import { BrandMark } from '../components/BrandMark'
import { ErrorState, LoadingState } from '../components/PageState'
import { useAsync } from '../hooks/useAsync'
import { AppShell } from './AppShell'
import type { MenuItem } from './menus'
import '../pages/LoginPage.css'

const STATUS_COPY: Record<'PENDING' | 'REJECTED', { title: string; body: string }> = {
  PENDING: {
    title: 'Başvurunuz İnceleniyor',
    body: 'Otel kaydınız acente ekibimiz tarafından incelenmektedir. Onaylandığında panel erişiminiz açılacak ve size e-posta ile bilgi verilecektir.',
  },
  REJECTED: {
    title: 'Başvurunuz Reddedildi',
    body: 'Otel başvurunuz acente tarafından reddedilmiştir. Detaylı bilgi için acente ile iletişime geçebilirsiniz.',
  },
}

export function HotelAccessGate({ panelTitle, menu }: { panelTitle: string; menu: MenuItem[] }) {
  const { logout } = useAuth()
  const hotel = useAsync(getMyHotel, [])

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  if (hotel.data && hotel.data.status !== 'ACTIVE') {
    const copy = STATUS_COPY[hotel.data.status as 'PENDING' | 'REJECTED']
    return (
      <div className="login-page">
        <div className="login-card">
          <BrandMark size={40} className="login-card__mark" />
          <h1 className="login-card__title">{copy.title}</h1>
          <p className="login-card__subtitle">{copy.body}</p>
          <button type="button" className="login-card__submit" onClick={logout}>
            Çıkış Yap
          </button>
        </div>
      </div>
    )
  }

  return <AppShell panelTitle={panelTitle} menu={menu} />
}
