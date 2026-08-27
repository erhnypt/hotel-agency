export type HotelStatus = 'PENDING' | 'ACTIVE' | 'REJECTED'

export interface StaffResponse {
  id: number
  fullName: string
  email: string
  createdAt: string
}

export interface StaffRequest {
  fullName: string
  email: string
  password: string
}

export interface UpdateProfileRequest {
  fullName: string
  currentPassword?: string
  newPassword?: string
}

export interface HotelResponse {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  description: string | null
  contactPerson: string
  website: string | null
  status: HotelStatus
  createdAt: string
  updatedAt: string
}

export interface HotelUpdateRequest {
  name: string
  description?: string | null
  address: string
  city: string
  country: string
  phone: string
  email: string
  website?: string | null
  contactPerson: string
}

export interface RoomImageResponse {
  id: number
  roomTypeId: number
  imageUrl: string
}

export interface RoomTypeResponse {
  id: number
  hotelId: number
  name: string
  description: string | null
  capacity: number
  numberOfRooms: number
  bedType: string
  roomSize: number | null
  basePrice: number | null
  currency: string
  images: RoomImageResponse[]
  createdAt: string
  updatedAt: string
}

export interface RoomTypeRequest {
  name: string
  description?: string | null
  capacity: number
  numberOfRooms: number
  bedType: string
  roomSize?: number | null
}

export interface ServiceResponse {
  id: number
  hotelId: number
  name: string
  description: string | null
  price: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface ServiceRequest {
  name: string
  description?: string | null
  price: number
  currency: string
}

export interface RoomPriceResponse {
  roomTypeId: number
  basePrice: number | null
  currency: string
}

export interface RoomPriceRequest {
  price: number
  currency: string
}

export interface AvailableRoomResponse {
  roomTypeId: number
  name: string
  description: string | null
  capacity: number
  bedType: string
  totalPrice: number
  currency: string
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED'

export interface CustomerSummary {
  id: number
  firstName: string
  lastName: string
  phone: string
  email: string | null
}

export interface CustomerResponse {
  id: number
  firstName: string
  lastName: string
  phone: string
  email: string | null
  passportNumber: string | null
  nationality: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CustomerRequest {
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  passportNumber?: string | null
  nationality?: string | null
  notes?: string | null
}

export interface ReservationCreateRequest {
  hotelId: number
  roomTypeId: number
  checkIn: string
  checkOut: string
  guests: number
  customerId?: number | null
  newCustomer?: CustomerRequest | null
}

export type BookingRequestStatus = 'NEW' | 'IN_PROGRESS' | 'CLOSED'

export interface BookingRequestCreateRequest {
  propertyId: string
  propertyName: string
  hotelType: string
  propertyCity?: string | null
  countryCode?: string | null
  countryName?: string | null
  checkIn: string
  checkOut: string
  guests: number
  contactName: string
  contactEmail: string
  contactPhone: string
  message?: string | null
}

export interface BookingRequestResponse {
  id: number
  propertyId: string
  propertyName: string
  hotelType: string
  propertyCity: string | null
  countryCode: string | null
  countryName: string | null
  checkIn: string
  checkOut: string
  guests: number
  contactName: string
  contactEmail: string
  contactPhone: string
  message: string | null
  status: BookingRequestStatus
  createdAt: string
  updatedAt: string
}

export interface ReservationResponse {
  id: number
  reservationNumber: string
  hotelId: number
  hotelName: string
  roomTypeId: number
  roomTypeName: string
  customer: CustomerSummary
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  currency: string
  status: ReservationStatus
  createdByUserId: number
  createdAt: string
  updatedAt: string
}

