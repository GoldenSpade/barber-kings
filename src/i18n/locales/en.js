export default {
  // Navigation
  nav: {
    home: 'Home',
    booking: 'Booking'
  },
  
  // Common
  common: {
    loading: 'Loading...',
    loadingSlots: 'Loading available slots...',
    submittingBooking: 'Submitting your booking...'
  },

  // Slot availability messages
  slots: {
    available: 'Available: {duration} min ({start} - {end})',
    occupied: 'Occupied',
    notEnoughTime: 'Not enough time until end of day (need {duration} min)',
    conflictWith: 'Conflict with booking at {time}',
    needConsecutive: 'Need {slots} consecutive free slots for this service'
  },
  
  // Home page
  home: {
    welcome: 'WELCOME',
    description: 'Where tradition meets precision. Expert cuts, classic shaves, and modern style crafted by masters of the trade.',
    bookNow: 'BOOK NOW',
    ourLocations: 'Our Locations'
  },
  
  // Booking page
  booking: {
    back: 'Back',
    steps: {
      locations: 'Locations',
      service: 'Service',
      time: 'Time', 
      details: 'Details'
    },
    chooseService: 'Choose Your Service',
    chooseLocation: 'Choose Location',
    service: 'Service',
    location: 'Location',
    dateTime: 'Date & Time',
    chooseTime: 'Choose Your Time',
    contactDetails: 'Contact Details',
    timeConfirmation: 'Time Confirmation',
    choose: 'Choose',
    bookNow: 'Book Now',
    submitting: 'Submitting',
    closed: 'Closed',
    pastday: 'Past day',
    notavailabletoday: 'Not available today',
    haircut: 'Haircut',
    duration: '30 min',
    timezone: 'Timezone: {timezone}',
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    fullName: 'Full Name',
    phone: 'Phone',
    enterName: 'Enter your name',
    enterPhone: 'Enter phone number',
    successMessage: 'Thank you! Your booking has been received. We will contact you for confirmation.',
    previousWeek: 'Previous Week',
    nextWeek: 'Next Week',
    occupied: 'Occupied',
    refresh: 'Refresh',
    loadingCalendar: 'Loading available times...',
    workingHours: 'Working Hours',
    address: 'Address',
    days: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    }
  },
  
  // Services
  services: {
    mensHaircut: {
      name: "Men's Haircut",
      description: 'Classic and modern haircuts for men'
    },
    mensHaircutBeard: {
      name: "Men's Haircut + Beard Trim",
      description: 'Haircut with professional beard trimming and shaping'
    },
    womensHaircut: {
      name: "Women's Haircut",
      description: 'Professional haircuts for women'
    }
  },
  
  // Locations
  locations: {
    downtown: {
      name: 'Barber Kings Martinkovac',
      address: 'Martinkovac ul. 127, 51000, Rijeka',
      description: 'Located in Marti Retail Park',
      phone: '091 985 2998',
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
    podil: {
      name: 'Barber Kings Adamićeva',
      address: 'Adamićeva ul. 34A, 51000, Rijeka',
      description: 'Professional barber services in the heart of Rijeka',
      phone: '091 948 1514',
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
  },

  // Authentication
  auth: {
    adminLogin: 'Admin Login',
    enterCredentials: 'Enter your credentials to access the admin panel',
    username: 'Username',
    password: 'Password',
    usernamePlaceholder: 'Enter your username',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    backToSite: 'Back to Site',
    fillAllFields: 'Please fill in all fields',
    loginFailed: 'Login failed. Please check your credentials.',
    logout: 'Logout',
    sessionExpired: 'Session expired. Please log in again.'
  },

  // Footer
  footer: {
    copyright: 'Copyright © 2025 Barber Kings. All rights reserved.'
  },

  // Admin Panel
  admin: {
    title: 'Admin Panel - Barber Kings',
    backToSite: 'Back to Site',
    tabs: {
      calendar: 'Bookings Calendar',
      addBooking: 'Add Booking', 
      manageBookings: 'Manage Bookings'
    },
    calendar: {
      title: 'Bookings Calendar',
      subtitle: 'Admin Calendar View',
      previousWeek: 'Previous Week',
      nextWeek: 'Next Week',
      filterLocation: 'Location:',
      occupied: 'Occupied',
      available: 'Available',
      closed: 'Closed',
      loading: 'Loading bookings...',
      clickToCopyPhone: 'Click to copy phone number',
      phoneCopied: 'Phone {phone} copied to clipboard!'
    },
    editBooking: {
      title: 'Edit Booking',
      customerInfo: 'Customer Information',
      bookingDetails: 'Booking Details',
      name: 'Name',
      phone: 'Phone',
      location: 'Location',
      dateTime: 'Date & Time',
      status: 'Status',
      deleteBooking: 'Delete Booking',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      deleting: 'Deleting...'
    },
    addBooking: {
      title: 'Add New Booking',
      customerInfo: 'Customer Information',
      bookingDetails: 'Booking Details', 
      bookingStatus: 'Booking Status',
      fullName: 'Full Name',
      phone: 'Phone Number',
      location: 'Location',
      service: 'Service',
      date: 'Date',
      time: 'Time',
      selectLocation: 'Select location',
      selectService: 'Select service',
      selectTime: 'Select time',
      enterName: 'Enter customer name',
      enterPhone: 'Enter phone number',
      pending: 'Pending',
      confirmed: 'Confirmed',
      pendingConfirmation: 'Pending Confirmation',
      addBooking: 'Add Booking',
      adding: 'Adding...',
      resetForm: 'Reset Form',
      successMessage: 'Booking added successfully!',
      errorMessage: 'Failed to add booking. Please try again.',
      occupied: 'Occupied'
    },
    bookings: {
      title: 'All Bookings',
      filterLocation: 'Filter by Location:',
      filterStatus: 'Filter by Status:',
      selectDate: 'Select Date:',
      search: 'Search by name or phone...',
      resetFilters: 'Reset Filters',
      refresh: 'Refresh',
      noBookings: 'No bookings found',
      noBookingsText: 'Try adjusting your filters or add some bookings.',
      loading: 'Loading bookings...',
      timestamp: 'Timestamp',
      name: 'Name',
      phone: 'Phone',
      location: 'Location',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      actions: 'Actions',
      first: 'First',
      previous: 'Previous',
      next: 'Next',
      last: 'Last',
      showing: 'Showing {start} to {end} of {total} bookings',
      statuses: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed'
      },
      locations: {
        allLocations: 'All Locations',
        downtown: 'Downtown',
        podil: 'Podil'
      },
      allStatus: 'All Status'
    }
  },

  // Validation messages
  validation: {
    nameRequired: 'Name is required',
    nameMinLength: 'Name must be at least 2 characters long',
    phoneRequired: 'Phone number is required',
    invalidPhone: 'Please enter a valid phone number (8-20 digits, spaces, +, -, ( ) allowed)',
    locationRequired: 'Location is required',
    serviceRequired: 'Service is required',
    dateRequired: 'Date is required',
    timeRequired: 'Time is required',
    statusRequired: 'Status is required'
  }
}