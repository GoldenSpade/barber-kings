<template>
  <div class="home-page">
    <Navigation />

    <!-- Hero Section -->
    <div class="hero-section bg-light">
      <div class="container h-100 d-flex flex-column justify-content-center">
        <!-- Main Content -->
        <div class="row align-items-center">
          <div class="col-12">
            <div class="text-center py-5">
              <!-- Large WELCOME text -->
              <h1
                class="display-1 fw-bold text-dark mb-4"
                style="font-size: 7rem; letter-spacing: 5px; line-height: 0.9"
              >
                {{ $t('home.welcome') }}
              </h1>

              <!-- Description text -->
              <p
                class="lead text-muted fw-normal mb-4 mx-auto"
                style="font-size: 1.1rem; max-width: 600px; line-height: 1.6"
              >
                {{ $t('home.description') }}
              </p>

              <!-- Book Now Button -->
              <router-link :to="{ name: 'booking' }">
                <button
                  class="btn btn-dark btn-lg px-5 py-3 fw-bold"
                  style="
                    letter-spacing: 2px;
                    background-color: #2c3e33 !important;
                    border-color: #2c3e33 !important;
                  "
                >
                  {{ $t('home.bookNow') }}
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Locations Section -->
    <div class="locations-section bg-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h2 class="display-4 fw-bold text-dark mb-5" style="font-size: 3rem; letter-spacing: 2px;">
              {{ $t('home.locations') }}
            </h2>
            
            <div class="row justify-content-center mb-3">
              <!-- Location 1 -->
              <div class="col-lg-6 mb-4">
                <div class="location-item text-center">
                  <div class="location-header mb-3">
                    <div class="d-flex align-items-center justify-content-center">
                      <div class="location-icon me-3">
                        <i class="bi bi-geo-alt-fill text-danger" style="font-size: 2rem;"></i>
                      </div>
                      <div class="location-info text-center">
                        <h5 class="fw-bold text-dark mb-0">
                          Martinkovac ul. 127, 51000, Rijeka<br>091 985 2998
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div class="map-container">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2803.691183100972!2d14.3628497!3d45.3550458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4764a778cea92f49%3A0xe6f79ee3aa294ac7!2sBarber%20Kings!5e0!3m2!1sru!2sua!4v1756892589098!5m2!1sru!2sua" 
                      width="100%" 
                      height="300" 
                      style="border:0; border-radius: 8px;" 
                      allowfullscreen="" 
                      loading="lazy" 
                      referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                </div>
              </div>

              <!-- Location 2 -->
              <div class="col-lg-6 mb-4">
                <div class="location-item text-center">
                  <div class="location-header mb-3">
                    <div class="d-flex align-items-center justify-content-center">
                      <div class="location-icon me-3">
                        <i class="bi bi-geo-alt-fill text-danger" style="font-size: 2rem;"></i>
                      </div>
                      <div class="location-info text-center">
                        <h5 class="fw-bold text-dark mb-0">
                          Adamićeva ul. 34A, 51000, Rijeka<br>091 948 1514
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div class="map-container">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2805.062280198281!2d14.439723400000002!3d45.32736479999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4764a16f5d1d6545%3A0xdbf757076701a6e!2sBarber%20Kings!5e0!3m2!1sru!2sua!4v1756892541675!5m2!1sru!2sua" 
                      width="100%" 
                      height="300" 
                      style="border:0; border-radius: 8px;" 
                      allowfullscreen="" 
                      loading="lazy" 
                      referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hours Section -->
            <h2 class="display-4 fw-bold text-dark mb-5" style="font-size: 3rem; letter-spacing: 2px;">
              {{ $t('home.hours') }}
            </h2>
            
            <div class="row justify-content-center">
              <!-- Column 1: Mon-Fri 9:00–21:00, Sun Closed -->
              <div class="col-md-6 mb-4">
                <div class="hours-column">
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.monday') }}</span>
                    <span>9:00 to 21:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.tuesday') }}</span>
                    <span>9:00 to 21:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.wednesday') }}</span>
                    <span>9:00 to 21:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.thursday') }}</span>
                    <span>9:00 to 21:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.friday') }}</span>
                    <span>9:00 to 21:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.sunday') }}</span>
                    <span class="text-danger fw-bold">{{ $t('booking.closed') }}</span>
                  </div>
                </div>
              </div>

              <!-- Column 2: Mon-Fri 8:00–17:00, Sun Closed -->
              <div class="col-md-6 mb-4">
                <div class="hours-column">
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.monday') }}</span>
                    <span>8:00 to 17:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.tuesday') }}</span>
                    <span>8:00 to 17:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.wednesday') }}</span>
                    <span>8:00 to 17:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.thursday') }}</span>
                    <span>8:00 to 17:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.friday') }}</span>
                    <span>8:00 to 17:00</span>
                  </div>
                  <div class="d-flex justify-content-between py-2">
                    <span class="fw-bold">{{ $t('booking.days.sunday') }}</span>
                    <span class="text-danger fw-bold">{{ $t('booking.closed') }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div id="pricing" class="pricing-section bg-dark text-white py-5">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2 class="display-4 fw-bold text-white text-center mb-5" style="font-size: 3rem; letter-spacing: 2px;">
              {{ $t('home.pricing') }}
            </h2>
            
            <!-- Loading State -->
            <div v-if="servicesStore.isLoading" class="text-center py-5">
              <Loader size="large" message="Loading pricing information..." />
            </div>

            <!-- Services Content -->
            <div v-else class="row justify-content-center">
              <!-- Dynamic Services (Regular) -->
              <div class="col-md-8 col-lg-6">
                <div class="pricing-column">
                  <h3 class="fw-bold text-white mb-4 pb-2 border-bottom border-white" style="font-size: 1.5rem; letter-spacing: 1px;">
                    {{ $t('home.pricingServices.regular') }}
                  </h3>
                  
                  <div 
                    v-for="service in pricingServices" 
                    :key="service.id"
                    class="service-item d-flex justify-content-between py-2 border-bottom border-secondary"
                  >
                    <span>{{ service.name }}</span>
                    <span class="fw-bold">{{ service.formattedPrice }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Book Appointment Button -->
            <div class="text-center mt-5">
              <router-link :to="{ name: 'booking' }">
                <button
                  class="btn btn-light btn-lg px-5 py-3 fw-bold text-dark"
                  style="letter-spacing: 2px;"
                >
                  {{ $t('home.bookAppointment') }}
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import Loader from '@/components/Loader.vue'
import { useServicesStore } from '@/stores/services'

const servicesStore = useServicesStore()

// Load services on component mount
onMounted(async () => {
  await servicesStore.fetchServices()
})

// Computed property for services with pricing
const pricingServices = computed(() => {
  return servicesStore.activeServices.map(service => ({
    ...service,
    formattedPrice: service.price > 0 ? `€${service.price}` : 'from €15'
  }))
})
</script>

<style scoped>
.home-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.hero-section {
  background-color: #f8f9fa !important;
}

.locations-section {
  background-image: url('@/assets/main-page-locations-bg.jpg');
  background-repeat: repeat;
  position: relative;
}

.location-item {
  margin-bottom: 1.5rem;
}

.location-icon {
  min-width: 50px;
}

.map-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.hours-column {
  max-width: 300px;
  margin: 0 auto;
}

.pricing-section {
  background-color: #212529 !important;
}

.pricing-column {
  padding: 0 15px;
}

.service-item {
  font-size: 1rem;
  padding: 12px 0;
}

.service-item:last-child {
  border-bottom: none !important;
}

@media (max-width: 768px) {
  .display-1 {
    font-size: 4rem !important;
    letter-spacing: 3px !important;
  }
  
  .display-4 {
    font-size: 2.5rem !important;
    letter-spacing: 1.5px !important;
  }
  
  .pricing-column {
    margin-bottom: 3rem;
  }
}

@media (max-width: 576px) {
  .display-1 {
    font-size: 3rem !important;
  }
  
  .display-4 {
    font-size: 2rem !important;
    letter-spacing: 1px !important;
  }

  .lead {
    font-size: 1rem !important;
  }
  
  .location-item {
    flex-direction: column;
    text-align: center;
  }
  
  .location-icon {
    margin-bottom: 1rem;
    margin-right: 0 !important;
  }
  
  .location-header {
    flex-direction: column !important;
  }
  
  .hours-column {
    max-width: 100%;
  }
}
</style>
