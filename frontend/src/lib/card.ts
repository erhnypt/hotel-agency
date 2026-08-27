/**
 * Card helpers for the customer form. The full number and CVV live only in
 * component state and are never sent to the API — we submit brand + last 4 +
 * expiry, which is what a hotel booking actually needs.
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

export function last4(number: string): string | null {
  const n = digitsOnly(number)
  return n.length >= 4 ? n.slice(-4) : null
}

/** e.g. "VISA •••• 4242" */
export function maskedCard(brand?: string | null, l4?: string | null): string | null {
  if (!l4) return null
  return `${brand ?? 'Kart'} •••• ${l4}`
}
