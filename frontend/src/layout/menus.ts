export interface MenuItem {
  label: string
  path: string
  end?: boolean
}

export const ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', path: '/admin', end: true },
  { label: 'Oteller', path: '/admin/hotels' },
  { label: 'Rezervasyonlar', path: '/admin/reservations', end: true },
  { label: 'Yeni Rezervasyon', path: '/admin/reservations/new' },
  { label: 'Müşteriler', path: '/admin/customers' },
  { label: 'Çalışanlar', path: '/admin/staff' },
  { label: 'Ayarlar', path: '/admin/settings' },
]

export const STAFF_MENU: MenuItem[] = [
  { label: 'Dashboard', path: '/staff', end: true },
  { label: 'Oteller', path: '/staff/hotels' },
  { label: 'Müşteriler', path: '/staff/customers' },
  { label: 'Rezervasyonlar', path: '/staff/reservations', end: true },
  { label: 'Yeni Rezervasyon', path: '/staff/reservations/new' },
  { label: 'Ayarlar', path: '/staff/settings' },
]

export const HOTEL_MENU: MenuItem[] = [
  { label: 'Dashboard', path: '/hotel', end: true },
  { label: 'Otel Profili', path: '/hotel/profile' },
  { label: 'Oda Tipleri', path: '/hotel/rooms' },
  { label: 'Hizmetler', path: '/hotel/services' },
  { label: 'Fiyatlar', path: '/hotel/prices' },
  { label: 'Rezervasyonlar', path: '/hotel/reservations' },
  { label: 'Ayarlar', path: '/hotel/settings' },
]
