<template>
  <div class="home-page">
    <Navigation />

    <!-- Hero Section -->
    <div class="hero-section bg-light">
      <div class="container h-100 d-flex flex-column justify-content-between">
        <!-- Main Content -->
        <div class="row flex-grow-1 align-items-center">
          <div class="col-12">
            <div class="text-center py-5">
              <!-- Large WELCOME text -->
              <h1
                class="display-1 fw-bold text-dark mb-4"
                style="font-size: 7rem; letter-spacing: 5px; line-height: 0.9"
              >
                WELCOME
              </h1>

              <!-- Description text -->
              <p
                class="lead text-muted fw-normal mb-4 mx-auto"
                style="font-size: 1.1rem; max-width: 600px; line-height: 1.6"
              >
                Where tradition meets precision. Expert cuts, classic shaves,
                and modern style crafted by masters of the trade.
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
                  BOOK NOW
                </button>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Barbershop Image -->
        <div class="row">
          <div class="col-12">
            <div class="barbershop-image mb-4 mb-md-4 mb-lg-4">
              <img
                src="@/assets/barbershop-photo.jpg"
                alt="Barbershop Interior"
                class="img-fluid w-100 rounded shadow"
                style="height: 500px; object-fit: cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.home-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.hero-section {
  background-color: #f8f9fa !important;
}

@media (max-width: 768px) {
  .display-1 {
    font-size: 4rem !important;
    letter-spacing: 3px !important;
  }
}

@media (max-width: 576px) {
  .display-1 {
    font-size: 3rem !important;
  }

  .lead {
    font-size: 1rem !important;
  }
}
</style>
