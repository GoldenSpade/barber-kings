<template>
  <div class="admin-calendar">
    <!-- Copy Notification -->
    <div 
      v-if="showCopyNotification" 
      class="copy-notification alert alert-success alert-dismissible fade show position-fixed"
      style="top: 20px; right: 20px; z-index: 9999;"
    >
      <i class="bi bi-check-circle me-2"></i>
      {{ $t('admin.calendar.phoneCopied', { phone: copiedPhone }) }}
      <button type="button" class="btn-close" @click="showCopyNotification = false"></button>
    </div>

    <!-- Calendar Navigation -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button 
        class="btn-nav-arrow" 
        @click="previousWeek"
        :disabled="!canGoToPreviousWeek"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      
      <div class="text-center">
        <h5 class="mb-0">{{ formatDateRange }}</h5>
        <small class="text-muted">{{ $t('admin.calendar.subtitle') }}</small>
      </div>
      
      <button 
        class="btn-nav-arrow" 
        @click="nextWeek"
        :disabled="!canGoToNextWeek"
      >
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
          <button 
            class="btn btn-outline-primary btn-sm me-3" 
            @click="refreshBookings"
            :disabled="isLoading"
          >
            <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': isLoading }"></i>
            {{ isLoading ? $t('admin.calendar.loading') : 'Refresh' }}
          </button>
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
    <div v-else class="calendar-wrapper">
      <div class="calendar-grid">
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
                class="time-slot mb-1 p-2 rounded"
                :class="getSlotClass(day, slot)"
              >
                <div v-if="getBookingForSlot(day, slot)" class="booking-info-vertical text-center">
                  <div class="time-label fw-medium mb-1">{{ slot }}</div>
                  <div class="customer-name text-dark fw-bold mb-1">
                    <i class="bi bi-person-fill me-1"></i>
                    {{ getBookingForSlot(day, slot).name }}
                  </div>
                  <div 
                    class="customer-phone text-muted small phone-clickable mb-1" 
                    @click="copyPhoneToClipboard(getBookingForSlot(day, slot).phone)"
                    :title="$t('admin.calendar.clickToCopyPhone')"
                  >
                    <i class="bi bi-telephone-fill me-1"></i>
                    {{ getBookingForSlot(day, slot).phone }}
                    <i class="bi bi-clipboard ms-1 copy-icon"></i>
                  </div>
                  <div v-if="getBookingForSlot(day, slot).location" class="booking-location text-muted small mb-1">
                    <i class="bi bi-geo-alt me-1"></i>
                    {{ getLocationName(getBookingForSlot(day, slot).location) }}
                  </div>
                  <div v-if="getBookingForSlot(day, slot).status" class="booking-status">
                    <span 
                      class="badge" 
                      :class="getStatusBadgeClass(getBookingForSlot(day, slot).status)"
                    >
                      {{ getBookingForSlot(day, slot).status }}
                    </span>
                  </div>
                </div>
                <div v-else class="d-flex justify-content-center align-items-center">
                  <span class="fw-medium time-label">{{ slot }}</span>
                </div>
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

// State for copy notification
const showCopyNotification = ref(false)
const copiedPhone = ref('')

