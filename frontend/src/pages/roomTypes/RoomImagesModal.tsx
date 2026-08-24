import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { addRoomImage, deleteRoomImage } from '../../api/roomTypes'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import type { RoomTypeResponse } from '../../api/types'
import '../../components/crud.css'
import './RoomImagesModal.css'

export function RoomImagesModal({
  roomType,
  onClose,
  onChanged,
}: {
  roomType: RoomTypeResponse
  onClose: () => void
  onChanged: () => void
}) {
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await addRoomImage(roomType.id, imageUrl)
      setImageUrl('')
      onChanged()
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('Görsel eklenemedi.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (imageId: number) => {
    await deleteRoomImage(imageId)
    onChanged()
  }

  return (
    <Modal title={`${roomType.name} — Görseller`} onClose={onClose}>
      <form onSubmit={handleAdd} className="inline-form">
        <label className="form-field inline-form__grow">
          <span>Görsel URL</span>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            placeholder="https://..."
            autoFocus
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          Ekle
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {roomType.images.length === 0 && <p className="page-state">Henüz görsel eklenmemiş.</p>}

      <ul className="room-images-list">
        {roomType.images.map((image) => (
          <li key={image.id} className="room-images-list__item">
            <span className="room-images-list__url" title={image.imageUrl}>
              {image.imageUrl}
            </span>
            <button type="button" className="btn btn--small btn--danger" onClick={() => handleDelete(image.id)}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
