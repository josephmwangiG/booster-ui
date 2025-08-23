<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">🚚 Suppliers</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Suppliers</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Suppliers Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Suppliers</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ suppliers?.length?.toLocaleString() || 0 }}
            </span>
            suppliers
          </span>
        </div>
        <button
          @click="activeModal = true"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
        >
          ➕ Add Supplier
        </button>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table ref="dataTableRef" class="w-full border-collapse text-sm">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Name</th>
              <th class="t-th text-left">Email</th>
              <th class="t-th text-left">Phone</th>
              <th class="t-th text-left">Address</th>
              <th class="t-th text-center">Status</th>
              <th class="t-th text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in suppliers"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-medium text-gray-700">{{ item.name || 'Unknown' }}</td>
              <td class="t-td">{{ item.email || 'No email' }}</td>
              <td class="t-td">{{ item.phone || 'No phone' }}</td>
              <td class="t-td">{{ item.address || 'No address' }}</td>
              <td class="t-td text-center">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full shadow-sm',
                    item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ item.status || 'inactive' }}
                </span>
              </td>
              <td class="t-td text-center">
                <div class="flex justify-center space-x-2">
                  <button @click="editSupplier(item)" class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                    Edit
                  </button>
                  <button @click="deleteSupplier(item.id)" class="bg-red-100 text-red-700 hover:bg-red-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                    Delete
                  </button>
                </div>
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
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const dataTableRef = ref(null);

DataTable.use(DataTablesCore);
const loading = ref(true);
const activeModal = ref(false);

// Mock suppliers data for now
const suppliers = ref([
  {
    id: 1,
    name: 'ABC Supplies',
    email: 'info@abcsupplies.com',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    status: 'active'
  },
  {
    id: 2,
    name: 'XYZ Corporation',
    email: 'contact@xyzcorp.com',
    phone: '+0987654321',
    address: '456 Oak Ave, Town, State',
    status: 'active'
  }
]);

const editSupplier = (supplier: any) => {
  console.log('Edit supplier:', supplier);
  // TODO: Implement edit functionality
};

const deleteSupplier = (id: number) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    suppliers.value = suppliers.value.filter(s => s.id !== id);
    console.log('Deleted supplier:', id);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    // TODO: Fetch suppliers from API
    // await suppliersStore.getSuppliers();
  } catch (error) {
    console.error('Failed to fetch suppliers:', error);
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

