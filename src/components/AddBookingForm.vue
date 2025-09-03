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
                  :class="{ 'is-invalid': v$.name.$error }"
                  v-model="form.name"
                  :placeholder="$t('admin.addBooking.enterName')"
                  :disabled="isSubmitting"
                  @blur="v$.name.$touch"
                />
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <div v-for="error in v$.name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t('admin.addBooking.phone') }} *</label>
                <input
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': v$.phone.$error }"
                  v-model="form.phone"
                  :placeholder="$t('admin.addBooking.enterPhone')"
                  :disabled="isSubmitting"
                  @blur="v$.phone.$touch"
                />
                <div v-if="v$.phone.$error" class="invalid-feedback">
                  <div v-for="error in v$.phone.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
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
                  :class="{ 'is-invalid': v$.location.$error }"
                  v-model="form.location"
                  :disabled="isSubmitting"
                  @blur="v$.location.$touch"
                >
                  <option value="">{{ $t('admin.addBooking.selectLocation') }}</option>
                  <option value="Martinkovac">{{ $t('locations.downtown.name') }}</option>
                  <option value="Adamiceva">{{ $t('locations.podil.name') }}</option>
                </select>
                <div v-if="v$.location.$error" class="invalid-feedback">
                  <div v-for="error in v$.location.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t('admin.addBooking.service') }} *</label>
                <select
                  class="form-select"
                  :class="{ 'is-invalid': v$.service.$error }"
                  v-model="form.service"
                  :disabled="isSubmitting"
                  @blur="v$.service.$touch"
                >
                  <option value="">{{ $t('admin.addBooking.selectService') }}</option>
                  <option 
                    v-for="service in availableServices" 
                    :key="service.id"
                    :value="service.id"
                  >
                    {{ $t(service.nameKey) }} ({{ service.duration }} min)
                  </option>
                </select>
                <div v-if="v$.service.$error" class="invalid-feedback">
                  <div v-for="error in v$.service.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-6 mb-3">
                  <label class="form-label">{{ $t('admin.addBooking.date') }} *</label>
                  <input
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': v$.date.$error }"
                    v-model="form.date"
                    :min="minDate"
                    :max="maxDate"
                    :disabled="isSubmitting"
                    @blur="v$.date.$touch"
                  />
                  <div v-if="v$.date.$error" class="invalid-feedback">
                    <div v-for="error in v$.date.$errors" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
                </div>

                <div class="col-sm-6 mb-3">
                  <label class="form-label">{{ $t('admin.addBooking.time') }} *</label>
                  <select
                    class="form-select"
                    :class="{ 'is-invalid': v$.time.$error }"
                    v-model="form.time"
                    :disabled="isSubmitting || !form.date || !form.location || !form.service"
                    @blur="v$.time.$touch"
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
                  <div v-if="v$.time.$error" class="invalid-feedback">
                    <div v-for="error in v$.time.$errors" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
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
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else class="bi bi-plus-circle me-2"></i>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { useBookingStore } from '@/stores/booking'
import { useServicesStore } from '@/stores/services'
import { getAllServices, getServiceById } from '@/config/services'
import Loader from '@/components/Loader.vue'

const { t: $t } = useI18n()

const bookingStore = useBookingStore()
const servicesStore = useServicesStore()

// Define emits
const emit = defineEmits(['booking-added'])

// Make services available in template - computed to be reactive to store changes
const availableServices = computed(() => getAllServices())

// Form data
const form = ref({
  name: '',
  phone: '',
  location: '',
  service: '',
  date: '',
  time: '',
  status: 'Confirmed'
})

// Form state - используем состояние из store
const isSubmitting = computed(() => bookingStore.isSubmittingBooking)

// Custom phone validator
const phoneValidator = helpers.withMessage(
  () => $t('validation.invalidPhone'),
  (value) => {
    if (!value) return true // Let required handle empty values
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\d\s\+\-\(\)]{8,20}$/
    return phoneRegex.test(value.trim())
  }
)

// Validation rules
const rules = computed(() => ({
  name: {
    required: helpers.withMessage(() => $t('validation.nameRequired'), required),
    minLength: helpers.withMessage(() => $t('validation.nameMinLength'), minLength(2))
  },
  phone: {
    required: helpers.withMessage(() => $t('validation.phoneRequired'), required),
    phoneValidator
  },
  location: {
    required: helpers.withMessage(() => $t('validation.locationRequired'), required)
  },
  service: {
    required: helpers.withMessage(() => $t('validation.serviceRequired'), required)
  },
  date: {
    required: helpers.withMessage(() => $t('validation.dateRequired'), required)
  },
  time: {
    required: helpers.withMessage(() => $t('validation.timeRequired'), required)
  },
  status: {
    required: helpers.withMessage(() => $t('validation.statusRequired'), required)
  }
}))

