import { useState } from 'react'
import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { createRoomType, deleteRoomType, updateRoomType } from '../../api/roomTypes'
import type { RoomTypeRequest, RoomTypeResponse } from '../../api/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { RoomImagesModal } from './RoomImagesModal'
import { RoomTypeFormModal } from './RoomTypeFormModal'
import '../../components/crud.css'

export function RoomTypesPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRoomType, setEditingRoomType] = useState<RoomTypeResponse | null>(null)
  const [imagesRoomType, setImagesRoomType] = useState<RoomTypeResponse | null>(null)

  const hotel = useAsync(getMyHotel, [])
  const roomTypes = useAsync(() => (hotel.data ? listRoomTypes(hotel.data.id) : Promise.resolve([])), [
    hotel.data?.id,
    refreshKey,
  ])

  const refresh = () => setRefreshKey((key) => key + 1)

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  const handleCreate = async (request: RoomTypeRequest) => {
    await createRoomType(hotel.data!.id, request)
    setShowCreateModal(false)
    refresh()
  }

  const handleUpdate = async (request: RoomTypeRequest) => {
    if (!editingRoomType) return
    await updateRoomType(editingRoomType.id, request)
    setEditingRoomType(null)
    refresh()
  }

  const handleDelete = async (roomType: RoomTypeResponse) => {
    if (!window.confirm(`"${roomType.name}" oda tipini silmek istediğinize emin misiniz?`)) return
    await deleteRoomType(roomType.id)
    refresh()
  }

  return (
    <div>
      <div className="page-header">
        <h2>Oda Tipleri</h2>
        <button type="button" className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
          + Yeni Oda Tipi
        </button>
      </div>

      {roomTypes.loading && <LoadingState />}
      {roomTypes.error && <ErrorState message={roomTypes.error} />}

      {roomTypes.data && (
        <div className="data-table-wrapper"><table className="data-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Kapasite</th>
              <th>Yatak Tipi</th>
              <th>Oda Sayısı</th>
              <th>m²</th>
              <th>Görseller</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.data.map((roomType) => (
              <tr key={roomType.id}>
                <td>{roomType.name}</td>
                <td>{roomType.capacity}</td>
                <td>{roomType.bedType}</td>
                <td>{roomType.numberOfRooms}</td>
                <td>{roomType.roomSize ?? '—'}</td>
                <td>
                  <button type="button" className="btn btn--small" onClick={() => setImagesRoomType(roomType)}>
                    {roomType.images.length} görsel
                  </button>
                </td>
                <td>
                  <div className="data-table__actions">
                    <button type="button" className="btn btn--small" onClick={() => setEditingRoomType(roomType)}>
                      Düzenle
                    </button>
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(roomType)}
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {roomTypes.data.length === 0 && (
              <tr>
                <td colSpan={7} className="data-table__empty">
                  Henüz oda tipi yok.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      )}

      {showCreateModal && (
        <RoomTypeFormModal roomType={null} onClose={() => setShowCreateModal(false)} onSave={handleCreate} />
      )}
      {editingRoomType && (
        <RoomTypeFormModal
          roomType={editingRoomType}
          onClose={() => setEditingRoomType(null)}
          onSave={handleUpdate}
        />
      )}
      {imagesRoomType && (
        <RoomImagesModal
          roomType={roomTypes.data?.find((rt) => rt.id === imagesRoomType.id) ?? imagesRoomType}
          onClose={() => setImagesRoomType(null)}
          onChanged={refresh}
        />
      )}
    </div>
  )
}
