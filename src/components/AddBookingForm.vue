<template>
  <div class="add-booking-form">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="position-relative">
          <!-- Loading Overlay -->
          <div v-if="isSubmitting" class="form-overlay">
            <Loader size="medium" :message="$t('admin.addBooking.adding')" />
          </div>

          <div class="row">
            <!-- Customer Information -->
            <div class="col-md-6 mb-4">
              <h6 class="fw-bold mb-3">
                <i class="bi bi-person me-2"></i>{{ $t('admin.addBooking.customerInfo') }}
              </h6>
              
              <div class="mb-3">
                <label class="form-label">{{ $t('admin.addBooking.fullName') }} *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.name"
                  :placeholder="$t('admin.addBooking.enterName')"
                  required
                  :disabled="isSubmitting"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t('admin.addBooking.phone') }} *</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="form.phone"
                  :placeholder="$t('admin.addBooking.enterPhone')"
                  required
                  :disabled="isSubmitting"
                />
              </div>
            </div>

            <!-- Booking Details -->
            <div class="col-md-6 mb-4">
              <h6 class="fw-bold mb-3">
                <i class="bi bi-calendar-event me-2"></i>{{ $t('admin.addBooking.bookingDetails') }}
              </h6>
              
              <div class="mb-3">
                <label class="form-label">{{ $t('admin.addBooking.location') }} *</label>
                <select
                  class="form-select"
                  v-model="form.location"
                  required
                  :disabled="isSubmitting"
                >
                  <option value="">{{ $t('admin.addBooking.selectLocation') }}</option>
                  <option value="downtown">Downtown Barber Kings</option>
                  <option value="podil">Barber Kings Podil</option>
                </select>
              </div>

              <div class="row">
                <div class="col-sm-6 mb-3">
                  <label class="form-label">{{ $t('admin.addBooking.date') }} *</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="form.date"
                    :min="minDate"
                    :max="maxDate"
                    required
                    :disabled="isSubmitting"
                  />
                </div>

                <div class="col-sm-6 mb-3">
                  <label class="form-label">{{ $t('admin.addBooking.time') }} *</label>
                  <select
                    class="form-select"
                    v-model="form.time"
                    required
                    :disabled="isSubmitting || !form.date || !form.location"
                  >
                    <option value="">{{ $t('admin.addBooking.selectTime') }}</option>
                    <option 
                      v-for="slot in availableTimeSlots" 
                      :key="slot"
                      :value="slot"
                      :disabled="isSlotBooked(slot)"
                    >
                      {{ slot }} {{ isSlotBooked(slot) ? $t('admin.addBooking.occupied') : '' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Selection -->
          <div class="mb-4">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-flag me-2"></i>{{ $t('admin.addBooking.bookingStatus') }}
            </h6>
            <div class="d-flex gap-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="pending"
                  value="Pending"
                  v-model="form.status"
                  :disabled="isSubmitting"
                />
                <label class="form-check-label" for="pending">
                  <span class="badge bg-warning me-2">{{ $t('admin.addBooking.pending') }}</span>
                  {{ $t('admin.addBooking.pendingConfirmation') }}
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="confirmed"
                  value="Confirmed"
                  v-model="form.status"
                  :disabled="isSubmitting"
                />
                <label class="form-check-label" for="confirmed">
                  <span class="badge bg-success me-2">{{ $t('admin.addBooking.confirmed') }}</span>
                  {{ $t('admin.addBooking.confirmed') }}
                </label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="d-flex gap-3">
            <button
              type="submit"
              class="btn btn-lg px-4 fw-bold"
              :disabled="isSubmitting || !isFormValid"
              style="background-color: #2c3e33; border-color: #2c3e33; color: white;"
            >
              <i class="bi bi-plus-circle me-2"></i>
              {{ isSubmitting ? $t('admin.addBooking.adding') : $t('admin.addBooking.addBooking') }}
            </button>
            
            <button
              type="button"
              class="btn btn-outline-secondary btn-lg px-4"
              @click="resetForm"
              :disabled="isSubmitting"
            >
              <i class="bi bi-arrow-clockwise me-2"></i>
              {{ $t('admin.addBooking.resetForm') }}
            </button>
          </div>
        </form>

        <!-- Success/Error Messages -->
        <div v-if="message" class="mt-4">
          <div 
            class="alert alert-dismissible fade show"
            :class="messageType === 'success' ? 'alert-success' : 'alert-danger'"
            role="alert"
          >
            <i :class="messageType === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'" class="me-2"></i>
            {{ message }}
            <button type="button" class="btn-close" @click="clearMessage"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookingStore } from '@/stores/booking'
import Loader from '@/components/Loader.vue'

const { t: $t } = useI18n()

const bookingStore = useBookingStore()

// Form data
const form = ref({
  name: '',
  phone: '',
  location: '',
  date: '',
  time: '',
  status: 'Pending'
})

// Form state
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref('success')

// Date limits
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const today = new Date()
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0)
  return maxDate.toISOString().split('T')[0]
})

