import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { useSupportUnread } from '../hooks/useSupportUnread'
import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { useT } from '../i18n/useT'
import type { MenuItem } from './menus'
import './AppShell.css'

export function AppShell({ panelTitleKey, menu }: { panelTitleKey: string; menu: MenuItem[] }) {
  const { user, logout } = useAuth()
  const { t } = useT()
  const { hotelUnread, unreadHotelIds } = useSupportUnread()

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          Travel Sites
          <small>{t('shell.tagline')}</small>
        </div>
        <nav className="app-shell__nav">
          {menu.map((item) => {
            const showBadge =
              (item.path.endsWith('/support') && hotelUnread) ||
              (item.path.endsWith('/hotels') && unreadHotelIds.length > 0)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => 'app-shell__nav-item' + (isActive ? ' app-shell__nav-item--active' : '')}
              >
                {t(item.labelKey)}
                {showBadge && <span className="badge-dot" aria-label="Yeni mesaj" />}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <div className="app-shell__main">
        <header className="app-shell__header">
          <h1 className="app-shell__title">{t(panelTitleKey)}</h1>
          <div className="app-shell__user">
            <LanguageSwitcher variant="dark" />
            <span>{user?.fullName}</span>
            <button type="button" onClick={logout} className="app-shell__logout">
              {t('shell.logout')}
            </button>
          </div>
        </header>
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
