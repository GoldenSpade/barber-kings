import { createI18n } from 'vue-i18n'

// English translations
const en = {
  // Navigation
  nav: {
    home: 'Home',
    about: 'About', 
    booking: 'Booking'
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
    closed: 'Closed',
    pastDay: 'Past day',
    notAvailableToday: 'Not available today',
    haircut: 'Haircut',
    duration: '60 min',
    timezone: 'Timezone: Europe/Zagreb',
    fullName: 'Full Name',
    phone: 'Phone',
    enterName: 'Enter your name',
    successMessage: 'Thank you! Your booking has been received. We will contact you for confirmation.',
    previousWeek: 'Previous Week',
    nextWeek: 'Next Week'
  },
  
  // Locations
  locations: {
    downtown: {
      name: 'Downtown Barber Kings',
      address: '25 Khreshchatyk Street', 
      description: 'Central location with full range of services'
    },
    podil: {
      name: 'Barber Kings Podil',
      address: '15 Sagaidachnogo Street',
      description: 'Cozy atmosphere in historic district'  
    }
  },
  
  // Footer
  footer: {
    copyright: 'Copyright © 2025 Barber Kings. All rights reserved.'
  }
}

// Croatian translations
const hr = {
  // Navigation
  nav: {
    home: 'Početna',
    about: 'O nama',
    booking: 'Rezervacija'
  },
  
  // Home page
  home: {
    welcome: 'DOBRODOŠLI',
    description: 'Gdje se tradicija susreće s preciznošću. Stručno šišanje, klasično brijanje i moderni stil koji stvaraju majstori zanata.',
    bookNow: 'REZERVIRAJ SADA'
  },
  
  // Booking page
  booking: {
    back: 'Nazad',
    steps: {
      locations: 'Lokacije',
      time: 'Vrijeme',
      details: 'Detalji'
    },
    chooseLocation: 'Odaberite lokaciju',
    chooseTime: 'Odaberite vrijeme',
    contactDetails: 'Kontakt podaci',
    timeConfirmation: 'Potvrda vremena',
    choose: 'Odaberi',
    bookNow: 'Rezerviraj',
    closed: 'Zatvoreno',
    pastDay: 'Prošli dan',
    notAvailableToday: 'Danas nije dostupno',
    haircut: 'Šišanje',
    duration: '60 min',
    timezone: 'Vremenska zona: Europe/Zagreb',
    fullName: 'Puno ime',
    phone: 'Telefon',
    enterName: 'Unesite vaše ime',
    successMessage: 'Hvala! Vaša rezervacija je primljena. Kontaktirat ćemo vas za potvrdu.',
    previousWeek: 'Prethodna Tjedni',
    nextWeek: 'Sljedeći Tjedan'
  },
  
  // Locations
  locations: {
    downtown: {
      name: 'Downtown Barber Kings',
      address: '25 Khreshchatyk Street',
      description: 'Centralna lokacija s punim spektrom usluga'
    },
    podil: {
      name: 'Barber Kings Podil', 
      address: '15 Sagaidachnogo Street',
      description: 'Ugodna atmosfera u povijesnoj četvrti'
    }
  },
  
  // Footer
  footer: {
    copyright: 'Autorska prava © 2025 Barber Kings. Sva prava zadržana.'
  }
}

const messages = { en, hr }

const i18n = createI18n({
  locale: 'en', // Default to English
  fallbackLocale: 'en',
  messages,
  legacy: false, // Use Composition API mode
  globalInjection: true
})

export default i18n