// Available time slots
const availableTimeSlots = computed(() => {
  const slots = []
  for (let hour = 9; hour <= 21; hour++) {
    if (hour < 21) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    } else {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
  }
  return slots
})

// Check if slot is already booked
const isSlotBooked = (slot) => {
  if (!form.value.date || !form.value.location) return false
  
  // Convert date format from YYYY-MM-DD to DD/MM/YYYY
  const [year, month, day] = form.value.date.split('-')
  const formattedDate = `${day}/${month}/${year}`
  
  return bookingStore.bookedSlots.some(booking => 
    booking.date === formattedDate && 
    booking.time === slot && 
    booking.location === form.value.location
  )
}

// Form validation
const isFormValid = computed(() => {
  return form.value.name.trim() && 
         form.value.phone.trim() && 
         form.value.location && 
         form.value.date && 
         form.value.time &&
         form.value.status
})

// Submit handler
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  clearMessage()
  
  try {
    // Convert date format from YYYY-MM-DD to DD/MM/YYYY for Google Sheets
    const [year, month, day] = form.value.date.split('-')
    const formattedDate = `${day}/${month}/${year}`
    
    const bookingData = {
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      location: form.value.location,
      date: formattedDate,
      time: form.value.time,
      status: form.value.status
    }
    
    // Here you would call an API to add the booking
    // For now, we'll simulate the process
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    
    if (GOOGLE_SCRIPT_URL) {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
        mode: 'no-cors'
      })
      
      // With no-cors, we assume success
      showMessage($t('admin.addBooking.successMessage'), 'success')
    } else {
      // Simulate adding to local state for development
      console.log('Adding booking:', bookingData)
      showMessage($t('admin.addBooking.successMessage'), 'success')
    }
    
    // Refresh the bookings data
    await bookingStore.fetchBookedSlots()
    
    // Reset form after successful submission
    resetForm()
    
  } catch (error) {
    console.error('Error adding booking:', error)
    showMessage($t('admin.addBooking.errorMessage'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Helper functions
const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    location: '',
    date: '',
    time: '',
    status: 'Pending'
  }
  clearMessage()
}

const showMessage = (text, type) => {
  message.value = text
  messageType.value = type
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      clearMessage()
    }, 5000)
  }
}

const clearMessage = () => {
  message.value = ''
  messageType.value = 'success'
}
</script>

<style scoped>
.add-booking-form {
  width: 100%;
}

.form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 8px;
}

.form-control:focus,
.form-select:focus {
  border-color: #2c3e33;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 51, 0.25);
}

.form-check-input:checked {
  background-color: #2c3e33;
  border-color: #2c3e33;
}

.form-check-input:focus {
  border-color: #2c3e33;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 51, 0.25);
}

.btn:disabled {
  opacity: 0.65;
}

.alert {
  border-radius: 8px;
}

h6 i {
  color: #2c3e33;
}

.form-check-label {
  cursor: pointer;
}

.badge {
  font-size: 0.7em;
}

@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
  }
  
  .d-flex.gap-3 .btn {
    width: 100%;
  }
}
</style>