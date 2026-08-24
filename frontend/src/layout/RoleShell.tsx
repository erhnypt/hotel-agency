import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { roleHomePath } from '../auth/roleHome'
import type { RoleName } from '../auth/types'
import { AppShell } from './AppShell'
import type { MenuItem } from './menus'

export function RoleShell({
  role,
  panelTitle,
  menu,
}: {
  role: RoleName
  panelTitle: string
  menu: MenuItem[]
}) {
  const { user } = useAuth()

  if (user?.role !== role) {
    return <Navigate to={user ? roleHomePath(user.role) : '/login'} replace />
  }

  return <AppShell panelTitle={panelTitle} menu={menu} />
}
