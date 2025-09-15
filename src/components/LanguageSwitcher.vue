<template>
  <div class="language-switcher">
    <!-- Universal Toggle Button for all screen sizes -->
    <button
      class="lang-toggle"
      @click="changeLanguage(locale === 'hr' ? 'en' : 'hr')"
      aria-label="Change language"
    >
      {{ locale.toUpperCase() }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
}

/* Universal toggle button */
.lang-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  min-width: 45px;
}

.lang-toggle:hover {
  border-color: #198754;
  background: #f8f9fa;
}

.lang-toggle:active {
  transform: scale(0.98);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .lang-toggle {
    padding: 5px 10px;
    font-size: 13px;
    gap: 6px;
  }
}
</style>
