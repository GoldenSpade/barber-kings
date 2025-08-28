import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  // State
  const currentStep = ref(1)
  const selectedLocation = ref(null)
  const selectedDate = ref(null)
  const selectedTime = ref(null)
  const currentWeekStart = ref(new Date())
  
  const bookingForm = ref({
    name: '',
    phone: ''
  })

  // Locations data
  const locations = ref([
    {
      id: 1,
      name: 'Downtown Barber Kings',
      address: '25 Khreshchatyk Street',
      description: 'Central location with full range of services'
    },
    {
      id: 2,  
      name: 'Barber Kings Podil',
      address: '15 Sagaidachnogo Street',
      description: 'Cozy atmosphere in historic district'
    }
  ])

  // Helper function to generate time slots
  const generateTimeSlots = () => {
    const slots = []
    // From 9:00 to 21:00 (9 PM) with 30-minute intervals
    for (let hour = 9; hour <= 21; hour++) {
      if (hour < 21) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      } else {
        slots.push(`${hour.toString().padStart(2, '0')}:00`) // Last slot at 21:00
      }
    }
    return slots
  }

  // Getters
  const weekDays = computed(() => {
    const days = []
    const start = new Date(currentWeekStart.value)
    
    // Show 1 week (7 days) - slider approach
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      date.setHours(0, 0, 0, 0)
      
      let available = true
      let reason = ''
      let timeSlots = []
      
      if (date < today) {
        available = false
        reason = 'Past day'
      } else if (date.getDay() === 0) { // Sunday
        available = false
        reason = 'Closed'
      } else if (date.getTime() === today.getTime()) {
        available = false
        reason = 'Same day not available'
      } else {
        // Generate time slots for available days (9:00-21:00, 30min intervals)
        timeSlots = generateTimeSlots()
      }
      
      days.push({
        date: date.getTime(),
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        month: monthNames[date.getMonth()],
        available,
        reason,
        timeSlots
      })
    }
    
    return days
  })

  const formatDateRange = computed(() => {
    const start = new Date(currentWeekStart.value)
    const end = new Date(start)
    end.setDate(end.getDate() + 6) // 6 days for 1 week
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      })
    }
    
    return `${formatDate(start)} - ${formatDate(end)}`
  })

  const formatBookingDate = computed(() => {
    if (!selectedDate.value || !selectedTime.value) return ''
    
    const date = new Date(selectedDate.value)
    const dateStr = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    
    return `${dateStr} at ${selectedTime.value}`
  })

  // Actions
  const selectLocation = (location) => {
    selectedLocation.value = location
    currentStep.value = 2
  }

  const selectTime = (date, time) => {
    selectedDate.value = date
    selectedTime.value = time
    currentStep.value = 3
  }

  const goToPreviousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
      return false // Stay on current page
    }
    return true // Should go back to home
  }

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() - 7) // Move 1 week back
    currentWeekStart.value = newDate
  }

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() + 7) // Move 1 week forward
    currentWeekStart.value = newDate
  }

  const submitBooking = () => {
    // Here would be the actual booking submission logic
    // For now, just show success message
    const bookingData = {
      location: selectedLocation.value,
      date: selectedDate.value,
      time: selectedTime.value,
      customer: bookingForm.value
    }
    
    console.log('Booking submitted:', bookingData)
    
    // Reset form after successful submission
    resetBooking()
    
    return {
      success: true,
      message: 'Thank you! Your booking has been received. We will contact you for confirmation.'
    }
  }

  const resetBooking = () => {
    currentStep.value = 1
    selectedLocation.value = null
    selectedDate.value = null
    selectedTime.value = null
    bookingForm.value = {
      name: '',
      phone: ''
    }
  }

  const initializeCalendar = () => {
    // Initialize with current week starting from Sunday
    const today = new Date()
    
    // Find the current week's Sunday
    const dayOfWeek = today.getDay()
    const currentWeekSunday = new Date(today)
    currentWeekSunday.setDate(today.getDate() - dayOfWeek)
    
    currentWeekStart.value = currentWeekSunday
  }

  return {
    // State
    currentStep,
    selectedLocation,
    selectedDate,
    selectedTime,
    currentWeekStart,
    bookingForm,
    locations,
    
    // Getters
    weekDays,
    formatDateRange,
    formatBookingDate,
    
    // Actions
    selectLocation,
    selectTime,
    goToPreviousStep,
    previousWeek,
    nextWeek,
    submitBooking,
    resetBooking,
    initializeCalendar
  }
})