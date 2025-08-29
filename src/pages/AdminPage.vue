<template>
  <div class="admin-page bg-light">
    <!-- Header -->
    <div class="py-4 bg-white shadow-sm">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-md-6">
            <h1 class="h3 mb-0 fw-bold text-dark">
              <i class="bi bi-shield-lock me-2" style="color: #2c3e33"></i>
              {{ $t('admin.title') }}
            </h1>
          </div>
          <div class="col-12 col-md-6 text-end mt-3 mt-md-0">
            <!-- Language Switcher -->
            <div class="dropdown d-inline-block me-3">
              <button
                class="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button"
                id="adminLanguageDropdown"
                data-bs-toggle="dropdown"
              >
                {{ locale.toUpperCase() }}
              </button>
              <ul class="dropdown-menu">
                <li>
                  <button
                    class="dropdown-item"
                    @click="changeLanguage('en')"
                    :class="{ active: locale === 'en' }"
                  >
                    EN
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item"
                    @click="changeLanguage('hr')"
                    :class="{ active: locale === 'hr' }"
                  >
                    HR
                  </button>
                </li>
              </ul>
            </div>
            
            <router-link to="/" class="btn btn-outline-secondary">
              <i class="bi bi-house me-2"></i>{{ $t('admin.backToSite') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="container py-4">
      <ul class="nav nav-pills mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link active" 
            id="bookings-tab" 
            data-bs-toggle="pill" 
            data-bs-target="#bookings" 
            type="button" 
            role="tab"
          >
            <i class="bi bi-calendar-check me-2"></i>{{ $t('admin.tabs.calendar') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            id="add-booking-tab" 
            data-bs-toggle="pill" 
            data-bs-target="#add-booking" 
            type="button" 
            role="tab"
          >
            <i class="bi bi-plus-circle me-2"></i>{{ $t('admin.tabs.addBooking') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            id="manage-bookings-tab" 
            data-bs-toggle="pill" 
            data-bs-target="#manage-bookings" 
            type="button" 
            role="tab"
          >
            <i class="bi bi-table me-2"></i>{{ $t('admin.tabs.manageBookings') }}
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Bookings Calendar Tab -->
        <div class="tab-pane fade show active" id="bookings" role="tabpanel">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-calendar3 me-2"></i>{{ $t('admin.tabs.calendar') }}
              </h5>
            </div>
            <div class="card-body">
              <AdminCalendar />
            </div>
          </div>
        </div>

        <!-- Add Booking Tab -->
        <div class="tab-pane fade" id="add-booking" role="tabpanel">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-plus-circle me-2"></i>{{ $t('admin.tabs.addBooking') }}
              </h5>
            </div>
            <div class="card-body">
              <AddBookingForm />
            </div>
          </div>
        </div>

        <!-- Manage Bookings Tab -->
        <div class="tab-pane fade" id="manage-bookings" role="tabpanel">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-table me-2"></i>{{ $t('admin.tabs.manageBookings') }}
              </h5>
            </div>
            <div class="card-body">
              <BookingsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminCalendar from '@/components/AdminCalendar.vue'
import AddBookingForm from '@/components/AddBookingForm.vue'
import BookingsTable from '@/components/BookingsTable.vue'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()
const { t: $t, locale } = useI18n()

// Language switching
const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

onMounted(async () => {
  // Initialize calendar first
  bookingStore.initializeCalendar()
  // Then load bookings data when admin page is mounted
  await bookingStore.fetchBookedSlots()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
}

.nav-pills .nav-link {
  color: #6c757d;
  background: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
  background-color: rgba(44, 62, 51, 0.1);
  color: #2c3e33;
}

.nav-pills .nav-link.active {
  background-color: #2c3e33;
  color: white;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
  border-radius: 12px 12px 0 0 !important;
}

.btn-outline-secondary {
  border-color: #2c3e33;
  color: #2c3e33;
}

.btn-outline-secondary:hover {
  background-color: #2c3e33;
  border-color: #2c3e33;
  color: white;
}
</style>