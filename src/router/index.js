import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import BookingPage from '@/pages/BookingPage.vue'
import AdminPage from '@/pages/AdminPage.vue'

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
      path: '/about',
      name: 'about',
      component: AboutPage,
      meta: {
        title: 'About Us - Barber Kings'
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
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      meta: {
        title: 'Admin Panel - Barber Kings'
      }
    },
  ],
})

// Navigation guard to update document title
router.beforeEach((to, from, next) => {
  // Update document title based on route meta
  if (to.meta?.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Barber Kings'
  }
  next()
})

export default router
