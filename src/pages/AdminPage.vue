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
            <!-- Edit form -->
            <div v-if="selectedBooking" class="edit-booking-form">
              <form @submit.prevent="saveBookingChanges">
                <div class="row">
                  <!-- Customer Information -->
                  <div class="col-md-6 mb-4">
                    <h6 class="fw-bold mb-3">
                      <i class="bi bi-person me-2"></i>{{ $t('admin.editBooking.customerInfo') }}
                    </h6>
                    
                    <div class="mb-3">
                      <label class="form-label">{{ $t('admin.editBooking.name') }} *</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="selectedBooking.name"
                        required
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">{{ $t('admin.editBooking.phone') }} *</label>
                      <input
                        type="tel"
                        class="form-control"
                        v-model="selectedBooking.phone"
                        required
                      />
                    </div>
                  </div>

                  <!-- Booking Details -->
                  <div class="col-md-6 mb-4">
                    <h6 class="fw-bold mb-3">
                      <i class="bi bi-calendar-event me-2"></i>{{ $t('admin.editBooking.bookingDetails') }}
                    </h6>
                    
                    <div class="mb-3">
                      <label class="form-label">{{ $t('admin.editBooking.location') }}</label>
                      <input
                        type="text"
                        class="form-control readonly-field"
                        :value="selectedBooking.location"
                        readonly
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">{{ $t('admin.editBooking.dateTime') }}</label>
                      <div class="row">
                        <div class="col-6">
                          <input
                            type="text"
                            class="form-control readonly-field"
                            :value="selectedBooking.date"
                            readonly
                          />
                        </div>
                        <div class="col-6">
                          <input
                            type="text"
                            class="form-control readonly-field"
                            :value="selectedBooking.time"
                            readonly
                          />
                        </div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">{{ $t('admin.editBooking.status') }} *</label>
                      <select v-model="selectedBooking.status" class="form-select" required>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-3 justify-content-between">
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="confirmDeleteBooking"
                    :disabled="isDeletingBooking"
                  >
                    <span v-if="isDeletingBooking" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-trash me-2"></i>
                    {{ isDeletingBooking ? $t('admin.editBooking.deleting') : $t('admin.editBooking.deleteBooking') }}
                  </button>
                  
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="closeModal('editBookingModal')"
                    >
                      {{ $t('admin.editBooking.cancel') }}
                    </button>
                    <button
                      type="submit"
                      class="btn btn-success"
                      :disabled="isSavingChanges"
                    >
                      <span v-if="isSavingChanges" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <i v-else class="bi bi-check-lg me-2"></i>
                      {{ isSavingChanges ? $t('admin.editBooking.saving') : $t('admin.editBooking.saveChanges') }}
                    </button>
                  </div>
                </div>
              </form>
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
const isSavingChanges = ref(false)
const isDeletingBooking = ref(false)

// Language switching
const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

// Handle click on empty slot to show add booking modal
const handleAddBookingFromCalendar = (event) => {
  const { date, time, dayDate } = event.detail
  
  // Get location from current filter (always has a value now)
  const locationFilter = document.querySelector('select[data-location-filter]')?.value || 'Martinkovac'
  const location = locationFilter
  
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
    // Remove focus from any element inside modal before closing
    const activeElement = document.activeElement
    if (activeElement && modalElement.contains(activeElement)) {
      activeElement.blur()
    }
    
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
  
  // Focus back to a safe element (like body or main content)
  const safeElement = document.querySelector('main') || document.body
  if (safeElement && safeElement !== document.activeElement) {
    safeElement.focus()
    // Remove focus outline for non-keyboard users
    safeElement.style.outline = 'none'
    setTimeout(() => {
      safeElement.removeAttribute('style')
    }, 100)
  }
}

// Handle booking added successfully
const onBookingAdded = () => {
  // Close modal and refresh calendar
  closeModal('addBookingModal')
  
  // Refresh bookings
  bookingStore.fetchBookedSlots(true)
}

