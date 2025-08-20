<template>
  <div v-if="!loading">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Bills Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <i class="ri-file-list-line text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Bills</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ formatAmount(reportsStore.propertiesDashboardReports?.tenant_bills_payment.total_amount) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Total Balance Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <i class="ri-scales-line text-orange-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Balance</p>
            <p class="text-2xl font-bold text-gray-900">
              KES {{ formatAmount(reportsStore.propertiesDashboardReports.tenant_bills_payment?.pending_amount) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tenants Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-pink-100 rounded-lg">
            <i class="ri-user-line text-pink-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Tenants</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ formatNumber(reportsStore.propertiesDashboardReports.tenants) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Properties Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <i class="ri-building-line text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Properties</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ formatNumber(reportsStore.propertiesDashboardReports.properties) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Collections Summary Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Collections Summary</h3>
        <div v-if="series.length > 0">
          <apexchart type="donut" :options="options" :series="series" height="300"></apexchart>
        </div>
        <div v-else class="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>

      <!-- Pending Bills Table -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Pending Bills</h3>
            <p class="text-sm text-gray-600">Overview of unpaid bills</p>
          </div>
          <router-link 
            :to="{ name: 'tenant-bills' }" 
            class="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View All
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Bill #</th>
                <th scope="col" class="px-6 py-3">Tenant</th>
                <th scope="col" class="px-6 py-3">Period</th>
                <th scope="col" class="px-6 py-3">Amount</th>
                <th scope="col" class="px-6 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in reportsStore.propertiesDashboardReports.bills" 
                :key="index" 
                class="bg-white border-b"
              >
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {{ item.bill_number }}
                </td>
                <td class="px-6 py-4">{{ item.tenant_name }}</td>
                <td class="px-6 py-4">{{ item.period }}</td>
                <td class="px-6 py-4">{{ formatAmount(item.amount) }}</td>
                <td class="px-6 py-4 text-right">{{ formatAmount(item.amount - item.amount_paid) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="flex items-center justify-center h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
</template>

<script setup lang="ts">
import { formatAmount, formatNumber } from "@/composables/helper_functions";
import { useReportsStore } from "@/store/report.store";
import { onMounted, ref } from "vue";

const loading = ref(true);
const reportsStore = useReportsStore();

const series = ref<number[]>([]);
const options = ref({});

onMounted(async () => {
  try {
    await reportsStore.getPropertiesDashboardReports();
    
    const reportData = reportsStore.propertiesDashboardReports;
    if (reportData) {
      series.value = [
        Number(reportData.tenant_rent_utility_bills?.total_rent) || 0,
        Number(reportData.tenant_rent_utility_bills?.total_utilities) || 0,
      ];

      options.value = {
        chart: {
          type: "donut",
          height: 300,
        },
        labels: [
          `Rent: ${formatAmount(reportData.tenant_rent_utility_bills?.total_rent)}`,
          `Utilities: ${formatAmount(reportData.tenant_rent_utility_bills?.total_utilities)}`,
        ],
        colors: ['#3B82F6', '#F59E0B'],
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: 'bottom'
        },
      };
    }
  } catch (error) {
    console.error("Failed to load properties dashboard reports:", error);
    // Optionally, set an error state here
  } finally {
    loading.value = false;
  }
});
</script>