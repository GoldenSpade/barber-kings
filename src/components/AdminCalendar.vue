<template>
  <div class="admin-calendar">

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
          <select v-model="selectedLocationFilter" class="form-select" data-location-filter>
            <option value="Martinkovac">Martinkovac</option>
            <option value="Adamiceva">Adamiceva</option>
          </select>
        </div>
        <div class="col-md-6 text-end mt-3 mt-md-0">
          <button 
            class="btn btn-outline-secondary btn-sm me-3 refresh-btn" 
            @click="refreshBookings"
            :disabled="isLoading"
          >
            <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': isLoading }"></i>
            {{ isLoading ? $t('admin.calendar.loading') : $t('admin.bookings.refresh') }}
          </button>
          <div class="legend d-inline-flex align-items-center">
            <div class="legend-item me-3">
              <span class="legend-color occupied"></span>
              <small>{{ $t('admin.calendar.occupied') }}</small>
            </div>
            <div class="legend-item me-3">
              <span class="legend-color completed"></span>
              <small>Completed</small>
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
                @click="getBookingsForSlot(day, slot).length > 0 ? handleBookingClick(getBookingsForSlot(day, slot)[0]) : handleEmptySlotClick(day, slot)"
              >
                <div v-if="getBookingsForSlot(day, slot).length > 0" class="booking-info-vertical text-center position-relative">
                  <div class="time-label fw-medium mb-1">{{ slot }}</div>
                  
                  <!-- Status icon in top right corner -->
                  <i 
                    class="status-icon-corner position-absolute" 
                    :class="getStatusIconClass(getBookingsForSlot(day, slot)[0].status)"
                    :title="getStatusTitle(getBookingsForSlot(day, slot)[0].status)"
                  ></i>
                  
                  <!-- Show all bookings for this slot -->
                  <div v-for="(booking, index) in getBookingsForSlot(day, slot)" :key="booking.id || index" class="single-booking mb-2" :class="{ 'border-top pt-2': index > 0 }">
                    <div class="customer-name text-dark fw-bold mb-1">
                      <i class="bi bi-person-fill me-1"></i>
                      {{ booking.name }}
                    </div>
                    <div class="customer-phone text-muted small mb-1">
                      <i class="bi bi-telephone-fill me-1"></i>
                      {{ booking.phone }}
                    </div>
                    <div v-if="booking.service" class="booking-service text-muted small mb-1">
                      <i class="bi bi-scissors me-1"></i>
                      {{ getServiceName(booking.service) }}
                    </div>
                  </div>
                </div>
                <div v-else class="empty-slot-content position-relative">
                  <span class="fw-medium time-label">{{ slot }}</span>
                  <i class="bi bi-plus-circle add-icon"></i>
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
const selectedLocationFilter = ref('Martinkovac')


// Load bookings on mount
onMounted(async () => {
  await bookingStore.fetchBookedSlots(true) // Передаем true для админ-панели
})

