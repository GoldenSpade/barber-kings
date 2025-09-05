<template>
  <div class="booking-page bg-light">
    <!-- Logo Header -->
    <div class="py-4 bg-white">
      <div class="container position-relative">
        <div class="row align-items-center">
          <!-- Logo -->
          <div class="col-12 text-center">
            <img src="@/assets/main-logo.png" alt="Barber Kings" style="height: 80px" />
          </div>

          <!-- Language Switcher -->
          <div class="position-absolute top-0 end-0 p-3">
            <div class="dropdown d-inline-block">
              <button
                class="btn btn-outline-secondary btn-sm dropdown-toggle"
                type="button"
                id="languageDropdown"
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
          </div>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="container py-3">
      <button @click="goBack" class="btn btn-link text-dark p-0" style="text-decoration: none">
        <i class="bi bi-arrow-left me-2"></i>{{ $t('booking.back') }}
      </button>
    </div>

    <!-- Progress Steps -->
    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="d-flex align-items-center justify-content-between">
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 1 }">1</span>
              <span class="step-text">{{ $t('booking.steps.locations') }}</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 2 }">2</span>
              <span class="step-text">{{ $t('booking.steps.service') }}</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 3 }">3</span>
              <span class="step-text">{{ $t('booking.steps.time') }}</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 4 }">4</span>
              <span class="step-text">{{ $t('booking.steps.details') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="container pb-5">
      <!-- Step 1: Location Selection -->
      <div v-if="bookingStore.currentStep === 1" class="step-content">
        <h2 class="text-center mb-5 fw-bold">{{ $t('booking.chooseLocation') }}</h2>
        
        <!-- Loading Spinner -->
        <Loader 
          v-if="bookingStore.isLoadingBookedSlots" 
          size="large" 
          :message="$t('common.loadingSlots')" 
        />
        
        <!-- Location Cards -->
        <div v-else class="row justify-content-center">
          <div class="col-md-5 mb-4" v-for="location in translatedLocations" :key="location.id">
            <div
              class="location-card h-100"
              :class="{ selected: bookingStore.selectedLocation?.id === location.id }"
              @click="bookingStore.selectLocation(location)"
            >
              <div class="card-content p-4">
                <h5 class="fw-bold text-dark mb-4 text-center">{{ location.name }}</h5>
                
                <!-- Address -->
                <div class="address-section mb-4 text-center">
                  <div class="d-flex align-items-center justify-content-center mb-2">
                    <i class="bi bi-geo-alt-fill me-2 text-brand"></i>
                    <span class="fw-bold text-dark">{{ $t('booking.address') }}</span>
                  </div>
                  <p class="text-muted mb-0">{{ location.address }}</p>
                </div>
                
                <!-- Working Hours -->
                <div class="working-hours-section">
                  <div class="d-flex align-items-center justify-content-center mb-3">
                    <i class="bi bi-clock-fill me-2 text-brand"></i>
                    <span class="fw-bold text-dark">{{ $t('booking.workingHours') }}</span>
                  </div>
                  <div class="hours-list">
                    <div class="hour-item d-flex justify-content-between align-items-center mb-1" :class="{ 'current-day': isCurrentDay('monday') }">
                      <span class="day-name">{{ $t('booking.days.monday') }}:</span>
                      <span class="hours">{{ location.hours.monday }}</span>
                    </div>
                    <div class="hour-item d-flex justify-content-between align-items-center mb-1" :class="{ 'current-day': isCurrentDay('tuesday') }">
                      <span class="day-name">{{ $t('booking.days.tuesday') }}:</span>
                      <span class="hours">{{ location.hours.tuesday }}</span>
                    </div>
                    <div class="hour-item d-flex justify-content-between align-items-center mb-1" :class="{ 'current-day': isCurrentDay('wednesday') }">
                      <span class="day-name">{{ $t('booking.days.wednesday') }}:</span>
                      <span class="hours">{{ location.hours.wednesday }}</span>
                    </div>
                    <div class="hour-item d-flex justify-content-between align-items-center mb-1" :class="{ 'current-day': isCurrentDay('thursday') }">
                      <span class="day-name">{{ $t('booking.days.thursday') }}:</span>
                      <span class="hours">{{ location.hours.thursday }}</span>
                    </div>
                    <div class="hour-item d-flex justify-content-between align-items-center mb-1" :class="{ 'current-day': isCurrentDay('friday') }">
                      <span class="day-name">{{ $t('booking.days.friday') }}:</span>
                      <span class="hours">{{ location.hours.friday }}</span>
                    </div>
                    <div class="hour-item d-flex justify-content-between align-items-center mb-1" :class="{ 'current-day': isCurrentDay('saturday') }">
                      <span class="day-name">{{ $t('booking.days.saturday') }}:</span>
                      <span class="hours">{{ location.hours.saturday }}</span>
                    </div>
                    <div class="hour-item d-flex justify-content-between align-items-center mb-1" :class="{ 'current-day': isCurrentDay('sunday') }">
                      <span class="day-name">{{ $t('booking.days.sunday') }}:</span>
                      <span class="hours">{{ location.hours.sunday }}</span>
                    </div>
                  </div>
                </div>
                
                <button class="btn btn-brand w-100 mt-4">
                  {{ $t('booking.choose') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Service Selection -->
      <div v-if="bookingStore.currentStep === 2" class="step-content">
        <!-- Loading State -->
        <div v-if="servicesStore.isLoading" class="text-center py-5">
          <Loader size="large" :message="$t('booking.loadingServices')" />
        </div>
        
        <!-- Services Content -->
        <div v-else>
          <h2 class="text-center mb-5 fw-bold">{{ $t('booking.chooseService') }}</h2>
          
          <div class="row justify-content-center">
            <div class="col-md-6 mb-4" v-for="service in translatedServices" :key="service.id">
            <div
              class="service-card h-100"
              :class="{ selected: bookingStore.selectedService?.id === service.id }"
              @click="bookingStore.selectService(service)"
            >
              <div class="card-content p-4">
                <div class="service-icon mb-3 text-center">
                  <i class="bi bi-scissors"></i>
                </div>
                <h5 class="fw-bold text-dark mb-3 text-center">{{ service.name }}</h5>
                <p class="text-muted mb-3 text-center">{{ service.description }}</p>
                <div class="service-duration text-center mb-4">
                  <span class="badge bg-brand text-white">{{ formatDuration(service.duration) }}</span>
                </div>
                <button class="btn btn-brand w-100">
                  {{ $t('booking.choose') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- Step 3: Time Selection -->
      <div v-if="bookingStore.currentStep === 3" class="step-content">
        <h2 class="text-center mb-3 fw-bold">{{ $t('booking.chooseTime') }}</h2>
        
        <!-- Selected Location Info -->
        <div class="row justify-content-center mb-4">
          <div class="col-lg-6">
            <div class="selected-location-info p-3 text-center">
              <div class="d-flex align-items-center justify-content-center mb-2">
                <i class="bi bi-geo-alt-fill me-2 text-brand"></i>
                <h6 class="mb-0 fw-bold text-dark">{{ getSelectedLocationName() }}</h6>
              </div>
              <p class="text-muted mb-0 small">{{ getSelectedLocationAddress() }}</p>
            </div>
          </div>
        </div>



        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="bg-white rounded shadow p-4">
              <!-- Calendar Navigation - Desktop Only -->
              <div class="d-none d-md-flex justify-content-between align-items-center mb-4">
                <button
                  class="btn btn-link text-dark"
                  @click="bookingStore.previousWeek"
                  :disabled="!bookingStore.canGoToPreviousWeek"
                  :class="{ 'opacity-50': !bookingStore.canGoToPreviousWeek }"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
                <div class="d-flex align-items-center gap-3">
                  <h5 class="mb-0">{{ formattedDateRange }}</h5>
                </div>
                <button
                  class="btn btn-link text-dark"
                  @click="bookingStore.nextWeek"
                  :disabled="!bookingStore.canGoToNextWeek"
                  :class="{ 'opacity-50': !bookingStore.canGoToNextWeek }"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>

              <!-- Week Days -->
              <div class="calendar-wrapper position-relative">
                <!-- Loading Overlay -->
                <div 
                  v-if="bookingStore.isLoadingBookedSlots" 
                  class="calendar-loading-overlay"
                >
                  <Loader size="medium" :message="$t('booking.loadingCalendar')" />
                </div>
                
                <!-- Desktop Calendar -->
                <div class="calendar-grid d-none d-md-block" :class="{ 'opacity-50': bookingStore.isLoadingBookedSlots }">
                  <div class="row text-center">
                    <div class="col" v-for="day in translatedWeekDays" :key="day.date">
                      <div class="day-column">
                        <div class="day-header mb-3">
                          <div class="day-name small text-muted">{{ day.dayName }}</div>
                          <div class="day-number fw-bold">{{ day.dayNumber }}</div>
                          <div class="day-month small text-muted">{{ day.month }}</div>
                        </div>
                        <div class="time-slots">
                          <div v-if="day.available">
                            <div
                              v-for="time in generateAllTimeSlots()"
                              :key="time"
                              class="time-slot mb-1 p-2 rounded"
                              :class="getSlotClass(day, time)"
                              :title="getSlotTitle(day, time)"
                            >
                              <button
                                v-if="!isSlotBooked(day, time) && isSlotAvailableForService(day, time)"
                                class="btn btn-outline-secondary btn-sm w-100"
                                :class="{
                                  'btn-success':
                                    bookingStore.selectedTime === time &&
                                    bookingStore.selectedDate === day.date
                                }"
                                @click="bookingStore.selectTime(day.date, time)"
                              >
                                {{ time }}
                              </button>
                              <div v-else class="time-label fw-medium">
                                {{ time }}
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-muted small text-center">
                            <div class="reason-text">{{ day.reason }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Mobile Calendar - Single Day -->
                <div class="mobile-calendar d-md-none" :class="{ 'opacity-50': bookingStore.isLoadingBookedSlots }">
                  <!-- Mobile Date Navigation -->
                  <div class="mobile-date-navigation mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                      <button
                        class="btn btn-date-nav"
                        @click="previousDay"
                        :disabled="!canGoToPreviousDay"
                      >
                        <i class="bi bi-chevron-left"></i>
                      </button>
                      <div class="selected-date-display">
                        <h5 class="fw-bold mb-0">{{ getSelectedDayDate() }}</h5>
                      </div>
                      <button
                        class="btn btn-date-nav"
                        @click="nextDay"
                        :disabled="!canGoToNextDay"
                      >
                        <i class="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Mobile Time Slots - Single Column with Scroll -->
                  <div class="mobile-time-slots-container">
                    <div v-if="getSelectedDay().available" class="time-slots-scroll">
                      <div 
                        v-for="time in generateAllTimeSlots()"
                        :key="time"
                        class="time-slot-mobile mb-2"
                        :title="getSlotTitle(getSelectedDay(), time)"
                      >
                        <button
                          v-if="!isSlotBooked(getSelectedDay(), time) && isSlotAvailableForService(getSelectedDay(), time)"
                          class="btn btn-time-slot w-100"
                          :class="{
                            'btn-success':
                              bookingStore.selectedTime === time &&
                              bookingStore.selectedDate === getSelectedDay().date
                          }"
                          @click="bookingStore.selectTime(getSelectedDay().date, time)"
                        >
                          {{ time }}
                        </button>
                        <div v-else-if="isSlotBooked(getSelectedDay(), time)" class="time-slot-occupied">
                          <span class="fw-medium">{{ time }}</span>
                        </div>
                        <div v-else class="time-slot-unavailable">
                          <span class="fw-medium">{{ time }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-muted text-center">
                      <div class="reason-text">{{ getSelectedDay().reason }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Contact Form -->
      <div v-if="bookingStore.currentStep === 4" class="step-content">
        <h2 class="text-center mb-5 fw-bold">{{ $t('booking.contactDetails') }}</h2>

        <div class="row justify-content-center">
          <div class="col-md-6">
            <!-- Booking Confirmation -->
            <div class="booking-summary mb-4">
              <div class="summary-item">
                <span class="summary-label">{{ $t('booking.service') }}:</span>
                <span class="summary-value">{{ getSelectedServiceName() }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ $t('booking.location') }}:</span>
                <span class="summary-value">{{ getSelectedLocationAddress() }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ $t('booking.dateTime') }}:</span>
                <span class="summary-value">{{ formatBookingDateTime() }}</span>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="bg-white rounded shadow p-4">
              <div class="d-flex align-items-center mb-4">
                <i class="bi bi-person me-3" style="color: #2c3e33"></i>
                <h6 class="mb-0 fw-bold">{{ $t('booking.contactDetails') }}</h6>
              </div>

              <!-- Loading Overlay -->
              <div v-if="bookingStore.isSubmittingBooking" class="booking-form-overlay">
                <Loader size="medium" :message="$t('common.submittingBooking')" />
              </div>

              <form @submit.prevent="handleSubmitBooking" :class="{ 'form-disabled': bookingStore.isSubmittingBooking }">
                <div class="mb-3">
                  <label class="form-label">{{ $t('booking.fullName') }} *</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': v$.name.$error }"
                    v-model="bookingStore.bookingForm.name"
                    :placeholder="$t('booking.enterName')"
                    :disabled="bookingStore.isSubmittingBooking"
                    @blur="v$.name.$touch"
                  />
                  <div v-if="v$.name.$error" class="invalid-feedback">
                    <div v-for="error in v$.name.$errors" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">{{ $t('booking.phone') }} *</label>
                  <input
                    type="tel"
                    class="form-control"
                    :class="{ 'is-invalid': v$.phone.$error }"
                    v-model="bookingStore.bookingForm.phone"
                    :placeholder="$t('booking.enterPhone')"
                    :disabled="bookingStore.isSubmittingBooking"
                    @blur="v$.phone.$touch"
                  />
                  <div v-if="v$.phone.$error" class="invalid-feedback">
                    <div v-for="error in v$.phone.$errors" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-lg w-100 fw-bold"
                  :disabled="bookingStore.isSubmittingBooking"
                  style="
                    background-color: #2c3e33 !important;
                    border-color: #2c3e33 !important;
                    color: white;
                  "
                >
                  <span v-if="!bookingStore.isSubmittingBooking">{{ $t('booking.bookNow') }}</span>
                  <span v-else>{{ $t('booking.submitting') }}...</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { useBookingStore } from '@/stores/booking'
import { useServicesStore } from '@/stores/services'
import { getAllServices, formatDuration } from '@/config/services'
import Footer from '@/components/Footer.vue'
import Loader from '@/components/Loader.vue'

const router = useRouter()
const bookingStore = useBookingStore()
const servicesStore = useServicesStore()
const { t: $t, locale } = useI18n()

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
  }
}))

// Setup validation
const v$ = useVuelidate(rules, bookingStore.bookingForm)



// Computed locations with translations
const translatedLocations = computed(() => {
  return bookingStore.locations.map((location) => ({
    ...location,
    name: $t(location.nameKey),
    address: $t(location.addressKey),
    description: $t(location.descriptionKey),
  }))
})

// Computed services with translations
const translatedServices = computed(() => {
  try {
    // Теперь getAllServices() уже возвращает готовые данные с name и description
    return getAllServices()
  } catch (error) {
    console.error('Error loading services:', error)
    return []
  }
})

// Debug computed for bookings
const bookingsCount = computed(() => {
  return bookingStore.bookedSlots.length
})

// Computed calendar days with translations
const translatedWeekDays = computed(() => {
  // Use locale from above
  const dayNames =
    locale.value === 'hr'
      ? ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const monthNames =
    locale.value === 'hr'
      ? ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return bookingStore.weekDays.map((day) => {
    let translatedReason = ''
    if (day.reason) {
      const reasonKey = day.reason.toLowerCase().replace(/\s+/g, '')
      translatedReason = $t(`booking.${reasonKey}`)
    }

    return {
      ...day,
      dayName: dayNames[new Date(day.date).getDay()],
      month: monthNames[new Date(day.date).getMonth()],
      reason: translatedReason
    }
  })
})

// Methods
const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const goBack = () => {
  const shouldGoHome = bookingStore.goToPreviousStep()
  if (shouldGoHome) {
    router.push('/')
  }
}

const handleSubmitBooking = async () => {
  // Validate form first
  const isValid = await v$.value.$validate()
  
  if (!isValid) {
    // Show validation errors
    return
  }

  try {
    const result = await bookingStore.submitBooking()
    if (result.success) {
      // Reset validation state on successful submission
      v$.value.$reset()
      router.push('/')
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('Error submitting booking:', error)
    console.error('Booking submission failed')
  }
}

const getSelectedLocationName = () => {
  if (!bookingStore.selectedLocation) return ''
  return bookingStore.selectedLocation.nameKey
    ? $t(bookingStore.selectedLocation.nameKey)
    : bookingStore.selectedLocation.name
}

const getSelectedLocationAddress = () => {
  if (!bookingStore.selectedLocation) return ''
  return bookingStore.selectedLocation.addressKey
    ? $t(bookingStore.selectedLocation.addressKey)
    : bookingStore.selectedLocation.address
}

const getSelectedServiceName = () => {
  if (!bookingStore.selectedService) return ''
  return bookingStore.selectedService.name
}

const getSelectedServiceDuration = () => {
  if (!bookingStore.selectedService) return 30
  return bookingStore.selectedService.duration
}

const formatBookingDateTime = () => {
  if (!bookingStore.selectedDate || !bookingStore.selectedTime) return ''
  
  const date = new Date(bookingStore.selectedDate)
  const monthNames = locale.value === 'hr' 
    ? ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const month = monthNames[date.getMonth()]
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  
  const timeRange = getTimeRange(bookingStore.selectedTime)
  
  return `${month} ${day}, ${year}, ${timeRange}`
}

const formattedDateRange = computed(() => {
  const start = new Date(bookingStore.currentWeekStart)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)

  const monthNames =
    locale.value === 'hr'
      ? ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  return `${formatDate(start)} - ${formatDate(end)}`
})

// Helper function to generate all time slots
const generateAllTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour <= 20; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
}

