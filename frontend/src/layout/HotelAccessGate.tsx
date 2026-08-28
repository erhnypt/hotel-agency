import { getMyHotel } from '../api/hotels'
import { useAuth } from '../auth/useAuth'
import { BrandMark } from '../components/BrandMark'
import { ErrorState, LoadingState } from '../components/PageState'
import { useAsync } from '../hooks/useAsync'
import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { useT } from '../i18n/useT'
import { AppShell } from './AppShell'
import type { MenuItem } from './menus'
import '../pages/LoginPage.css'

export function HotelAccessGate({ panelTitleKey, menu }: { panelTitleKey: string; menu: MenuItem[] }) {
  const { logout } = useAuth()
  const { t } = useT()
  const hotel = useAsync(getMyHotel, [])

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  if (hotel.data && hotel.data.status !== 'ACTIVE') {
    const rejected = hotel.data.status === 'REJECTED'
    return (
      <div className="login-page">
        <div className="login-page__lang">
          <LanguageSwitcher />
        </div>
        <div className="login-card">
          <BrandMark size={40} className="login-card__mark" />
          <h1 className="login-card__title">{t(rejected ? 'gate.rejectedTitle' : 'gate.pendingTitle')}</h1>
          <p className="login-card__subtitle">{t(rejected ? 'gate.rejectedBody' : 'gate.pendingBody')}</p>
          <button type="button" className="login-card__submit" onClick={logout}>
            {t('shell.logout')}
          </button>
        </div>
      </div>
    )
  }

  return <AppShell panelTitleKey={panelTitleKey} menu={menu} />
}
