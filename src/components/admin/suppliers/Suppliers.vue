<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Suppliers</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Suppliers
        </span>
      </div>
    </div>
    <div class="mt-5">
      <div class="shadow-md rounded py-5 px-3 bg-white">
        <div class="justify-between space-x-2 items-center flex">
          <div class="title">
            <h4 class="font-semibold">Suppliers</h4>
            <span class="text-gray-400 text-sm">
              You have {{ suppliers?.length?.toLocaleString() || 0 }} suppliers
            </span>
          </div>
          <button @click="activeModal = true" class="bg-primary-700 rounded text-white text-sm py-2 px-3">
            Add Supplier
          </button>
        </div>
        <hr class="my-3" />
        <div class="overflow-x-auto w-full">
          <table ref="dataTableRef" class="w-full d-table">
            <thead class="t-head">
              <tr>
                <th class="t-th">Name</th>
                <th class="t-th">Email</th>
                <th class="t-th">Phone</th>
                <th class="t-th">Address</th>
                <th class="t-th">Status</th>
                <th class="w-32 t-th">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in suppliers" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td">
                  {{ item.name || 'Unknown' }}
                </td>
                <td class="t-td">
                  {{ item.email || 'No email' }}
                </td>
                <td class="t-td">
                  {{ item.phone || 'No phone' }}
                </td>
                <td class="t-td">
                  {{ item.address || 'No address' }}
                </td>
                <td class="t-td">
                  <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
                    {{ item.status || 'inactive' }}
                  </span>
                </td>
                <td class="t-td">
                  <button @click="editSupplier(item)" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button @click="deleteSupplier(item.id)" class="text-red-600 hover:text-red-800">Delete</button>
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
import { onMounted, ref } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { initDataTable } from "@/composables/dataTables";

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
  }
  initDataTable(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>

