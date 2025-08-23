<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">Property Details</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Properties ></span>
          <span class="text-blue-600 font-medium"> Property Details</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Property Details Card -->
    <div v-else>
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6 rounded-2xl shadow-lg animate-slide-up">
        <h4 class="font-semibold text-lg text-gray-800">Property | {{ store.property?.name }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-gray-900">{{ store.property?.units.length.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Total Units</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-green-600">{{ store.property?.units.filter((u:any) => !u.available)?.length.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Occupied</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-red-600">{{ store.property?.units.filter((u:any) => u.available)?.length.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Vacant</span>
          </div>
        </div>
      </div>

      <div class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 mt-6 animate-slide-up">
        <div class="flex justify-between items-center">
          <div class="title">
            <h4 class="font-semibold text-lg text-gray-800">Units</h4>
            <span class="text-gray-500 text-sm">
              {{ store.property?.units.length }} units found
            </span>
          </div>
          <button
            @click="dialogVisible = true"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
          >
            ➕ Add Unit
          </button>
        </div>

        <hr class="my-4" />

        <!-- Table -->
        <div class="overflow-x-auto w-full">
          <table class="w-full border-collapse text-sm" ref="dataTableRef">
            <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th class="t-th text-left">Unit Code</th>
                <th class="t-th text-left">Tenant</th>
                <th class="t-th text-right">Rent</th>
                <th class="t-th text-center">Bathrooms</th>
                <th class="t-th text-center">Bedrooms</th>
                <th class="t-th text-center">Status</th>
                <th class="t-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in store?.property?.units"
                :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''"
                class="hover:bg-blue-50/40 transition-colors duration-300"
              >
                <td class="t-td font-semibold text-gray-700">{{ item.unit_code }}</td>
                <td class="t-td">{{ item?.tenancies?.length > 0 ? item?.tenancies[0]?.tenant?.tenant_name : "-" }}</td>
                <td class="t-td text-right font-medium">KES {{ Number(item.rent).toLocaleString() }}</td>
                <td class="t-td text-center">{{ item.bathrooms }}</td>
                <td class="t-td text-center">{{ item.bedrooms }}</td>
                <td class="t-td text-center">
                  <span
                    v-if="!item.available"
                    class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-green-100 text-green-800"
                  >
                    Occupied
                  </span>
                  <span
                    v-else
                    class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-red-100 text-red-800"
                  >
                    Vacant
                  </span>
                </td>
                <td class="t-td text-center">
                  <button class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
            Add Unit
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <UnitFormModal
        @close-modal="dialogVisible = false"
        :form="formData"
      ></UnitFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { initDataTable } from "@/composables/dataTables";
import { useRouter } from "vue-router";
import { usePropertiesStore } from "@/store/properties.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const UnitFormModal = defineAsyncComponent(
  () => import("@/components/modules/properties/UnitFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const router = useRouter();
const store = usePropertiesStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const formData = {
  property_id: (router.currentRoute.value.params.id as string) || "",
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getProperty((router.currentRoute.value.params.id as string) || "");
  } catch (error) {
    console.error("Failed to fetch property details:", error);
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