// Helper function to check if a time slot is available for the selected service
const isSlotAvailableForService = (day, startTime) => {
  if (!bookingStore.selectedService) return true
  
  const serviceDuration = bookingStore.selectedService.duration
  const slotsNeeded = Math.ceil(serviceDuration / 30) // Convert minutes to 30-minute slots
  
  // Get all time slots
  const allSlots = generateAllTimeSlots()
  const startIndex = allSlots.indexOf(startTime)
  
  if (startIndex === -1) return false
  
  // Check if we have enough consecutive slots available
  for (let i = 0; i < slotsNeeded; i++) {
    const slotIndex = startIndex + i
    if (slotIndex >= allSlots.length) return false // Not enough time left in the day
    
    const slotTime = allSlots[slotIndex]
    if (isSlotBooked(day, slotTime)) return false // One of the required slots is booked
  }
  
  return true
}

// Helper function to get time range for display
const getTimeRange = (startTime) => {
  // Always return just the start time, no ranges
  return startTime
}

// Get localized title for slot availability
const getSlotTitle = (day, slot) => {
  const isBooked = isSlotBooked(day, slot)
  const isAvailable = isSlotAvailableForService(day, slot)
  
  if (isBooked) {
    return $t('slots.occupied')
  }
  
  if (!isAvailable && bookingStore.selectedService) {
    const serviceDuration = bookingStore.selectedService.duration
    const slotsNeeded = Math.ceil(serviceDuration / 30)
    
    // Check if there's enough time until end of day
    const allSlots = generateAllTimeSlots()
    const startIndex = allSlots.indexOf(slot)
    const endIndex = startIndex + slotsNeeded - 1
    
    if (endIndex >= allSlots.length) {
      return $t('slots.notEnoughTime', { duration: serviceDuration })
    }
    
    // Check which specific slot is conflicting
    for (let i = 0; i < slotsNeeded; i++) {
      const slotIndex = startIndex + i
      if (slotIndex < allSlots.length) {
        const checkSlot = allSlots[slotIndex]
        if (isSlotBooked(day, checkSlot)) {
          return $t('slots.conflictWith', { time: checkSlot })
        }
      }
    }
    
    return $t('slots.needConsecutive', { slots: slotsNeeded })
  }
  
  if (bookingStore.selectedService) {
    const serviceDuration = bookingStore.selectedService.duration
    const slotsNeeded = Math.ceil(serviceDuration / 30)
    const allSlots = generateAllTimeSlots()
    const startIndex = allSlots.indexOf(slot)
    const endIndex = startIndex + slotsNeeded - 1
    
    if (endIndex < allSlots.length) {
      const endTime = allSlots[endIndex]
      return $t('slots.available', { 
        duration: serviceDuration, 
        start: slot, 
        end: endTime 
      })
    }
  }
  
  return $t('slots.available', { duration: '30', start: slot, end: slot })
}


