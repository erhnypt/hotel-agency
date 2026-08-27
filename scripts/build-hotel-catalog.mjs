/**
 * Builds the hotel catalog the public landing page searches.
 *
 * Source: OpenStreetMap via the Overpass API — real hotels (name, city,
 * country, star rating when tagged, coordinates) for a curated set of ~60
 * destination cities. No API key required.
 *
 * "From" nightly prices are indicative: a EUR star band scaled by a rough
 * per-country cost index. They are illustrative only; agency confirms the
 * real price on each enquiry.
 *
 * Output: frontend/public/hotels.catalog.json  (fetched at runtime, not bundled)
 *
 * Run:  node scripts/build-hotel-catalog.mjs
 */
import { writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'

const execFileP = promisify(execFile)

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(root, 'frontend/public/hotels.catalog.json')

const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]
const PER_CITY_CAP = 140
const REQUEST_GAP_MS = 800

// name, country, ISO 3166-1 alpha-2, lat, lon, search radius (m)
const CITIES = [
  ['Londra', 'Birleşik Krallık', 'GB', 51.5074, -0.1278, 9000],
  ['Paris', 'Fransa', 'FR', 48.8566, 2.3522, 8000],
  ['Roma', 'İtalya', 'IT', 41.9028, 12.4964, 8000],
  ['Milano', 'İtalya', 'IT', 45.4642, 9.19, 7000],
  ['Venedik', 'İtalya', 'IT', 45.4408, 12.3155, 6000],
  ['Floransa', 'İtalya', 'IT', 43.7696, 11.2558, 6000],
  ['Barselona', 'İspanya', 'ES', 41.3874, 2.1686, 7000],
  ['Madrid', 'İspanya', 'ES', 40.4168, -3.7038, 8000],
  ['Sevilla', 'İspanya', 'ES', 37.3891, -5.9845, 6000],
  ['Valensiya', 'İspanya', 'ES', 39.4699, -0.3763, 6000],
  ['Palma de Mallorca', 'İspanya', 'ES', 39.5696, 2.6502, 9000],
  ['Lizbon', 'Portekiz', 'PT', 38.7223, -9.1393, 7000],
  ['Porto', 'Portekiz', 'PT', 41.1579, -8.6291, 6000],
  ['Amsterdam', 'Hollanda', 'NL', 52.3676, 4.9041, 7000],
  ['Brüksel', 'Belçika', 'BE', 50.8503, 4.3517, 7000],
  ['Berlin', 'Almanya', 'DE', 52.52, 13.405, 9000],
  ['Münih', 'Almanya', 'DE', 48.1351, 11.582, 7000],
  ['Frankfurt', 'Almanya', 'DE', 50.1109, 8.6821, 6000],
  ['Viyana', 'Avusturya', 'AT', 48.2082, 16.3738, 7000],
  ['Prag', 'Çekya', 'CZ', 50.0755, 14.4378, 7000],
  ['Budapeşte', 'Macaristan', 'HU', 47.4979, 19.0402, 7000],
  ['Varşova', 'Polonya', 'PL', 52.2297, 21.0122, 7000],
  ['Krakov', 'Polonya', 'PL', 50.0647, 19.945, 6000],
  ['Atina', 'Yunanistan', 'GR', 37.9838, 23.7275, 7000],
  ['Selanik', 'Yunanistan', 'GR', 40.6401, 22.9444, 6000],
  ['Dublin', 'İrlanda', 'IE', 53.3498, -6.2603, 7000],
  ['Edinburgh', 'Birleşik Krallık', 'GB', 55.9533, -3.1883, 6000],
  ['Kopenhag', 'Danimarka', 'DK', 55.6761, 12.5683, 7000],
  ['Stokholm', 'İsveç', 'SE', 59.3293, 18.0686, 7000],
  ['Oslo', 'Norveç', 'NO', 59.9139, 10.7522, 6000],
  ['Helsinki', 'Finlandiya', 'FI', 60.1699, 24.9384, 6000],
  ['Zürih', 'İsviçre', 'CH', 47.3769, 8.5417, 6000],
  ['Cenevre', 'İsviçre', 'CH', 46.2044, 6.1432, 5000],
  ['Nis', 'Fransa', 'FR', 43.7102, 7.262, 6000],
  ['Dubrovnik', 'Hırvatistan', 'HR', 42.6507, 18.0944, 6000],
  ['Split', 'Hırvatistan', 'HR', 43.5081, 16.4402, 6000],
  ['Reykjavik', 'İzlanda', 'IS', 64.1466, -21.9426, 6000],
  ['İstanbul', 'Türkiye', 'TR', 41.0082, 28.9784, 12000],
  ['Ankara', 'Türkiye', 'TR', 39.9334, 32.8597, 8000],
  ['İzmir', 'Türkiye', 'TR', 38.4237, 27.1428, 9000],
  ['Antalya', 'Türkiye', 'TR', 36.8969, 30.7133, 18000],
  ['Bodrum', 'Türkiye', 'TR', 37.0344, 27.4305, 16000],
  ['Kapadokya', 'Türkiye', 'TR', 38.6431, 34.8289, 20000],
  ['Fethiye', 'Türkiye', 'TR', 36.6213, 29.1164, 16000],
  ['Dubai', 'Birleşik Arap Emirlikleri', 'AE', 25.2048, 55.2708, 15000],
  ['Abu Dabi', 'Birleşik Arap Emirlikleri', 'AE', 24.4539, 54.3773, 12000],
  ['Doha', 'Katar', 'QA', 25.2854, 51.531, 10000],
  ['Marakeş', 'Fas', 'MA', 31.6295, -7.9811, 8000],
  ['Kahire', 'Mısır', 'EG', 30.0444, 31.2357, 12000],
  ['Tel Aviv', 'İsrail', 'IL', 32.0853, 34.7818, 8000],
  ['New York', 'ABD', 'US', 40.7128, -74.006, 10000],
  ['Los Angeles', 'ABD', 'US', 34.0522, -118.2437, 14000],
  ['Miami', 'ABD', 'US', 25.7617, -80.1918, 10000],
  ['Bangkok', 'Tayland', 'TH', 13.7563, 100.5018, 12000],
  ['Singapur', 'Singapur', 'SG', 1.3521, 103.8198, 12000],
  ['Tokyo', 'Japonya', 'JP', 35.6762, 139.6503, 12000],
  ['Bali (Denpasar)', 'Endonezya', 'ID', -8.6705, 115.2126, 20000],
  ['Hong Kong', 'Hong Kong', 'HK', 22.3193, 114.1694, 10000],
  ['Sidney', 'Avustralya', 'AU', -33.8688, 151.2093, 10000],
  ['Cape Town', 'Güney Afrika', 'ZA', -33.9249, 18.4241, 12000],
]

