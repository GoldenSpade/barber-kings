<template>
  <div class="bookings-table">
    <!-- Filters and Controls -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 mb-3">
            <label class="form-label fw-bold">Filter by Location:</label>
            <select v-model="locationFilter" class="form-select">
              <option value="">All Locations</option>
              <option value="downtown">Downtown</option>
              <option value="podil">Podil</option>
            </select>
          </div>
          <div class="col-sm-6 mb-3">
            <label class="form-label fw-bold">Filter by Status:</label>
            <select v-model="statusFilter" class="form-select">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 mb-3">
            <label class="form-label fw-bold">Date From:</label>
            <input type="date" v-model="dateFromFilter" class="form-control">
          </div>
          <div class="col-sm-6 mb-3">
            <label class="form-label fw-bold">Date To:</label>
            <input type="date" v-model="dateToFilter" class="form-control">
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Search by name or phone..."
            v-model="searchQuery"
          />
        </div>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-outline-secondary" @click="resetFilters">
          <i class="bi bi-arrow-clockwise me-2"></i>Reset Filters
        </button>
        <button class="btn btn-success ms-2" @click="refreshData">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="bookingStore.isLoadingBookedSlots" class="text-center py-5">
      <Loader size="large" message="Loading bookings..." />
    </div>

    <!-- Table -->
    <div v-else class="table-responsive">
      <div v-if="filteredBookings.length === 0" class="text-center py-5">
        <i class="bi bi-calendar-x display-1 text-muted"></i>
        <h5 class="mt-3 text-muted">No bookings found</h5>
        <p class="text-muted">Try adjusting your filters or add some bookings.</p>
      </div>

      <table v-else class="table table-hover">
        <thead class="table-light">
          <tr>
            <th @click="sortBy('timestamp')" class="sortable">
              <i class="bi bi-clock me-1"></i>Timestamp
              <i :class="getSortIcon('timestamp')"></i>
            </th>
            <th @click="sortBy('name')" class="sortable">
              <i class="bi bi-person me-1"></i>Name
              <i :class="getSortIcon('name')"></i>
            </th>
            <th @click="sortBy('phone')" class="sortable">
              <i class="bi bi-telephone me-1"></i>Phone
              <i :class="getSortIcon('phone')"></i>
            </th>
            <th @click="sortBy('location')" class="sortable">
              <i class="bi bi-geo-alt me-1"></i>Location
              <i :class="getSortIcon('location')"></i>
            </th>
            <th @click="sortBy('date')" class="sortable">
              <i class="bi bi-calendar me-1"></i>Date
              <i :class="getSortIcon('date')"></i>
            </th>
            <th @click="sortBy('time')" class="sortable">
              <i class="bi bi-clock me-1"></i>Time
              <i :class="getSortIcon('time')"></i>
            </th>
            <th @click="sortBy('status')" class="sortable">
              <i class="bi bi-flag me-1"></i>Status
              <i :class="getSortIcon('status')"></i>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in paginatedBookings" :key="booking.id || `${booking.date}-${booking.time}-${booking.name}`">
            <td class="text-muted small">
              {{ formatTimestamp(booking.timestamp) }}
            </td>
            <td class="fw-medium">{{ booking.name }}</td>
            <td>
              <a :href="`tel:${booking.phone}`" class="text-decoration-none">
                {{ booking.phone }}
              </a>
            </td>
            <td>
              <span class="badge bg-info text-capitalize">{{ booking.location }}</span>
            </td>
            <td>{{ formatDate(booking.date) }}</td>
            <td class="fw-medium">{{ booking.time }}</td>
            <td>
              <span 
                class="badge"
                :class="getStatusBadgeClass(booking.status)"
              >
                {{ booking.status || 'Pending' }}
              </span>
            </td>
            <td>
              <div class="btn-group btn-group-sm" role="group">
                <button 
                  class="btn btn-outline-primary"
                  @click="editBooking(booking)"
                  title="Edit booking"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="btn btn-outline-danger"
                  @click="deleteBooking(booking)"
                  title="Delete booking"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-4">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-muted">
            Showing {{ startItem }} to {{ endItem }} of {{ filteredBookings.length }} bookings
          </div>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage = 1" :disabled="currentPage === 1">
                First
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                Previous
              </button>
            </li>
            
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="currentPage = page">
                {{ page }}
              </button>
            </li>
            
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
                Next
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="currentPage = totalPages" :disabled="currentPage === totalPages">
                Last
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Edit Modal Placeholder -->
    <!-- This would be implemented with a modal component -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookingStore } from '@/stores/booking'
