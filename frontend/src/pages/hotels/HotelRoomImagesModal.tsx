import { Modal } from '../../components/Modal'
import type { RoomTypeResponse } from '../../api/types'
import '../../components/crud.css'

/** Read-only image viewer for agency staff/admin — hotels manage their own photos. */
export function HotelRoomImagesModal({
  roomType,
  onClose,
}: {
  roomType: RoomTypeResponse
  onClose: () => void
}) {
  return (
    <Modal title={`${roomType.name} — Görseller`} onClose={onClose}>
      {roomType.images.length === 0 ? (
        <p className="page-state">Bu oda tipi için görsel yüklenmemiş.</p>
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
