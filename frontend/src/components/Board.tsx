import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { ReservationResponse } from '../api/types'
import { StatusBadge } from './StatusBadge'
import './crud.css'
import './Board.css'

export interface BoardStripItem {
  label: string
  value: number | string
  to?: string
}

export function BoardStrip({ items }: { items: BoardStripItem[] }) {
  return (
    <div className="board-strip">
      {items.map((item, i) => {
        const inner = (
          <>
            <span className="board-strip__value">{item.value}</span>
            <span className="board-strip__label">{item.label}</span>
          </>
        )
        return item.to ? (
          <Link key={i} to={item.to} className="board-strip__item board-strip__item--link">
            {inner}
          </Link>
        ) : (
          <div key={i} className="board-strip__item">
            {inner}
          </div>
        )
      })}
    </div>
  )
}

export function BoardSection({
  title,
  count,
  children,
}: {
  title: string
  count?: number
  children: ReactNode
}) {
  return (
    <section className="board-section">
      <h3 className="board-section__title">
        {title}
        {count !== undefined && <span className="board-section__count">{count}</span>}
      </h3>
      {children}
    </section>
  )
}

export function BoardEmpty({ children }: { children: ReactNode }) {
  return <p className="board-empty">{children}</p>
}

export function ReservationMiniTable({
  items,
  showHotel = true,
  emptyLabel,
}: {
  items: ReservationResponse[]
  showHotel?: boolean
  emptyLabel: string
}) {
  if (items.length === 0) return <BoardEmpty>{emptyLabel}</BoardEmpty>

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            {showHotel && <th>Otel</th>}
            <th>Oda Tipi</th>
            <th>Misafir</th>
            <th>Giriş</th>
            <th>Çıkış</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.reservationNumber}</td>
              {showHotel && <td>{r.hotelName}</td>}
              <td>{r.roomTypeName}</td>
              <td>
                {r.customer.firstName} {r.customer.lastName}
              </td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut}</td>
              <td>
                <StatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
