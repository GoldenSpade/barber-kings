<template>
  <div class="booking-page bg-light">
    <!-- Logo Header -->
    <div class="text-center py-4 bg-white">
      <img
        src="@/assets/main-logo.png"
        alt="Barber Kings"
        style="height: 80px"
      />
    </div>

    <!-- Back Button -->
    <div class="container py-3">
      <button @click="goBack" class="btn btn-link text-dark p-0" style="text-decoration: none;">
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
        <div class="row justify-content-center">
          <div class="col-md-5 mb-4" v-for="location in bookingStore.locations" :key="location.id">
            <div
              class="service-card h-100"
              :class="{ selected: bookingStore.selectedLocation?.id === location.id }"
              :style="{ backgroundImage: `url(${locationImages[location.id]})` }"
              @click="bookingStore.selectLocation(location)"
            >
              <div class="card-overlay"></div>
              <div class="card-content text-center p-4">
                <h5 class="fw-bold text-white mb-3">{{ $t(location.nameKey) }}</h5>
                <p class="text-white mb-3">{{ $t(location.addressKey) }}</p>
                <p class="text-white small mb-4">{{ $t(location.descriptionKey) }}</p>
                <button class="btn btn-outline-light w-100 mt-auto">{{ $t('booking.choose') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Time Selection -->
      <div v-if="bookingStore.currentStep === 2" class="step-content">
        <h2 class="text-center mb-3 fw-bold">{{ $t('booking.chooseTime') }}</h2>
        <div class="text-center mb-4 text-muted">
          <small>{{ bookingStore.selectedLocation ? $t(bookingStore.selectedLocation.nameKey) : '' }} • {{ $t('booking.haircut') }} • {{ $t('booking.timezone') }}</small>
        </div>
        
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="bg-white rounded shadow p-4">
              <!-- Calendar Navigation -->
              <div class="d-flex justify-content-between align-items-center mb-4">
                <button class="btn btn-link text-dark" @click="bookingStore.previousWeek">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <h5 class="mb-0">{{ bookingStore.formatDateRange }}</h5>
                <button class="btn btn-link text-dark" @click="bookingStore.nextWeek">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>

              <!-- Week Days -->
              <div class="row text-center">
                <div class="col" v-for="day in bookingStore.weekDays" :key="day.date">
                  <div class="day-column">
                    <div class="day-header mb-3">
                      <div class="day-name small text-muted">{{ day.dayName }}</div>
                      <div class="day-number fw-bold">{{ day.dayNumber }}</div>
                      <div class="day-month small text-muted">{{ day.month }}</div>
                    </div>
                    <div class="time-slots">
                      <div v-if="day.available">
                        <button
                          v-for="time in day.timeSlots"
                          :key="time"
                          class="btn btn-outline-secondary btn-sm mb-2 d-block w-100"
                          :class="{ 'btn-success': bookingStore.selectedTime === time && bookingStore.selectedDate === day.date }"
                          @click="bookingStore.selectTime(day.date, time)"
                        >
                          {{ time }}
                        </button>
                      </div>
                      <div v-else class="text-muted small">
                        {{ day.reason }}
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
                <p class="mb-2"><strong>{{ $t('booking.haircut') }} ({{ $t('booking.duration') }})</strong></p>
                <p class="text-muted mb-0">{{ bookingStore.formatBookingDate }} (Europe/Kiev)</p>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="bg-white rounded shadow p-4">
              <div class="d-flex align-items-center mb-4">
                <i class="bi bi-person me-3" style="color: #2c3e33;"></i>
                <h6 class="mb-0 fw-bold">{{ $t('booking.contactDetails') }}</h6>
              </div>

              <form @submit.prevent="handleSubmitBooking">
                <div class="mb-3">
                  <label class="form-label">{{ $t('booking.fullName') }} *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="bookingStore.bookingForm.name"
                    :placeholder="$t('booking.enterName')"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label class="form-label">{{ $t('booking.phone') }}</label>
                  <input
                    type="tel"
                    class="form-control"
                    v-model="bookingStore.bookingForm.phone"
                    placeholder="+380..."
                    required
                  />
                </div>


                <button
                  type="submit"
                  class="btn btn-lg w-100 fw-bold"
                  style="
                    background-color: #2c3e33 !important;
                    border-color: #2c3e33 !important;
                    color: white;
                  "
                >
                  {{ $t('booking.bookNow') }}
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import Footer from '@/components/Footer.vue'
import address1 from '@/assets/address-1.jpg'
import address2 from '@/assets/address-2.jpg'

const router = useRouter()
const bookingStore = useBookingStore()

// Location images mapping
const locationImages = {
  1: address1,
  2: address2
}

// Methods
const goBack = () => {
  const shouldGoHome = bookingStore.goToPreviousStep()
  if (shouldGoHome) {
    router.push('/')
  }
}

const handleSubmitBooking = () => {
  const result = bookingStore.submitBooking()
  if (result.success) {
    alert(result.message)
    router.push('/')
  }
}

// Initialize calendar on mount
onMounted(() => {
  bookingStore.initializeCalendar()
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
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
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
  background: linear-gradient(to bottom, rgba(44,62,51,0.4), rgba(44,62,51,0.8));
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

/* Calendar Styles */
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
}
</style>
