<template>
  <!-- Bottom Navigation -->
  <nav class="navbar navbar-light bg-white border-top py-3">
    <div class="container">
      <div class="navbar-nav mx-auto">
        {{ $t('footer.copyright').replace('2025', year) }}
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const year = new Date().getFullYear()
</script>

<style scoped>
.nav-link {
  font-weight: 500;
  color: #333 !important;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #198754 !important;
}

.router-link-active {
  color: #198754 !important;
}
</style>
