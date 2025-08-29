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
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingPage,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
  ],
})

export default router
