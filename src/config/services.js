// Services configuration file - now dynamically loaded from Google Sheets
import { useServicesStore } from '@/stores/services'

// Helper function to get service by ID
export const getServiceById = (id) => {
  const servicesStore = useServicesStore()
  return servicesStore.activeServices.find(service => service.id === id)
}

// Helper function to get all services
export const getAllServices = () => {
  const servicesStore = useServicesStore()
  // Преобразуем данные из store в формат, ожидаемый BookingPage
  return servicesStore.activeServices.map(service => ({
    id: service.id,
    name: service.name, // Используем name напрямую вместо nameKey
    description: service.description, // Используем description напрямую вместо descriptionKey  
    duration: service.duration,
    price: service.price
  }))
}

// Helper function to format duration
export const formatDuration = (minutes) => {
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
