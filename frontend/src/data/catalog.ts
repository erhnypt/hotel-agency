import catalogJson from './hotels.catalog.json'

export interface CatalogProperty {
  id: string
  name: string
  type: string
  totalBookings: number
  avgNightlyRate: number
  priceFrom: number
  avgStayNights: number
  topRoomTypes: string[]
  monthlyRate: Record<string, number>
}

export interface CatalogOffer {
  id: string
  propertyId: string
  propertyName: string
  hotelType: string
  countryCode: string
  countryName: string
  bookings: number
  priceFrom: number
  avgNightlyRate: number
}

export interface HotelCatalog {
  generatedAt: string
  source: string
  currency: string
  rowsProcessed: number
  properties: CatalogProperty[]
  offers: CatalogOffer[]
}

export const CATALOG = catalogJson as HotelCatalog

export const PEAK_MONTH: Record<string, string> = (() => {
  const out: Record<string, string> = {}
  for (const p of CATALOG.properties) {
    const entries = Object.entries(p.monthlyRate)
    if (entries.length) {
      out[p.id] = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    }
  }
  return out
})()
