import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  // State
  const currentStep = ref(1)
  const selectedLocation = ref(null)
  const selectedDate = ref(null)
  const selectedTime = ref(null)
  const currentWeekStart = ref(new Date())
  
  // Get user's timezone dynamically
  const userTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
  
  const bookingForm = ref({
    name: '',
    phone: ''
  })

  // Locations data
  const locations = ref([
    {
      id: 1,
      nameKey: 'locations.downtown.name',
      addressKey: 'locations.downtown.address',
      descriptionKey: 'locations.downtown.description',
      // Keep original properties for backward compatibility
      name: 'Downtown Barber Kings',
      address: '25 Khreshchatyk Street',
      description: 'Central location with full range of services'
    },
    {
      id: 2,  
      nameKey: 'locations.podil.name',
      addressKey: 'locations.podil.address',
      descriptionKey: 'locations.podil.description',
      // Keep original properties for backward compatibility
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
    
    // Show 1 week (7 days) - slider approach for extended calendar
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
      
      // Check if date is within our allowed range (tomorrow to +3 months)
      if (date < minDate.value) {
        available = false
        reason = 'Past day'
      } else if (date > maxDate.value) {
        available = false
        reason = 'Too far ahead'
      } else if (date.getDay() === 0) { // Sunday
        available = false
        reason = 'Closed'
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

  // Calendar limits: from tomorrow to current month + 2 months
  const minDate = computed(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  })

  const maxDate = computed(() => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0) // Last day of current month + 2 months
    maxDate.setHours(23, 59, 59, 999)
    return maxDate
  })

  // Navigation controls
  const canGoToPreviousWeek = computed(() => {
    const prevWeekStart = new Date(currentWeekStart.value)
    prevWeekStart.setDate(prevWeekStart.getDate() - 7)
    
    const minWeekStart = new Date(minDate.value)
    minWeekStart.setDate(minWeekStart.getDate() - minWeekStart.getDay())
    
    return prevWeekStart >= minWeekStart
  })

  const canGoToNextWeek = computed(() => {
    const nextWeekStart = new Date(currentWeekStart.value)
    nextWeekStart.setDate(nextWeekStart.getDate() + 7)
    
    const maxWeekStart = new Date(maxDate.value)
    maxWeekStart.setDate(maxWeekStart.getDate() - maxWeekStart.getDay())
    
    return nextWeekStart <= maxWeekStart
  })

  // Formatted timezone display
  const formattedTimezone = computed(() => {
    return userTimezone.value || 'UTC'
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
    
    // Don't go before the minimum date
    const minWeekStart = new Date(minDate.value)
    minWeekStart.setDate(minWeekStart.getDate() - minWeekStart.getDay()) // Find Sunday of min date week
    
    if (newDate >= minWeekStart) {
      currentWeekStart.value = newDate
    }
  }

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() + 7) // Move 1 week forward
    
    // Don't go past the maximum date
    const maxWeekStart = new Date(maxDate.value)
    maxWeekStart.setDate(maxWeekStart.getDate() - maxWeekStart.getDay()) // Find Sunday of max date week
    
    if (newDate <= maxWeekStart) {
      currentWeekStart.value = newDate
    }
  }

  const submitBooking = async () => {
    // URL Google Apps Script веб-приложения из .env
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    
    try {
      // Форматируем дату с -- разделителями для Google Sheets
      const dateObj = new Date(selectedDate.value)
      const day = dateObj.getDate().toString().padStart(2, '0')
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const year = dateObj.getFullYear()
      const formattedDate = `${day}--${month}--${year}`
      
      // Форматируем время с -- разделителями
      const formattedTime = selectedTime.value.replace(':', '--')
      
      // Подготавливаем данные для отправки
      const bookingData = {
        name: bookingForm.value.name,
        phone: bookingForm.value.phone,
        location: selectedLocation.value.nameKey ? 
          selectedLocation.value.nameKey.replace('locations.', '').replace('.name', '') : 
          selectedLocation.value.name,
        date: formattedDate,
        time: formattedTime
      }
      
      
      // Отправляем данные в Google Таблицу
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
        mode: 'no-cors' // Необходимо для Google Apps Script
      })
      
      // При mode: 'no-cors' мы не можем получить response, 
      // поэтому считаем отправку успешной
      console.log('Booking submitted successfully')
      
      // Сбрасываем форму после успешной отправки
      resetBooking()
      
      return {
        success: true,
        message: 'Thank you! Your booking has been received. We will contact you for confirmation.'
      }
      
    } catch (error) {
      console.error('Error submitting booking:', error)
      
      return {
        success: false,
        message: 'Sorry, there was an error submitting your booking. Please try again.'
      }
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
    // Initialize calendar starting from tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Find the week that contains tomorrow
    const dayOfWeek = tomorrow.getDay()
    const weekSunday = new Date(tomorrow)
    weekSunday.setDate(tomorrow.getDate() - dayOfWeek)
    
    currentWeekStart.value = weekSunday
  }

  return {
    // State
    currentStep,
    selectedLocation,
    selectedDate,
    selectedTime,
    currentWeekStart,
    userTimezone,
    bookingForm,
    locations,
    
    // Getters
    weekDays,
    formatDateRange,
    formatBookingDate,
    formattedTimezone,
    minDate,
    maxDate,
    canGoToPreviousWeek,
    canGoToNextWeek,
    
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