// Load bookings on mount
onMounted(async () => {
  await bookingStore.fetchBookedSlots(true) // Передаем true для админ-панели
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

// Format date range for display (same as BookingPage)
const formatDateRange = computed(() => {
  const start = new Date(bookingStore.currentWeekStart)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)

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

// Get CSS class for status badge
const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-success'
    case 'pending':
      return 'bg-warning text-dark'
    case 'completed':
      return 'bg-info'
    case 'cancelled':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}

// Get location name from location key
const getLocationName = (locationKey) => {
  const locationMap = {
    'downtown': 'Downtown',
    'podil': 'Podil'
  }
  return locationMap[locationKey] || locationKey
}

// Loading state
const isLoading = computed(() => bookingStore.isLoadingBookedSlots)

// Refresh bookings
const refreshBookings = async () => {
  try {
    await bookingStore.fetchBookedSlots(true)
  } catch (error) {
    console.error('Failed to refresh bookings:', error)
  }
}

// Copy phone number to clipboard
const copyPhoneToClipboard = async (phone) => {
  if (!phone || phone === 'undefined') {
    console.error('Phone number is undefined or empty')
    return
  }
  
  try {
    await navigator.clipboard.writeText(phone)
    copiedPhone.value = phone
    showCopyNotification.value = true
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      showCopyNotification.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy phone number:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = phone
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      copiedPhone.value = phone
      showCopyNotification.value = true
      setTimeout(() => {
        showCopyNotification.value = false
      }, 2000)
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
    }
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
.admin-calendar {
  width: 100%;
}

.calendar-wrapper {
  width: 100%;
}

.calendar-grid {
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
  max-width: 70%;
  margin-right: 4px;
}

.booking-info-vertical {
  font-size: 0.75rem;
  width: 100%;
  padding: 0.25rem;
}

.customer-name {
  font-size: 0.8rem;
  line-height: 1.2;
}

.customer-phone {
  font-size: 0.7rem;
  line-height: 1.2;
}

.booking-location {
  font-size: 0.7rem;
  line-height: 1.2;
}

.phone-clickable {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px 4px;
}

.phone-clickable:hover {
  background-color: rgba(44, 62, 51, 0.1);
  color: #2c3e33 !important;
}

.copy-icon {
  opacity: 0.6;
  font-size: 0.65rem;
  transition: opacity 0.2s ease;
}

.phone-clickable:hover .copy-icon {
  opacity: 1;
}


.time-label {
  min-width: 50px;
  color: #2c3e33;
}

.booking-status .badge {
  font-size: 0.6rem;
  padding: 0.2rem 0.4rem;
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

.btn-nav-arrow {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.btn-nav-arrow:hover:not(:disabled) {
  color: #2c3e33;
}

.btn-nav-arrow:disabled {
  color: #dee2e6;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

/* Responsive */
@media (max-width: 768px) {
  .calendar-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .calendar-grid {
    min-width: 910px; /* Increased minimum width */
  }
  
  .calendar-grid .col {
    padding: 0 1px;
    min-width: 130px; /* Increased minimum width for each day column */
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
    max-width: 100%; /* Allow full width */
    margin-right: 2px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .booking-info-vertical {
    font-size: 0.65rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .customer-name {
    font-size: 0.7rem;
    line-height: 1.2;
    white-space: normal;
    word-break: break-word;
  }
  
  .customer-phone {
    font-size: 0.6rem;
    line-height: 1.2;
    white-space: normal;
    word-break: break-all;
  }
  
  .booking-location {
    font-size: 0.6rem;
    line-height: 1.2;
  }
  
  .booking-status .badge {
    font-size: 0.55rem;
    padding: 0.15rem 0.3rem;
  }
  
  .time-label {
    min-width: 40px;
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .calendar-grid {
    min-width: 770px; /* Increased minimum width for very small screens */
  }
  
  .calendar-grid .col {
    min-width: 110px; /* Increased minimum width for each day column */
  }
  
  .day-column {
    margin-bottom: 1rem;
    min-height: 250px;
  }
  
  .time-slot {
    font-size: 0.7rem;
    padding: 0.2rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .booking-info {
    font-size: 0.6rem;
    max-width: 100%; /* Allow full width on small screens */
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .booking-info-vertical {
    font-size: 0.6rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .customer-name {
    font-size: 0.65rem;
    line-height: 1.1;
    white-space: normal;
    word-break: break-word;
  }
  
  .customer-phone {
    font-size: 0.55rem;
    line-height: 1.1;
    white-space: normal;
    word-break: break-all;
  }
  
  .booking-location {
    font-size: 0.55rem;
    line-height: 1.1;
  }
  
  .time-label {
    font-size: 0.65rem;
    min-width: 35px;
  }
  
  .copy-icon {
    font-size: 0.5rem;
  }
  
  /* Hide some icons on small screens */
  .customer-name .bi-person-fill,
  .customer-phone .bi-telephone-fill {
    display: none;
  }
}
</style>