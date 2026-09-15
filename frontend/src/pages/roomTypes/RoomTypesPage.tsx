import axios from 'axios'
import { useState } from 'react'
import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { addRoomImage, createRoomType, deleteRoomType, updateRoomType } from '../../api/roomTypes'
import type { RoomTypeRequest, RoomTypeResponse } from '../../api/types'
import type { ApiErrorResponse } from '../../auth/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import { RoomImagesModal } from './RoomImagesModal'
import { RoomTypeFormModal } from './RoomTypeFormModal'
import '../../components/crud.css'

export function RoomTypesPage() {
  const { t } = useT()
  const [refreshKey, setRefreshKey] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRoomType, setEditingRoomType] = useState<RoomTypeResponse | null>(null)
  const [imagesRoomType, setImagesRoomType] = useState<RoomTypeResponse | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const hotel = useAsync(getMyHotel, [])
  const roomTypes = useAsync(() => (hotel.data ? listRoomTypes(hotel.data.id) : Promise.resolve([])), [
    hotel.data?.id,
    refreshKey,
  ])

  const refresh = () => setRefreshKey((key) => key + 1)

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  const handleCreate = async (request: RoomTypeRequest, imageDataUrls?: string[]) => {
    const created = await createRoomType(hotel.data!.id, request)
    for (const dataUrl of imageDataUrls ?? []) {
      await addRoomImage(created.id, dataUrl)
    }
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
    if (!window.confirm(t('roomTypes.deleteConfirm', { name: roomType.name }))) return
    setDeleteError(null)
    try {
      await deleteRoomType(roomType.id)
      refresh()
    } catch (err) {
      console.error('Failed to delete room type:', err)
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setDeleteError(err.response.data.message)
      } else {
        setDeleteError(t('roomTypes.deleteError'))
      }
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>{t('roomTypes.title')}</h2>
        <button type="button" className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
          + {t('roomTypes.newRoomType')}
        </button>
      </div>

      {roomTypes.loading && <LoadingState />}
      {roomTypes.error && <ErrorState message={roomTypes.error} />}
      {deleteError && <ErrorState message={deleteError} />}

      {roomTypes.data && (
        <div className="data-table-wrapper"><table className="data-table">
          <thead>
            <tr>
              <th>{t('common.name')}</th>
              <th>{t('roomTypes.columnCapacity')}</th>
              <th>{t('roomTypes.columnBedType')}</th>
              <th>{t('roomTypes.columnRoomCount')}</th>
              <th>{t('roomTypes.columnNightlyPrice')}</th>
              <th>{t('roomTypes.columnSize')}</th>
              <th>{t('roomTypes.columnImages')}</th>
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
                <td>
                  {roomType.basePrice != null ? `${roomType.basePrice} ${roomType.currency}` : '—'}
                </td>
                <td>{roomType.roomSize ?? '—'}</td>
                <td>
                  <button type="button" className="btn btn--small" onClick={() => setImagesRoomType(roomType)}>
                    {t('roomTypes.imagesCount', { count: roomType.images.length })}
                  </button>
                </td>
                <td>
                  <div className="data-table__actions">
                    <button type="button" className="btn btn--small" onClick={() => setEditingRoomType(roomType)}>
                      {t('common.edit')}
                    </button>
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(roomType)}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {roomTypes.data.length === 0 && (
              <tr>
                <td colSpan={8} className="data-table__empty">
                  {t('roomTypes.empty')}
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
