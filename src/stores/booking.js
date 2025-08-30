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

  // Загружаем занятые слоты из Google Таблицы
  const fetchBookedSlots = async (isAdmin = false, retryCount = 0) => {
    const MAX_RETRIES = 3
    
    try {
      isLoadingBookedSlots.value = true
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
      
      if (!GOOGLE_SCRIPT_URL) {
        console.warn('GOOGLE_SCRIPT_URL not configured')
        isLoadingBookedSlots.value = false
        return
      }
      
      // Используем JSONP для обхода CORS
      const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.random().toString(36).substring(7)
      
      return new Promise((resolve, reject) => {
        // Очищаем возможные старые callback функции только если это первая попытка
        if (retryCount === 0) {
          Object.keys(window).forEach(key => {
            if (key.startsWith('jsonp_callback_') && typeof window[key] === 'function') {
              delete window[key]
            }
          })
        }
        
        // Создаем глобальную callback функцию
        window[callbackName] = function(data) {
          if (data.success) {
            bookedSlots.value = data.bookings
            console.log(`Successfully loaded ${data.bookings.length} bookings`)
          } else {
            console.error('Error fetching booked slots:', data.message)
          }
          
          // Очищаем
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          isLoadingBookedSlots.value = false
          resolve(data)
        }
        
        // Создаем script элемент
        const script = document.createElement('script')
        // Добавляем параметр admin для получения полных данных
        const adminParam = isAdmin ? '&admin=true' : ''
        const requestUrl = `${GOOGLE_SCRIPT_URL}?callback=${callbackName}${adminParam}`
        script.src = requestUrl
        
        script.onerror = async () => {
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          
          // Повторная попытка при ошибке
          if (retryCount < MAX_RETRIES) {
            console.log(`JSONP request failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
            setTimeout(async () => {
              try {
                const result = await fetchBookedSlots(isAdmin, retryCount + 1)
                resolve(result)
              } catch (error) {
                reject(error)
              }
            }, 1000 * (retryCount + 1)) // Увеличиваем задержку с каждой попыткой
          } else {
            isLoadingBookedSlots.value = false
            console.error('Error loading booked slots via JSONP after all retries')
            reject(new Error('JSONP request failed after retries'))
          }
        }
        
        // Добавляем timeout для очистки
        setTimeout(() => {
          if (window[callbackName]) {
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            
            // Повторная попытка при timeout
            if (retryCount < MAX_RETRIES) {
              console.log(`Request timeout, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
              setTimeout(async () => {
                try {
                  const result = await fetchBookedSlots(isAdmin, retryCount + 1)
                  resolve(result)
                } catch (error) {
                  reject(error)
                }
              }, 1000 * (retryCount + 1))
            } else {
              isLoadingBookedSlots.value = false
              reject(new Error('Request timeout after retries'))
            }
          }
        }, 8000) // Сократили timeout до 8 секунд
        
        document.head.appendChild(script)
      })
    } catch (error) {
      console.error('Error fetching booked slots:', error)
      isLoadingBookedSlots.value = false
      throw error
    }
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