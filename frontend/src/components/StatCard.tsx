import { Link } from 'react-router-dom'
import './StatCard.css'

export function StatCard({ label, value, to }: { label: string; value: number | string; to?: string }) {
  const content = (
    <>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="stat-card stat-card--link">
        {content}
      </Link>
    )
  }

  return <div className="stat-card">{content}</div>
}
