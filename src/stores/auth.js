import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hashPassword } from '@/utils/crypto'

export const useAuthStore = defineStore('auth', () => {
  // State
  const isAuthenticated = ref(false)
  const username = ref('')
  const role = ref('')
  const isLoggingIn = ref(false)
  
  // Session timeout (24 часа в миллисекундах)
  const SESSION_TIMEOUT = 24 * 60 * 60 * 1000
  
  // Getters
  const isLoggedIn = computed(() => isAuthenticated.value)
  const currentUser = computed(() => ({
    username: username.value,
    role: role.value
  }))
  
  // Actions
  const login = async (usernameInput, password) => {
    isLoggingIn.value = true
    
    try {
      // Хешируем пароль перед отправкой
      const passwordHash = hashPassword(password)
      
      // Отправляем запрос на Google Apps Script для проверки пользователя
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL
      const url = `${scriptUrl}?action=verifyUser&username=${encodeURIComponent(usernameInput)}&passwordHash=${encodeURIComponent(passwordHash)}&callback=handleLoginResult`
      
      console.log('Attempting login for:', usernameInput)
      
      // Создаем JSONP запрос для обхода CORS
      return new Promise((resolve, reject) => {
        const callbackName = 'handleLoginResult'
        window[callbackName] = (result) => {
          console.log('Login response:', result)
          
          if (result.success && result.user) {
            // Успешная авторизация
            isAuthenticated.value = true
            username.value = result.user.username
            role.value = result.user.role || 'admin'
            
            // Сохраняем данные сессии в localStorage
            const sessionData = {
              isAuthenticated: true,
              username: result.user.username,
              role: result.user.role || 'admin',
              timestamp: Date.now()
            }
            localStorage.setItem('auth_session', JSON.stringify(sessionData))
            
            resolve({ success: true, user: result.user })
          } else {
            // Ошибка авторизации
            reject(new Error(result.message || 'Invalid credentials'))
          }
          
          // Очищаем callback
          delete window[callbackName]
          document.head.removeChild(script)
          isLoggingIn.value = false
        }
        
        // Создаем script element для JSONP
        const script = document.createElement('script')
        script.src = url
        script.onerror = () => {
          console.error('Login script failed to load')
          delete window[callbackName]
          document.head.removeChild(script)
          isLoggingIn.value = false
          reject(new Error('Connection error. Please try again.'))
        }
        document.head.appendChild(script)
      })
      
    } catch (error) {
      isLoggingIn.value = false
      console.error('Login error:', error)
      throw error
    }
  }
  
  const logout = () => {
    // Очищаем состояние
    isAuthenticated.value = false
    username.value = ''
    role.value = ''
    
    // Очищаем localStorage
    localStorage.removeItem('auth_session')
    
    console.log('User logged out')
  }
  
  const initializeAuth = () => {
    // Проверяем сохраненную сессию при инициализации приложения
    try {
      const sessionData = localStorage.getItem('auth_session')
      if (sessionData) {
        const session = JSON.parse(sessionData)
        
        // Проверяем, не истекла ли сессия
        const currentTime = Date.now()
        const sessionAge = currentTime - session.timestamp
        
        if (sessionAge < SESSION_TIMEOUT && session.isAuthenticated) {
          // Восстанавливаем сессию
          isAuthenticated.value = true
          username.value = session.username
          role.value = session.role || 'admin'
          console.log('Session restored for:', session.username)
        } else {
          // Сессия истекла
          localStorage.removeItem('auth_session')
          console.log('Session expired')
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      localStorage.removeItem('auth_session')
    }
  }
  
  const checkAuthStatus = () => {
    // Проверяем актуальность сессии
    try {
      const sessionData = localStorage.getItem('auth_session')
      if (sessionData) {
        const session = JSON.parse(sessionData)
        const currentTime = Date.now()
        const sessionAge = currentTime - session.timestamp
        
        if (sessionAge >= SESSION_TIMEOUT) {
          // Сессия истекла, выходим
          logout()
          return false
        }
        
        return session.isAuthenticated
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      logout()
    }
    
    return false
  }
  
  return {
    // State
    isAuthenticated,
    username,
    role,
    isLoggingIn,
    
    // Getters
    isLoggedIn,
    currentUser,
    
    // Actions
    login,
    logout,
    initializeAuth,
    checkAuthStatus
  }
})