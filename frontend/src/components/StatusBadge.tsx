import './StatusBadge.css'

const LABELS: Record<string, string> = {
  PENDING: 'Bekliyor',
  ACTIVE: 'Aktif',
  REJECTED: 'Reddedildi',
  CONFIRMED: 'Onaylandı',
  CANCELLED: 'İptal Edildi',
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{LABELS[status] ?? status}</span>
}
