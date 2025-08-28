<template>
  <div class="loader-container">
    <div class="spinner-border text-secondary" role="status" :style="spinnerStyle">
      <span class="visually-hidden">{{ $t('common.loading') }}</span>
    </div>
    <p v-if="message" class="text-muted mt-3">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  message: {
    type: String,
    default: null
  }
})

const spinnerStyle = computed(() => {
  const sizes = {
    small: { width: '1.5rem', height: '1.5rem' },
    medium: { width: '2rem', height: '2rem' },
    large: { width: '3rem', height: '3rem' }
  }
  
  return sizes[props.size]
})
</script>

<style scoped>
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 200px;
}

.spinner-border {
  color: #2c3e33 !important;
}

.text-muted {
  font-size: 0.95rem;
  margin: 0;
}
</style>