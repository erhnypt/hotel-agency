import { listPublicHotels } from '../api/publicHotels'
import type { PublicHotelResponse } from '../api/types'

/**
 * Hotel catalog for the landing-page search. The JSON lives in `public/` and is
 * fetched once at runtime (it can hold thousands of hotels — too big to bundle).
 * Regenerate it with `npm run catalog:build`.
 *
 * Real hotels registered on the platform (approved + at least one priced room
 * type) are merged in on top of this static/seed data, prefixed `hotel-<id>`
 * so they stay distinguishable from the seed entries (`seed-...`).
 */

export interface CatalogRoom {
  id: string
  name: string
  capacity: number
  bedType: string
  roomSize?: number
  price: number
  currency: string
  images: string[]
}

export interface CatalogHotel {
  id: string
  name: string
  city: string
  country: string
  iso2: string
  stars: number | null
  priceFrom: number
  currency?: string
  lat: number | null
  lon: number | null
  rooms?: CatalogRoom[]
}

export interface CatalogCity {
  name: string
  country: string
  iso2: string
  count: number
}

export interface HotelCatalog {
  generatedAt: string
  source: string
  currency: string
  priceNote?: string
  cities: CatalogCity[]
  count: number
  hotels: CatalogHotel[]
}

let catalogCache: Promise<HotelCatalog> | null = null
let realHotelsCache: Promise<PublicHotelResponse[]> | null = null

function toCatalogHotel(hotel: PublicHotelResponse): CatalogHotel {
  return {
    id: `hotel-${hotel.id}`,
    name: hotel.name,
    city: hotel.city,
    country: hotel.country,
    iso2: '',
    stars: null,
    priceFrom: hotel.priceFrom,
    currency: hotel.currency,
    lat: null,
    lon: null,
  }
}

export function mergeRealHotels(catalog: HotelCatalog, realHotels: PublicHotelResponse[]): HotelCatalog {
  if (realHotels.length === 0) return catalog

  const merged = realHotels.map(toCatalogHotel)
  const cities = [...catalog.cities]
  for (const hotel of merged) {
    const existing = cities.find((c) => c.name === hotel.city)
    if (existing) {
      existing.count += 1
    } else {
      cities.push({ name: hotel.city, country: hotel.country, iso2: hotel.iso2, count: 1 })
    }
  }

  return {
    ...catalog,
    cities,
    hotels: [...merged, ...catalog.hotels],
    count: catalog.count + merged.length,
  }
}

/**
 * Fetches the static seed catalog only — same-origin, fast, no backend
 * dependency. Real hotels are fetched and merged separately (see
 * `loadRealHotels`) so a slow-to-wake backend never delays or blocks the
 * seed catalog from showing.
 */
export function loadCatalog(): Promise<HotelCatalog> {
  if (!catalogCache) {
    catalogCache = fetch(`${import.meta.env.BASE_URL}hotels.catalog.json`).then((r) => {
      if (!r.ok) throw new Error(`Katalog yüklenemedi (${r.status})`)
      return r.json() as Promise<HotelCatalog>
    })
  }
  return catalogCache
}

/**
 * Fetches real registered hotels to merge on top of the seed catalog.
 * Resolves to `[]` on any failure or timeout (e.g. a cold backend instance)
 * instead of hanging or rejecting, so callers can treat it as best-effort.
 */
export function loadRealHotels(): Promise<PublicHotelResponse[]> {
  if (!realHotelsCache) {
    realHotelsCache = listPublicHotels().catch(() => [] as PublicHotelResponse[])
  }
  return realHotelsCache
}
