import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import type { RoomTypeRequest, RoomTypeResponse } from '../../api/types'
import '../../components/crud.css'

export function RoomTypeFormModal({
  roomType,
  onClose,
  onSave,
}: {
  roomType: RoomTypeResponse | null
  onClose: () => void
  onSave: (request: RoomTypeRequest) => Promise<void>
}) {
  const [name, setName] = useState(roomType?.name ?? '')
  const [description, setDescription] = useState(roomType?.description ?? '')
  const [capacity, setCapacity] = useState(String(roomType?.capacity ?? 2))
  const [numberOfRooms, setNumberOfRooms] = useState(String(roomType?.numberOfRooms ?? 1))
  const [bedType, setBedType] = useState(roomType?.bedType ?? '')
  const [roomSize, setRoomSize] = useState(roomType?.roomSize != null ? String(roomType.roomSize) : '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSave({
        name,
        description: description || null,
        capacity: Number(capacity),
        numberOfRooms: Number(numberOfRooms),
        bedType,
        roomSize: roomSize ? Number(roomSize) : null,
      })
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('Kaydedilemedi. Lütfen tekrar deneyin.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={roomType ? 'Oda Tipini Düzenle' : 'Yeni Oda Tipi'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Ad</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </label>
        <label className="form-field">
          <span>Açıklama</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </label>
        <label className="form-field">
          <span>Kapasite</span>
          <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Oda Sayısı</span>
          <input
            type="number"
            min={1}
            value={numberOfRooms}
            onChange={(e) => setNumberOfRooms(e.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Yatak Tipi</span>
          <input value={bedType} onChange={(e) => setBedType(e.target.value)} required placeholder="ör. King Bed" />
        </label>
        <label className="form-field">
          <span>Oda Büyüklüğü (m²)</span>
          <input type="number" min={0} step="0.1" value={roomSize} onChange={(e) => setRoomSize(e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
