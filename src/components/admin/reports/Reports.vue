<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Reports & Analytics</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Reports
        </span>
      </div>
    </div>
    
    <div class="mt-5">
      <!-- Dashboard Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.total_users || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.total_orders || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Sales</p>
              <p class="text-2xl font-semibold text-gray-900">${{ dashboardData.total_sales?.toFixed(2) || '0.00' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 text-orange-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Stores</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.total_stores || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Additional Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Organizations</h3>
            <span class="text-2xl font-semibold text-blue-600">{{ dashboardData.total_organizations || 0 }}</span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Active Organizations</span>
              <span class="font-medium">{{ dashboardData.total_organizations || 0 }}</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Orders Overview</h3>
            <span class="text-2xl font-semibold text-green-600">{{ dashboardData.closed_orders || 0 }}</span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Closed Orders</span>
              <span class="font-medium">{{ dashboardData.closed_orders || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Total Orders</span>
              <span class="font-medium">{{ dashboardData.total_orders || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Analytics Overview</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading reports data...</p>
          </div>
          <div v-else-if="error" class="text-center py-8">
            <div class="text-red-600 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <p class="text-gray-600 mb-2">Failed to load reports data</p>
            <button @click="fetchReports" class="text-primary-600 hover:text-primary-800 underline">
              Try again
            </button>
          </div>
          <div v-else class="text-center py-8">
            <div class="text-gray-600 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <p class="text-gray-600">Charts and detailed analytics will be displayed here</p>
            <p class="text-sm text-gray-500 mt-2">Data loaded successfully</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useReportsStore } from "@/store/report.store";

const loading = ref(true);
const error = ref(false);
const reportStore = useReportsStore();

const dashboardData = computed(() => reportStore.dashboardReports);

const fetchReports = async () => {
  loading.value = true;
  error.value = false;
  try {
    await reportStore.getAdminDashboardReports();
  } catch (err) {
    console.error('Failed to fetch reports data:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReports();
});
</script>

<style scoped>
.content {
  padding: 1.5rem;
}

.top-section {
  margin-bottom: 1.5rem;
}

.bread-crumb {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bread-crumb h2 {
  font-size: 1.875rem;
  line-height: 2.25rem;
  color: #111827;
}

.bread-crumb span {
  color: #6b7280;
}

.text-primary-600 {
  color: #2563eb;
}

.text-primary-700 {
  color: #1d4ed8;
}

.text-primary-800 {
  color: #1e40af;
}

.hover\:text-primary-800:hover {
  color: #1e40af;
}
</style>