// EUR indicative nightly floor by star rating
const STAR_BAND = { 1: 45, 2: 60, 3: 85, 4: 135, 5: 220 }
const UNKNOWN_STAR_BAND = 95

// rough cost-of-stay multiplier by country (default 1.0)
const COUNTRY_INDEX = {
  CH: 1.7, GB: 1.35, IE: 1.2, FR: 1.2, NL: 1.2, DK: 1.3, SE: 1.15, NO: 1.35, FI: 1.1,
  IS: 1.4, DE: 1.1, AT: 1.1, BE: 1.1, IT: 1.1, ES: 1.0, PT: 0.9, GR: 0.9, HR: 0.95,
  CZ: 0.8, HU: 0.75, PL: 0.7, TR: 0.6, AE: 1.5, QA: 1.4, MA: 0.7, EG: 0.55, IL: 1.3,
  US: 1.55, TH: 0.6, SG: 1.4, JP: 1.2, ID: 0.6, HK: 1.3, AU: 1.35, ZA: 0.6,
}

/**
 * Small seed of real, well-known hotels — used only when the live Overpass
 * fetch returns nothing (e.g. no network). Running this script on a normal
 * connection replaces it with thousands of hotels straight from OSM.
 * [name, city, iso2, stars]
 */
const SEED_HOTELS = [
  ['The Savoy', 'Londra', 'GB', 5], ['The Langham, London', 'Londra', 'GB', 5],
  ['Premier Inn London County Hall', 'Londra', 'GB', 3], ['The Z Hotel Piccadilly', 'Londra', 'GB', 4],
  ['Hôtel Le Meurice', 'Paris', 'FR', 5], ['Hôtel des Grands Boulevards', 'Paris', 'FR', 4],
  ['Generator Paris', 'Paris', 'FR', 2], ['Hotel Hana', 'Paris', 'FR', 3],
  ['Hotel Hassler Roma', 'Roma', 'IT', 5], ['Hotel Artemide', 'Roma', 'IT', 4],
  ['The RomeHello', 'Roma', 'IT', 3], ['Generator Rome', 'Roma', 'IT', 2],
  ['Hotel Gritti Palace', 'Venedik', 'IT', 5], ['Hotel Antiche Figure', 'Venedik', 'IT', 4],
  ['Portrait Firenze', 'Floransa', 'IT', 5], ['Hotel Davanzati', 'Floransa', 'IT', 3],
  ['Room Mate Giulia', 'Milano', 'IT', 4], ['B&B Hotel Milano Central Station', 'Milano', 'IT', 3],
  ['Hotel Arts Barcelona', 'Barselona', 'ES', 5], ['Casa Camper Barcelona', 'Barselona', 'ES', 4],
  ['Generator Barcelona', 'Barselona', 'ES', 2], ['The Principal Madrid', 'Madrid', 'ES', 5],
  ['Only YOU Boutique Hotel Madrid', 'Madrid', 'ES', 4], ['Hotel Alfonso XIII', 'Sevilla', 'ES', 5],
  ['Hotel Colón Gran Meliá', 'Sevilla', 'ES', 5], ['Caro Hotel', 'Valensiya', 'ES', 4],
  ['Nobu Hotel Barcelona', 'Barselona', 'ES', 5], ['Hotel Cort', 'Palma de Mallorca', 'ES', 4],
  ['Bless Hotel Madrid', 'Madrid', 'ES', 5],
  ['Bairro Alto Hotel', 'Lizbon', 'PT', 5], ['Memmo Alfama Hotel', 'Lizbon', 'PT', 4],
  ['The Lumiares Hotel & Spa', 'Lizbon', 'PT', 5], ['The Yeatman', 'Porto', 'PT', 5],
  ['Pestana Vintage Porto', 'Porto', 'PT', 5], ['Gallery Hostel', 'Porto', 'PT', 2],
  ['The Dylan Amsterdam', 'Amsterdam', 'NL', 5], ['Hotel Estheréa', 'Amsterdam', 'NL', 4],
  ['The Hoxton, Amsterdam', 'Amsterdam', 'NL', 4], ['ClinkNOORD', 'Amsterdam', 'NL', 2],
  ['Rocco Forte Hotel Amigo', 'Brüksel', 'BE', 5], ['The Hotel Brussels', 'Brüksel', 'BE', 5],
  ['Hotel Adlon Kempinski', 'Berlin', 'DE', 5], ['25hours Hotel Bikini Berlin', 'Berlin', 'DE', 4],
  ['Michelberger Hotel', 'Berlin', 'DE', 3], ['Hotel Bayerischer Hof', 'Münih', 'DE', 5],
  ['Motel One München-Sendlinger Tor', 'Münih', 'DE', 3], ['Villa Kennedy', 'Frankfurt', 'DE', 5],
  ['Hotel Sacher Wien', 'Viyana', 'AT', 5], ['Hotel Altstadt Vienna', 'Viyana', 'AT', 4],
  ['Wombats City Hostel Vienna', 'Viyana', 'AT', 2], ['Augustine, a Luxury Collection Hotel', 'Prag', 'CZ', 5],
  ['Mosaic House Design Hotel', 'Prag', 'CZ', 4], ['Hotel Josef', 'Prag', 'CZ', 4],
  ['Aria Hotel Budapest', 'Budapeşte', 'HU', 5], ['Hotel Rum Budapest', 'Budapeşte', 'HU', 4],
  ['Maverick City Lodge', 'Budapeşte', 'HU', 2], ['Raffles Europejski Warsaw', 'Varşova', 'PL', 5],
  ['Hotel Bristol Warsaw', 'Varşova', 'PL', 5], ['Hotel Stary', 'Krakov', 'PL', 5],
  ['Puro Kraków Kazimierz', 'Krakov', 'PL', 4], ['Hotel Grande Bretagne', 'Atina', 'GR', 5],
  ['AthensWas', 'Atina', 'GR', 5], ['A for Athens', 'Atina', 'GR', 4],
  ['The Shelbourne', 'Dublin', 'IE', 5], ['The Merrion Hotel', 'Dublin', 'IE', 5],
  ['Jurys Inn Dublin Christchurch', 'Dublin', 'IE', 3], ['Generator Dublin', 'Dublin', 'IE', 2],
  ['The Balmoral', 'Edinburgh', 'GB', 5], ['The Witchery by the Castle', 'Edinburgh', 'GB', 4],
  ['Nobis Hotel Copenhagen', 'Kopenhag', 'DK', 5], ['Hotel SP34', 'Kopenhag', 'DK', 4],
  ['Nobis Hotel Stockholm', 'Stokholm', 'SE', 5], ['Hotel Diplomat Stockholm', 'Stokholm', 'SE', 5],
  ['The Thief', 'Oslo', 'NO', 5], ['Amerikalinjen', 'Oslo', 'NO', 4],
  ['Hotel St. George Helsinki', 'Helsinki', 'FI', 5], ['Hotel Kämp', 'Helsinki', 'FI', 5],
  ['Baur au Lac', 'Zürih', 'CH', 5], ['25hours Hotel Zürich Langstrasse', 'Zürih', 'CH', 4],
  ['Hotel N’vY', 'Cenevre', 'CH', 4], ['Hôtel Beau-Rivage Genève', 'Cenevre', 'CH', 5],
  ['Hôtel Negresco', 'Nis', 'FR', 5], ['Hôtel La Pérouse', 'Nis', 'FR', 4],
  ['Hotel Excelsior Dubrovnik', 'Dubrovnik', 'HR', 5], ['Hotel Bellevue Dubrovnik', 'Dubrovnik', 'HR', 5],
  ['Hotel Park Split', 'Split', 'HR', 4], ['Judita Palace Hotel', 'Split', 'HR', 4],
  ['The Reykjavik EDITION', 'Reykjavik', 'IS', 5], ['Kvosin Downtown Hotel', 'Reykjavik', 'IS', 4],
  ['Pera Palace Hotel', 'İstanbul', 'TR', 5], ['Çırağan Palace Kempinski', 'İstanbul', 'TR', 5],
  ['Vault Karakoy', 'İstanbul', 'TR', 5], ['Sirkeci Mansion', 'İstanbul', 'TR', 4],
  ['Cheya Besiktas', 'İstanbul', 'TR', 4], ['Marmara Taksim', 'İstanbul', 'TR', 5],
  ['JW Marriott Ankara', 'Ankara', 'TR', 5], ['Divan Ankara', 'Ankara', 'TR', 5],
  ['Swissôtel Büyük Efes İzmir', 'İzmir', 'TR', 5], ['Key Hotel', 'İzmir', 'TR', 4],
  ['Rixos Downtown Antalya', 'Antalya', 'TR', 5], ['Akra Hotel', 'Antalya', 'TR', 5],
  ['Tuvana Hotel', 'Antalya', 'TR', 4], ['The Marmara Bodrum', 'Bodrum', 'TR', 5],
  ['Kaya Palazzo Resort Bodrum', 'Bodrum', 'TR', 5], ['Museum Hotel', 'Kapadokya', 'TR', 5],
  ['Argos in Cappadocia', 'Kapadokya', 'TR', 5], ['Sultan Cave Suites', 'Kapadokya', 'TR', 4],
  ['Yacht Classic Hotel', 'Fethiye', 'TR', 4], ['Hillside Beach Club', 'Fethiye', 'TR', 5],
  ['Burj Al Arab Jumeirah', 'Dubai', 'AE', 5], ['Atlantis, The Palm', 'Dubai', 'AE', 5],
  ['Rove Downtown', 'Dubai', 'AE', 3], ['Emirates Palace', 'Abu Dabi', 'AE', 5],
  ['The St. Regis Doha', 'Doha', 'QA', 5], ['Mandarin Oriental, Doha', 'Doha', 'QA', 5],
  ['La Mamounia', 'Marakeş', 'MA', 5], ['Riad Yasmine', 'Marakeş', 'MA', 4],
  ['Marriott Mena House', 'Kahire', 'EG', 5], ['The Nile Ritz-Carlton', 'Kahire', 'EG', 5],
  ['The Norman Tel Aviv', 'Tel Aviv', 'IL', 5], ['The Jaffa', 'Tel Aviv', 'IL', 5],
  ['The Plaza Hotel', 'New York', 'US', 5], ['Ace Hotel New York', 'New York', 'US', 4],
  ['Pod 51', 'New York', 'US', 3], ['The Beverly Hills Hotel', 'Los Angeles', 'US', 5],
  ['Freehand Los Angeles', 'Los Angeles', 'US', 3], ['The Setai, Miami Beach', 'Miami', 'US', 5],
  ['Generator Miami', 'Miami', 'US', 3], ['Mandarin Oriental, Bangkok', 'Bangkok', 'TH', 5],
  ['The Siam', 'Bangkok', 'TH', 5], ['Lub d Bangkok Silom', 'Bangkok', 'TH', 2],
  ['Marina Bay Sands', 'Singapur', 'SG', 5], ['Raffles Singapore', 'Singapur', 'SG', 5],
  ['The Peninsula Tokyo', 'Tokyo', 'JP', 5], ['Park Hotel Tokyo', 'Tokyo', 'JP', 4],
  ['UNPLAN Kagurazaka', 'Tokyo', 'JP', 2], ['The Mulia', 'Bali (Denpasar)', 'ID', 5],
  ['Potato Head Suites', 'Bali (Denpasar)', 'ID', 5], ['The Peninsula Hong Kong', 'Hong Kong', 'HK', 5],
  ['Tuve', 'Hong Kong', 'HK', 4], ['Park Hyatt Sydney', 'Sidney', 'AU', 5],
  ['QT Sydney', 'Sidney', 'AU', 5], ['Sydney Harbour YHA', 'Sidney', 'AU', 2],
  ['The Silo Hotel', 'Cape Town', 'ZA', 5], ['Gorgeous George', 'Cape Town', 'ZA', 4],
  ['Cape Grace', 'Cape Town', 'ZA', 5],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function parseStars(raw) {
  const s = String(raw ?? '').trim()
  const n = Number.parseInt(s, 10)
  return n >= 1 && n <= 5 ? n : null
}

function priceFrom(stars, iso2) {
  const base = stars ? STAR_BAND[stars] : UNKNOWN_STAR_BAND
  const idx = COUNTRY_INDEX[iso2] ?? 1.0
  return Math.round((base * idx) / 5) * 5
}

function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Node's fetch is blocked for the Overpass hosts in this environment; curl works.
async function overpass(endpoint, query) {
  const { stdout } = await execFileP(
    'curl',
    ['-sS', '--max-time', '90', '--fail', '-X', 'POST', endpoint, '--data-urlencode', `data=${query}`],
    { maxBuffer: 64 * 1024 * 1024 },
  )
  return JSON.parse(stdout)
}

async function fetchCity([name, country, iso2, lat, lon, radius]) {
  const query = `[out:json][timeout:40];nwr["tourism"="hotel"]["name"](around:${radius},${lat},${lon});out tags center;`
  for (let attempt = 1; attempt <= 4; attempt++) {
    const endpoint = OVERPASS_ENDPOINTS[(attempt - 1) % OVERPASS_ENDPOINTS.length]
    try {
      const data = await overpass(endpoint, query)
      const seen = new Set()
      const hotels = []
      for (const el of data.elements ?? []) {
        const t = el.tags ?? {}
        const hName = (t.name ?? '').trim()
        if (!hName) continue
        const key = slug(hName)
        if (seen.has(key)) continue
        seen.add(key)
        const stars = parseStars(t.stars)
        hotels.push({
          id: `${el.type[0]}${el.id}`,
          name: hName,
          city: name,
          country,
          iso2,
          stars,
          priceFrom: priceFrom(stars, iso2),
          lat: Number((el.lat ?? el.center?.lat ?? lat).toFixed(5)),
          lon: Number((el.lon ?? el.center?.lon ?? lon).toFixed(5)),
        })
      }
      hotels.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0) || a.name.localeCompare(b.name, 'tr'))
      return hotels.slice(0, PER_CITY_CAP)
    } catch (err) {
      console.warn(`  ${name}: attempt ${attempt} (${endpoint.split('/')[2]}) failed — ${err.message}`)
      if (attempt < 4) await sleep(2000 * attempt)
    }
  }
  console.warn(`  ${name}: giving up`)
  return []
}

