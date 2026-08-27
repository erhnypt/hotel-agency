import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { StaffPage } from './pages/staff/StaffPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ADMIN_MENU, HOTEL_MENU, STAFF_MENU } from './layout/menus'
import { RoleShell } from './layout/RoleShell'
import { AgencyAdminDashboard } from './pages/dashboard/AgencyAdminDashboard'
import { AgencyStaffDashboard } from './pages/dashboard/AgencyStaffDashboard'
import { HotelAdminDashboard } from './pages/dashboard/HotelAdminDashboard'
import { BookingRequestsPage } from './pages/bookingRequests/BookingRequestsPage'
import { CustomersPage } from './pages/customers/CustomersPage'
import { LandingPage } from './pages/landing/LandingPage'
import { AboutPage } from './pages/public/AboutPage'
import { ContactPage } from './pages/public/ContactPage'
import { FaqPage } from './pages/public/FaqPage'
import { PrivacyPage } from './pages/public/PrivacyPage'
import { TermsPage } from './pages/public/TermsPage'
import { HotelProfilePage } from './pages/hotelProfile/HotelProfilePage'
import { HotelsPage } from './pages/hotels/HotelsPage'
import { LoginPage } from './pages/LoginPage'
import { HotelRegisterPage } from './pages/HotelRegisterPage'
import { PricesPage } from './pages/prices/PricesPage'
import { NewReservationPage } from './pages/reservations/NewReservationPage'
import { ReservationsPage } from './pages/reservations/ReservationsPage'
import { RoomTypesPage } from './pages/roomTypes/RoomTypesPage'
import { ServicesPage } from './pages/services/ServicesPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/sss" element={<FaqPage />} />
        <Route path="/gizlilik" element={<PrivacyPage />} />
        <Route path="/kosullar" element={<TermsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<HotelRegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<RoleShell role="AGENCY_ADMIN" panelTitle="Acente Admin Paneli" menu={ADMIN_MENU} />}>
            <Route index element={<AgencyAdminDashboard />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="reservations/new" element={<NewReservationPage />} />
            <Route path="booking-requests" element={<BookingRequestsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/staff" element={<RoleShell role="AGENCY_STAFF" panelTitle="Acente Çalışanı Paneli" menu={STAFF_MENU} />}>
            <Route index element={<AgencyStaffDashboard />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="reservations/new" element={<NewReservationPage />} />
            <Route path="booking-requests" element={<BookingRequestsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/hotel" element={<RoleShell role="HOTEL_ADMIN" panelTitle="Otel Paneli" menu={HOTEL_MENU} />}>
            <Route index element={<HotelAdminDashboard />} />
            <Route path="profile" element={<HotelProfilePage />} />
            <Route path="rooms" element={<RoomTypesPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="prices" element={<PricesPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
