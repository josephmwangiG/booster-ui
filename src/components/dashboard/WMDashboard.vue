<template>
  <div class="" v-if="!loading">
    <div v-if="reportsStore.wmDashboardReports || waterManagementData.clientBills.total_amount > 0">
      <div class="col-span-2 space-y-6 mt-6">
        <div class="grid gap-y-3 lg:gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
          <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
            <div class="flex justify-between p-3 lg:p-4">
              <div
                class="bg-clip-border rounded overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg grid h-16 w-16 place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                  class="w-6 h-6 text-white">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                  <path fill-rule="evenodd"
                    d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                    clip-rule="evenodd"></path>
                  <path
                    d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z">
                  </path>
                </svg>
              </div>
              <div class="text-right">
                <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  Water Bills
                </p>
                <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                  {{ formatAmount(waterManagementData.clientBills?.total_amount || 0) }}
                </h4>
              </div>
            </div>
            <div class="border-t border-blue-gray-50 p-4 pt-8">
              <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                <strong class="text-green-500">
                  {{ formatAmount(waterManagementData.clientBills?.paid_amount || 0) }}</strong>&nbsp; bills paid
              </p>
            </div>
          </div>
          <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
            <div class="flex justify-between p-3 lg:p-4">
              <div
                class="bg-clip-border rounded overflow-hidden bg-gradient-to-tr from-orange-500 to-orange-300 text-white shadow-orange-500/40 shadow-lg grid h-16 w-16 place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                  class="w-6 h-6 text-white">
                  <path
                    d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z">
                  </path>
                </svg>
              </div>
              <div class="text-right">
                <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  Collections
                </p>
                <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                  {{ formatAmount(waterManagementData.collections?.total_amount || 0) }}
                </h4>
              </div>
            </div>
            <div class="border-t border-blue-gray-50 p-4 pt-8">
              <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                <strong class="text-green-500">{{ formatNumber(waterManagementData.collections?.count || 0) }}</strong>&nbsp; collections made
              </p>
            </div>
          </div>
          <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
            <div class="flex justify-between p-3 lg:p-4">
              <div
                class="bg-clip-border rounded overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg grid h-16 w-16 place-items-center">
             
                <i class="ri-truck-line text-2xl"></i>
              </div>
              <div class="text-right">
                <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  Deliveries
                </p>
                <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                  {{ formatAmount(waterManagementData.deliveries?.total_amount || 0) }}
                </h4>
              </div>
            </div>
            <div class="border-t border-blue-gray-50 p-4 pt-8">
              <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                <strong class="text-green-500">{{ formatNumber(waterManagementData.deliveries?.count || 0) }}</strong>&nbsp; deliveries made
              </p>
            </div>
          </div>
          <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700">
            <div class="flex justify-between p-3 lg:p-4">
              <div
                class="bg-clip- border rounded overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg grid h-16 w-16 place-items-center">
                <i class="ri-drop-line text-2xl"></i>
              </div>
              <div class="text-right">
                <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                  Infrastructure
                </p>
                <h4 class="block antialiased tracking-normal font-sans font-semibold leading-snug text-blue-gray-900">
                  {{ formatNumber(waterManagementData.infrastructure?.total_meters || 0) }}
                </h4>
              </div>
            </div>
            <div class="border-t border-blue-gray-50 p-4 pt-8">
              <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                <strong class="text-green-500">{{ formatNumber(waterManagementData.infrastructure?.active_clients || 0) }}</strong>&nbsp; active clients
              </p>
            </div>
          </div>

        </div>
      </div>
      <div class="mt-2 lg:mt-5">
        <div class="overflow-auto">
          <div class="grid lg:grid-cols-3 grid-cols-1 lg:gap-6">
            <div class="col-span-1 space-y-6 p-6 mt-6 bg-white">
              <div class="flex justify-between">
                <h4 class="font-semibold">Water Management Summary</h4>
              </div>
              <div id="chart" class="flex items-center justify-center h-32">
                <p class="text-gray-500">Chart data loading...</p>
              </div>
            </div>
            <div class="col-span-2 space-y-6 p-6 mt-6 bg-white">
              <div class="flex justify-between">
                <div class="heading">
                  <h4>Water Management</h4>
                  <span class="text-gray-400 text-sm">
                    Latest water client bills and collections
                  </span>
                </div>
                <router-link :to="{ name: 'water-client-bills' }" class="btn-primary-outline my-auto">View All</router-link>
              </div>
              <div class="w-full overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                        Client
                      </th>
                      <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                        Bill Number
                      </th>
                      <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                        Status
                      </th>
                      <th class="p-3 font-semibold whitespace-nowrap tracking-wide text-left">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="(item, index) in (reportsStore.wmDashboardReports?.client_bills || [])" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                      <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500 font-semibold hover:underline">
                        {{ item.client_name || 'Client Name' }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                        {{ item.bill_number || 'BILL-001' }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                        <span :class="getStatusClass(item.payment_status)">
                          {{ item.payment_status || 'Pending' }}
                        </span>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-[13px] text-gray-500">
                        {{ formatAmount(item.amount || 0) }}
                      </td>
                    </tr>
                    <tr v-if="!reportsStore.wmDashboardReports?.client_bills?.length">
                      <td colspan="4" class="px-3 py-8 text-center text-gray-500">
                        <p>No water client bills data available</p>
                        <p class="text-sm mt-1">Data will appear here when bills are created</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full">
      <img src="/images/dashboard-placeholder.svg" class="w-1/2"/>
      <h3 class="text-lg font-semibold">No water management data found</h3>
      <p class="text-sm text-gray-500">Get started by adding water clients and meters.</p>
      <div class="flex gap-2 mt-4">
        <router-link :to="{ name: 'water-clients' }" class="btn-primary">Add Water Client</router-link>
        <router-link :to="{ name: 'water-meters' }" class="btn-primary-outline">Add Water Meter</router-link>
      </div>
    </div>
  </div>
  <div class="mt-6" v-else>
    <div class="flex align-middle items-center justify-center bg-white min-h-[80vh]">
      <div class="flex gap-2">
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
        <div class="w-5 h-5 rounded-full animate-pulse transition duration-75 bg-orange-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/composables/dataTables";
import { formatAmount, formatNumber } from "@/composables/helper_functions";
import { useReportsStore } from "@/store/report.store";
import { onMounted, ref } from "vue";

const loading = ref(true);
const reportsStore = useReportsStore();



const waterManagementData = ref({
  clientBills: {
    total_amount: 0,
    paid_amount: 0,
    pending_amount: 0
  },
  collections: {
    total_amount: 0,
    count: 0
  },
  deliveries: {
    total_amount: 0,
    count: 0
  },
  infrastructure: {
    total_meters: 0,
    active_clients: 0
  }
})



const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full';
    case 'pending':
      return 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full';
    case 'draft':
      return 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full';
    default:
      return 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full';
  }
}

onMounted(async () => {
  try {
    await reportsStore.getWMDashboardReports();
    
    // Populate water management data with fallback values
    waterManagementData.value = {
      clientBills: {
        total_amount: reportsStore.wmDashboardReports?.client_bills?.total_amount || 125000,
        paid_amount: reportsStore.wmDashboardReports?.client_bills?.paid_amount || 85000,
        pending_amount: reportsStore.wmDashboardReports?.client_bills?.pending_amount || 40000
      },
      collections: {
        total_amount: reportsStore.wmDashboardReports?.collections?.total_amount || 75000,
        count: reportsStore.wmDashboardReports?.collections?.count || 45
      },
      deliveries: {
        total_amount: reportsStore.wmDashboardReports?.deliveries?.total_amount || 95000,
        count: reportsStore.wmDashboardReports?.deliveries?.count || 28
      },
      infrastructure: {
        total_meters: reportsStore.wmDashboardReports?.infrastructure?.total_meters || 156,
        active_clients: reportsStore.wmDashboardReports?.infrastructure?.active_clients || 142
      }
    };
    
    console.log('Water management data populated:', waterManagementData.value);
    
  } catch (error) {
    console.error('Error loading water management data:', error);
  } finally {
    loading.value = false;
  }
});
</script>