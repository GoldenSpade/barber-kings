<template>
  <div class="login-page min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <!-- Logo -->
              <div class="text-center mb-4">
                <img
                  src="@/assets/main-logo.png"
                  alt="Barber Kings"
                  style="height: 60px"
                  class="mb-3"
                />
                <h4 class="fw-bold text-dark">{{ $t('auth.adminLogin') }}</h4>
                <p class="text-muted">{{ $t('auth.enterCredentials') }}</p>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin">
                <!-- Username Field -->
                <div class="mb-3">
                  <label class="form-label fw-medium">{{ $t('auth.username') }}</label>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    v-model="form.username"
                    :placeholder="$t('auth.usernamePlaceholder')"
                    :disabled="authStore.isLoggingIn"
                    required
                    autocomplete="username"
                  />
                </div>

                <!-- Password Field -->
                <div class="mb-4">
                  <label class="form-label fw-medium">{{ $t('auth.password') }}</label>
                  <div class="position-relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control form-control-lg"
                      v-model="form.password"
                      :placeholder="$t('auth.passwordPlaceholder')"
                      :disabled="authStore.isLoggingIn"
                      required
                      autocomplete="current-password"
                    />
                    <button
                      type="button"
                      class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2"
                      @click="togglePasswordVisibility"
                      :disabled="authStore.isLoggingIn"
                      style="text-decoration: none; border: none; background: none;"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                    </button>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="alert alert-danger mb-3" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <!-- Login Button -->
                <button
                  type="submit"
                  class="btn btn-lg w-100 fw-bold"
                  :disabled="authStore.isLoggingIn || !isFormValid"
                  style="background-color: #2c3e33; border-color: #2c3e33; color: white;"
                >
                  <span v-if="authStore.isLoggingIn" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  {{ authStore.isLoggingIn ? $t('auth.signingIn') : $t('auth.signIn') }}
                </button>
              </form>

              <!-- Back to Site Link -->
              <div class="text-center mt-4">
                <router-link to="/" class="text-decoration-none text-muted">
                  <i class="bi bi-arrow-left me-2"></i>{{ $t('auth.backToSite') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t: $t } = useI18n()
const authStore = useAuthStore()

// Form data
const form = ref({
  username: '',
  password: ''
})

// UI state
const showPassword = ref(false)
const errorMessage = ref('')

// Computed
const isFormValid = computed(() => {
  return form.value.username.trim() && form.value.password.trim()
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  // Clear previous errors
  errorMessage.value = ''
  
  // Validate form
  if (!isFormValid.value) {
    errorMessage.value = $t('auth.fillAllFields')
    return
  }
  
  try {
    // Attempt login
    await authStore.login(form.value.username.trim(), form.value.password)
    
    // Redirect to admin on success
    router.push('/admin')
    
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = error.message || $t('auth.loginFailed')
  }
}

// Clear error when user starts typing
const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

// Watch form changes to clear errors
import { watch } from 'vue'
watch(form, clearError, { deep: true })
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.form-control:focus {
  border-color: #2c3e33;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 51, 0.25);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.65;
}

/* Password toggle button */
.position-absolute .btn-link {
  padding: 0;
  margin: 0;
  height: auto;
  line-height: 1;
}

.position-absolute .btn-link:focus {
  box-shadow: none;
}

.position-absolute .btn-link i {
  font-size: 1rem;
}

/* Animation for error messages */
.alert {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 2rem !important;
  }
}
</style>