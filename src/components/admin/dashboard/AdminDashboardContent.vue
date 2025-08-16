<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600">Overview of your system metrics and performance</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <i class="ri-error-warning-line text-red-400 mr-2"></i>
        <div>
          <h3 class="text-red-800 font-medium">Unable to load dashboard data</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
          <button 
            @click="loadDashboardData" 
            class="mt-2 text-red-800 hover:text-red-900 underline text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <i class="ri-user-line text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.total_users || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="ri-building-line text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Organizations</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.total_organizations || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <i class="ri-home-line text-yellow-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Properties</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.total_properties || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <i class="ri-file-list-line text-purple-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Bills</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.total_bills || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Overview Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div v-if="chartSeries.length > 0">
            <apexchart 
              type="donut" 
              :options="chartOptions" 
              :series="chartSeries"
              height="300"
            ></apexchart>
          </div>
          <div v-else class="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </div>

        
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link 
            :to="{ name: 'admin-users' }" 
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="ri-user-settings-line text-blue-500 mr-3 text-xl"></i>
            <span class="font-medium text-gray-900">Manage Users</span>
          </router-link>
          
          <router-link 
            :to="{ name: 'admin-organizations' }" 
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="ri-building-4-line text-green-500 mr-3 text-xl"></i>
            <span class="font-medium text-gray-900">Organizations</span>
          </router-link>
          
          <button 
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            @click="loadDashboardData"
          >
            <i class="ri-refresh-line text-purple-500 mr-3 text-xl"></i>
            <span class="font-medium text-gray-900">Refresh Data</span>
          </button>
          
          <router-link 
            :to="{ name: 'admin-profile' }" 
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="ri-settings-line text-gray-500 mr-3 text-xl"></i>
            <span class="font-medium text-gray-900">Settings</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useReportsStore } from "@/store/report.store";

const reportsStore = useReportsStore();
const loading = ref(true);
const error = ref<string | null>(null);

const dashboardData = computed(() => reportsStore.dashboardReports || {});

const chartSeries = computed(() => {
  const data = dashboardData.value;
  if (!data || typeof data !== 'object') return [];
  
  return [
    data.total_users || 0,
    data.total_organizations || 0,
    data.total_properties || 0,
    data.total_bills || 0
  ].filter(val => val > 0);
});

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: 300
  },
  labels: ['Users', 'Organizations', 'Properties', 'Bills'],
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
  dataLabels: {
    enabled: true,
    formatter: function (val: any, opts: any) {
      return chartSeries.value[opts.seriesIndex];
    }
  },
  legend: {
    position: 'bottom'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}));

const loadDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;
    await reportsStore.getAdminDashboardReports();
  } catch (err: any) {
    error.value = err.message || 'Failed to load dashboard data';
    console.error('Dashboard load error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>