import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useServicesStore = defineStore('services', () => {
  // State
  const services = ref([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)
  
  // Current fetch promise to prevent multiple requests
  let currentFetchPromise = null
  let currentCallback = null

  // Getters
  const activeServices = computed(() => {
    const filtered = services.value.filter(service => service.status === 'active')
    console.log('Active services computed:', filtered)
    console.log('All services:', services.value)
    return filtered
  })
  
  const serviceById = computed(() => (id) => 
    services.value.find(service => service.id === id)
  )

  // Actions
  const fetchServices = async (forceRefresh = false) => {
    // If already fetching and not forcing refresh, return existing promise
    if (currentFetchPromise && !forceRefresh) {
      return currentFetchPromise
    }

    // Cancel previous request if exists
    if (currentCallback) {
      if (window[currentCallback]) {
        delete window[currentCallback]
      }
      currentCallback = null
    }

    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('GOOGLE_SCRIPT_URL not configured, using mock data')
      // Use mock data for development
      const mockServices = [
        {
          id: 1,
          name: "Men's Haircut",
          description: 'Classic and modern haircuts for men',
          duration: 30,
          price: 25,
          category: 'haircut',
          status: 'active',
          order: 1
        },
        {
          id: 2,
          name: "Men's Haircut + Beard Trim",
          description: 'Haircut with professional beard trimming and shaping',
          duration: 60,
          price: 35,
          category: 'haircut',
          status: 'active',
          order: 2
        },
        {
          id: 3,
          name: "Women's Haircut",
          description: 'Professional haircuts for women',
          duration: 60,
          price: 40,
          category: 'haircut',
          status: 'active',
          order: 3
        }
      ]
      services.value = mockServices
      console.log('Loaded mock services:', mockServices)
      return Promise.resolve()
    }

    isLoading.value = true
    error.value = null

    currentFetchPromise = new Promise((resolve, reject) => {
      const callbackName = `jsonp_services_${Date.now()}_${Math.random().toString(36).substring(7)}`
      currentCallback = callbackName

      // Create global callback function
      window[callbackName] = function(data) {
        // Clean up script element
        if (script && script.parentNode) {
          document.head.removeChild(script)
        }
        delete window[callbackName]
        currentCallback = null

        console.log('Received services data:', data)
        console.log('Services array:', data.services)
        console.log('Services count:', data.services ? data.services.length : 0)

        if (data.success && data.services) {
          services.value = data.services
          console.log(`Successfully loaded ${data.services.length} services`)
          console.log('Services data:', data.services)
          resolve(data)
        } else {
          const errorMsg = data.message || 'Failed to fetch services'
          error.value = errorMsg
          console.error('Error fetching services:', errorMsg)
          console.error('Full response:', data)
          reject(new Error(errorMsg))
        }
      }

      // Create script element for JSONP
      const script = document.createElement('script')
      const requestUrl = `${GOOGLE_SCRIPT_URL}?action=getServices&callback=${callbackName}`
      script.src = requestUrl

      script.onerror = () => {
        if (script && script.parentNode) {
          document.head.removeChild(script)
        }
        delete window[callbackName]
        currentCallback = null
        
        const errorMsg = 'Network error while fetching services'
        error.value = errorMsg
        console.error(errorMsg)
        reject(new Error(errorMsg))
      }

      // Timeout for request
      setTimeout(() => {
        if (window[callbackName]) {
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          currentCallback = null
          
          const errorMsg = 'Request timeout while fetching services'
          error.value = errorMsg
          console.error(errorMsg)
          reject(new Error(errorMsg))
        }
      }, 10000) // 10 seconds timeout

      document.head.appendChild(script)
    })

    try {
      await currentFetchPromise
    } finally {
      isLoading.value = false
      currentFetchPromise = null
    }

    return currentFetchPromise
  }

  const addService = async (serviceData) => {
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('GOOGLE_SCRIPT_URL not configured, service not added')
      return { success: false, message: 'API not configured' }
    }

    isSubmitting.value = true
    error.value = null

    try {
      return new Promise((resolve, reject) => {
        const callbackName = `jsonp_add_service_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // Create global callback function
        window[callbackName] = function(data) {
          // Clean up script element
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          
          // Reset loading state
          isSubmitting.value = false

          if (data.success) {
            console.log('Service added successfully:', data.service)
            // Add the new service to local state
            if (data.service) {
              services.value.push(data.service)
            }
            resolve(data)
          } else {
            const errorMsg = data.message || 'Failed to add service'
            error.value = errorMsg
            reject(new Error(errorMsg))
          }
        }

        // Create script element for JSONP
        const script = document.createElement('script')
        const params = new URLSearchParams({
          action: 'addService',
          name: serviceData.name,
          description: serviceData.description || '',
          duration: serviceData.duration,
          price: serviceData.price || 0,
          category: serviceData.category || 'haircut',
          callback: callbackName
        })
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`

        script.onerror = () => {
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          isSubmitting.value = false
          const errorMsg = 'Network error while adding service'
          error.value = errorMsg
          reject(new Error(errorMsg))
        }

        // Timeout for request
        setTimeout(() => {
          if (window[callbackName]) {
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            isSubmitting.value = false
            const errorMsg = 'Request timeout while adding service'
            error.value = errorMsg
            reject(new Error(errorMsg))
          }
        }, 10000)

        document.head.appendChild(script)
      })
    } catch (error) {
      isSubmitting.value = false
      throw error
    }
  }

  const updateService = async (serviceId, serviceData) => {
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('GOOGLE_SCRIPT_URL not configured, service not updated')
      return { success: false, message: 'API not configured' }
    }

    isSubmitting.value = true
    error.value = null

    try {
      return new Promise((resolve, reject) => {
        const callbackName = `jsonp_update_service_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // Create global callback function
        window[callbackName] = function(data) {
          // Clean up script element
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]

          if (data.success) {
            console.log('Service updated successfully:', data.service)
            // Update the service in local state
            const index = services.value.findIndex(s => s.id === serviceId)
            if (index !== -1 && data.service) {
              services.value[index] = { ...services.value[index], ...data.service }
            }
            resolve(data)
          } else {
            const errorMsg = data.message || 'Failed to update service'
            error.value = errorMsg
            reject(new Error(errorMsg))
          }
        }

        // Create script element for JSONP
        const script = document.createElement('script')
        const params = new URLSearchParams({
          action: 'updateService',
          id: serviceId,
          name: serviceData.name,
          description: serviceData.description || '',
          duration: serviceData.duration,
          price: serviceData.price || 0,
          category: serviceData.category || 'haircut',
          callback: callbackName
        })
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`

        script.onerror = () => {
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          const errorMsg = 'Network error while updating service'
          error.value = errorMsg
          reject(new Error(errorMsg))
        }

        // Timeout for request
        setTimeout(() => {
          if (window[callbackName]) {
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            const errorMsg = 'Request timeout while updating service'
            error.value = errorMsg
            reject(new Error(errorMsg))
          }
        }, 10000)

        document.head.appendChild(script)
      })
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteService = async (serviceId) => {
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

    if (!GOOGLE_SCRIPT_URL) {
      console.warn('GOOGLE_SCRIPT_URL not configured, service not deleted')
      return { success: false, message: 'API not configured' }
    }

    isSubmitting.value = true
    error.value = null

    try {
      return new Promise((resolve, reject) => {
        const callbackName = `jsonp_delete_service_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // Create global callback function
        window[callbackName] = function(data) {
          // Clean up script element
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]

          if (data.success) {
            console.log('Service deleted successfully')
            // Remove the service from local state
            services.value = services.value.filter(s => s.id !== serviceId)
            resolve(data)
          } else {
            const errorMsg = data.message || 'Failed to delete service'
            error.value = errorMsg
            reject(new Error(errorMsg))
          }
        }

        // Create script element for JSONP
        const script = document.createElement('script')
        const params = new URLSearchParams({
          action: 'deleteService',
          id: serviceId,
          callback: callbackName
        })
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`

        script.onerror = () => {
          if (script && script.parentNode) {
            document.head.removeChild(script)
          }
          delete window[callbackName]
          const errorMsg = 'Network error while deleting service'
          error.value = errorMsg
          reject(new Error(errorMsg))
        }

        // Timeout for request
        setTimeout(() => {
          if (window[callbackName]) {
            if (script && script.parentNode) {
              document.head.removeChild(script)
            }
            delete window[callbackName]
            const errorMsg = 'Request timeout while deleting service'
            error.value = errorMsg
            reject(new Error(errorMsg))
          }
        }, 10000)

        document.head.appendChild(script)
      })
    } finally {
      isSubmitting.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) {
        return `${hours}h`
      } else {
        return `${hours}h ${remainingMinutes}min`
      }
    }
  }

  // Helper function to format price
  const formatPrice = (price) => {
    return `€${price},-`
  }

  return {
    // State
    services,
    isLoading,
    isSubmitting,
    error,

    // Getters
    activeServices,
    serviceById,

    // Actions
    fetchServices,
    addService,
    updateService,
    deleteService,
    clearError,

    // Helpers
    formatDuration,
    formatPrice
  }
})