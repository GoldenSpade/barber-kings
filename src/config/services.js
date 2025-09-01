// Services configuration file
// You can add new services or modify existing ones
// Duration must be in 30-minute increments (30, 60, 90, 120, etc.)

export const services = [
  {
    id: 1,
    nameKey: 'services.mensHaircut.name',
    descriptionKey: 'services.mensHaircut.description',
    duration: 30, // minutes
    price: 25, // optional - for future use
    category: 'haircut'
  },
  {
    id: 2,
    nameKey: 'services.mensHaircutBeard.name',
    descriptionKey: 'services.mensHaircutBeard.description',
    duration: 60, // minutes (30 min haircut + 30 min beard)
    price: 35, // optional - for future use
    category: 'haircut'
  },
  {
    id: 3,
    nameKey: 'services.womensHaircut.name',
    descriptionKey: 'services.womensHaircut.description',
    duration: 60, // minutes
    price: 40, // optional - for future use
    category: 'haircut'
  }
]

// Helper function to get service by ID
export const getServiceById = (id) => {
  return services.find(service => service.id === id)
}

// Helper function to get all services
export const getAllServices = () => {
  return services
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
