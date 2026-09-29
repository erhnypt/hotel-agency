import { useState } from 'react'
import { getMyHotel, listRoomTypes } from '../../api/hotels'
import { createService, deleteService, listServices, updateService } from '../../api/services'
import type { ServiceRequest, ServiceResponse } from '../../api/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { useT } from '../../i18n/useT'
import { ServiceFormModal } from './ServiceFormModal'
import '../../components/crud.css'

export function ServicesPage() {
  const { t } = useT()
  const [refreshKey, setRefreshKey] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null)

  const hotel = useAsync(getMyHotel, [])
  const services = useAsync(
    () => (hotel.data ? listServices(hotel.data.id) : Promise.resolve([])),
    [hotel.data?.id, refreshKey],
  )
  const roomTypes = useAsync(
    () => (hotel.data ? listRoomTypes(hotel.data.id) : Promise.resolve([])),
    [hotel.data?.id],
  )
  const roomCurrency = roomTypes.data?.find((roomType) => roomType.currency)?.currency ?? null

  const refresh = () => setRefreshKey((key) => key + 1)

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />

  const handleCreate = async (request: ServiceRequest) => {
    await createService(hotel.data!.id, request)
    setShowCreateModal(false)
    refresh()
  }

  const handleUpdate = async (request: ServiceRequest) => {
    if (!editingService) return
    await updateService(editingService.id, request)
    setEditingService(null)
    refresh()
  }

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(t('services.confirmDelete', { name }))) return
    await deleteService(id)
    refresh()
  }

  return (
    <div>
      <div className="page-header">
        <h2>{t('services.title')}</h2>
        <button type="button" className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
          + {t('services.addButton')}
        </button>
      </div>

      {services.loading && <LoadingState />}
      {services.error && <ErrorState message={services.error} />}

      {services.data && roomCurrency && services.data.length > 0 && (
        <p className="form-hint">{t('services.currencyMismatchHint', { roomCurrency })}</p>
      )}

      {services.data && (
        <div className="data-table-wrapper"><table className="data-table">
          <thead>
            <tr>
              <th>{t('common.name')}</th>
              <th>{t('common.description')}</th>
              <th>{t('common.price')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.data.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.description ?? '—'}</td>
                <td>
                  {service.price} {service.currency}
                  {roomCurrency && service.currency !== roomCurrency && (
                    <>
                      {' '}
                      <span className="data-table__muted">⚠</span>
                    </>
                  )}
                </td>
                <td>
                  <div className="data-table__actions">
                    <button type="button" className="btn btn--small" onClick={() => setEditingService(service)}>
                      {t('common.edit')}
                    </button>
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(service.id, service.name)}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.data.length === 0 && (
              <tr>
                <td colSpan={4} className="data-table__empty">
                  {t('services.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      )}

      {showCreateModal && (
        <ServiceFormModal
          service={null}
          roomCurrency={roomCurrency}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}
      {editingService && (
        <ServiceFormModal
          service={editingService}
          roomCurrency={roomCurrency}
          onClose={() => setEditingService(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  )
}