// Setup validation
const v$ = useVuelidate(rules, form)

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
  for (let hour = 9; hour <= 20; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
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
    if (location === 'Martinkovac' || location === 'Downtown Barber Kings') return 'Martinkovac'
    if (location === 'Adamiceva' || location === 'Barber Kings Podil') return 'Adamiceva'
    return location
  }
  
  const currentLocation = normalizeLocation(form.value.location)
  
  // Check if selected service needs multiple slots
  let slotsNeeded = 1
  if (form.value.service) {
    const selectedServiceConfig = getServiceById(parseInt(form.value.service))
    if (selectedServiceConfig) {
      slotsNeeded = selectedServiceConfig.duration / 30
    }
  }
  
  // For multi-slot services, check if any of the required consecutive slots are booked
  const allSlots = availableTimeSlots.value
  const currentSlotIndex = allSlots.indexOf(slot)
  
  if (slotsNeeded > 1 && currentSlotIndex >= 0) {
    for (let i = 0; i < slotsNeeded; i++) {
      const checkSlotIndex = currentSlotIndex + i
      if (checkSlotIndex >= allSlots.length) return true // Not enough slots available
      
      const checkSlot = allSlots[checkSlotIndex]
      const isBooked = bookingStore.bookedSlots.some(booking => {
        const bookingLocation = normalizeLocation(booking.location || '')
        return booking.date === formattedDate && 
               booking.time === checkSlot && 
               bookingLocation === currentLocation
      })
      if (isBooked) return true
    }
    return false
  }
  
  // Single slot check (default behavior)
  return bookingStore.bookedSlots.some(booking => {
    const bookingLocation = normalizeLocation(booking.location || '')
    return booking.date === formattedDate && 
           booking.time === slot && 
           bookingLocation === currentLocation
  })
}

// Form validation
const isFormValid = computed(() => {
  return !v$.value.$invalid && form.value.status // Only check status separately since it's not in our validation rules
})

// Submit handler
const handleSubmit = async () => {
  // Validate form first
  const isValid = await v$.value.$validate()
  
  if (!isValid || !form.value.status) {
    // Show validation errors
    return
  }
  
  clearMessage()
  
  try {
    // Сначала сохраним данные формы, так как submitBooking сбросит форму
    const bookingData = {
      name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      location: form.value.location,
      service: form.value.service,
      date: form.value.date, // оставляем в формате YYYY-MM-DD, submitBooking сам конвертирует
      time: form.value.time,
      status: form.value.status
    }
    
    // Временно заполняем store данными для submitBooking
    bookingStore.bookingForm.name = bookingData.name
    bookingStore.bookingForm.phone = bookingData.phone
    
    // Map short location names to store locations
    const locationMapping = {
      'Martinkovac': 'downtown',
      'Adamiceva': 'podil'
    }
    const storeLocationKey = locationMapping[bookingData.location] || bookingData.location
    
    bookingStore.selectedLocation = bookingStore.locations.find(loc => 
      loc.nameKey?.replace('locations.', '').replace('.name', '') === storeLocationKey || 
      loc.name === bookingData.location
    )
    
    // Set selected service in store
    const selectedServiceConfig = getServiceById(parseInt(bookingData.service))
    if (selectedServiceConfig) {
      bookingStore.selectedService = selectedServiceConfig
    }
    bookingStore.selectedDate = new Date(bookingData.date + 'T00:00:00').getTime()
    bookingStore.selectedTime = bookingData.time
    bookingStore.selectedStatus = bookingData.status
    
    // Используем submitBooking из store (который управляет лоадером)
    const result = await bookingStore.submitBooking()
    
    if (result.success) {
      // Сбрасываем форму вручную (так как store сбросил свою)
      resetFormFields()
      console.log('Booking added with ID:', result.id)
      
      // Emit event to parent to close modal
      emit('booking-added')
    } else {
      console.error('Failed to add booking:', result.message)
      throw new Error(result.message)
    }
    
    // Данные обновятся автоматически через submitBooking в store
    
  } catch (error) {
    console.error('Error adding booking:', error)
  }
}

// Helper functions
const resetFormFields = () => {
  form.value = {
    name: '',
    phone: '',
    location: '',
    service: '',
    date: '',
    time: '',
    status: 'Confirmed'
  }
  // Reset validation state
  v$.value.$reset()
}

const resetForm = () => {
  resetFormFields()
  clearMessage()
}

const clearMessage = () => {
  // Функция оставлена для совместимости, но больше ничего не делает
  console.log('clearMessage called')
}

// Watch for changes in date, location, or service to clear time selection if needed
watch([() => form.value.date, () => form.value.location, () => form.value.service], (newValues, oldValues) => {
  // Only clear message if this is a user interaction, not a programmatic reset
  if ((oldValues[0] && oldValues[1]) || oldValues[2]) {
    // Check if currently selected time is still available for new service
    if (form.value.time && form.value.date && form.value.location && form.value.service) {
      // If selected time is now booked/unavailable with new service, clear it
      if (isSlotBooked(form.value.time)) {
        form.value.time = ''
      }
    } else if (!form.value.date || !form.value.location) {
      // Clear time only if date or location is cleared
      form.value.time = ''
    }
    clearMessage()
  }
})

// Handle pre-fill form data from calendar
const handlePrefillForm = (event) => {
  const { date, time, location } = event.detail
  
  // Convert date from dd/MM/yyyy to yyyy-MM-dd format for HTML date input
  const convertDateFormat = (dateStr) => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return dateStr
  }
  
  // Pre-fill the form
  form.value.date = convertDateFormat(date)
  form.value.time = time
  if (location) {
    form.value.location = location
  }
  
  console.log('Pre-filled booking form:', { date: form.value.date, time, location })
}

// Load booked slots when component mounts
onMounted(async () => {
  // Load services first
  await servicesStore.fetchServices()
  
  await bookingStore.fetchBookedSlots(true)
  
  // Add event listener for form pre-fill
  window.addEventListener('prefill-booking-form', handlePrefillForm)
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('prefill-booking-form', handlePrefillForm)
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