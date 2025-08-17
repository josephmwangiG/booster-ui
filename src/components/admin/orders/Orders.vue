<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Orders</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Orders
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="shadow-md rounded py-5 px-3 bg-white">
        <div class="justify-between space-x-2 items-center flex">
          <div class="title">
            <h4 class="font-semibold">Orders</h4>
            <span class="text-gray-400 text-sm">
              You have {{ orders?.length?.toLocaleString() || 0 }} orders
            </span>
          </div>
        </div>
        <hr class="my-3" />
        <div class="overflow-x-auto w-full">
          <table ref="dataTableRef" class="w-full d-table">
            <thead class="t-head">
              <tr>
                <th class="t-th">Order ID</th>
                <th class="t-th">Customer</th>
                <th class="t-th">Total</th>
                <th class="t-th">Status</th>
                <th class="t-th">Created At</th>
                <th class="w-32 t-th">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in orders" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td">
                  #{{ item.id }}
                </td>
                <td class="t-td">
                  {{ item.customer_name || 'Unknown' }}
                </td>
                <td class="t-td">
                  ${{ item.total?.toFixed(2) || '0.00' }}
                </td>
                <td class="t-td">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusColor(item.status)
                  ]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="t-td">
                  {{ new Date(item.created_at).toLocaleDateString() }}
                </td>
                <td class="t-td">
                  <button class="text-blue-600 hover:text-blue-800 mr-2">View</button>
                  <button class="text-green-600 hover:text-green-800">Update</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { initDataTable } from "@/composables/dataTables";
import { useReportStore } from "@/store/report.store";

const dataTableRef = ref(null);

DataTable.use(DataTablesCore);
const loading = ref(true);
const reportStore = useReportStore();

const orders = computed(() => {
  // This would typically come from a dedicated orders store
  // For now, we'll use mock data or empty array
  return [];
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await reportStore.getAdminDashboard();
  } catch (error) {
    console.error('Failed to fetch orders data:', error);
  }
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
