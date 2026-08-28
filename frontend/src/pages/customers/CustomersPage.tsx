import { useState } from 'react'
import { createCustomer, listCustomers, updateCustomer } from '../../api/customers'
import type { CustomerRequest, CustomerResponse } from '../../api/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import { cardLabel } from '../../lib/card'
import { CustomerFormModal } from './CustomerFormModal'
import '../../components/crud.css'

export function CustomersPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const customers = useAsync(listCustomers, [refreshKey])

  const refresh = () => setRefreshKey((key) => key + 1)

  const handleCreate = async (request: CustomerRequest) => {
    await createCustomer(request)
    setShowCreateModal(false)
    refresh()
  }

  const handleUpdate = async (request: CustomerRequest) => {
    if (!editingCustomer) return
    await updateCustomer(editingCustomer.id, request)
    setEditingCustomer(null)
    refresh()
  }

  return (
    <div>
      <div className="page-header">
        <h2>Müşteriler</h2>
        <button type="button" className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
          + Yeni Müşteri
        </button>
      </div>

      {customers.loading && <LoadingState />}
      {customers.error && <ErrorState message={customers.error} />}

      {customers.data && (
        <div className="data-table-wrapper"><table className="data-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Telefon</th>
              <th>E-posta</th>
              <th>Uyruk</th>
              <th>Kart</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.data.map((customer) => (
              <tr key={customer.id}>
                <td>
                  {customer.firstName} {customer.lastName}
                </td>
                <td>{customer.phone}</td>
                <td>{customer.email ?? '—'}</td>
                <td>{customer.nationality ?? '—'}</td>
                <td>
                  {cardLabel(customer.cardBrand, customer.cardNumber) ?? '—'}
                  {customer.cardNote && (
                    <>
                      <br />
                      <span className="data-table__muted">Not: {customer.cardNote}</span>
                    </>
                  )}
                </td>
                <td>
                  <div className="data-table__actions">
                    <button type="button" className="btn btn--small" onClick={() => setEditingCustomer(customer)}>
                      Düzenle
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.data.length === 0 && (
              <tr>
                <td colSpan={6} className="data-table__empty">
                  Henüz müşteri yok.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      )}

      {showCreateModal && (
        <CustomerFormModal customer={null} onClose={() => setShowCreateModal(false)} onSave={handleCreate} />
      )}
      {editingCustomer && (
        <CustomerFormModal customer={editingCustomer} onClose={() => setEditingCustomer(null)} onSave={handleUpdate} />
      )}
    </div>
  )
}
