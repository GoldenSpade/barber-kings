import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import hr from './locales/hr.js'

const messages = { en, hr }

// Get saved locale from localStorage or default to English
const savedLocale = localStorage.getItem('locale') || 'en'

const i18n = createI18n({
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
  legacy: false, // Use Composition API mode
  globalInjection: true
})

export default i18n