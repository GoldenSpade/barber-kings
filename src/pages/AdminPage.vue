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

    <!-- Main Calendar -->
    <div class="container py-4">
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

    <!-- Modal for Adding Booking -->
    <div class="modal fade" id="addBookingModal" tabindex="-1" aria-labelledby="addBookingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addBookingModalLabel">
              <i class="bi bi-plus-circle me-2"></i>{{ $t('admin.tabs.addBooking') }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal('addBookingModal')" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <AddBookingForm @booking-added="onBookingAdded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Editing Booking -->
    <div class="modal fade" id="editBookingModal" tabindex="-1" aria-labelledby="editBookingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editBookingModalLabel">
              <i class="bi bi-pencil-square me-2"></i>{{ $t('admin.editBooking.title') }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal('editBookingModal')" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Edit form will be here -->
            <div v-if="selectedBooking">
              <div class="mb-3">
                <strong>{{ $t('admin.editBooking.name') }}:</strong> {{ selectedBooking.name }}
              </div>
              <div class="mb-3">
                <strong>{{ $t('admin.editBooking.phone') }}:</strong> {{ selectedBooking.phone }}
              </div>
              <div class="mb-3">
                <strong>{{ $t('admin.editBooking.status') }}:</strong>
                <select v-model="selectedBooking.status" class="form-select mt-2" @change="updateBookingStatus">
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminCalendar from '@/components/AdminCalendar.vue'
import AddBookingForm from '@/components/AddBookingForm.vue'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()
const { t: $t, locale } = useI18n()
const selectedBooking = ref(null)

// Language switching
const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

// Handle click on empty slot to show add booking modal
const handleAddBookingFromCalendar = (event) => {
  const { date, time, dayDate } = event.detail
  
  // Determine location based on current filter or default
  const locationFilter = document.querySelector('select[data-location-filter]')?.value || ''
  const location = locationFilter || 'Martinkovac' // Default location
  
  console.log('Showing add booking modal for:', { date, time, location })
  
  // Pre-fill form data
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('prefill-booking-form', {
      detail: { date, time, location }
    }))
  }, 100)
  
  // Show modal using Bootstrap data attributes (more reliable)
  const modalElement = document.getElementById('addBookingModal')
  if (modalElement) {
    // Use Bootstrap's data-bs-toggle approach
    modalElement.style.display = 'block'
    modalElement.classList.add('show')
    modalElement.setAttribute('aria-modal', 'true')
    modalElement.setAttribute('role', 'dialog')
    modalElement.removeAttribute('aria-hidden')
    
    // Add backdrop
    const backdrop = document.createElement('div')
    backdrop.className = 'modal-backdrop fade show'
    backdrop.id = 'modal-backdrop'
    backdrop.addEventListener('click', () => closeModal('addBookingModal'))
    document.body.appendChild(backdrop)
    
    // Prevent body scrolling
    document.body.classList.add('modal-open')
  }
}

// Handle click on existing booking to show edit modal
const handleEditBookingFromCalendar = (event) => {
  selectedBooking.value = event.detail.booking
  
  console.log('Showing edit booking modal for:', event.detail.booking)
  
  // Show edit modal manually
  const modalElement = document.getElementById('editBookingModal')
  if (modalElement) {
    modalElement.style.display = 'block'
    modalElement.classList.add('show')
    modalElement.setAttribute('aria-modal', 'true')
    modalElement.setAttribute('role', 'dialog')
    modalElement.removeAttribute('aria-hidden')
    
    // Add backdrop if it doesn't exist
    if (!document.getElementById('modal-backdrop')) {
      const backdrop = document.createElement('div')
      backdrop.className = 'modal-backdrop fade show'
      backdrop.id = 'modal-backdrop'
      backdrop.addEventListener('click', () => closeModal('editBookingModal'))
      document.body.appendChild(backdrop)
    }
    
    // Prevent body scrolling
    document.body.classList.add('modal-open')
  }
}

// Function to close modal manually
const closeModal = (modalId) => {
  const modalElement = document.getElementById(modalId)
  if (modalElement) {
    modalElement.style.display = 'none'
    modalElement.classList.remove('show')
    modalElement.setAttribute('aria-hidden', 'true')
    modalElement.removeAttribute('aria-modal')
    modalElement.removeAttribute('role')
  }
  
  // Remove backdrop
  const backdrop = document.getElementById('modal-backdrop')
  if (backdrop) {
    backdrop.remove()
  }
  
  // Restore body scrolling
  document.body.classList.remove('modal-open')
}

// Handle booking added successfully
const onBookingAdded = () => {
  // Close modal and refresh calendar
  closeModal('addBookingModal')
  
  // Refresh bookings
  bookingStore.fetchBookedSlots(true)
}

// Update booking status
const updateBookingStatus = async () => {
  if (!selectedBooking.value) return
  
  try {
    // Use GET request with JSONP for CORS
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwXGJVD8C-k5P-RaKHZ_Vp-oFZhBUQM5FMmRGU4LqHOKT9vEr1gvV8IZp0n4TxnzXPQhg/exec'
    const url = `${scriptUrl}?action=updateStatus&id=${encodeURIComponent(selectedBooking.value.id)}&newStatus=${encodeURIComponent(selectedBooking.value.status)}&callback=handleUpdateResult`
    
    // Create JSONP request
    const callbackName = 'handleUpdateResult'
    window[callbackName] = (result) => {
      if (result.success) {
        console.log('Status updated successfully:', result.message)
        // Refresh bookings to show updated status
        bookingStore.fetchBookedSlots(true)
      } else {
        console.error('Failed to update status:', result.message)
      }
      
      // Clean up
      delete window[callbackName]
      document.head.removeChild(script)
    }
    
    // Create script element for JSONP
    const script = document.createElement('script')
    script.src = url
    document.head.appendChild(script)
    
  } catch (error) {
    console.error('Error updating booking status:', error)
  }
}

onMounted(async () => {
  // Initialize calendar first
  bookingStore.initializeCalendar()
  // Then load bookings data when admin page is mounted with admin privileges
  await bookingStore.fetchBookedSlots(true) // isAdmin = true for full data access
  
  // Add event listeners for calendar interactions
  window.addEventListener('admin-add-booking', handleAddBookingFromCalendar)
  window.addEventListener('admin-edit-booking', handleEditBookingFromCalendar)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('admin-add-booking', handleAddBookingFromCalendar)
  window.removeEventListener('admin-edit-booking', handleEditBookingFromCalendar)
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
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