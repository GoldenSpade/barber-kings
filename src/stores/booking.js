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
  
  // Занятые слоты из Google Таблицы
  const bookedSlots = ref([])
  
  // Состояние загрузки данных
  const isLoadingBookedSlots = ref(false)
  
  // Состояние отправки бронирования
  const isSubmittingBooking = ref(false)
  
  // Переменные для предотвращения множественных запросов
  let currentFetchPromise = null
  let currentCallback = null

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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Use currentWeekStart instead of today for navigation
    const startDate = new Date(currentWeekStart.value)
    startDate.setHours(0, 0, 0, 0)
    
    // Show 7 days starting from currentWeekStart
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      let available = true
      let reason = ''
      let timeSlots = []
      
      // Check if date is within our allowed range
      if (date.getTime() === today.getTime()) {
        // Today - not available for booking
        available = false
        reason = 'Not available today'
      } else if (date > maxDate.value) {
        available = false
        reason = 'Too far ahead'
      } else if (date.getDay() === 0) { // Sunday
        available = false
        reason = 'Closed'
      } else {
        // Generate time slots for available days (9:00-21:00, 30min intervals)
        const allSlots = generateTimeSlots()
        
        // Фильтруем занятые слоты для текущей даты и локации
        const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        const currentLocation = selectedLocation.value?.nameKey ? 
          selectedLocation.value.nameKey.replace('locations.', '').replace('.name', '') : 
          selectedLocation.value?.name
        
        timeSlots = allSlots.filter(slot => {
          const isBooked = bookedSlots.value.some(booking => 
            booking.date === dateString && 
            booking.time === slot && 
            booking.location === currentLocation
          )
          return !isBooked
        })
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
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6) // 6 days from currentWeekStart
    
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
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return prevWeekStart >= today
  })

  const canGoToNextWeek = computed(() => {
    const nextWeekStart = new Date(currentWeekStart.value)
    nextWeekStart.setDate(nextWeekStart.getDate() + 7)
    
    return nextWeekStart <= maxDate.value
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
    
    // Don't go before today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (newDate >= today) {
      currentWeekStart.value = newDate
    }
  }

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() + 7) // Move 1 week forward
    
    // Don't go too far ahead (check if the first day of the new week is within maxDate)
    if (newDate <= maxDate.value) {
      currentWeekStart.value = newDate
    }
  }

  const submitBooking = async () => {
    // URL Google Apps Script веб-приложения из .env
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    
    isSubmittingBooking.value = true
    
    try {
      // Форматируем дату в стандартном формате DD/MM/YYYY
      const dateObj = new Date(selectedDate.value)
      const day = dateObj.getDate().toString().padStart(2, '0')
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const year = dateObj.getFullYear()
      const formattedDate = `${day}/${month}/${year}`
      
      // Время остается в стандартном формате HH:MM
      const formattedTime = selectedTime.value
      
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
    } finally {
      isSubmittingBooking.value = false
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

  // Функция для валидации полноты загруженных данных
  const validateBookingsData = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) return false
    
    console.log('Validating bookings data:', bookings.length, 'records')
    
    // Проверяем базовые требования - должны быть хотя бы location, date, time
    const basicValidBookings = bookings.filter(booking => 
      booking && 
      booking.location && 
      booking.date && 
      booking.time
    )
    
    // Проверяем полные записи с именем и телефоном (только для админки)
    const fullValidBookings = bookings.filter(booking => 
      booking && 
      booking.name && 
      booking.phone && 
      booking.location && 
      booking.date && 
      booking.time
    )
    
    const basicRatio = basicValidBookings.length / bookings.length
    const fullRatio = fullValidBookings.length / bookings.length
    
    console.log(`Data validation: ${basicValidBookings.length}/${bookings.length} basic valid (${Math.round(basicRatio * 100)}%), ${fullValidBookings.length}/${bookings.length} full valid (${Math.round(fullRatio * 100)}%)`)
    
    // Принимаем данные если есть хотя бы базовая информация у 70%+ записей
    // или полная информация у 50%+ записей
    return basicRatio >= 0.7 || fullRatio >= 0.5
  }

  // Загружаем занятые слоты из Google Таблицы
  const fetchBookedSlots = async (isAdmin = false, forceRefresh = false) => {
    // Если уже есть активный запрос и это не принудительное обновление, возвращаем существующий Promise
    if (currentFetchPromise && !forceRefresh) {
      console.log('Using existing fetch promise')
      return currentFetchPromise
    }
    
    // Отменяем предыдущий запрос если он есть
    if (currentCallback) {
      console.log('Cancelling previous request')
      if (window[currentCallback]) {
        delete window[currentCallback]
      }
      currentCallback = null
    }
    
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('GOOGLE_SCRIPT_URL not configured')
      return Promise.resolve()
    }
    
    isLoadingBookedSlots.value = true
    
    currentFetchPromise = new Promise(async (resolve, reject) => {
      let attempt = 0
      const MAX_ATTEMPTS = 3
      
      const tryFetch = async () => {
        attempt++
        console.log(`Fetching bookings (attempt ${attempt}/${MAX_ATTEMPTS})`)
        
        // Очищаем старые callback функции
        Object.keys(window).forEach(key => {
          if (key.startsWith('jsonp_callback_') && typeof window[key] === 'function') {
            delete window[key]
          }
        })
        
        const callbackName = `jsonp_callback_${Date.now()}_${Math.random().toString(36).substring(7)}`
        currentCallback = callbackName
        
        return new Promise((resolveRequest, rejectRequest) => {
          // Создаем глобальную callback функцию
          window[callbackName] = function(data) {
            // Очищаем script элемент
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            currentCallback = null
            
            if (data.success && data.bookings) {
              // Валидируем полноту данных
              const isDataComplete = validateBookingsData(data.bookings)
              
              if (isDataComplete || attempt >= MAX_ATTEMPTS) {
                bookedSlots.value = data.bookings
                console.log(`Successfully loaded ${data.bookings.length} bookings`)
                resolveRequest(data)
              } else {
                console.log('Incomplete data received, retrying...')
                setTimeout(() => {
                  tryFetch().then(resolveRequest).catch(rejectRequest)
                }, 1000 * attempt)
              }
            } else {
              console.error('Error fetching booked slots:', data.message || 'Unknown error')
              if (attempt < MAX_ATTEMPTS) {
                setTimeout(() => {
                  tryFetch().then(resolveRequest).catch(rejectRequest)
                }, 1000 * attempt)
              } else {
                rejectRequest(new Error(data.message || 'Failed to fetch bookings'))
              }
            }
          }
          
          // Создаем script элемент
          const script = document.createElement('script')
          const adminParam = isAdmin ? '&admin=true' : ''
          const requestUrl = `${GOOGLE_SCRIPT_URL}?callback=${callbackName}${adminParam}`
          script.src = requestUrl
          
          script.onerror = () => {
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            currentCallback = null
            
            if (attempt < MAX_ATTEMPTS) {
              console.log(`Request failed, retrying... (${attempt}/${MAX_ATTEMPTS})`)
              setTimeout(() => {
                tryFetch().then(resolveRequest).catch(rejectRequest)
              }, 1000 * attempt)
            } else {
              rejectRequest(new Error('JSONP request failed after all attempts'))
            }
          }
          
          // Timeout для запроса
          setTimeout(() => {
            if (window[callbackName]) {
              if (script && script.parentNode) {
                document.head.removeChild(script)
              }
              delete window[callbackName]
              currentCallback = null
              
              if (attempt < MAX_ATTEMPTS) {
                console.log(`Request timeout, retrying... (${attempt}/${MAX_ATTEMPTS})`)
                setTimeout(() => {
                  tryFetch().then(resolveRequest).catch(rejectRequest)
                }, 1000 * attempt)
              } else {
                rejectRequest(new Error('Request timeout after all attempts'))
              }
            }
          }, 10000) // 10 секунд timeout
          
          document.head.appendChild(script)
        })
      }
      
      try {
        await tryFetch()
        resolve()
      } catch (error) {
        console.error('Final error fetching booked slots:', error)
        reject(error)
      } finally {
        isLoadingBookedSlots.value = false
        currentFetchPromise = null
        currentCallback = null
      }
    })
    
    return currentFetchPromise
  }

  const initializeCalendar = () => {
    // Initialize calendar starting from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Since we now show 7 days starting from today, we can just set currentWeekStart to today
    currentWeekStart.value = today
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
    bookedSlots,
    isLoadingBookedSlots,
    isSubmittingBooking,
    
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
    initializeCalendar,
    fetchBookedSlots
  }
})