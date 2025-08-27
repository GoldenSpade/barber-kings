<template>
  <div class="about-page">
    <Navigation />

    <!-- About Hero Section -->
    <div class="about-hero bg-light py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h1 class="display-4 fw-bold text-dark mb-4">About Barber Kings</h1>
            <p class="lead text-muted mb-0">
              Learn more about our story, mission, and the team behind Barber Kings
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- About Content Section -->
    <div class="about-content py-5">
      <div class="container h-100 d-flex flex-column justify-content-between">
        <div class="row flex-grow-1 align-items-center">
          <div class="col-12">
            <div class="bg-white p-5 rounded shadow">
              
              <p class="lead text-dark mb-5">
                At Barber Kings, we keep things simple: great cuts, honest advice, and a place you'll actually look forward to visiting. Our barbers blend old-school craft with modern technique to deliver sharp fades, classic scissor work, precise beard sculpting, and hot-towel straight-razor shaves.
              </p>
              
              <h2 class="h3 mb-4 text-dark fw-bold">Our Story</h2>
              <p class="text-muted mb-5" style="line-height: 1.8;">
                We started this shop to bring back the feeling of a true neighborhood barbershop—somewhere you're greeted by name, the music's right, and the conversation's easy. From day one, our goal has been the same: consistent results, zero fuss, and service that respects your time.
              </p>
              
              <h2 class="h3 mb-4 text-dark fw-bold">What We Do</h2>
              <ul class="list-unstyled text-muted mb-5" style="line-height: 2;">
                <li>• Classic & modern haircuts</li>
                <li>• Skin fades, tapers, and scissor cuts</li>
                <li>• Beard trims, line-ups, and reshapes</li>
                <li>• Hot-towel shaves & razor finishes</li>
                <li>• Kids' cuts (patient barbers, parent-approved)</li>
              </ul>
              <p class="text-muted mb-5" style="line-height: 1.8;">
                We use pro-grade tools and products we trust, and we'll show you how to style your cut at home so it looks good every day—not just when you leave the chair.
              </p>
              
              <h2 class="h3 mb-4 text-dark fw-bold">Why Choose Us</h2>
              <div class="row mb-5">
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">Craft first</h5>
                  <p class="text-muted">Detail-driven barbers who care about the final millimeter.</p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">Clean & comfortable</h5>
                  <p class="text-muted">Sanitized tools, fresh capes, and a relaxed vibe.</p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">On time</h5>
                  <p class="text-muted">Easy online booking and walk-ins when chairs are open.</p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">Straight talk</h5>
                  <p class="text-muted">We'll recommend what fits your hair, face shape, and lifestyle.</p>
                </div>
              </div>
              
              <h2 class="h3 mb-4 text-dark fw-bold">Our Promise</h2>
              <p class="text-muted mb-5" style="line-height: 1.8;">
                You should walk out feeling confident and camera-ready. If something isn't perfect, let us know before you leave—we'll make it right.
              </p>
              
              <h2 class="h3 mb-4 text-dark fw-bold">Visit Us</h2>
              <p class="text-muted mb-4" style="line-height: 1.8;">
                Book online, call ahead, or swing by—coffee's on, chairs are ready. Whether you're after a sharp new look or just a clean refresh, Barber Kings has you covered.
              </p>
              
              <div class="text-center">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="navbar navbar-light bg-white border-top py-3">
      <div class="container">
        <div class="navbar-nav mx-auto">
          <div class="d-flex justify-content-center">
            <a class="nav-link text-dark fw-bold fs-6 me-5" href="#home">HOME</a>
            <a class="nav-link text-dark fw-bold fs-6 me-5" href="#about">ABOUT</a>
            <a class="nav-link text-dark fw-bold fs-6" href="#services">SERVICES</a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue'
</script>

<style scoped>
.about-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.about-hero {
  background-color: #f8f9fa !important;
}


@media (max-width: 768px) {
  .display-4 {
    font-size: 2.5rem !important;
  }
  
  .about-content {
    padding: 3rem 0 !important;
  }
}
</style>
