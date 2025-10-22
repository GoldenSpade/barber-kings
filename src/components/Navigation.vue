<template>
  <!-- Top Navigation -->
  <nav class="navbar navbar-expand-lg navbar-light bg-white py-3">
    <div class="container">
      <!-- Desktop Navigation -->
      <div class="row w-100 align-items-center d-none d-lg-flex">
        <!-- Left Links -->
        <div class="col-4 d-flex justify-content-start">
          <!-- Removed home link -->
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
        <div class="col-4 d-flex justify-content-end align-items-center">
          <!-- Language Switcher Component -->
          <LanguageSwitcher />
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="w-100 d-lg-none">
        <div class="d-flex justify-content-center align-items-center position-relative">
          <!-- Centered Mobile Logo -->
          <div class="navbar-brand">
            <img
              src="@/assets/main-logo.png"
              alt="Barber Kings"
              style="height: 60px"
            />
          </div>

          <!-- Language Switcher positioned absolutely on the right -->
          <div class="position-absolute end-0 me-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
</script>

<style scoped>
.navbar-brand img {
  max-height: 80px;
  width: auto;
}

.navbar-brand {
  display: flex;
  justify-content: center;
  align-items: center;
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
