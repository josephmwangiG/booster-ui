<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
      <p class="text-gray-600">Manage SMS and email notifications</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.total || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.pending || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Sent</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.sent || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Failed</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.failed || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status" @change="loadNotifications" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.notification_type" @change="loadNotifications" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">All Types</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
          <input 
            v-model="filters.recipient" 
            @input="debounceSearch"
            type="text" 
            placeholder="Search recipient..."
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
        </div>

        <div class="flex items-end">
          <button 
            @click="clearFilters"
            class="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="bg-white p-4 rounded-lg shadow mb-6" v-if="selectedNotifications.length > 0">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">{{ selectedNotifications.length }} notification(s) selected</span>
        <div class="flex space-x-2">
          <button 
            @click="bulkRetry"
            :disabled="!canBulkRetry"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Retry Selected
          </button>
          <button 
            @click="clearSelection"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input 
                  type="checkbox" 
                  :checked="allSelected"
                  @change="toggleAllSelection"
                  class="rounded border-gray-300"
                >
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="notification in notifications" :key="notification.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <input 
                  type="checkbox" 
                  :value="notification.id"
                  v-model="selectedNotifications"
                  class="rounded border-gray-300"
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="notification.notification_type === 'sms' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                  {{ notification.notification_type.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ notification.recipient }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <div class="max-w-xs truncate">
                  {{ notification.subject || 'No subject' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(notification.status)">
                  {{ notification.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(notification.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="viewNotification(notification)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button 
                    @click="openNotification(notification)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Open
                  </button>
                  <button 
                    v-if="notification.status === 'failed' && notification.retry_count < 3"
                    @click="retryNotification(notification.id)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Retry
                  </button>
                  <button 
                    v-if="['failed', 'delivered'].includes(notification.status)"
                    @click="deleteNotification(notification.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" v-if="pagination">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="loadNotifications(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="loadNotifications(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ pagination.from }}</span> to <span class="font-medium">{{ pagination.to }}</span> of <span class="font-medium">{{ pagination.total }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="loadNotifications(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                v-for="page in getPageNumbers()" 
                :key="page"
                @click="loadNotifications(page)"
                :class="page === pagination.current_page ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {{ page }}
              </button>
              <button 
                @click="loadNotifications(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Details Modal -->
    <Modal v-if="showDetailsModal" @close="showDetailsModal = false">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Details</h3>
        
        <div class="space-y-4" v-if="selectedNotification">
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedNotification.notification_type.toUpperCase() }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Recipient</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedNotification.recipient }}</p>
          </div>
          
          <div v-if="selectedNotification.subject">
            <label class="block text-sm font-medium text-gray-700">Subject</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedNotification.subject }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Body</label>
            <div class="mt-1 p-3 bg-gray-50 rounded-md">
              <pre class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedNotification.body }}</pre>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <span class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(selectedNotification.status)">
              {{ selectedNotification.status }}
            </span>
          </div>
          
          <div v-if="selectedNotification.description">
            <label class="block text-sm font-medium text-gray-700">Description/Error</label>
            <p class="mt-1 text-sm text-red-600">{{ selectedNotification.description }}</p>
          </div>
          
          <div v-if="selectedNotification.metadata">
            <label class="block text-sm font-medium text-gray-700">Metadata</label>
            <div class="mt-1 p-3 bg-gray-50 rounded-md">
              <pre class="text-sm text-gray-900">{{ JSON.stringify(selectedNotification.metadata, null, 2) }}</pre>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Created</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedNotification.created_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Retry Count</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedNotification.retry_count || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            v-if="selectedNotification && selectedNotification.status === 'failed' && selectedNotification.retry_count < 3"
            @click="retryNotification(selectedNotification.id); showDetailsModal = false"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
          <button 
            @click="showDetailsModal = false"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import Modal from '@/components/shared/Modal.vue'

const { get, post, del } = useApi()
const router = useRouter()

// Reactive data
const notifications = ref([])
const stats = ref({})
const pagination = ref(null)
const loading = ref(false)
const selectedNotifications = ref([])
const showDetailsModal = ref(false)
const selectedNotification = ref(null)

// Filters
const filters = ref({
  status: '',
  notification_type: '',
  recipient: '',
  date_from: '',
  date_to: '',
  per_page: 15
})

// Computed properties
const allSelected = computed(() => {
  return notifications.value.length > 0 && selectedNotifications.value.length === notifications.value.length
})

const canBulkRetry = computed(() => {
  return selectedNotifications.value.some(id => {
    const notification = notifications.value.find(n => n.id === id)
    return notification && notification.status === 'failed' && notification.retry_count < 3
  })
})

// Methods
const loadNotifications = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      ...filters.value,
      page
    }
    
    const response = await get('/notifications', params)
    notifications.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Failed to load notifications:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await get('/notifications/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const retryNotification = async (id) => {
  try {
    await post(`/notifications/${id}/retry`)
    await loadNotifications()
    await loadStats()
  } catch (error) {
    console.error('Failed to retry notification:', error)
  }
}

const bulkRetry = async () => {
  try {
    await post('/notifications/bulk-retry', {
      notification_ids: selectedNotifications.value
    })
    selectedNotifications.value = []
    await loadNotifications()
    await loadStats()
  } catch (error) {
    console.error('Failed to bulk retry notifications:', error)
  }
}

const deleteNotification = async (id) => {
  if (confirm('Are you sure you want to delete this notification?')) {
    try {
      await del(`/notifications/${id}`)
      await loadNotifications()
      await loadStats()
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }
}

const viewNotification = (notification) => {
  selectedNotification.value = notification
  showDetailsModal.value = true
}

const openNotification = (notification) => {
  router.push({ name: 'notification-details', params: { id: notification.id } })
}

const clearFilters = () => {
  filters.value = {
    status: '',
    notification_type: '',
    recipient: '',
    date_from: '',
    date_to: '',
    per_page: 15
  }
  loadNotifications()
}

const clearSelection = () => {
  selectedNotifications.value = []
}

const toggleAllSelection = () => {
  if (allSelected.value) {
    selectedNotifications.value = []
  } else {
    selectedNotifications.value = notifications.value.map(n => n.id)
  }
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    delivered: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const getPageNumbers = () => {
  if (!pagination.value) return []
  
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
}

// Debounced search
let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadNotifications()
  }, 500)
}

// Lifecycle
onMounted(() => {
  loadNotifications()
  loadStats()
})
</script>

