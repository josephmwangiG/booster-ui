<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">🏢 Organizations</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Organizations</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Organizations Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Organizations</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ store?.organizations?.length?.toLocaleString() || 0 }}
            </span>
            organizations
          </span>
        </div>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table ref="dataTableRef" class="w-full border-collapse text-sm">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Name</th>
              <th class="t-th text-left">Email</th>
              <th class="t-th text-left">Phone Number</th>
              <th class="t-th text-left">Industry</th>
              <th class="t-th text-center">Login</th>
              <th class="t-th text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in (store.organizations as any)"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-medium text-gray-700">{{ item.name }}</td>
              <td class="t-td">{{ item.email }}</td>
              <td class="t-td">{{ item.phone }}</td>
              <td class="t-td">{{ item?.industry }}</td>
              <td class="t-td text-center">
                <span
                  :class="item.can_login
                    ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold'
                    : 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold'"
                >
                  {{ item.can_login ? "Yes" : "No" }}
                </span>
              </td>
              <td class="t-td text-center">
                <router-link
                  :to="{
                    name: 'admin-organization',
                    params: { id: item.id },
                  }"
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
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { initDataTable } from "@/composables/dataTables";
import { useAdmUsersStore } from "@/store/admin/users.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const dataTableRef = ref(null);

DataTable.use(DataTablesCore);
const loading = ref(true);
const store = useAdmUsersStore();

onMounted(async () => {
  loading.value = true;
  try {
    await store.getOrganizations();
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
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
