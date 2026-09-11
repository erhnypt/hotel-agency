import axios from 'axios'
import { useState } from 'react'
import { addRoomImage, deleteRoomImage } from '../../api/roomTypes'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import { ImageUploadField } from '../../components/ImageUploadField'
import type { RoomTypeResponse } from '../../api/types'
import '../../components/crud.css'

export function RoomImagesModal({
  roomType,
  onClose,
  onChanged,
}: {
  roomType: RoomTypeResponse
  onClose: () => void
  onChanged: () => void
}) {
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (dataUrl: string) => {
    try {
      await addRoomImage(roomType.id, dataUrl)
      setError(null)
      onChanged()
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('Görsel eklenemedi.')
      }
      throw err
    }
  }

  const handleRemove = async (imageId: string) => {
    await deleteRoomImage(Number(imageId))
    onChanged()
  }

  return (
    <Modal title={`${roomType.name} — Görseller`} onClose={onClose}>
      <ImageUploadField
        images={roomType.images.map((image) => ({ key: String(image.id), url: image.imageUrl }))}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      {error && <p className="form-error">{error}</p>}
    </Modal>
  )
}