// Check if a slot is booked
const isSlotBooked = (day, slot) => {
  const date = new Date(day.date)
  const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  
  // Get current location name
  let currentLocation = ''
  if (bookingStore.selectedLocation?.nameKey) {
    const locationKey = bookingStore.selectedLocation.nameKey.replace('locations.', '').replace('.name', '')
    if (locationKey === 'downtown') {
      currentLocation = 'Martinkovac'
    } else if (locationKey === 'podil') {
      currentLocation = 'Adamiceva'
    } else {
      currentLocation = locationKey
    }
  } else if (bookingStore.selectedLocation?.name) {
    // Map location names to short format
    if (bookingStore.selectedLocation.name.includes('Martinkovac')) {
      currentLocation = 'Martinkovac'
    } else if (bookingStore.selectedLocation.name.includes('Adami')) {
      currentLocation = 'Adamiceva'
    } else {
      currentLocation = bookingStore.selectedLocation.name
    }
  }

  console.log(`Checking slot ${slot} on ${dateString} at ${currentLocation}`)
  console.log('Available bookings:', bookingStore.bookedSlots)

  const isBooked = bookingStore.bookedSlots.some(booking => {
    const matches = booking.date === dateString && 
                   booking.time === slot && 
                   booking.location === currentLocation
    if (matches) {
      console.log(`Found matching booking:`, booking)
    }
    return matches
  })
  
  // Debug logging
  if (isBooked) {
    console.log(`Slot ${slot} on ${dateString} at ${currentLocation} is booked`)
  }
  
  return isBooked
}