import Loader from '@/components/Loader.vue'

const bookingStore = useBookingStore()

// Filters
const locationFilter = ref('')
const statusFilter = ref('')
const dateFromFilter = ref('')
const dateToFilter = ref('')
const searchQuery = ref('')

// Sorting
const sortField = ref('timestamp')
const sortOrder = ref('desc')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filtered and sorted bookings
const filteredBookings = computed(() => {
  if (!bookingStore.bookedSlots || !Array.isArray(bookingStore.bookedSlots)) {
    return []
  }
  
  let bookings = [...bookingStore.bookedSlots]
  
  // Apply filters
  if (locationFilter.value) {
    bookings = bookings.filter(b => b.location === locationFilter.value)
  }
  
  if (statusFilter.value) {
    bookings = bookings.filter(b => (b.status || 'Pending') === statusFilter.value)
  }
  
  if (dateFromFilter.value) {
    bookings = bookings.filter(b => {
      const bookingDate = convertDateToComparable(b.date)
      const filterDate = convertDateToComparable(dateFromFilter.value, true)
      return bookingDate >= filterDate
    })
  }
  
  if (dateToFilter.value) {
    bookings = bookings.filter(b => {
      const bookingDate = convertDateToComparable(b.date)
      const filterDate = convertDateToComparable(dateToFilter.value, true)
      return bookingDate <= filterDate
    })
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    bookings = bookings.filter(b => 
      b.name.toLowerCase().includes(query) || 
      b.phone.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  bookings.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    // Handle special cases
    if (sortField.value === 'date') {
      aVal = convertDateToComparable(aVal)
      bVal = convertDateToComparable(bVal)
    }
    
    if (sortField.value === 'time') {
      aVal = convertTimeToComparable(aVal)
      bVal = convertTimeToComparable(bVal)
    }
    
    if (sortField.value === 'timestamp' && aVal && bVal) {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return bookings
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage.value))

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBookings.value.slice(start, end)
})

const startItem = computed(() => {
  return filteredBookings.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredBookings.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Helper functions
const convertDateToComparable = (dateStr, isYMD = false) => {
  if (!dateStr) return 0
  
  if (isYMD) {
    // YYYY-MM-DD format
    return new Date(dateStr).getTime()
  } else {
    // DD/MM/YYYY format
    const [day, month, year] = dateStr.split('/')
    return new Date(year, month - 1, day).getTime()
  }
}

const convertTimeToComparable = (timeStr) => {
  if (!timeStr) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [day, month, year] = dateStr.split('/')
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  try {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return timestamp
  }
}

const getStatusBadgeClass = (status) => {
  const statusClass = {
    'Pending': 'bg-warning text-dark',
    'Confirmed': 'bg-success',
    'Completed': 'bg-primary',
    'Cancelled': 'bg-danger'
  }
  return statusClass[status] || 'bg-warning text-dark'
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return 'bi bi-arrow-down-up text-muted'
  return sortOrder.value === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'
}

// Actions
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const resetFilters = () => {
  locationFilter.value = ''
  statusFilter.value = ''
  dateFromFilter.value = ''
  dateToFilter.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

const refreshData = async () => {
  await bookingStore.fetchBookedSlots(true, true) // isAdmin = true, forceRefresh = true
}

const editBooking = (booking) => {
  // This would open an edit modal
  console.log('Edit booking:', booking)
  alert('Edit functionality would be implemented here')
}

const deleteBooking = (booking) => {
  // This would delete the booking
  if (confirm(`Are you sure you want to delete booking for ${booking.name}?`)) {
    console.log('Delete booking:', booking)
    alert('Delete functionality would be implemented here')
  }
}
</script>

<style scoped>
.bookings-table {
  width: 100%;
}

.form-control:focus,
.form-select:focus {
  border-color: #2c3e33;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 51, 0.25);
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.sortable:hover {
  background-color: rgba(44, 62, 51, 0.1);
}

.table th {
  font-weight: 600;
  font-size: 0.9rem;
  border-top: none;
}

.table td {
  vertical-align: middle;
  font-size: 0.9rem;
}

.badge {
  font-size: 0.75rem;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

.pagination .page-link {
  color: #2c3e33;
  border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #2c3e33;
  border-color: #2c3e33;
}

.pagination .page-link:hover {
  color: #2c3e33;
  background-color: rgba(44, 62, 51, 0.1);
  border-color: #2c3e33;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #ced4da;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.8rem;
  }
  
  .table td, .table th {
    padding: 0.5rem 0.25rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.125rem 0.25rem;
  }
}
</style>