async function overpassReachable() {
  for (const ep of OVERPASS_ENDPOINTS) {
    try {
      await overpass(ep, '[out:json][timeout:10];node["tourism"="hotel"](around:500,53.3498,-6.2603);out ids 1;')
      process.stderr.write(`  Overpass OK via ${ep.split('/')[2]}\n`)
      return true
    } catch (err) {
      process.stderr.write(`  ${ep.split('/')[2]} unreachable — ${String(err.message).split('\n')[0]}\n`)
    }
  }
  return false
}

async function main() {
  const hotels = []
  const cities = []

  if (await overpassReachable()) {
    let i = 0
    for (const city of CITIES) {
      const found = await fetchCity(city)
      hotels.push(...found)
      cities.push({ name: city[0], country: city[1], iso2: city[2], count: found.length })
      process.stderr.write(`  [${++i}/${CITIES.length}] ${city[0].padEnd(22)} ${found.length}\n`)
      await sleep(REQUEST_GAP_MS)
    }
  }

  let source = 'OpenStreetMap (Overpass API) — tourism=hotel'
  if (hotels.length === 0) {
    process.stderr.write('\n  Live fetch returned nothing — writing the built-in seed list.\n')
    source = 'Built-in seed (Overpass unreachable) — re-run this script online for the full OSM set'
    const cityMeta = new Map(CITIES.map((c) => [c[0], c]))
    const counts = {}
    for (const [hName, city, iso2, stars] of SEED_HOTELS) {
      const meta = cityMeta.get(city)
      hotels.push({
        id: `seed-${slug(city)}-${slug(hName)}`,
        name: hName,
        city,
        country: meta ? meta[1] : city,
        iso2,
        stars,
        priceFrom: priceFrom(stars, iso2),
        lat: meta ? meta[3] : null,
        lon: meta ? meta[4] : null,
      })
      counts[city] = (counts[city] || 0) + 1
    }
    cities.length = 0
    for (const [name, [, country, iso2]] of [...cityMeta]) {
      if (counts[name]) cities.push({ name, country, iso2, count: counts[name] })
    }
  }

  hotels.sort((a, b) => a.city.localeCompare(b.city, 'tr') || a.name.localeCompare(b.name, 'tr'))
  cities.sort((a, b) => b.count - a.count)

  const catalog = {
    generatedAt: new Date().toISOString(),
    source,
    currency: 'EUR',
    priceNote: 'Gösterge fiyat: yıldıza göre EUR bandı × ülke maliyet endeksi. Kesin fiyat talep sonrası teyit edilir.',
    cities,
    count: hotels.length,
    hotels,
  }

  await writeFile(OUTPUT, JSON.stringify(catalog) + '\n')
  console.log(`\n  ${hotels.length} hotels across ${cities.length} cities`)
  console.log(`  -> ${OUTPUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
