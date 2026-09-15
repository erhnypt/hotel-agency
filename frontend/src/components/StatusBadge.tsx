import { useT } from '../i18n/useT'
import './StatusBadge.css'

type Tone = 'live' | 'hold' | 'break' | 'pulled'

const CONFIG: Record<string, { key: string; tone: Tone }> = {
  ACTIVE: { key: 'status.active', tone: 'live' },
  CONFIRMED: { key: 'status.confirmed', tone: 'live' },
  PENDING: { key: 'status.pending', tone: 'hold' },
  REJECTED: { key: 'status.rejected', tone: 'break' },
  INACTIVE: { key: 'status.inactive', tone: 'hold' },
  CANCELLED: { key: 'status.cancelled', tone: 'pulled' },
  NEW: { key: 'status.new', tone: 'hold' },
  IN_PROGRESS: { key: 'status.inProgress', tone: 'live' },
  CLOSED: { key: 'status.closed', tone: 'pulled' },
}

function StatusIcon({ tone }: { tone: Tone }) {
  return (
    <svg className="status-line__glyph" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" className="status-line__ring" strokeWidth="1.4" fill="none" />
      {tone === 'live' && (
        <path
          className="status-line__mark status-line__mark--draw"
          d="M5.1 8.3 7.2 10.4 11 6.2"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {tone === 'hold' && (
        <g className="status-line__mark" strokeWidth="1.5" strokeLinecap="round">
          <line x1="8" y1="8" x2="8" y2="4.6" />
          <line x1="8" y1="8" x2="10.3" y2="9.3" />
        </g>
      )}
      {tone === 'break' && (
        <g className="status-line__mark" strokeWidth="1.5" strokeLinecap="round">
          <line x1="5.6" y1="5.6" x2="10.4" y2="10.4" />
          <line x1="10.4" y1="5.6" x2="5.6" y2="10.4" />
        </g>
      )}
      {tone === 'pulled' && (
        <line
          className="status-line__mark"
          x1="3.7"
          y1="3.7"
          x2="12.3"
          y2="12.3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const { t } = useT()
  const config = CONFIG[status]
  const label = config ? t(config.key) : status
  const tone = config?.tone ?? ('hold' as Tone)
  return (
    <span className={`status-line status-line--${tone}`}>
      <StatusIcon tone={tone} />
      <span className="status-line__label">{label}</span>
    </span>
  )
}
