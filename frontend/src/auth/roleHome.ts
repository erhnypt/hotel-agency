import type { RoleName } from './types'

export function roleHomePath(role: RoleName): string {
  switch (role) {
    case 'AGENCY_ADMIN':
      return '/admin'
    case 'AGENCY_STAFF':
      return '/staff'
    case 'HOTEL_ADMIN':
      return '/hotel'
  }
}