// Get CSS class for time slot
const getSlotClass = (day, slot) => {
  const isBooked = isSlotBooked(day, slot)
  return {
    'occupied': isBooked,
    'available': !isBooked
  }
}

// Refresh calendar data manually
const refreshCalendar = async () => {
  try {
    await bookingStore.fetchBookedSlots(false, true) // isAdmin=false, forceRefresh=true
  } catch (error) {
    console.error('Error refreshing calendar:', error)
  }
}

// Check if current day matches the given day
const isCurrentDay = (dayName) => {
  const today = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDayName = dayNames[today.getDay()]
  return currentDayName === dayName
}

// Mobile calendar state
const selectedDayIndex = ref(0)

// Handle URL parameters for direct booking
const handleUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const locationId = urlParams.get('location')
  const step = urlParams.get('step')
  
  if (locationId && step) {
    const location = bookingStore.locations.find(loc => loc.id === parseInt(locationId))
    if (location) {
      bookingStore.selectLocation(location)
      bookingStore.currentStep = parseInt(step)
    }
  }
}

// Mobile calendar helpers
const getSelectedDay = () => {
  return translatedWeekDays.value[selectedDayIndex.value] || translatedWeekDays.value[0]
}

const getSelectedDayName = () => {
  const day = getSelectedDay()
  return day ? day.dayName : ''
}

