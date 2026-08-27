import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import type { MenuItem } from './menus'
import './AppShell.css'

export function AppShell({ panelTitle, menu }: { panelTitle: string; menu: MenuItem[] }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          Cassidy Travel
          <small>Otel Acentesi Merkezi</small>
        </div>
        <nav className="app-shell__nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 'app-shell__nav-item' + (isActive ? ' app-shell__nav-item--active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-shell__main">
        <header className="app-shell__header">
          <h1 className="app-shell__title">{panelTitle}</h1>
          <div className="app-shell__user">
            <span>{user?.fullName}</span>
            <button type="button" onClick={logout} className="app-shell__logout">
              Çıkış Yap
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
