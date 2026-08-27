/**
 * Builds the static hotel catalog the public landing page searches.
 *
 * Source data: Kaggle "Hotel Booking Demand" (hotel_bookings.csv by Antonio,
 * Almeida & Nunes 2019). That file is a booking-transactions log, not a hotel
 * directory: it has exactly two properties ("Resort Hotel", "City Hotel") and a
 * guest-nationality `country` column. So the catalog we can honestly derive is:
 *
 *   - two property profiles (rate, seasonality, typical stay, room mix)
 *   - a searchable list of "offers" = (property x guest-market country), each
 *     with an indicative "from" nightly price taken from that slice's real ADR
 *
 * Input : data/hotel_bookings.csv   (git-ignored; download from Kaggle)
 * Output: frontend/src/data/hotels.catalog.json
 *
 * Run:  node scripts/build-hotel-catalog.mjs
 */
import { createReadStream } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const INPUT = resolve(root, 'data/hotel_bookings.csv')
const OUTPUT = resolve(root, 'frontend/src/data/hotels.catalog.json')

const MIN_BOOKINGS_PER_OFFER = 30
const MAX_PLAUSIBLE_ADR = 1000 // the raw data has a handful of >5000 outliers and negatives

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const PROPERTIES = {
  'Resort Hotel': { id: 'resort-hotel', name: 'Cassidy Resort Hotel', type: 'Resort' },
  'City Hotel': { id: 'city-hotel', name: 'Cassidy City Hotel', type: 'City' },
}

/** Minimal ISO 3166-1 alpha-3 -> English name fallback; extended from the network when possible. */
const FALLBACK_COUNTRIES = {
  PRT: 'Portugal', GBR: 'United Kingdom', FRA: 'France', ESP: 'Spain', DEU: 'Germany',
  ITA: 'Italy', IRL: 'Ireland', BEL: 'Belgium', NLD: 'Netherlands', USA: 'United States',
  BRA: 'Brazil', CHE: 'Switzerland', AUT: 'Austria', SWE: 'Sweden', CHN: 'China',
  POL: 'Poland', ISR: 'Israel', RUS: 'Russia', NOR: 'Norway', ROU: 'Romania',
  FIN: 'Finland', DNK: 'Denmark', AUS: 'Australia', MAR: 'Morocco', TUR: 'Turkey',
  ARG: 'Argentina', LUX: 'Luxembourg', IND: 'India', GRC: 'Greece', CAN: 'Canada',
  HUN: 'Hungary', HRV: 'Croatia', JPN: 'Japan', CZE: 'Czechia', KOR: 'South Korea',
  MEX: 'Mexico', ZAF: 'South Africa', UKR: 'Ukraine', SVN: 'Slovenia', SVK: 'Slovakia',
}

async function loadCountryNames() {
  const names = { ...FALLBACK_COUNTRIES }
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json',
      { signal: AbortSignal.timeout(15000) },
    )
    if (res.ok) {
      for (const row of await res.json()) {
        if (row['alpha-3'] && row.name) names[row['alpha-3']] = row.name
      }
      console.log(`  country names: ${Object.keys(names).length} (from network)`)
      return names
    }
  } catch (err) {
    console.warn(`  country name lookup failed (${err.message}); using ${Object.keys(names).length}-entry fallback`)
  }
  return names
}

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') quoted = false
      else cur += c
    } else if (c === '"') quoted = true
    else if (c === ',') { out.push(cur); cur = '' }
    else cur += c
  }
  out.push(cur)
  return out
}

function percentile(sortedAsc, p) {
  if (sortedAsc.length === 0) return 0
  const idx = Math.min(sortedAsc.length - 1, Math.floor((p / 100) * sortedAsc.length))
  return sortedAsc[idx]
}

