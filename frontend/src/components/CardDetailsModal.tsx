import { useEffect, useState } from 'react'
import { revealReservationCard } from '../api/reservations'
import { formatCardNumber } from '../lib/card'
import { Modal } from './Modal'
import { LoadingState } from './PageState'
import './CardDetailsModal.css'

export function CardDetailsModal({ reservationId, onClose }: { reservationId: number; onClose: () => void }) {
  const [details, setDetails] = useState<Awaited<ReturnType<typeof revealReservationCard>> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    revealReservationCard(reservationId)
      .then((data) => {
        if (!cancelled) setDetails(data)
      })
      .catch(() => {
        if (!cancelled) setError('Kart bilgileri alınamadı.')
      })
    return () => {
      cancelled = true
    }
  }, [reservationId])

  return (
    <Modal title="Kart Bilgileri" onClose={onClose}>
      {error && <p className="form-error">{error}</p>}
      {!details && !error && <LoadingState />}
      {details && (
        <div className="card-details">
          <div className="card-details__face">
            <div className="card-details__brand">{details.cardBrand ?? 'Kart'}</div>
            <div className="card-details__number">
              {details.cardNumber ? formatCardNumber(details.cardNumber) : '—'}
            </div>
            <div className="card-details__row">
              <div>
                <span className="card-details__label">Kart Sahibi</span>
                <span className="card-details__value">
                  {details.cardHolder || `${details.customerFirstName} ${details.customerLastName}`}
                </span>
              </div>
              <div>
                <span className="card-details__label">SKT</span>
                <span className="card-details__value">{details.cardExpiry ?? '—'}</span>
              </div>
              <div>
                <span className="card-details__label">CVV</span>
                <span className="card-details__value">{details.cardNote ?? '—'}</span>
              </div>
            </div>
          </div>
          <p className="card-details__notice">
            Bu görüntüleme kaydedildi ve acenteye bildirim olarak iletildi.
          </p>
        </div>
      )}
    </Modal>
  )
}
