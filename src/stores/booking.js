import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  // State
  const currentStep = ref(1)
  const selectedLocation = ref(null)
  const selectedService = ref(null)
  const selectedDate = ref(null)
  const selectedTime = ref(null)
  const selectedStatus = ref('Pending')
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
      phoneKey: 'locations.downtown.phone',
      hoursKey: 'locations.downtown.hours',
      name: 'Barber Kings Martinkovac',
      address: 'Martinkovac ul. 127, 51000, Rijeka',
      description: 'Located in Marti Retail Park',
      phone: '091 985 2998',
      url: '/booking?location=1&step=2',
      hours: {
        monday: '9 AM - 9 PM',
        tuesday: '9 AM - 9 PM',
        wednesday: '9 AM - 9 PM',
        thursday: '9 AM - 9 PM',
        friday: '9 AM - 9 PM',
        saturday: '9 AM - 9 PM',
        sunday: 'Closed'
      }
    },
    {
      id: 2,  
      nameKey: 'locations.podil.name',
      addressKey: 'locations.podil.address',
      descriptionKey: 'locations.podil.description',
      phoneKey: 'locations.podil.phone',
      hoursKey: 'locations.podil.hours',
      name: 'Barber Kings Adamiceva',
      address: 'Adamiceva ul. 34A, 51000, Rijeka',
      description: 'Professional barber services in the heart of Rijeka',
      phone: '091 948 1514',
      url: '/booking?location=2&step=2',
      hours: {
        monday: '8 AM - 5 PM',
        tuesday: '8 AM - 5 PM',
        wednesday: '8 AM - 5 PM',
        thursday: '8 AM - 5 PM',
        friday: '8 AM - 5 PM',
        saturday: '8 AM - 1 PM',
        sunday: 'Closed'
      }
    }
  ])

  // Helper function to generate time slots
  const generateTimeSlots = () => {
    const slots = []
    // From 9:00 to 20:30 with 30-minute intervals
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  // Getters
  const weekDays = computed(() => {
    // Add dependency on selectedService to make it reactive
    const currentService = selectedService.value
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
        // Generate time slots for available days (9:00-20:30, 30min intervals)
        const allSlots = generateTimeSlots()
        
        // Фильтруем занятые слоты для текущей даты и локации
        const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        // Преобразуем название локации для сопоставления с API
        let currentLocation = selectedLocation.value?.name
        if (currentLocation) {
          if (currentLocation.includes('Martinkovac')) {
            currentLocation = 'Martinkovac'
          } else if (currentLocation.includes('Adami')) {
            currentLocation = 'Adamiceva'
          }
        }
        
        // Не фильтруем слоты, а просто используем все слоты
        // Логика отображения (занят/свободен) будет обрабатываться в компоненте
        timeSlots = allSlots
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

  const selectService = (service) => {
    selectedService.value = service
    currentStep.value = 3
  }

  const selectTime = (date, time) => {
    selectedDate.value = date
    selectedTime.value = time
    currentStep.value = 4
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

  const validateBookingForm = () => {
    const errors = []
    
    // Validate name
    if (!bookingForm.value.name?.trim()) {
      errors.push('Name is required')
    } else if (bookingForm.value.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    }
    
    // Validate phone
    if (!bookingForm.value.phone?.trim()) {
      errors.push('Phone number is required')
    } else {
      const phoneRegex = /^[\d\s\+\-\(\)]{8,20}$/
      if (!phoneRegex.test(bookingForm.value.phone.trim())) {
        errors.push('Please enter a valid phone number')
      }
    }
    
    // Validate required selections
    if (!selectedLocation.value) {
      errors.push('Please select a location')
    }
    
    if (!selectedService.value) {
      errors.push('Please select a service')
    }
    
    if (!selectedDate.value) {
      errors.push('Please select a date')
    }
    
    if (!selectedTime.value) {
      errors.push('Please select a time')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const submitBooking = async () => {
    // URL Google Apps Script веб-приложения из .env
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
    
    // Validate form before submission
    const validation = validateBookingForm()
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors.join(', ')
      }
    }
    
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
      
      // Calculate end time based on service duration
      const serviceDuration = selectedService.value.duration
      const allSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
      const startIndex = allSlots.indexOf(formattedTime)
      const endIndex = startIndex + (serviceDuration / 30) - 1
      const endTime = endIndex < allSlots.length ? allSlots[endIndex] : formattedTime
      
      // Преобразуем location в короткое название для отправки
      let locationKey = selectedLocation.value.name
      if (locationKey.includes('Martinkovac')) {
        locationKey = 'Martinkovac'
      } else if (locationKey.includes('Adami')) {
        locationKey = 'Adamiceva'
      }

      // Подготавливаем данные для отправки
      const bookingData = {
        name: bookingForm.value.name,
        phone: bookingForm.value.phone, // Апостроф добавляется на стороне Google Apps Script
        location: locationKey,
        service: selectedService.value.name,
        date: formattedDate,
        time: formattedTime,
        endTime: endTime,
        duration: serviceDuration
      }
      
      
      // Отправляем данные в Google Таблицу через JSONP (как GET с параметрами)
      const params = new URLSearchParams({
        action: 'add',
        name: bookingData.name,
        phone: bookingData.phone,
        location: bookingData.location,
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
        endTime: bookingData.endTime,
        duration: bookingData.duration,
        status: selectedStatus.value
      })
      
      // Используем JSONP для обхода CORS
      const callbackName = `jsonp_callback_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      return new Promise((resolve, reject) => {
        // Создаем глобальную callback функцию
        window[callbackName] = function(data) {
          // Очищаем script элемент
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          
          // Останавливаем лоадер
          isSubmittingBooking.value = false
          
          if (data.success) {
            console.log('Booking submitted successfully, ID:', data.id)
            
            // Сбрасываем форму после успешной отправки
            resetBooking()
            
            // Обновляем данные с сервера для синхронизации со всеми клиентами
            fetchBookedSlots(true, true) // isAdmin=true, forceRefresh=true
            
            resolve({
              success: true,
              message: 'Thank you! Your booking has been received. We will contact you for confirmation.',
              id: data.id
            })
          } else {
            reject(new Error(data.message || 'Unknown error occurred'))
          }
        }
        
        // Создаем script элемент
        const script = document.createElement('script')
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}&callback=${callbackName}`
        
        script.onerror = () => {
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          // Останавливаем лоадер при ошибке
          isSubmittingBooking.value = false
          reject(new Error('Network error'))
        }
        
        // Timeout для запроса
        setTimeout(() => {
          if (window[callbackName]) {
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            // Останавливаем лоадер при таймауте
            isSubmittingBooking.value = false
            reject(new Error('Request timeout'))
          }
        }, 10000)
        
        document.head.appendChild(script)
      })
      
    } catch (error) {
      console.error('Error submitting booking:', error)
      
      // Останавливаем лоадер при ошибке
      isSubmittingBooking.value = false
      
      return {
        success: false,
        message: 'Sorry, there was an error submitting your booking. Please try again.'
      }
    }
  }

  const resetBooking = (resetValidation = null) => {
    currentStep.value = 1
    selectedLocation.value = null
    selectedDate.value = null
    selectedTime.value = null
    selectedStatus.value = 'Pending'
    bookingForm.value = {
      name: '',
      phone: ''
    }
    
    // Reset validation if callback provided
    if (resetValidation && typeof resetValidation === 'function') {
      resetValidation()
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
    
    // Проверяем полные записи с именем, телефоном и ID (только для админки)
    const fullValidBookings = bookings.filter(booking => 
      booking && 
      booking.id &&
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
    
    console.log('Google Script URL:', GOOGLE_SCRIPT_URL)
    
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('GOOGLE_SCRIPT_URL not configured, using mock data')
      // Use mock data for testing
      const mockBookings = [
        {
          id: 1,
          name: 'John Doe',
          phone: '123456789',
          location: 'Martinkovac',
          date: '02/09/2025',
          time: '14:00',
          status: 'Confirmed'
        },
        {
          id: 2,
          name: 'Jane Smith',
          phone: '987654321',
          location: 'Adamiceva',
          date: '03/09/2025',
          time: '15:30',
          status: 'Pending'
        }
      ]
      bookedSlots.value = mockBookings
      console.log('Using mock bookings data:', mockBookings)
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
            
            console.log('Received data from Google Apps Script:', data)
            
            if (data.success && data.bookings) {
              // Валидируем полноту данных
              const isDataComplete = validateBookingsData(data.bookings)
              
              if (isDataComplete || attempt >= MAX_ATTEMPTS) {
                bookedSlots.value = data.bookings
                console.log(`Successfully loaded ${data.bookings.length} bookings`)
                console.log('Bookings data:', data.bookings)
                resolveRequest(data)
              } else {
                console.log('Incomplete data received, retrying...')
                setTimeout(() => {
                  tryFetch().then(resolveRequest).catch(rejectRequest)
                }, 1000 * attempt)
              }
            } else {
              console.error('Error fetching booked slots:', data.message || 'Unknown error')
              console.error('Full response:', data)
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
    selectedService,
    selectedDate,
    selectedTime,
    selectedStatus,
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
    selectService,
    selectTime,
    goToPreviousStep,
    previousWeek,
    nextWeek,
    submitBooking,
    resetBooking,
    initializeCalendar,
    fetchBookedSlots,
    validateBookingForm
  }
})