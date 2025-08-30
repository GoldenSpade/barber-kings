<template>
  <div class="booking-page bg-light">
    <!-- Logo Header -->
    <div class="py-4 bg-white">
      <div class="container">
        <div class="row align-items-center">
          <!-- Logo -->
          <div class="col-12 col-md-8 text-center text-md-start">
            <img src="@/assets/main-logo.png" alt="Barber Kings" style="height: 80px" />
          </div>

          <!-- Language Switcher -->
          <div class="col-12 col-md-4 text-center text-md-end mt-3 mt-md-0">
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
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-between">
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 1 }">1</span>
              <span class="step-text">{{ $t('booking.steps.locations') }}</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 2 }">2</span>
              <span class="step-text">{{ $t('booking.steps.time') }}</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 3 }">3</span>
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
              class="service-card h-100"
              :class="{ selected: bookingStore.selectedLocation?.id === location.id }"
              :style="{ backgroundImage: `url(${locationImages[location.id]})` }"
              @click="bookingStore.selectLocation(location)"
            >
              <div class="card-overlay"></div>
              <div class="card-content text-center p-4">
                <h5 class="fw-bold text-white mb-3">{{ location.name }}</h5>
                <p class="text-white mb-3">{{ location.address }}</p>
                <p class="text-white small mb-4">{{ location.description }}</p>
                <button class="btn btn-outline-light w-100 mt-auto">
                  {{ $t('booking.choose') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Time Selection -->
      <div v-if="bookingStore.currentStep === 2" class="step-content">
        <h2 class="text-center mb-3 fw-bold">{{ $t('booking.chooseTime') }}</h2>

        <!-- Selected Location Card -->
        <div class="row justify-content-center mb-4">
          <div class="col-lg-10">
            <div
              class="selected-location-card"
              :style="{
                backgroundImage: `url(${locationImages[bookingStore.selectedLocation.id]})`,
              }"
            >
              <div class="card-overlay"></div>
              <div class="card-content text-center p-4">
                <h5 class="fw-bold text-white mb-2">{{ getSelectedLocationName() }}</h5>
                <p class="text-white mb-2">
                  <i class="bi bi-geo-alt me-1"></i>{{ getSelectedLocationAddress() }}
                </p>
                <p class="text-white mb-2">
                  <i class="bi bi-scissors me-1"></i>{{ $t('booking.haircut') }} ({{
                    $t('booking.duration')
                  }})
                </p>
                <p class="text-white mb-0">
                  <i class="bi bi-clock me-1"></i
                  >{{ $t('booking.timezone', { timezone: bookingStore.formattedTimezone }) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="bg-white rounded shadow p-4">
              <!-- Calendar Navigation -->
              <div class="d-flex justify-content-between align-items-center mb-4">
                <button
                  class="btn btn-link text-dark"
                  @click="bookingStore.previousWeek"
                  :disabled="!bookingStore.canGoToPreviousWeek"
                  :class="{ 'opacity-50': !bookingStore.canGoToPreviousWeek }"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
                <h5 class="mb-0">{{ formattedDateRange }}</h5>
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
              <div class="calendar-wrapper">
                <div class="calendar-grid">
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
                          v-for="time in day.allTimeSlots"
                          :key="time"
                          class="time-slot mb-1 p-2 rounded"
                          :class="getSlotClass(day, time)"
                        >
                          <button
                            v-if="!isSlotBooked(day, time)"
                            class="btn btn-outline-secondary btn-sm w-100"
                            :class="{
                              'btn-success':
                                bookingStore.selectedTime === time &&
                                bookingStore.selectedDate === day.date,
                            }"
                            @click="bookingStore.selectTime(day.date, time)"
                          >
                            {{ time }}
                          </button>
                          <div v-else class="d-flex justify-content-center align-items-center">
                            <span class="fw-medium time-label">{{ time }}</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Contact Form -->
      <div v-if="bookingStore.currentStep === 3" class="step-content">
        <h2 class="text-center mb-5 fw-bold">{{ $t('booking.contactDetails') }}</h2>

        <div class="row justify-content-center">
          <div class="col-md-6">
            <!-- Booking Confirmation -->
            <div class="bg-white rounded shadow p-4 mb-4">
              <h6 class="fw-bold mb-3">{{ $t('booking.timeConfirmation') }}</h6>
              <div class="booking-details">
                <p class="mb-2">
                  <strong>{{ $t('booking.haircut') }} ({{ $t('booking.duration') }})</strong>
                </p>
                <p class="text-muted mb-0">
                  {{ bookingStore.formatBookingDate }} ({{ bookingStore.formattedTimezone }})
                </p>
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
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { useBookingStore } from '@/stores/booking'
import Footer from '@/components/Footer.vue'
import Loader from '@/components/Loader.vue'
import address1 from '@/assets/address-1.jpg'
import address2 from '@/assets/address-2.jpg'

const router = useRouter()
const bookingStore = useBookingStore()
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

// Location images mapping
const locationImages = {
  1: address1,
  2: address2,
}

// Computed locations with translations
const translatedLocations = computed(() => {
  return bookingStore.locations.map((location) => ({
    ...location,
    name: $t(location.nameKey),
    address: $t(location.addressKey),
    description: $t(location.descriptionKey),
  }))
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
      reason: translatedReason,
      allTimeSlots: generateAllTimeSlots(), // Добавляем все слоты времени
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
      alert(result.message)
      router.push('/')
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('Error submitting booking:', error)
    alert('Sorry, there was an error submitting your booking. Please try again.')
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
  for (let hour = 9; hour <= 21; hour++) {
    if (hour < 21) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    } else {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
  }
  return slots
}

// Check if a slot is booked
const isSlotBooked = (day, slot) => {
  const date = new Date(day.date)
  const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  const currentLocation = bookingStore.selectedLocation?.nameKey ? 
    bookingStore.selectedLocation.nameKey.replace('locations.', '').replace('.name', '') : 
    bookingStore.selectedLocation?.name

  return bookingStore.bookedSlots.some(booking => 
    booking.date === dateString && 
    booking.time === slot && 
    booking.location === currentLocation
  )
}

// Get CSS class for time slot
const getSlotClass = (day, slot) => {
  const isBooked = isSlotBooked(day, slot)
  return {
    'occupied': isBooked,
    'available': !isBooked
  }
}

// Initialize calendar on mount
onMounted(async () => {
  bookingStore.initializeCalendar()
  // Загружаем занятые слоты при загрузке страницы
  await bookingStore.fetchBookedSlots()
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

/* Service Cards */
.service-card {
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  min-height: 350px;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
  transition: opacity 0.3s ease;
}

.card-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.card-content h5,
.card-content p {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  border-color: #fff;
}

.service-card:hover .card-overlay {
  opacity: 0.9;
}

.service-card.selected {
  border-color: #fff;
  box-shadow: 0 0 0 3px #2c3e33;
}

.service-card.selected .card-overlay {
  background: linear-gradient(to bottom, rgba(44, 62, 51, 0.4), rgba(44, 62, 51, 0.8));
}

.service-card .btn {
  transition: all 0.3s ease;
}

.service-card:hover .btn,
.service-card.selected .btn {
  background-color: white;
  border-color: white;
  color: #2c3e33;
  font-weight: bold;
}

/* Selected Location Card */
.selected-location-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  min-height: 350px;
  position: relative;
  display: flex;
  align-items: center;
}

.selected-location-card .card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(44, 62, 51, 0.4), rgba(44, 62, 51, 0.8));
}

.selected-location-card .card-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.selected-location-card .card-content h5,
.selected-location-card .card-content p {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

/* Calendar Styles */
.calendar-wrapper {
  width: 100%;
}

.calendar-grid {
  width: 100%;
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
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
}

.time-slots .btn-success {
  background-color: #2c3e33 !important;
  border-color: #2c3e33 !important;
}

/* Time Slot Styles */
.time-slot {
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  font-size: 0.85rem;
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

.booking-details {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #2c3e33;
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
    font-size: 0.8rem;
  }

  .service-card {
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
</style>