// Save booking changes (name, phone, status)
const saveBookingChanges = async () => {
  if (!selectedBooking.value) return
  
  isSavingChanges.value = true
  
  console.log('Saving booking changes:', {
    id: selectedBooking.value.id,
    name: selectedBooking.value.name,
    phone: selectedBooking.value.phone,
    status: selectedBooking.value.status
  })
  
  try {
    // Use GET request with JSONP for CORS
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    const url = `${scriptUrl}?action=updateBooking&id=${encodeURIComponent(selectedBooking.value.id)}&name=${encodeURIComponent(selectedBooking.value.name)}&phone=${encodeURIComponent(selectedBooking.value.phone)}&status=${encodeURIComponent(selectedBooking.value.status)}&callback=handleUpdateBookingResult`
    
    console.log('Making request to:', url)
    
    // Create JSONP request
    const callbackName = 'handleUpdateBookingResult'
    window[callbackName] = (result) => {
      console.log('Received response from updateBooking:', result)
      
      if (result.success) {
        console.log('Booking updated successfully:', result.message)
        // Refresh bookings to show updated data
        bookingStore.fetchBookedSlots(true)
        // Close modal
        closeModal('editBookingModal')
      } else {
        console.error('Failed to update booking:', result.message)
        alert(`Failed to update booking: ${result.message}`)
      }
      
      // Clean up
      delete window[callbackName]
      document.head.removeChild(script)
      isSavingChanges.value = false
    }
    
    // Create script element for JSONP
    const script = document.createElement('script')
    script.src = url
    script.onerror = () => {
      console.error('Script failed to load:', url)
      console.log('Trying fallback method for status update only...')
      
      // Fallback: try the old updateStatus method if only status changed
      const fallbackUrl = `${scriptUrl}?action=updateStatus&id=${encodeURIComponent(selectedBooking.value.id)}&newStatus=${encodeURIComponent(selectedBooking.value.status)}&callback=handleUpdateStatusFallback`
      
      const fallbackCallbackName = 'handleUpdateStatusFallback'
      window[fallbackCallbackName] = (result) => {
        if (result.success) {
          console.log('Status updated successfully via fallback:', result.message)
          bookingStore.fetchBookedSlots(true)
          closeModal('editBookingModal')
        } else {
          console.error('Fallback also failed:', result.message)
        }
        delete window[fallbackCallbackName]
        document.head.removeChild(fallbackScript)
        isSavingChanges.value = false
      }
      
      const fallbackScript = document.createElement('script')
      fallbackScript.src = fallbackUrl
      document.head.appendChild(fallbackScript)
      
      delete window[callbackName]
      document.head.removeChild(script)
      isSavingChanges.value = false
    }
    document.head.appendChild(script)
    
  } catch (error) {
    console.error('Error updating booking:', error)
    isSavingChanges.value = false
  }
}

// Confirm and delete booking
const confirmDeleteBooking = async () => {
  if (!selectedBooking.value) return
  
  isDeletingBooking.value = true
  
  console.log('Deleting booking:', {
    id: selectedBooking.value.id,
    name: selectedBooking.value.name
  })
  
  try {
    // Use GET request with JSONP for CORS
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    const url = `${scriptUrl}?action=deleteBooking&id=${encodeURIComponent(selectedBooking.value.id)}&callback=handleDeleteBookingResult`
    
    console.log('Making delete request to:', url)
    
    // Create JSONP request
    const callbackName = 'handleDeleteBookingResult'
    window[callbackName] = (result) => {
      console.log('Received response from deleteBooking:', result)
      
      if (result.success) {
        console.log('Booking deleted successfully:', result.message)
        // Refresh bookings to remove deleted booking
        bookingStore.fetchBookedSlots(true)
        // Close modal
        closeModal('editBookingModal')
      } else {
        console.error('Failed to delete booking:', result.message)
      }
      
      // Clean up
      delete window[callbackName]
      document.head.removeChild(script)
      isDeletingBooking.value = false
    }
    
    // Create script element for JSONP
    const script = document.createElement('script')
    script.src = url
    script.onerror = () => {
      console.error('Delete script failed to load:', url)
      delete window[callbackName]
      document.head.removeChild(script)
      isDeletingBooking.value = false
    }
    document.head.appendChild(script)
    
  } catch (error) {
    console.error('Error deleting booking:', error)
    isDeletingBooking.value = false
  }
}

// Handle escape key to close modal
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    const addBookingModal = document.getElementById('addBookingModal')
    const editBookingModal = document.getElementById('editBookingModal')
    
    if (addBookingModal && addBookingModal.style.display === 'block') {
      closeModal('addBookingModal')
    } else if (editBookingModal && editBookingModal.style.display === 'block') {
      closeModal('editBookingModal')
    }
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
  
  // Add escape key listener
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('admin-add-booking', handleAddBookingFromCalendar)
  window.removeEventListener('admin-edit-booking', handleEditBookingFromCalendar)
  document.removeEventListener('keydown', handleEscapeKey)
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

.readonly-field {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  cursor: not-allowed;
}
</style>