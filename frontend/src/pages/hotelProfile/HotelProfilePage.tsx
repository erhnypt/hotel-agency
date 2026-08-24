import axios from 'axios'
import { useEffect, useState, type FormEvent } from 'react'
import { getMyHotel, updateHotel } from '../../api/hotels'
import type { ApiErrorResponse } from '../../auth/types'
import { ErrorState, LoadingState } from '../../components/PageState'
import { useAsync } from '../../hooks/useAsync'
import '../../components/crud.css'

export function HotelProfilePage() {
  const hotel = useAsync(getMyHotel, [])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [contactPerson, setContactPerson] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!hotel.data) return
    setName(hotel.data.name)
    setDescription(hotel.data.description ?? '')
    setAddress(hotel.data.address)
    setCity(hotel.data.city)
    setCountry(hotel.data.country)
    setPhone(hotel.data.phone)
    setEmail(hotel.data.email)
    setWebsite(hotel.data.website ?? '')
    setContactPerson(hotel.data.contactPerson)
  }, [hotel.data])

  if (hotel.loading) return <LoadingState />
  if (hotel.error) return <ErrorState message={hotel.error} />
  if (!hotel.data) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)
    try {
      await updateHotel(hotel.data!.id, {
        name,
        description: description || null,
        address,
        city,
        country,
        phone,
        email,
        website: website || null,
        contactPerson,
      })
      setSuccess(true)
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
        setError(err.response.data.message)
      } else {
        setError('Kaydedilemedi. Lütfen tekrar deneyin.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Otel Profili</h2>
      </div>

      <form onSubmit={handleSubmit} className="form--narrow">
        <label className="form-field">
          <span>Otel Adı</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Açıklama</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </label>
        <label className="form-field">
          <span>Adres</span>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Şehir</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Ülke</span>
          <input value={country} onChange={(e) => setCountry(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Telefon</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>E-posta</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="form-field">
          <span>Web Sitesi</span>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
        <label className="form-field">
          <span>Yetkili Kişi</span>
          <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">Kaydedildi.</p>}

        <div className="form-actions form-actions--start">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
