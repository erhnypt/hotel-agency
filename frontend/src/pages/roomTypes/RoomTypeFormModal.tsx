import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { ApiErrorResponse } from '../../auth/types'
import { Modal } from '../../components/Modal'
import { ImageUploadField } from '../../components/ImageUploadField'
import type { RoomTypeRequest, RoomTypeResponse } from '../../api/types'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

export function RoomTypeFormModal({
  roomType,
  onClose,
  onSave,
}: {
  roomType: RoomTypeResponse | null
  onClose: () => void
  onSave: (request: RoomTypeRequest, imageDataUrls?: string[]) => Promise<void>
}) {
  const { t } = useT()
  const [name, setName] = useState(roomType?.name ?? '')
  const [description, setDescription] = useState(roomType?.description ?? '')
  const [capacity, setCapacity] = useState(String(roomType?.capacity ?? 2))
  const [numberOfRooms, setNumberOfRooms] = useState(String(roomType?.numberOfRooms ?? 1))
  const [bedType, setBedType] = useState(roomType?.bedType ?? '')
  const [roomSize, setRoomSize] = useState(roomType?.roomSize != null ? String(roomType.roomSize) : '')
  const [stagedImages, setStagedImages] = useState<{ key: string; url: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSave(
        {
          name,
          description: description || null,
          capacity: Number(capacity),
          numberOfRooms: Number(numberOfRooms),
          bedType,
          roomSize: roomSize ? Number(roomSize) : null,
        },
        roomType ? undefined : stagedImages.map((image) => image.url),
      )
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError(t('roomTypeForm.saveError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={roomType ? t('roomTypeForm.editTitle') : t('roomTypeForm.createTitle')} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="form-field">
          <span>{t('common.name')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </label>
        <label className="form-field">
          <span>{t('common.description')}</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </label>
        <label className="form-field">
          <span>{t('roomTypes.columnCapacity')}</span>
          <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>{t('roomTypes.columnRoomCount')}</span>
          <input
            type="number"
            min={1}
            value={numberOfRooms}
            onChange={(e) => setNumberOfRooms(e.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>{t('roomTypes.columnBedType')}</span>
          <input
            value={bedType}
            onChange={(e) => setBedType(e.target.value)}
            required
            placeholder={t('roomTypeForm.bedTypePlaceholder')}
          />
        </label>
        <label className="form-field">
          <span>{t('roomTypeForm.roomSizeLabel')}</span>
          <input type="number" min={0} step="0.1" value={roomSize} onChange={(e) => setRoomSize(e.target.value)} />
        </label>

        {!roomType && (
          <label className="form-field">
            <span>{t('roomTypeForm.photosLabel')}</span>
            <ImageUploadField
              images={stagedImages}
              onAdd={(dataUrl) =>
                setStagedImages((prev) => [...prev, { key: crypto.randomUUID(), url: dataUrl }])
              }
              onRemove={(key) => setStagedImages((prev) => prev.filter((image) => image.key !== key))}
            />
          </label>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
