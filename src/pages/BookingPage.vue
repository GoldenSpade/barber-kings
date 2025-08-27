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
        <i class="fas fa-arrow-left me-2"></i>Back
      </button>
    </div>

    <!-- Progress Steps -->
    <div class="container mb-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-between">
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 1 }">1</span>
              <span class="step-text">Locations</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 2 }">2</span>
              <span class="step-text">Time</span>
            </div>
            <div class="step-line"></div>
            <div class="step-item">
              <span class="step-number" :class="{ active: bookingStore.currentStep >= 3 }">3</span>
              <span class="step-text">Details</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="container pb-5">
      <!-- Step 1: Location Selection -->
      <div v-if="bookingStore.currentStep === 1" class="step-content">
        <h2 class="text-center mb-5 fw-bold">Choose Location</h2>
        <div class="row justify-content-center">
          <div class="col-md-4 mb-4" v-for="location in bookingStore.locations" :key="location.id">
            <div
              class="service-card h-100"
              :class="{ selected: bookingStore.selectedLocation?.id === location.id }"
              @click="bookingStore.selectLocation(location)"
            >
              <div class="card-body text-center p-4">
                <div class="service-icon mb-3">
                  <i class="fas fa-map-marker-alt fa-2x" style="color: #2c3e33;"></i>
                </div>
                <h5 class="fw-bold text-dark mb-3">{{ location.name }}</h5>
                <p class="text-muted mb-3">{{ location.address }}</p>
                <p class="text-muted small">{{ location.description }}</p>
                <button class="btn btn-outline-dark w-100 mt-3">Choose</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Time Selection -->
      <div v-if="bookingStore.currentStep === 2" class="step-content">
        <h2 class="text-center mb-3 fw-bold">Choose Your Time</h2>
        <div class="text-center mb-4 text-muted">
          <small>{{ bookingStore.selectedLocation?.name }} • Type: Haircut • Timezone: Europe/Kiev</small>
        </div>
        
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="bg-white rounded shadow p-4">
              <!-- Calendar Navigation -->
              <div class="d-flex justify-content-between align-items-center mb-4">
                <button class="btn btn-link text-dark" @click="bookingStore.previousWeek">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <h5 class="mb-0">{{ bookingStore.formatDateRange }}</h5>
                <button class="btn btn-link text-dark" @click="bookingStore.nextWeek">
                  <i class="fas fa-chevron-right"></i>
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
        <h2 class="text-center mb-5 fw-bold">Contact Details</h2>
        
        <div class="row justify-content-center">
          <div class="col-md-6">
            <!-- Booking Confirmation -->
            <div class="bg-white rounded shadow p-4 mb-4">
              <h6 class="fw-bold mb-3">Time Confirmation</h6>
              <div class="booking-details">
                <p class="mb-2"><strong>Haircut (60 min)</strong></p>
                <p class="text-muted mb-0">{{ bookingStore.formatBookingDate }} (Europe/Kiev)</p>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="bg-white rounded shadow p-4">
              <div class="d-flex align-items-center mb-4">
                <i class="fas fa-user me-3" style="color: #2c3e33;"></i>
                <h6 class="mb-0 fw-bold">Contact Details</h6>
              </div>

              <form @submit.prevent="handleSubmitBooking">
                <div class="mb-3">
                  <label class="form-label">Full Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="bookingStore.bookingForm.name"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label class="form-label">Phone</label>
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
                  Book Now
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

const router = useRouter()
const bookingStore = useBookingStore()

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
  background: white;
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: #2c3e33;
}

.service-card.selected {
  border-color: #2c3e33;
  background-color: #f8f9f8;
}

.service-card .btn {
  transition: all 0.3s ease;
}

.service-card:hover .btn,
.service-card.selected .btn {
  background-color: #2c3e33;
  border-color: #2c3e33;
  color: white;
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
