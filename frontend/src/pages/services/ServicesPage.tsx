import { useState } from 'react'
import { getMyHotel } from '../../api/hotels'
import { createService, deleteService, listServices } from '../../api/services'
import type { ServiceRequest } from '../../api/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { ServiceFormModal } from './ServiceFormModal'
import '../../components/crud.css'

export function ServicesPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const hotel = useAsync(getMyHotel, [])
  const services = useAsync(
    () => (hotel.data ? listServices(hotel.data.id) : Promise.resolve([])),
    [hotel.data?.id, refreshKey],
  )

  const refresh = () => setRefreshKey((key) => key + 1)

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  const handleCreate = async (request: ServiceRequest) => {
    await createService(hotel.data!.id, request)
    setShowCreateModal(false)
    refresh()
  }

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" hizmetini silmek istediğinize emin misiniz?`)) return
    await deleteService(id)
    refresh()
  }

  return (
    <div>
      <div className="page-header">
        <h2>Hizmetler</h2>
        <button type="button" className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
          + Yeni Hizmet
        </button>
      </div>

      {services.loading && <LoadingState />}
      {services.error && <ErrorState message={services.error} />}

      {services.data && (
        <div className="data-table-wrapper"><table className="data-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Açıklama</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.data.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.description ?? '—'}</td>
                <td>
                  <div className="data-table__actions">
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(service.id, service.name)}
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.data.length === 0 && (
              <tr>
                <td colSpan={3} className="data-table__empty">
                  Henüz hizmet yok.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      )}

      {showCreateModal && <ServiceFormModal onClose={() => setShowCreateModal(false)} onSave={handleCreate} />}
    </div>
  )
}