async function main() {
  const countryNames = await loadCountryNames()

  const rl = createInterface({ input: createReadStream(INPUT), crlfDelay: Infinity })
  let header = null
  let idx = {}
  let rows = 0

  // per property
  const prop = {}
  for (const key of Object.keys(PROPERTIES)) {
    prop[key] = {
      adr: [],
      nights: 0,
      bookings: 0,
      roomTypes: {},
      monthly: Object.fromEntries(MONTHS.map((m) => [m, []])),
    }
  }
  // per property x country
  const offers = new Map() // `${property}|${code}` -> { adr:[], bookings }

  for await (const line of rl) {
    if (!header) {
      header = parseCsvLine(line)
      idx = Object.fromEntries(header.map((h, i) => [h, i]))
      continue
    }
    if (!line) continue
    const f = parseCsvLine(line)
    const hotel = f[idx.hotel]
    if (!PROPERTIES[hotel]) continue
    rows++

    const adr = Number(f[idx.adr])
    const validAdr = Number.isFinite(adr) && adr > 0 && adr < MAX_PLAUSIBLE_ADR
    const nights = Number(f[idx.stays_in_week_nights] || 0) + Number(f[idx.stays_in_weekend_nights] || 0)
    const month = f[idx.arrival_date_month]
    const roomType = f[idx.reserved_room_type]
    const code = f[idx.country]

    const p = prop[hotel]
    p.bookings++
    p.nights += nights
    if (roomType) p.roomTypes[roomType] = (p.roomTypes[roomType] || 0) + 1
    if (validAdr) {
      p.adr.push(adr)
      if (p.monthly[month]) p.monthly[month].push(adr)
    }

    if (code && code !== 'NULL') {
      const k = `${hotel}|${code}`
      let o = offers.get(k)
      if (!o) { o = { adr: [], bookings: 0 }; offers.set(k, o) }
      o.bookings++
      if (validAdr) o.adr.push(adr)
    }
  }

  const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0)
  const round = (n) => Math.round(n)

  const properties = Object.entries(PROPERTIES).map(([csvKey, meta]) => {
    const p = prop[csvKey]
    const adrSorted = [...p.adr].sort((a, b) => a - b)
    const topRoomTypes = Object.entries(p.roomTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([t]) => t)
    const monthlyRate = Object.fromEntries(
      MONTHS.map((m) => [m, round(mean(p.monthly[m])) || round(mean(p.adr))]),
    )
    return {
      ...meta,
      totalBookings: p.bookings,
      avgNightlyRate: round(mean(p.adr)),
      priceFrom: round(percentile(adrSorted, 15)),
      avgStayNights: Number((p.nights / p.bookings).toFixed(1)),
      topRoomTypes,
      monthlyRate,
    }
  })

  const catalogOffers = []
  for (const [k, o] of offers) {
    if (o.bookings < MIN_BOOKINGS_PER_OFFER) continue
    const [csvKey, code] = k.split('|')
    const adrSorted = [...o.adr].sort((a, b) => a - b)
    catalogOffers.push({
      id: `${PROPERTIES[csvKey].id}-${code.toLowerCase()}`,
      propertyId: PROPERTIES[csvKey].id,
      propertyName: PROPERTIES[csvKey].name,
      hotelType: PROPERTIES[csvKey].type,
      countryCode: code,
      countryName: countryNames[code] || code,
      bookings: o.bookings,
      priceFrom: round(percentile(adrSorted, 15)) || properties.find((p) => p.id === PROPERTIES[csvKey].id).priceFrom,
      avgNightlyRate: round(mean(o.adr)),
    })
  }
  catalogOffers.sort((a, b) => a.countryName.localeCompare(b.countryName) || a.hotelType.localeCompare(b.hotelType))

  const catalog = {
    generatedAt: new Date().toISOString(),
    source: 'Kaggle: Hotel Booking Demand (hotel_bookings.csv, Antonio/Almeida/Nunes 2019)',
    currency: 'EUR',
    rowsProcessed: rows,
    properties,
    offers: catalogOffers,
  }

  await writeFile(OUTPUT, JSON.stringify(catalog, null, 2) + '\n')
  console.log(`\n  ${rows.toLocaleString()} booking rows`)
  console.log(`  ${properties.length} properties, ${catalogOffers.length} offers`)
  console.log(`  -> ${OUTPUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
