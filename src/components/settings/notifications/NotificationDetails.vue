<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Notification Details</h1>
        <p class="text-gray-600">Inspect full payload, status and metadata</p>
      </div>
      <button @click="$router.back()" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
        Back
      </button>
    </div>

    <div v-if="loading" class="text-gray-600">Loading...</div>

    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else-if="notification" class="space-y-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <p class="mt-1 text-sm text-gray-900">{{ notification.notification_type?.toUpperCase() }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Recipient</label>
            <p class="mt-1 text-sm text-gray-900">{{ notification.recipient }}</p>
          </div>
          <div v-if="notification.subject">
            <label class="block text-sm font-medium text-gray-700">Subject</label>
            <p class="mt-1 text-sm text-gray-900">{{ notification.subject }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <span class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(notification.status)">
              {{ notification.status }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Created At</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(notification.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Retry Count</label>
            <p class="mt-1 text-sm text-gray-900">{{ notification.retry_count || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <label class="block text-sm font-medium text-gray-700 mb-2">Body</label>
        <div class="mt-1 p-3 bg-gray-50 rounded-md">
          <pre class="text-sm text-gray-900 whitespace-pre-wrap">{{ notification.body }}</pre>
        </div>
      </div>

      <div v-if="notification.metadata" class="bg-white p-4 rounded-lg shadow">
        <label class="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
        <div class="mt-1 p-3 bg-gray-50 rounded-md">
          <pre class="text-sm text-gray-900">{{ JSON.stringify(notification.metadata, null, 2) }}</pre>
        </div>
      </div>

      <div v-if="notification.description" class="bg-white p-4 rounded-lg shadow">
        <label class="block text-sm font-medium text-gray-700 mb-2">Description / Error</label>
        <p class="text-sm text-red-600">{{ notification.description }}</p>
      </div>

      <div class="flex space-x-2">
        <button v-if="notification.status === 'failed' && (notification.retry_count || 0) < 3"
                @click="retry"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          Retry
        </button>
        <button v-if="['failed','delivered'].includes(notification.status)"
                @click="remove"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const router = useRouter()
const { get, post, del } = useApi()

const id = route.params.id as string
const loading = ref(true)
const error = ref('')
const notification = ref<any>(null)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await get(`/notifications/${id}`)
    notification.value = res.data
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load notification'
  } finally {
    loading.value = false
  }
}

const retry = async () => {
  try {
    await post(`/notifications/${id}/retry`)
    await load()
  } catch (e) {}
}

const remove = async () => {
  if (!confirm('Delete this notification?')) return
  try {
    await del(`/notifications/${id}`)
    router.push('/settings/notifications')
  } catch (e) {}
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    delivered: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString?: string) => new Date(dateString || '').toLocaleString()

onMounted(load)
</script>


