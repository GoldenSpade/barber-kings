<template>
  <div class="admin-calendar">
    <!-- Calendar Navigation -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button 
        class="btn btn-outline-secondary" 
        @click="previousWeek"
        :disabled="!canGoToPreviousWeek"
      >
        <i class="bi bi-chevron-left"></i>
        {{ $t('admin.calendar.previousWeek') }}
      </button>
      
      <div class="text-center">
        <h5 class="mb-0">{{ formatDateRange }}</h5>
        <small class="text-muted">{{ $t('admin.calendar.subtitle') }}</small>
      </div>
      
      <button 
        class="btn btn-outline-secondary" 
        @click="nextWeek"
        :disabled="!canGoToNextWeek"
      >
        {{ $t('admin.calendar.nextWeek') }}
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <!-- Location Filter -->
    <div class="mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <label class="form-label fw-bold">{{ $t('admin.calendar.filterLocation') }}</label>
          <select v-model="selectedLocationFilter" class="form-select">
            <option value="">{{ $t('admin.calendar.allLocations') }}</option>
            <option value="downtown">Downtown</option>
            <option value="podil">Podil</option>
          </select>
        </div>
        <div class="col-md-6 text-end mt-3 mt-md-0">
          <div class="legend d-inline-flex align-items-center">
            <div class="legend-item me-3">
              <span class="legend-color occupied"></span>
              <small>{{ $t('admin.calendar.occupied') }}</small>
            </div>
            <div class="legend-item">
              <span class="legend-color available"></span>
              <small>{{ $t('admin.calendar.available') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="bookingStore.isLoadingBookedSlots" class="text-center py-5">
      <Loader size="large" :message="$t('admin.calendar.loading')" />
    </div>

    <!-- Calendar Grid -->
    <div v-else class="calendar-grid">
      <div class="row">
        <!-- Days Headers -->
        <div class="col" v-for="day in weekDays" :key="day.date">
          <div class="day-header text-center p-3 bg-light rounded-top">
            <div class="day-name fw-bold">{{ day.dayName }}</div>
            <div class="day-number h5 mb-0">{{ day.dayNumber }}</div>
            <div class="day-month small text-muted">{{ day.month }}</div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Time Slots -->
        <div class="col" v-for="day in weekDays" :key="day.date">
          <div class="day-column bg-white border rounded-bottom p-2">
            <!-- Day status or time slots -->
            <div v-if="!day.available" class="text-center text-muted py-4">
              {{ day.reason === 'Closed' ? $t('admin.calendar.closed') : day.reason }}
            </div>
            <div v-else class="time-slots">
              <div 
                v-for="slot in allTimeSlots" 
                :key="slot"
                class="time-slot mb-1 p-2 rounded d-flex justify-content-between align-items-center"
                :class="getSlotClass(day, slot)"
              >
                <span class="fw-medium">{{ slot }}</span>
                <div v-if="getBookingForSlot(day, slot)" class="booking-info">
                  <small class="text-dark">
                    {{ getBookingForSlot(day, slot).name }}
                  </small>
                  <br>
                  <small class="text-muted">
                    {{ getBookingForSlot(day, slot).phone }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookingStore } from '@/stores/booking'
import Loader from '@/components/Loader.vue'

const { t: $t, locale } = useI18n()

const bookingStore = useBookingStore()
const selectedLocationFilter = ref('')

// Load bookings on mount
onMounted(async () => {
  await bookingStore.fetchBookedSlots()
})

// Generate all possible time slots for admin view
const allTimeSlots = computed(() => {
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

// Get week days (reuse logic from booking store but for admin view)
const weekDays = computed(() => {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Use currentWeekStart from store or fallback to today
  const startDate = bookingStore.currentWeekStart || today
  
  // Show 7 days starting from current week start
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dayNames = locale.value === 'hr' 
      ? ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      
    const monthNames = locale.value === 'hr'
      ? ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    let available = true
    let reason = ''
    
    // Check availability
    if (date.getDay() === 0) { // Sunday
      available = false
      reason = 'Closed'
    } else if (date < today) {
      available = true // Show past days for admin
      reason = ''
    }
    
    days.push({
      date: date.getTime(),
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      month: monthNames[date.getMonth()],
      available,
      reason
    })
  }
  
  return days
})

// Format date range for display
const formatDateRange = computed(() => {
  const startDate = bookingStore.currentWeekStart || new Date()
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  const formatDate = (date) => {
    const monthNames = locale.value === 'hr'
      ? ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    
    return `${month} ${day}, ${year}`
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
})

// Navigation methods
const canGoToPreviousWeek = computed(() => true) // Admin can see all weeks
const canGoToNextWeek = computed(() => true)

const previousWeek = () => {
  bookingStore.previousWeek()
}

const nextWeek = () => {
  bookingStore.nextWeek()
}

// Get booking for specific slot
const getBookingForSlot = (day, slot) => {
  // Return null if data is not yet loaded
  if (!bookingStore.bookedSlots || !Array.isArray(bookingStore.bookedSlots) || bookingStore.bookedSlots.length === 0) {
    return null
  }
  
  const date = new Date(day.date)
  const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  
  // Find booking that matches date and time
  const booking = bookingStore.bookedSlots.find(booking => {
    const matchesDate = booking.date === dateString
    const matchesTime = booking.time === slot
    
    // If location filter is selected, also check location
    if (selectedLocationFilter.value) {
      return matchesDate && matchesTime && booking.location === selectedLocationFilter.value
    }
    
    // If no filter, show all bookings
    return matchesDate && matchesTime
  })
  
  return booking
}

// Get CSS class for time slot
const getSlotClass = (day, slot) => {
  const booking = getBookingForSlot(day, slot)
  return {
    'occupied': booking,
    'available': !booking
  }
}
</script>

<style scoped>
.admin-calendar {
  width: 100%;
}

.calendar-grid .col {
  min-width: 0;
  padding: 0 2px;
}

.day-header {
  border: 1px solid #e9ecef;
  border-bottom: none;
}

.day-column {
  border: 1px solid #e9ecef;
  min-height: 400px;
}

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
}

.time-slot.occupied:hover {
  background-color: #ffcdd2;
}

.time-slot.available:hover {
  background-color: #dcedc8;
}

.booking-info {
  font-size: 0.75rem;
  text-align: right;
}

.legend {
  font-size: 0.85rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 6px;
  border: 1px solid #ddd;
}

.legend-color.occupied {
  background-color: #ffebee;
}

.legend-color.available {
  background-color: #f1f8e9;
}

.btn-outline-secondary {
  border-color: #2c3e33;
  color: #2c3e33;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #2c3e33;
  border-color: #2c3e33;
  color: white;
}

.form-select:focus {
  border-color: #2c3e33;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 51, 0.25);
}

@media (max-width: 768px) {
  .calendar-grid .col {
    padding: 0 1px;
  }
  
  .day-column {
    min-height: 300px;
  }
  
  .time-slot {
    font-size: 0.75rem;
    padding: 0.25rem !important;
  }
  
  .booking-info {
    font-size: 0.65rem;
  }
}
</style>