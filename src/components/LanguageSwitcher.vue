<template>
  <div class="language-switcher">
    <!-- Desktop Version - Buttons -->
    <div class="d-none d-lg-flex align-items-center gap-2">
      <button
        class="lang-btn"
        :class="{ 'active': locale === 'hr' }"
        @click="changeLanguage('hr')"
        aria-label="Hrvatski"
      >
        <span class="lang-text">HR</span>
      </button>
      <button
        class="lang-btn"
        :class="{ 'active': locale === 'en' }"
        @click="changeLanguage('en')"
        aria-label="English"
      >
        <span class="lang-text">EN</span>
      </button>
    </div>

    <!-- Mobile Version - Compact Toggle -->
    <div class="d-lg-none">
      <button
        class="lang-toggle-mobile"
        @click="changeLanguage(locale === 'hr' ? 'en' : 'hr')"
        aria-label="Change language"
      >
        <span v-if="locale === 'hr'">HR</span>
        <span v-else>EN</span>
      </button>
    </div>
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

/* Desktop buttons */
.lang-btn {
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

.lang-btn:hover {
  border-color: #198754;
  background: #f8f9fa;
}

.lang-btn.active {
  background: #198754;
  color: white;
  border-color: #198754;
}

.lang-btn .lang-text {
  font-size: 14px;
  letter-spacing: 0.5px;
}

/* Mobile toggle button */
.lang-toggle-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 45px;
}

.lang-toggle-mobile:active {
  transform: scale(0.95);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .lang-toggle-mobile {
    padding: 5px 10px;
    font-size: 13px;
    min-width: 40px;
  }
}
</style>