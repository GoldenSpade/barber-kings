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
    nextWeek: 'Sljedeći Tjedan'
  },
  
  // Locations
  locations: {
    downtown: {
      name: 'Downtown Barber Kings',
      address: '25 Trg Nezavisnosti, Zagreb',
      description: 'Centralna lokacija s punim spektrom usluga'
    },
    podil: {
      name: 'Barber Kings Podil', 
      address: '15 Podil Četvrt, Zagreb',
      description: 'Ugodna atmosfera u povijesnoj četvrti'
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
      filterLocation: 'Filtriraj po lokaciji:',
      allLocations: 'Sve lokacije',
      occupied: 'Zauzeto',
      available: 'Dostupno',
      closed: 'Zatvoreno',
      loading: 'Učitavaju se rezervacije...',
      clickToCopyPhone: 'Kliknite za kopiranje broja telefona',
      phoneCopied: 'Telefon {phone} kopiran u međuspremnik!'
    },
    addBooking: {
      title: 'Dodaj novu rezervaciju',
      customerInfo: 'Informacije o korisniku',
      bookingDetails: 'Detalji rezervacije',
      bookingStatus: 'Status rezervacije',
      fullName: 'Puno ime',
      phone: 'Broj telefona',
      location: 'Lokacija',
      date: 'Datum',
      time: 'Vrijeme',
      selectLocation: 'Odaberite lokaciju',
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
      occupied: '(Zauzeto)'
    },
    bookings: {
      title: 'Sve rezervacije',
      filterLocation: 'Filtriraj po lokaciji:',
      filterStatus: 'Filtriraj po statusu:',
      dateFrom: 'Datum od:',
      dateTo: 'Datum do:',
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
      }
    }
  }
}