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
                      :class="{ 'text-muted': isSlotBooked(slot) }"
                    >
                      {{ slot }}{{ isSlotBooked(slot) ? ' (' + $t('admin.addBooking.occupied') + ')' : '' }}
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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
  
  // Normalize location names for comparison
  const normalizeLocation = (location) => {
    if (location === 'downtown' || location === 'Downtown Barber Kings') return 'downtown'
    if (location === 'podil' || location === 'Barber Kings Podil') return 'podil'
    return location.toLowerCase()
  }
  
  const currentLocation = normalizeLocation(form.value.location)
  
  return bookingStore.bookedSlots.some(booking => {
    const bookingLocation = normalizeLocation(booking.location || '')
    return booking.date === formattedDate && 
           booking.time === slot && 
           bookingLocation === currentLocation
  })
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
    
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    
    if (GOOGLE_SCRIPT_URL) {
      // Используем JSONP для обхода CORS ограничений
      const callbackName = 'addBooking_' + Date.now() + '_' + Math.random().toString(36).substring(7)
      
      return new Promise((resolve, reject) => {
        // Очищаем возможные старые callback функции
        Object.keys(window).forEach(key => {
          if (key.startsWith('addBooking_') && typeof window[key] === 'function') {
            delete window[key]
          }
        })
        
        // Создаем глобальную callback функцию
        window[callbackName] = function(data) {
          // Очищаем script элемент
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          
          if (data.success) {
            // Reset form fields first
            resetFormFields()
            // Then show success message
            showMessage($t('admin.addBooking.successMessage'), 'success')
            resolve()
          } else {
            showMessage($t('admin.addBooking.errorMessage') + ': ' + data.message, 'error')
            reject(new Error(data.message))
          }
        }
        
        // Создаем script элемент для JSONP запроса
        const script = document.createElement('script')
        const queryParams = new URLSearchParams({
          callback: callbackName,
          action: 'add',
          name: bookingData.name,
          phone: bookingData.phone,
          location: bookingData.location,
          date: bookingData.date,
          time: bookingData.time,
          status: bookingData.status
        })
        
        script.src = `${GOOGLE_SCRIPT_URL}?${queryParams.toString()}`
        script.onerror = () => {
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          showMessage($t('admin.addBooking.errorMessage'), 'error')
          reject(new Error('JSONP request failed'))
        }
        
        // Добавляем timeout для очистки
        setTimeout(() => {
          if (window[callbackName]) {
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            reject(new Error('Request timeout'))
          }
        }, 10000)
        
        document.head.appendChild(script)
      })
    } else {
      // Simulate adding to local state for development
      console.log('Adding booking:', bookingData)
      // Reset form fields first
      resetFormFields()
      // Then show success message
      showMessage($t('admin.addBooking.successMessage'), 'success')
    }
    
    // Refresh the bookings data with admin flag after a short delay
    setTimeout(async () => {
      await bookingStore.fetchBookedSlots(true)
    }, 100)
    
  } catch (error) {
    console.error('Error adding booking:', error)
    showMessage($t('admin.addBooking.errorMessage'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Helper functions
const resetFormFields = () => {
  form.value = {
    name: '',
    phone: '',
    location: '',
    date: '',
    time: '',
    status: 'Pending'
  }
}

const resetForm = () => {
  resetFormFields()
  clearMessage()
}

const showMessage = (text, type) => {
  console.log('Showing message:', text, 'Type:', type)
  
  // Используем alert для надежного отображения сообщений
  if (type === 'success') {
    alert(`✅ ${text}`)
  } else {
    alert(`❌ ${text}`)
  }
}

const clearMessage = () => {
  // Функция оставлена для совместимости, но больше ничего не делает
  console.log('clearMessage called (now using alerts)')
}

// Watch for changes in date or location to clear time selection
watch([() => form.value.date, () => form.value.location], (newValues, oldValues) => {
  // Only clear message if this is a user interaction, not a programmatic reset
  if (oldValues[0] && oldValues[1]) {
    // Clear selected time when date or location changes
    form.value.time = ''
    clearMessage()
  }
})

// Load booked slots when component mounts
onMounted(async () => {
  await bookingStore.fetchBookedSlots(true)
})
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

option:disabled {
  color: #6c757d !important;
  font-style: italic;
}

.text-muted {
  color: #6c757d !important;
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