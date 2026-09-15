import { Modal } from '../../components/Modal'
import type { RoomTypeResponse } from '../../api/types'
import { useT } from '../../i18n/useT'
import '../../components/crud.css'

/** Read-only image viewer for agency staff/admin — hotels manage their own photos. */
export function HotelRoomImagesModal({
  roomType,
  onClose,
}: {
  roomType: RoomTypeResponse
  onClose: () => void
}) {
  const { t } = useT()
  return (
    <Modal title={`${roomType.name} — ${t('hotelRoomImages.title')}`} onClose={onClose}>
      {roomType.images.length === 0 ? (
        <p className="page-state">{t('hotelRoomImages.empty')}</p>
      ) : (
        <div className="room-image-grid">
          {roomType.images.map((image) => (
            <img key={image.id} src={image.imageUrl} alt="" />
          ))}
        </div>
      )}
    </Modal>
  )
}
