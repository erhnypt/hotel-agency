export interface MenuItem {
  labelKey: string
  path: string
  end?: boolean
}

export const ADMIN_MENU: MenuItem[] = [
  { labelKey: 'nav.dashboard', path: '/admin', end: true },
  { labelKey: 'nav.hotels', path: '/admin/hotels' },
  { labelKey: 'nav.reservations', path: '/admin/reservations', end: true },
  { labelKey: 'nav.newReservation', path: '/admin/reservations/new' },
  { labelKey: 'nav.requests', path: '/admin/booking-requests' },
  { labelKey: 'nav.customers', path: '/admin/customers' },
  { labelKey: 'nav.staff', path: '/admin/staff' },
  { labelKey: 'nav.settings', path: '/admin/settings' },
]

export const STAFF_MENU: MenuItem[] = [
  { labelKey: 'nav.dashboard', path: '/staff', end: true },
  { labelKey: 'nav.hotels', path: '/staff/hotels' },
  { labelKey: 'nav.customers', path: '/staff/customers' },
  { labelKey: 'nav.reservations', path: '/staff/reservations', end: true },
  { labelKey: 'nav.newReservation', path: '/staff/reservations/new' },
  { labelKey: 'nav.requests', path: '/staff/booking-requests' },
  { labelKey: 'nav.settings', path: '/staff/settings' },
]

export const HOTEL_MENU: MenuItem[] = [
  { labelKey: 'nav.dashboard', path: '/hotel', end: true },
  { labelKey: 'nav.hotelProfile', path: '/hotel/profile' },
  { labelKey: 'nav.roomTypes', path: '/hotel/rooms' },
  { labelKey: 'nav.services', path: '/hotel/services' },
  { labelKey: 'nav.prices', path: '/hotel/prices' },
  { labelKey: 'nav.reservations', path: '/hotel/reservations' },
  { labelKey: 'nav.settings', path: '/hotel/settings' },
]
