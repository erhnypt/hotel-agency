/**
 * Card helpers for the customer form (school project).
 * The full number is stored and shown. A CVV is never collected or stored.
 */

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function detectBrand(number: string): string | null {
  const n = digitsOnly(number)
  if (!n) return null
  if (/^4/.test(n)) return 'VISA'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard'
  if (/^3[47]/.test(n)) return 'Amex'
  if (/^(36|38|30[0-5])/.test(n)) return 'Diners'
  if (/^6(011|5)/.test(n)) return 'Discover'
  if (/^9792/.test(n)) return 'Troy'
  return 'Kart'
}

/** Groups digits for display: 4-4-4-4 (Amex 4-6-5). */
export function formatCardNumber(value: string): string {
  const n = digitsOnly(value).slice(0, 19)
  const amex = /^3[47]/.test(n)
  const groups = amex ? [4, 6, 5] : [4, 4, 4, 4, 3]
  const out: string[] = []
  let i = 0
  for (const g of groups) {
    if (i >= n.length) break
    out.push(n.slice(i, i + g))
    i += g
  }
  return out.join(' ')
}

/** e.g. "VISA 4242 4242 4242 4242" — full number, not masked. */
export function cardLabel(brand?: string | null, number?: string | null): string | null {
  if (!number) return null
  return `${brand ?? 'Kart'} ${formatCardNumber(number)}`
}
