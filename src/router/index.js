import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import BookingPage from '@/pages/BookingPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'Barber Kings - Premium Barbershop & Grooming'
      }
    },

    {
      path: '/booking',
      name: 'booking',
      component: BookingPage,
      meta: {
        title: 'Book Appointment - Barber Kings'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        title: 'Login - Barber Kings'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      meta: {
        title: 'Admin Panel - Barber Kings',
        requiresAuth: true
      }
    },
  ],
})

// Navigation guard to update document title and check authentication
router.beforeEach((to, from, next) => {
  // Update document title based on route meta
  if (to.meta?.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Barber Kings'
  }
  
  // Check if route requires authentication
  if (to.meta?.requiresAuth) {
    const authStore = useAuthStore()
    
    // Initialize auth store if not already done
    if (!authStore.isAuthenticated) {
      authStore.initializeAuth()
    }
    
    // Check if user is authenticated
    if (!authStore.checkAuthStatus()) {
      // Redirect to login if not authenticated
      console.log('Access denied: Not authenticated')
      next('/login')
      return
    }
    
    console.log('Access granted to admin area')
  }
  
  // If going to login page but already authenticated, redirect to admin
  if (to.path === '/login') {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      authStore.initializeAuth()
    }
    
    if (authStore.checkAuthStatus()) {
      console.log('Already authenticated, redirecting to admin')
      next('/admin')
      return
    }
  }
  
  next()
})

export default router
