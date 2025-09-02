export default {
  // Navigation
  nav: {
    home: 'Početna',
    about: 'O nama',
    booking: 'Rezervacija'
  },
  
  // Common
  common: {
    loading: 'Učitava...',
    loadingSlots: 'Učitavaju se dostupni termini...',
    submittingBooking: 'Šalje se vaša rezervacija...'
  },

  // Slot availability messages
  slots: {
    available: 'Dostupno: {duration} min ({start} - {end})',
    occupied: 'Zauzeto',
    notEnoughTime: 'Nedovoljno vremena do kraja dana (potrebno {duration} min)',
    conflictWith: 'Konflikt s rezervacijom u {time}',
    needConsecutive: 'Potrebno {slots} uzastopnih slobodnih termina za ovu uslugu'
  },
  
  // Home page
  home: {
    welcome: 'DOBRODOŠLI',
    description: 'Gdje se tradicija susreće s preciznošću. Stručno šišanje, klasično brijanje i moderni stil koji stvaraju majstori zanata.',
    bookNow: 'REZERVIRAJ SADA',
    ourLocations: 'Naše Lokacije'
  },
  
  // Booking page
  booking: {
    back: 'Nazad',
    steps: {
      locations: 'Lokacije',
      service: 'Usluga',
      time: 'Vrijeme',
      details: 'Detalji'
    },
    chooseService: 'Odaberite uslugu',
    chooseLocation: 'Odaberite lokaciju',
    service: 'Usluga',
    location: 'Lokacija',
    dateTime: 'Datum i vrijeme',
    chooseTime: 'Odaberite vrijeme',
    contactDetails: 'Kontakt podaci',
    timeConfirmation: 'Potvrda vremena',
    choose: 'Odaberi',
    bookNow: 'Rezerviraj',
    submitting: 'Šalje se',
    closed: 'Zatvoreno',
    pastday: 'Prošli dan',
    notavailabletoday: 'Danas nije dostupno',
    haircut: 'Šišanje',
    duration: '30 min',
    timezone: 'Vremenska zona: {timezone}',
    dayNames: ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'],
    monthNames: ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'],
    fullName: 'Puno ime',
    phone: 'Telefon',
    enterName: 'Unesite vaše ime',
    enterPhone: 'Unesite broj telefona',
    successMessage: 'Hvala! Vaša rezervacija je primljena. Kontaktirat ćemo vas za potvrdu.',
    previousWeek: 'Prethodna Tjedni',
    nextWeek: 'Sljedeći Tjedan',
    occupied: 'Zauzeto',
    refresh: 'Osvježi',
    loadingCalendar: 'Učitavaju se dostupni termini...',
    workingHours: 'Radno vrijeme',
    address: 'Adresa',
    days: {
      monday: 'Ponedjeljak',
      tuesday: 'Utorak',
      wednesday: 'Srijeda',
      thursday: 'Četvrtak',
      friday: 'Petak',
      saturday: 'Subota',
      sunday: 'Nedjelja'
    }
  },
  
  // Services
  services: {
    mensHaircut: {
      name: 'Muško šišanje',
      description: 'Klasično i moderno šišanje za muškarce'
    },
    mensHaircutBeard: {
      name: 'Muško šišanje + uređenje brade',
      description: 'Šišanje s profesionalnim uređenjem i oblikovanjem brade'
    },
    womensHaircut: {
      name: 'Žensko šišanje',
      description: 'Profesionalno šišanje za žene'
    }
  },
  
  // Locations
  locations: {
    downtown: {
      name: 'Barber Kings Martinkovac',
      address: 'Martinkovac ul. 127, 51000, Rijeka',
      description: 'Nalazi se u Marti Retail Park',
      phone: '091 985 2998',
      hours: {
        monday: '9:00 - 21:00',
        tuesday: '9:00 - 21:00',
        wednesday: '9:00 - 21:00',
        thursday: '9:00 - 21:00',
        friday: '9:00 - 21:00',
        saturday: '9:00 - 21:00',
        sunday: 'Zatvoreno'
      }
    },
    podil: {
      name: 'Barber Kings Adamićeva',
      address: 'Adamićeva ul. 34A, 51000, Rijeka',
      description: 'Profesionalne berberske usluge u srcu Rijeke',
      phone: '091 948 1514',
      hours: {
        monday: '8:00 - 17:00',
        tuesday: '8:00 - 17:00',
        wednesday: '8:00 - 17:00',
        thursday: '8:00 - 17:00',
        friday: '8:00 - 17:00',
        saturday: '8:00 - 13:00',
        sunday: 'Zatvoreno'
      }
    }
  },
  
  // About page
  about: {
    title: 'O Barber Kings',
    subtitle: 'Saznajte više o našoj priči, misiji i timu koji stoji iza Barber Kings',
    intro: 'U Barber Kings-u držimo stvari jednostavnima: odlične frizure, iskreni savjeti i mjesto koje ćete se radovati posjetiti. Naši berberi spajaju staru školu s modernim tehnikama kako bi pružili oštre fade frizure, klasični rad škarama, precizno oblikovanje brade i brijanje vručim ručnicima.',
    ourStory: 'Naša Priča',
    ourStoryText: 'Otvorili smo ovaj salon da vratimo osjećaj pravog susjedskog berbershopa—mjesto gdje vas pozdravljaju po imenu, gdje je glazba prava, a razgovor opušten. Od prvog dana, naš cilj je isti: konzistentni rezultati, bez komplikacija i usluga koja poštuje vaše vrijeme.',
    whatWeDo: 'Što Radimo',
    services: {
      cuts: 'Klasične i moderne frizure',
      fades: 'Fade frizure, ošišano škarama',
      beards: 'Uređenje brade, linije i preoblikovanje',
      shaves: 'Brijanje vručim ručnicima i britvom',
      kids: 'Frizure za djecu (strpljivi berberi, odobreno od roditelja)'
    },
    whatWeDoText: 'Koristimo profesionalne alate i proizvode kojima vjerujemo, te ćemo vam pokazati kako stilizirati svoju frizuru kod kuće tako da izgleda dobro svaki dan—ne samo kada odlazite iz stolca.',
    whyChooseUs: 'Zašto Odabrati Nas',
    features: {
      craft: {
        title: 'Zanatlija prije svega',
        description: 'Berberi usmjereni na detalje kojima je stalo do svakog milimetra.'
      },
      clean: {
        title: 'Čisto i udobno',
        description: 'Dezinficirani alati, svježi ogrtači i opuštena atmosfera.'
      },
      onTime: {
        title: 'Na vrijeme',
        description: 'Lako online rezerviranje i walk-in kada su stolci slobodni.'
      },
      straightTalk: {
        title: 'Direktan razgovor',
        description: 'Preporučit ćemo ono što pristaje vašoj kosi, obliku lica i načinu života.'
      }
    },
    ourPromise: 'Naše Obećanje',
    ourPromiseText: 'Trebali biste izaći osjećajući se samouvjereno i spremno za fotografiranje. Ako nešto nije savršeno, javite nam prije odlaska—ispravit ćemo to.',
    visitUs: 'Posjetite Nas',
    visitUsText: 'Rezervirajte online, nazovite unaprijed, ili svratite—kava je spremna, stolci čekaju. Bilo da tražite oštar novi look ili samo osvježavanje, Barber Kings vas pokriva.'
  },

  // Footer
  footer: {
    copyright: 'Autorska prava © 2025 Barber Kings. Sva prava zadržana.'
  },

  // Admin Panel
  admin: {
    title: 'Admin Panel - Barber Kings',
    backToSite: 'Povratak na stranicu',
    tabs: {
      calendar: 'Kalendar rezervacija',
      addBooking: 'Dodaj rezervaciju',
      manageBookings: 'Upravljaj rezervacijama'
    },
    calendar: {
      title: 'Kalendar rezervacija',
      subtitle: 'Admin pregled kalendara',
      previousWeek: 'Prethodni tjedan',
      nextWeek: 'Sljedeći tjedan',
      filterLocation: 'Lokacija:',
      occupied: 'Zauzeto',
      available: 'Dostupno',
      closed: 'Zatvoreno',
      loading: 'Učitavaju se rezervacije...',
      clickToCopyPhone: 'Kliknite za kopiranje broja telefona',
      phoneCopied: 'Telefon {phone} kopiran u međuspremnik!'
    },
    editBooking: {
      title: 'Uredi rezervaciju',
      name: 'Ime',
      phone: 'Telefon',
      status: 'Status'
    },
    addBooking: {
      title: 'Dodaj novu rezervaciju',
      customerInfo: 'Informacije o korisniku',
      bookingDetails: 'Detalji rezervacije',
      bookingStatus: 'Status rezervacije',
      fullName: 'Puno ime',
      phone: 'Broj telefona',
      location: 'Lokacija',
      service: 'Usluga',
      date: 'Datum',
      time: 'Vrijeme',
      selectLocation: 'Odaberite lokaciju',
      selectService: 'Odaberite uslugu',
      selectTime: 'Odaberite vrijeme',
      enterName: 'Unesite ime korisnika',
      enterPhone: 'Unesite broj telefona',
      pending: 'Na čekanju',
      confirmed: 'Potvrđeno',
      pendingConfirmation: 'Čeka potvrdu',
      addBooking: 'Dodaj rezervaciju',
      adding: 'Dodaje se...',
      resetForm: 'Resetiraj formu',
      successMessage: 'Rezervacija je uspješno dodana!',
      errorMessage: 'Dodavanje rezervacije nije uspjelo. Molimo pokušajte ponovno.',
      occupied: 'Zauzeto'
    },
    bookings: {
      title: 'Sve rezervacije',
      filterLocation: 'Filtriraj po lokaciji:',
      filterStatus: 'Filtriraj po statusu:',
      selectDate: 'Odaberite datum:',
      search: 'Pretraži po imenu ili telefonu...',
      resetFilters: 'Resetiraj filtere',
      refresh: 'Osvježi',
      noBookings: 'Nema rezervacija',
      noBookingsText: 'Pokušajte prilagoditi filtere ili dodajte rezervacije.',
      loading: 'Učitavaju se rezervacije...',
      timestamp: 'Vremenska oznaka',
      name: 'Ime',
      phone: 'Telefon',
      location: 'Lokacija',
      date: 'Datum',
      time: 'Vrijeme',
      status: 'Status',
      actions: 'Akcije',
      first: 'Prva',
      previous: 'Prethodna',
      next: 'Sljedeća',
      last: 'Zadnja',
      showing: 'Prikazuje {start} do {end} od {total} rezervacija',
      statuses: {
        pending: 'Na čekanju',
        confirmed: 'Potvrđeno',
        completed: 'Završeno',
        cancelled: 'Otkazano'
      },
      locations: {
        allLocations: 'Sve lokacije',
        downtown: 'Centar',
        podil: 'Podil'
      },
      allStatus: 'Svi statusni'
    }
  },

  // Validation messages
  validation: {
    nameRequired: 'Ime je obavezno',
    nameMinLength: 'Ime mora imati najmanje 2 znakova',
    phoneRequired: 'Broj telefona je obavezan',
    invalidPhone: 'Molimo unesite valjani broj telefona (8-20 brojeva, razmaci, +, -, ( ) dozvoljeni)',
    locationRequired: 'Lokacija je obavezna',
    serviceRequired: 'Usluga je obavezna',
    dateRequired: 'Datum je obavezan',
    timeRequired: 'Vrijeme je obavezno',
    statusRequired: 'Status je obavezan'
  }
}