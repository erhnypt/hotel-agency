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

let cache: Promise<HotelCatalog> | null = null

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

function mergeRealHotels(catalog: HotelCatalog, realHotels: PublicHotelResponse[]): HotelCatalog {
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

export function loadCatalog(): Promise<HotelCatalog> {
  if (!cache) {
    cache = Promise.all([
      fetch(`${import.meta.env.BASE_URL}hotels.catalog.json`).then((r) => {
        if (!r.ok) throw new Error(`Katalog yüklenemedi (${r.status})`)
        return r.json() as Promise<HotelCatalog>
      }),
      listPublicHotels().catch(() => [] as PublicHotelResponse[]),
    ]).then(([catalog, realHotels]) => mergeRealHotels(catalog, realHotels))
  }
  return cache
}
