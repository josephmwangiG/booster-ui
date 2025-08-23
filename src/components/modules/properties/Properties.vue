<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">🏘️ Properties</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Properties</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Properties Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Properties</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ store.properties?.length?.toLocaleString() || 0 }}
            </span>
            properties
          </span>
        </div>
        <button
          @click="dialogVisible = true"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
        >
          ➕ Create Property
        </button>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table class="w-full border-collapse text-sm" ref="dataTableRef">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Property Name</th>
              <th class="t-th text-left">Type</th>
              <th class="t-th text-left">Address</th>
              <th class="t-th text-center">Units</th>
              <th class="t-th text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in store.properties"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-semibold text-gray-700">
                <router-link
                  :to="{ name: 'property', params: { id: item.id } }"
                  class="hover:text-blue-600"
                >
                  {{ item.name }}
                </router-link>
              </td>
              <td class="t-td">{{ item.type }}</td>
              <td class="t-td">{{ item.address }}</td>
              <td class="t-td text-center font-medium">
                {{ Number(item.units_count || 0).toLocaleString() }}
              </td>
              <td class="t-td text-center">
                <router-link
                  :to="{ name: 'property', params: { id: item.id } }"
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
  <teleport to="body">
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      style="min-width: 300px"
      width="40%"
    >
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Create Property
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <PropertyFormModal
        @close-modal="dialogVisible = false"
        :form="formData"
      ></PropertyFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { initDataTable } from "@/composables/dataTables";
import { usePropertiesStore } from "@/store/properties.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const PropertyFormModal = defineAsyncComponent(
  () => import("@/components/modules/properties/PropertyFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const store = usePropertiesStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const formData = {};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getProperties();
  } catch (error) {
    console.error("Failed to fetch properties:", error);
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