// Generate all possible time slots for admin view
const allTimeSlots = computed(() => {
  const slots = []
  for (let hour = 9; hour <= 20; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
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

// Get bookings for specific slot (can return multiple bookings)
const getBookingsForSlot = (day, slot) => {
  // Return empty array if data is not yet loaded
  if (!bookingStore.bookedSlots || !Array.isArray(bookingStore.bookedSlots) || bookingStore.bookedSlots.length === 0) {
    return []
  }
  
  const date = new Date(day.date)
  const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  
  // Find all bookings that match date, time, and selected location
  const bookings = bookingStore.bookedSlots.filter(booking => {
    const matchesDate = booking.date === dateString
    const matchesTime = booking.time === slot
    const matchesLocation = booking.location === selectedLocationFilter.value
    
    return matchesDate && matchesTime && matchesLocation
  })
  
  return bookings
}

// Get booking for specific slot (backwards compatibility - returns first booking)
const getBookingForSlot = (day, slot) => {
  const bookings = getBookingsForSlot(day, slot)
  return bookings.length > 0 ? bookings[0] : null
}

// Get CSS class for time slot
const getSlotClass = (day, slot) => {
  const bookings = getBookingsForSlot(day, slot)
  if (bookings.length === 0) {
    return { 'available': true }
  }
  
  // Check if any booking is completed
  const hasCompleted = bookings.some(booking => booking.status === 'Completed')
  
  return {
    'occupied': true,
    'completed': hasCompleted
  }
}

const getServiceName = (serviceKey) => {
  // Преобразуем ключ услуги в читаемое название
  const serviceNames = {
    'mensHaircut': $t('services.mensHaircut.name'),
    'mensHaircutBeard': $t('services.mensHaircutBeard.name'),
    'womensHaircut': $t('services.womensHaircut.name')
  }
  
  return serviceNames[serviceKey] || serviceKey
}

// Get status icon class based on booking status
const getStatusIconClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bi bi-clock-fill text-warning'
    case 'Confirmed':
      return 'bi bi-check-circle-fill text-primary'
    case 'Completed':
      return 'bi bi-check-circle-fill text-success'
    default:
      return 'bi bi-question-circle text-muted'
  }
}

// Get status title for tooltip
const getStatusTitle = (status) => {
  try {
    const key = status.toLowerCase()
    return $t(`admin.bookings.status.${key}`)
  } catch (error) {
    // Fallback to default values if translation fails
    const statusTitles = {
      'Pending': 'Pending Confirmation',
      'Confirmed': 'Confirmed',
      'Completed': 'Completed'
    }
    return statusTitles[status] || status
  }
}

// Loading state
const isLoading = computed(() => bookingStore.isLoadingBookedSlots)

// Refresh bookings
const refreshBookings = async () => {
  try {
    console.log('Manual refresh triggered')
    await bookingStore.fetchBookedSlots(true, true) // forceRefresh = true
  } catch (error) {
    console.error('Failed to refresh bookings:', error)
  }
}


// Handle click on empty slot to add booking
const handleEmptySlotClick = (day, slot) => {
  // Format the date for the booking form
  const date = new Date(day.date)
  const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  
  // Navigate to Add Booking tab with pre-filled date and time
  // We'll emit an event to parent component to handle tab switching
  console.log(`Adding booking for ${dateString} at ${slot}`)
  
  // For now, we'll use window navigation to the Add Booking tab
  // In the future, this could be improved with proper component communication
  window.dispatchEvent(new CustomEvent('admin-add-booking', {
    detail: {
      date: dateString,
      time: slot,
      dayDate: day.date
    }
  }))
}

// Handle click on existing booking to edit it
const handleBookingClick = (booking) => {
  console.log('Editing booking:', booking)
  
  // Emit event to parent component to show edit modal
  window.dispatchEvent(new CustomEvent('admin-edit-booking', {
    detail: {
      booking: booking
    }
  }))
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

.time-slot.occupied.completed {
  background-color: #f5f5f5;
  border-color: #9e9e9e;
}

.time-slot.available {
  background-color: #f1f8e9;
  border-color: #aed581;
}

.time-slot.occupied {
  cursor: pointer;
}

.time-slot.occupied:hover {
  background-color: #ffcdd2;
}

.time-slot.occupied.completed:hover {
  background-color: #eeeeee;
}

.time-slot.available {
  cursor: pointer;
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

.single-booking {
  position: relative;
}

.single-booking.border-top {
  border-top: 1px solid rgba(0,0,0,0.1) !important;
}

.customer-name {
  font-size: 0.8rem;
  line-height: 1.2;
}

.customer-phone {
  font-size: 0.7rem;
  line-height: 1.2;
}

.booking-service {
  font-size: 0.7rem;
  line-height: 1.2;
}

/* Status icon styles */
.status-icon-corner {
  font-size: 0.8rem;
  top: 2px;
  right: 4px;
  z-index: 5;
}

.status-icon-corner.text-warning {
  color: #fd7e14 !important;
}

.status-icon-corner.text-success {
  color: #28a745 !important;
}

.status-icon-corner.text-primary {
  color: #007bff !important;
}

.status-icon-corner.text-muted {
  color: #6c757d !important;
}



/* Empty slot content styles */
.empty-slot-content {
  padding: 8px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot-content .time-label {
  text-align: center;
  width: 100%;
}

.empty-slot-content .add-icon {
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #2c3e33;
  font-size: 0.8rem;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
}

.time-slot.available:hover .add-icon {
  opacity: 1;
}




.time-label {
  min-width: 50px;
  color: #2c3e33;
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
  border-color: #e57373;
}

.legend-color.completed {
  background-color: #f5f5f5;
  border-color: #9e9e9e;
}

.legend-color.available {
  background-color: #f1f8e9;
  border-color: #aed581;
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

.refresh-btn {
  border-color: #dee2e6;
  color: #6c757d;
  background-color: #f8f9fa;
}

.refresh-btn:hover:not(:disabled) {
  border-color: #adb5bd;
  color: #495057;
  background-color: #e9ecef;
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
  
  
  .time-label {
    min-width: 40px;
    font-size: 0.7rem;
  }
  
  .status-icon-corner {
    font-size: 0.7rem;
    top: 1px;
    right: 3px;
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
  
  
  .time-label {
    font-size: 0.65rem;
    min-width: 35px;
  }
  
  .copy-icon {
    font-size: 0.5rem;
  }
  
  .status-icon-corner {
    font-size: 0.6rem;
    top: 1px;
    right: 2px;
  }
  
  /* Hide some icons on small screens */
  .customer-name .bi-person-fill,
  .customer-phone .bi-telephone-fill {
    display: none;
  }
}
</style>