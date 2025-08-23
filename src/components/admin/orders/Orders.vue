<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6">
      <div class="bread-crumb animate-fade-in">
        <h2 class="font-bold text-2xl text-gray-800">📦 Orders</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Orders</span>
        </span>
      </div>
    </div>

    <!-- Orders Card -->
    <div
      class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up"
    >
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Orders</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ orders?.length?.toLocaleString() || 0 }}
            </span>
            orders
          </span>
        </div>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table
          ref="dataTableRef"
          class="w-full border-collapse text-sm"
        >
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Order ID</th>
              <th class="t-th text-left">Customer</th>
              <th class="t-th text-right">Total</th>
              <th class="t-th text-center">Status</th>
              <th class="t-th text-left">Created At</th>
              <th class="t-th text-center w-40">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in orders"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-semibold text-gray-700">#{{ item.id }}</td>
              <td class="t-td">{{ item.customer_name || 'Unknown' }}</td>
              <td class="t-td text-right font-medium">
                {{ formatAmount(item.total) }}
              </td>
              <td class="t-td text-center">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full shadow-sm transition-all duration-300',
                    getStatusColor(item.status)
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="t-td text-gray-600">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="t-td text-center space-x-2">
                <button
                  @click="viewOrder(item)"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-300 shadow-sm"
                >
                  View
                </button>
                <button
                  @click="updateOrder(item)"
                  class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition duration-300 shadow-sm"
                >
                  Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { initDataTable } from "@/composables/dataTables";
import { useReportsStore } from "@/store/report.store";
import { formatAmount } from "@/composables/helper_functions";
import { formatDate } from "@/composables/dataTables";

const dataTableRef = ref(null);

DataTable.use(DataTablesCore);
const loading = ref(true);
const reportStore = useReportsStore();

const orders = computed(() => {
  return reportStore.dashboardReports?.orders || [];
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const viewOrder = (order: any) => {
  console.log("View order:", order);
  // Navigate to order details page
  // For now, we'll show an alert with order details
  alert(`Order #${order.id}\nCustomer: ${order.customer_name}\nTotal: ${formatAmount(order.total)}\nStatus: ${order.status}`);
};

const updateOrder = (order: any) => {
  console.log("Update order:", order);
  // For now, we'll show an alert with order details
  alert(`Update Order #${order.id}\nCustomer: ${order.customer_name}\nTotal: ${formatAmount(order.total)}\nStatus: ${order.status}\n\nThis would open an edit modal in a real implementation.`);
};

onMounted(async () => {
  loading.value = true;
  try {
    await reportStore.getAdminDashboardReports();
  } catch (error) {
    console.error("Failed to fetch orders data:", error);
  } finally {
    loading.value = false;
  }
  initDataTable(dataTableRef.value);
});
</script>

<style scoped>
/* Modern table styles */
.t-th {
  @apply px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider;
}
.t-td {
  @apply px-4 py-3 text-sm text-gray-700;
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.7s ease-out;
}
</style>
