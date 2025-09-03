<template>
  <div class="manage-services">
    <!-- Header with Add Button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">
        <i class="bi bi-gear-fill me-2"></i>{{ $t('admin.services.title') }}
      </h5>
      <button 
        class="btn btn-success" 
        @click="showAddModal"
        :disabled="servicesStore.isLoading"
      >
        <i class="bi bi-plus-circle me-2"></i>{{ $t('admin.services.addService') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="servicesStore.isLoading" class="text-center py-5">
      <Loader size="large" :message="$t('admin.services.loading')" />
    </div>

    <!-- Error State -->
    <div v-else-if="servicesStore.error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ servicesStore.error }}
      <button class="btn btn-sm btn-outline-danger ms-2" @click="refreshServices">
        {{ $t('admin.services.retry') }}
      </button>
    </div>

    <!-- Services Table -->
    <div v-else-if="servicesStore.services.length > 0" class="table-responsive position-relative">
      <!-- Loading Overlay for table actions -->
      <div v-if="servicesStore.isSubmitting" class="table-overlay">
        <Loader size="large" :message="$t('admin.services.processing')" />
      </div>
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>{{ $t('admin.services.name') }}</th>
            <th>{{ $t('admin.services.description') }}</th>
            <th>{{ $t('admin.services.duration') }}</th>
            <th>{{ $t('admin.services.price') }}</th>
            <th>{{ $t('admin.services.category') }}</th>
            <th class="text-center">{{ $t('admin.services.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in servicesStore.activeServices" :key="service.id">
            <td class="fw-bold">{{ service.name }}</td>
            <td class="text-muted">{{ service.description || '—' }}</td>
            <td>
              <span class="badge bg-info">{{ servicesStore.formatDuration(service.duration) }}</span>
            </td>
            <td class="fw-bold text-success">{{ servicesStore.formatPrice(service.price) }}</td>
            <td>
              <span class="badge bg-secondary text-capitalize">{{ service.category }}</span>
            </td>
            <td class="text-center">
              <button 
                class="btn btn-sm btn-outline-primary me-2" 
                @click="editService(service)"
                :disabled="servicesStore.isSubmitting"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-danger" 
                @click="confirmDeleteService(service)"
                :disabled="servicesStore.isSubmitting"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="bi bi-gear display-1 text-muted"></i>
      <h5 class="mt-3 text-muted">{{ $t('admin.services.noServices') }}</h5>
      <p class="text-muted">{{ $t('admin.services.noServicesText') }}</p>
      <button class="btn btn-success" @click="showAddModal">
        <i class="bi bi-plus-circle me-2"></i>{{ $t('admin.services.addFirstService') }}
      </button>
    </div>

    <!-- Add/Edit Service Modal -->
    <div class="modal fade" id="serviceModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-gear me-2"></i>
              {{ isEditing ? $t('admin.services.editService') : $t('admin.services.addService') }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Loading Overlay -->
            <div v-if="servicesStore.isSubmitting" class="form-overlay">
              <Loader size="medium" :message="$t('admin.services.saving')" />
            </div>
            
            <form @submit.prevent="saveService">
              <div class="mb-3">
                <label class="form-label">{{ $t('admin.services.name') }} *</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.name.$error }"
                  v-model="form.name"
                  :placeholder="$t('admin.services.namePlaceholder')"
                  :disabled="servicesStore.isSubmitting"
                  @blur="v$.name.$touch"
                />
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <div v-for="error in v$.name.$errors" :key="error.$uid">
                    {{ error.$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t('admin.services.description') }}</label>
                <textarea
                  class="form-control"
                  v-model="form.description"
                  :placeholder="$t('admin.services.descriptionPlaceholder')"
                  :disabled="servicesStore.isSubmitting"
                  rows="2"
                ></textarea>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">{{ $t('admin.services.duration') }} *</label>
                    <select
                      class="form-select"
                      :class="{ 'is-invalid': v$.duration.$error }"
                      v-model="form.duration"
                      :disabled="servicesStore.isSubmitting"
                      @blur="v$.duration.$touch"
                    >
                      <option value="">{{ $t('admin.services.selectDuration') }}</option>
                      <option value="30">30 {{ $t('admin.services.minutes') }}</option>
                      <option value="60">60 {{ $t('admin.services.minutes') }}</option>
                      <option value="90">90 {{ $t('admin.services.minutes') }}</option>
                      <option value="120">120 {{ $t('admin.services.minutes') }}</option>
                    </select>
                    <div v-if="v$.duration.$error" class="invalid-feedback">
                      <div v-for="error in v$.duration.$errors" :key="error.$uid">
                        {{ error.$message }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">{{ $t('admin.services.price') }} *</label>
                    <div class="input-group">
                      <span class="input-group-text">€</span>
                      <input
                        type="number"
                        class="form-control"
                        :class="{ 'is-invalid': v$.price.$error }"
                        v-model="form.price"
                        :placeholder="$t('admin.services.pricePlaceholder')"
                        :disabled="servicesStore.isSubmitting"
                        min="0"
                        step="0.01"
                        @blur="v$.price.$touch"
                      />
                      <div v-if="v$.price.$error" class="invalid-feedback">
                        <div v-for="error in v$.price.$errors" :key="error.$uid">
                          {{ error.$message }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t('admin.services.category') }}</label>
                <select
                  class="form-select"
                  v-model="form.category"
                  :disabled="servicesStore.isSubmitting"
                >
                  <option value="haircut">{{ $t('admin.services.categories.haircut') }}</option>
                  <option value="beard">{{ $t('admin.services.categories.beard') }}</option>
                  <option value="styling">{{ $t('admin.services.categories.styling') }}</option>
                  <option value="other">{{ $t('admin.services.categories.other') }}</option>
                </select>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="closeModal"
                  :disabled="servicesStore.isSubmitting"
                >
                  {{ $t('admin.services.cancel') }}
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="servicesStore.isSubmitting || v$.$invalid"
                >
                  <span v-if="servicesStore.isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-lg me-2"></i>
                  {{ servicesStore.isSubmitting ? $t('admin.services.saving') : $t('admin.services.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, minLength } from '@vuelidate/validators'
import { useServicesStore } from '@/stores/services'
import Loader from '@/components/Loader.vue'

const { t: $t } = useI18n()
const servicesStore = useServicesStore()

// Component state
const isEditing = ref(false)
const editingServiceId = ref(null)

// Form data
const form = ref({
  name: '',
  description: '',
  duration: '',
  price: '',
  category: 'haircut'
})

// Form validation rules
const rules = computed(() => ({
  name: { 
    required: required,
    minLength: minLength(2)
  },
  duration: { 
    required: required,
    minValue: minValue(1)
  },
  price: { 
    required: required,
    minValue: minValue(0)
  }
}))

// Create vuelidate instance
const v$ = useVuelidate(rules, form)

// Actions
const refreshServices = async () => {
  servicesStore.clearError()
  await servicesStore.fetchServices(true)
}

const showAddModal = () => {
  isEditing.value = false
  editingServiceId.value = null
  resetForm()
  showModal()
}

const editService = (service) => {
  isEditing.value = true
  editingServiceId.value = service.id
  form.value = {
    name: service.name,
    description: service.description || '',
    duration: service.duration.toString(),
    price: service.price.toString(),
    category: service.category
  }
  v$.value.$reset()
  showModal()
}

const saveService = async () => {
  // Validate form
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }

  try {
    const serviceData = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      duration: parseInt(form.value.duration),
      price: parseFloat(form.value.price),
      category: form.value.category
    }

    if (isEditing.value && editingServiceId.value) {
      await servicesStore.updateService(editingServiceId.value, serviceData)
    } else {
      await servicesStore.addService(serviceData)
    }

    closeModal()
    // Refresh services list
    await refreshServices()
  } catch (error) {
    console.error('Error saving service:', error)
  }
}

const confirmDeleteService = async (service) => {
  const confirmed = confirm(
    $t('admin.services.confirmDelete', { name: service.name })
  )
  
  if (confirmed) {
    try {
      await servicesStore.deleteService(service.id)
      await refreshServices()
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    duration: '',
    price: '',
    category: 'haircut'
  }
  v$.value.$reset()
}

const showModal = () => {
  const modalElement = document.getElementById('serviceModal')
  if (modalElement) {
    // Check if Bootstrap is available
    if (window.bootstrap && window.bootstrap.Modal) {
      const modal = new window.bootstrap.Modal(modalElement)
      modal.show()
    } else {
      // Fallback: show modal manually
      modalElement.style.display = 'block'
      modalElement.classList.add('show')
      modalElement.setAttribute('aria-modal', 'true')
      modalElement.setAttribute('role', 'dialog')
      modalElement.removeAttribute('aria-hidden')
      
      // Add backdrop
      const backdrop = document.createElement('div')
      backdrop.className = 'modal-backdrop fade show'
      backdrop.id = 'service-modal-backdrop'
      backdrop.addEventListener('click', closeModal)
      document.body.appendChild(backdrop)
      
      // Prevent body scrolling
      document.body.classList.add('modal-open')
    }
  }
}

const closeModal = () => {
  const modalElement = document.getElementById('serviceModal')
  if (modalElement) {
    // Check if Bootstrap modal instance exists
    if (window.bootstrap && window.bootstrap.Modal) {
      const modal = window.bootstrap.Modal.getInstance(modalElement)
      if (modal) {
        modal.hide()
        resetForm()
        return
      }
    }
    
    // Fallback: hide modal manually
    modalElement.style.display = 'none'
    modalElement.classList.remove('show')
    modalElement.setAttribute('aria-hidden', 'true')
    modalElement.removeAttribute('aria-modal')
    modalElement.removeAttribute('role')
    
    // Remove backdrop
    const backdrop = document.getElementById('service-modal-backdrop')
    if (backdrop) {
      backdrop.remove()
    }
    
    // Restore body scrolling
    document.body.classList.remove('modal-open')
  }
  resetForm()
}

// Lifecycle
onMounted(async () => {
  await refreshServices()
})
</script>

<style scoped>
.manage-services {
  min-height: 400px;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.badge {
  font-size: 0.75rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
}

.form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.table-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  min-height: 200px;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-sm {
    padding: 0.125rem 0.25rem;
    font-size: 0.75rem;
  }
}
</style>