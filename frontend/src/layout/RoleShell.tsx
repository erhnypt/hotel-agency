import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { roleHomePath } from '../auth/roleHome'
import type { RoleName } from '../auth/types'
import { AppShell } from './AppShell'
import { HotelAccessGate } from './HotelAccessGate'
import type { MenuItem } from './menus'

export function RoleShell({
  role,
  panelTitleKey,
  menu,
}: {
  role: RoleName
  panelTitleKey: string
  menu: MenuItem[]
}) {
  const { user } = useAuth()

  if (user?.role !== role) {
    return <Navigate to={user ? roleHomePath(user.role) : '/login'} replace />
  }

  if (role === 'HOTEL_ADMIN') {
    return <HotelAccessGate panelTitleKey={panelTitleKey} menu={menu} />
  }

  return <AppShell panelTitleKey={panelTitleKey} menu={menu} />
}
