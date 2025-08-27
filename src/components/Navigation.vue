<template>
  <!-- Top Navigation -->
  <nav class="navbar navbar-expand-lg navbar-light bg-white py-3">
    <div class="container">
      <!-- Desktop Navigation -->
      <div class="row w-100 align-items-center d-none d-lg-flex">
        <!-- Left Links -->
        <div class="col-4 d-flex justify-content-start">
          <router-link
            :to="{ name: 'home' }"
            class="nav-link text-dark fw-semibold fs-6 me-5"
            >HOME</router-link
          >
          <router-link
            :to="{ name: 'about' }"
            class="nav-link text-dark fw-semibold fs-6"
            >ABOUT</router-link
          >
        </div>

        <!-- Center Logo -->
        <div class="col-4 text-center">
          <img
            src="@/assets/main-logo.png"
            alt="Barber Kings"
            style="height: 80px"
          />
        </div>

        <!-- Right Links -->
        <div class="col-4 d-flex justify-content-end">
          <router-link
            class="nav-link text-dark fw-semibold fs-6"
            :to="{ name: 'booking' }"
            >CONTACT</router-link
          >
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="w-100 d-lg-none">
        <div class="d-flex justify-content-between align-items-center">
          <!-- Mobile Logo -->
          <div class="navbar-brand">
            <img
              src="@/assets/main-logo.png"
              alt="Barber Kings"
              style="height: 60px"
            />
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mobileNav"
            @click="toggleMobileMenu"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <!-- Collapsible Mobile Menu -->
        <div class="collapse navbar-collapse" id="mobileNav">
          <div class="navbar-nav text-center mt-3">
            <router-link
              :to="{ name: 'home' }"
              class="nav-link text-dark fw-semibold py-2"
              >HOME</router-link
            >
            <router-link
              :to="{ name: 'about' }"
              class="nav-link text-dark fw-semibold py-2"
              >ABOUT</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const toggleMobileMenu = () => {
  // Bootstrap will handle the collapse functionality
}
</script>

<style scoped>
.navbar-brand img {
  max-height: 80px;
  width: auto;
}

.nav-link {
  font-weight: 500;
  color: #333 !important;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #198754 !important;
}

@media (max-width: 768px) {
  .navbar-nav {
    flex-direction: column;
    text-align: center;
  }

  .navbar-brand {
    order: -1;
    margin-bottom: 1rem;
  }
}

.router-link-active {
  color: #198754 !important;
}
</style>
