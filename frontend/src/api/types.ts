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
  createdAt: string
}

export interface ServiceRequest {
  name: string
  description?: string | null
}

export interface RoomPriceResponse {
  id: number
  roomTypeId: number
  date: string
  price: number
  currency: string
  updatedAt: string
}

export interface RoomPriceRequest {
  date: string
  price: number
  currency: string
}

export interface RoomAvailabilityResponse {
  id: number
  roomTypeId: number
  date: string
  availableRooms: number
  updatedAt: string
}

export interface RoomAvailabilityRequest {
  date: string
  availableRooms: number
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
  createdAt: string
  updatedAt: string
}

