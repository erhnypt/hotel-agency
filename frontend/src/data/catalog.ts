/**
 * Hotel catalog for the landing-page search. The JSON lives in `public/` and is
 * fetched once at runtime (it can hold thousands of hotels — too big to bundle).
 * Regenerate it with `npm run catalog:build`.
 */

export interface CatalogHotel {
  id: string
  name: string
  city: string
  country: string
  iso2: string
  stars: number | null
  priceFrom: number
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

export function loadCatalog(): Promise<HotelCatalog> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}hotels.catalog.json`).then((r) => {
      if (!r.ok) throw new Error(`Katalog yüklenemedi (${r.status})`)
      return r.json() as Promise<HotelCatalog>
    })
  }
  return cache
}