const getSelectedDayDate = () => {
  const day = getSelectedDay()
  if (!day) return ''
  const date = new Date(day.date)
  const monthNames = locale.value === 'hr' 
    ? ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const canGoToPreviousDay = computed(() => {
  return selectedDayIndex.value > 0
})

const canGoToNextDay = computed(() => {
  return selectedDayIndex.value < translatedWeekDays.value.length - 1
})

const previousDay = () => {
  if (canGoToPreviousDay.value) {
    selectedDayIndex.value--
  }
}

const nextDay = () => {
  if (canGoToNextDay.value) {
    selectedDayIndex.value++
  }
}


// Initialize calendar on mount
onMounted(async () => {
  console.log('Initializing booking page...')
  bookingStore.initializeCalendar()
  
  try {
    // Загружаем services перед другими данными
    console.log('Fetching services...')
    await servicesStore.fetchServices()
    console.log('Services loaded:', servicesStore.activeServices.length)
    
    console.log('Fetching booked slots...')
    // Загружаем занятые слоты при загрузке страницы
    await bookingStore.fetchBookedSlots()
    console.log('Booked slots loaded:', bookingStore.bookedSlots.length)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  
  // Handle URL parameters for direct booking
  handleUrlParams()
})
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Progress Steps */
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #6c757d;
  font-weight: bold;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step-number.active {
  background-color: #2c3e33;
  color: white;
}

.step-text {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e9ecef;
  margin: 0 1rem;
  margin-top: 20px;
}

/* Location Cards */
.location-card {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background-color: white;
  min-height: 400px;
  position: relative;
  display: flex;
  align-items: stretch;
}

.card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.location-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: #2c3e33;
}

.location-card.selected {
  border-color: #2c3e33;
  box-shadow: 0 0 0 3px rgba(44, 62, 51, 0.2);
  background-color: #f8f9fa;
}

.location-card .btn {
  transition: all 0.3s ease;
  margin-top: auto;
}

.location-card.selected .btn {
  font-weight: bold;
}

/* Brand Color */
.text-brand {
  color: #2c3e33 !important;
}

.btn-brand {
  background-color: #2c3e33 !important;
  border-color: #2c3e33 !important;
  color: white !important;
}

.btn-brand:hover {
  background-color: #1a2520 !important;
  border-color: #1a2520 !important;
  color: white !important;
}

/* Address Section */
.address-section {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

/* Service Cards */
.service-card {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background-color: white;
  min-height: 250px;
  position: relative;
  display: flex;
  align-items: stretch;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: #2c3e33;
}

.service-card.selected {
  border-color: #2c3e33;
  box-shadow: 0 0 0 3px rgba(44, 62, 51, 0.2);
  background-color: #f8f9fa;
}

.service-icon {
  font-size: 2.5rem;
  color: #2c3e33;
}

.service-duration .badge {
  background-color: #2c3e33 !important;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

/* Working Hours Section */
.working-hours-section {
  flex-grow: 1;
}

.hours-list {
  font-size: 0.8rem;
}

.hour-item {
  padding: 0.15rem 0;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.hour-item.current-day {
  background-color: rgba(44, 62, 51, 0.1);
  border-left: 3px solid #2c3e33;
  padding-left: 0.5rem;
}

.day-name {
  color: #6c757d;
  font-weight: 500;
}

.hours {
  color: #2c3e33;
  font-weight: 600;
}

.hour-item.current-day .day-name,
.hour-item.current-day .hours {
  color: #2c3e33;
  font-weight: 600;
}

/* Mobile Calendar */
.mobile-calendar {
  padding: 1rem;
}

/* Mobile Date Navigation */
.mobile-date-navigation {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.btn-date-nav {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #2c3e33;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-date-nav:hover:not(:disabled) {
  background-color: #2c3e33;
  border-color: #2c3e33;
  color: white;
}

.btn-date-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selected-date-display {
  flex-grow: 1;
  text-align: center;
}

.selected-date-display h5 {
  color: #2c3e33;
  font-size: 1rem;
  margin: 0;
}

/* Mobile Time Slots Container */
.mobile-time-slots-container {
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.time-slots-scroll {
  padding: 1rem;
}

.time-slot-mobile {
  margin-bottom: 0.5rem;
}

.btn-time-slot {
  background-color: white;
  border: 2px solid #e9ecef;
  color: #2c3e33;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-time-slot:hover:not(:disabled) {
  border-color: #2c3e33;
  background-color: #f8f9fa;
}

.btn-time-slot.btn-success {
  background-color: #2c3e33 !important;
  border-color: #2c3e33 !important;
  color: white !important;
}

.btn-time-slot.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f8f9fa !important;
  border-color: #dee2e6 !important;
  color: #6c757d !important;
}

.time-slot-occupied {
  background-color: #ffebee;
  border: 2px solid #e57373;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  text-align: center;
  color: #d32f2f;
  font-size: 0.9rem;
  font-weight: 500;
}

.time-slot-unavailable {
  background-color: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}



/* Selected Location Card */
.selected-location-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: white;
  min-height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #2c3e33;
}

.selected-location-card .card-content {
  width: 100%;
}

/* Selected Location Info */
.selected-location-info {
  /* Transparent background, no borders or shadows */
}

/* Calendar Styles */
.calendar-wrapper {
  width: 100%;
}

.calendar-grid {
  width: 100%;
}

.calendar-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.day-column {
  min-height: 300px;
}

.day-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.day-number {
  font-size: 1.5rem;
  color: #333;
}

.time-slots button {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
  min-width: 80px;
  height: 28px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-slots .btn-success {
  background-color: #2c3e33 !important;
  border-color: #2c3e33 !important;
}

.time-slots .btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f8f9fa !important;
  border-color: #dee2e6 !important;
  color: #6c757d !important;
}

/* Time Slot Styles */
.time-slot {
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  height: 32px;
  display: flex;
  align-items: center;
}

.time-slot.occupied {
  background-color: #ffebee;
  border-color: #e57373;
}

.time-slot.available {
  background-color: #f1f8e9;
  border-color: #aed581;
  padding: 0 !important;
}

.time-slot.available .btn {
  background-color: transparent;
  border: none;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  color: #2c3e33;
  font-weight: 500;
}

.time-slot.available .btn:hover {
  background-color: rgba(44, 62, 51, 0.1);
}

.time-slot.available .btn.btn-success {
  background-color: #2c3e33 !important;
  color: white !important;
}

.time-slot.occupied:hover {
  background-color: #ffcdd2;
}

.time-slot.available:hover {
  background-color: #dcedc8;
}

.time-label {
  color: #2c3e33;
  font-size: 0.8rem;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.reason-text {
  word-spacing: 100vw;
  line-height: 1.4;
}

/* Form Styles */
.form-control:focus,
.form-select:focus {
  border-color: #2c3e33;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 51, 0.25);
}

/* Booking Summary */
.booking-summary {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  color: #6c757d;
  font-weight: 500;
  font-size: 0.9rem;
  min-width: 80px;
}

.summary-value {
  color: #2c3e33;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

/* Booking Form Loading */
.bg-white {
  position: relative;
}

.booking-form-overlay {
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
  border-radius: 12px;
}

.form-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.form-disabled input,
.form-disabled button {
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .step-line {
    margin: 0 0.5rem;
  }

  .step-number {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }

  .step-text {
    display: none;
  }

  .location-card {
    margin-bottom: 1rem;
  }

  .calendar-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .calendar-grid {
    min-width: 700px;
  }
  
  .calendar-grid .col {
    min-width: 100px;
    padding: 0 1px;
  }

  .day-column {
    min-height: 250px;
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 1rem;
  }

  .step-item {
    flex-direction: row;
    text-align: left;
  }

  .step-number {
    margin-right: 0.5rem;
    margin-bottom: 0;
  }

  .step-line {
    display: none;
  }

  .calendar-grid {
    min-width: 560px;
  }
  
  .calendar-grid .col {
    min-width: 80px;
  }
}

/* Refresh button animation */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
