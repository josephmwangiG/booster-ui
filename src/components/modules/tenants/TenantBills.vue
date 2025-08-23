<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">Tenant Details</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Tenants ></span>
          <span class="text-blue-600 font-medium"> Tenant Bills</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Tenant Bills Card -->
    <div v-else>
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6 rounded-2xl shadow-lg animate-slide-up">
        <h4 class="font-semibold text-lg text-gray-800">Tenant | {{ store.tenant?.tenant_name }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-gray-900">{{ store.tenant?.bills?.length.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Bills</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-green-600">KES {{ store.tenant?.bills.reduce((a: any, b: any) => Number(a) + Number(b.amount_paid), 0).toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Paid</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-red-600">KES {{ store.tenant?.bills.reduce((a: any, b: any) => Number(a) + (Number(b.amount) - Number(b.amount_paid)), 0).toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <nav class="flex space-x-8 mt-6" aria-label="Tabs">
        <router-link
          :to="{ name: 'tenancies', params: { id: store?.tenant?.id } }"
          class="tab-item"
        >
          <span>Tenancies</span>
        </router-link>
        <span class="tab-item border-gray-700 text-gray-700">
          <span>Tenant Bills</span>
        </span>
      </nav>

      <div class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 mt-0 animate-slide-up">
        <div class="flex justify-between items-center">
          <div class="title">
            <h4 class="font-semibold text-lg text-gray-800">Bills</h4>
            <span class="text-gray-500 text-sm">
              {{ store?.tenant?.bills?.length }} items found
            </span>
          </div>
        </div>

        <hr class="my-4" />

        <!-- Table -->
        <div class="overflow-x-auto w-full">
          <table class="w-full border-collapse text-sm" ref="dataTableRef">
            <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th class="t-th text-left">Bill #</th>
                <th class="t-th text-left">Period</th>
                <th class="t-th text-right">Amount</th>
                <th class="t-th text-right">Balance</th>
                <th class="t-th text-left">Due Date</th>
                <th class="t-th text-center">Status</th>
                <th class="t-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in store.tenant?.bills"
                :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''"
                class="hover:bg-blue-50/40 transition-colors duration-300"
              >
                <td class="t-td font-semibold text-gray-700">
                  <router-link
                    :to="{ name: 'tenant-bill', params: { id: item.id } }"
                    class="hover:text-blue-600"
                  >
                    {{ item.bill_number }}
                  </router-link>
                </td>
                <td class="t-td">{{ item.period }}</td>
                <td class="t-td text-right font-medium">KES {{ item.amount.toLocaleString() }}</td>
                <td class="t-td text-right font-medium">
                  KES
                  {{
                    item.payment_status == "Paid"
                      ? 0
                      : (item.amount - item.amount_paid).toLocaleString()
                  }}
                </td>
                <td class="t-td">{{ formatDate(item.due_date) }}</td>
                <td class="t-td text-center">
                  <span
                    v-if="item.payment_status == 'Paid'"
                    class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-green-100 text-green-800"
                  >
                    {{ item.payment_status }}
                  </span>
                  <span
                    v-else
                    class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-red-100 text-red-800"
                  >
                    {{ item.payment_status }}
                  </span>
                </td>
                <td class="t-td text-center">
                  <router-link
                    :to="{ name: 'tenant-bill', params: { id: item.id } }"
                    class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300"
                  >
                    View
                  </router-link>
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
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { onMounted, ref } from "vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { useRouter } from "vue-router";
import { useTenantsStore } from "@/store/tenants.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const loading = ref(true);
const router = useRouter();
const store = useTenantsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

onMounted(async () => {
  loading.value = true;
  try {
    await store.getTenant((router.currentRoute.value.params.id as string) || "");
  } catch (error) {
    console.error("Failed to fetch tenant details:", error);
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
