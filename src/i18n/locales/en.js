export default {
  // Navigation
  nav: {
    home: 'Home',
    about: 'About', 
    booking: 'Booking'
  },
  
  // Common
  common: {
    loading: 'Loading...',
    loadingSlots: 'Loading available slots...',
    submittingBooking: 'Submitting your booking...'
  },
  
  // Home page
  home: {
    welcome: 'WELCOME',
    description: 'Where tradition meets precision. Expert cuts, classic shaves, and modern style crafted by masters of the trade.',
    bookNow: 'BOOK NOW'
  },
  
  // Booking page
  booking: {
    back: 'Back',
    steps: {
      locations: 'Locations',
      time: 'Time', 
      details: 'Details'
    },
    chooseLocation: 'Choose Location',
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
    occupied: 'Occupied'
  },
  
  // Locations
  locations: {
    downtown: {
      name: 'Downtown Barber Kings',
      address: '25 Independence Square, Kyiv', 
      description: 'Central location with full range of services'
    },
    podil: {
      name: 'Barber Kings Podil',
      address: '15 Podil District, Kyiv',
      description: 'Cozy atmosphere in historic district'  
    }
  },
  
  // About page
  about: {
    title: 'About Barber Kings',
    subtitle: 'Learn more about our story, mission, and the team behind Barber Kings',
    intro: 'At Barber Kings, we keep things simple: great cuts, honest advice, and a place you\'ll actually look forward to visiting. Our barbers blend old-school craft with modern technique to deliver sharp fades, classic scissor work, precise beard sculpting, and hot-towel straight-razor shaves.',
    ourStory: 'Our Story',
    ourStoryText: 'We started this shop to bring back the feeling of a true neighborhood barbershop—somewhere you\'re greeted by name, the music\'s right, and the conversation\'s easy. From day one, our goal has been the same: consistent results, zero fuss, and service that respects your time.',
    whatWeDo: 'What We Do',
    services: {
      cuts: 'Classic & modern haircuts',
      fades: 'Skin fades, tapers, and scissor cuts',
      beards: 'Beard trims, line-ups, and reshapes',
      shaves: 'Hot-towel shaves & razor finishes',
      kids: 'Kids\' cuts (patient barbers, parent-approved)'
    },
    whatWeDoText: 'We use pro-grade tools and products we trust, and we\'ll show you how to style your cut at home so it looks good every day—not just when you leave the chair.',
    whyChooseUs: 'Why Choose Us',
    features: {
      craft: {
        title: 'Craft first',
        description: 'Detail-driven barbers who care about the final millimeter.'
      },
      clean: {
        title: 'Clean & comfortable',
        description: 'Sanitized tools, fresh capes, and a relaxed vibe.'
      },
      onTime: {
        title: 'On time',
        description: 'Easy online booking and walk-ins when chairs are open.'
      },
      straightTalk: {
        title: 'Straight talk',
        description: 'We\'ll recommend what fits your hair, face shape, and lifestyle.'
      }
    },
    ourPromise: 'Our Promise',
    ourPromiseText: 'You should walk out feeling confident and camera-ready. If something isn\'t perfect, let us know before you leave—we\'ll make it right.',
    visitUs: 'Visit Us',
    visitUsText: 'Book online, call ahead, or swing by—coffee\'s on, chairs are ready. Whether you\'re after a sharp new look or just a clean refresh, Barber Kings has you covered.'
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
      filterLocation: 'Filter by Location:',
      allLocations: 'All Locations',
      occupied: 'Occupied',
      available: 'Available',
      closed: 'Closed',
      loading: 'Loading bookings...',
      clickToCopyPhone: 'Click to copy phone number',
      phoneCopied: 'Phone {phone} copied to clipboard!'
    },
    addBooking: {
      title: 'Add New Booking',
      customerInfo: 'Customer Information',
      bookingDetails: 'Booking Details', 
      bookingStatus: 'Booking Status',
      fullName: 'Full Name',
      phone: 'Phone Number',
      location: 'Location',
      date: 'Date',
      time: 'Time',
      selectLocation: 'Select location',
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
        completed: 'Completed',
        cancelled: 'Cancelled'
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
    dateRequired: 'Date is required',
    timeRequired: 'Time is required',
    statusRequired: 'Status is required'
  }
}