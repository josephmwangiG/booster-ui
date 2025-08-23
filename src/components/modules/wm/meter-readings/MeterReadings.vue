<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">Meter Readings</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Meter Readings</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Meter Readings Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Meter Readings</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ store.meterReadings?.length?.toLocaleString() || 0 }}
            </span>
            readings
          </span>
        </div>
        <button
          @click="addItem"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
        >
          ➕ Add Reading
        </button>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table class="w-full border-collapse text-sm" ref="dataTableRef">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Meter Code Number</th>
              <th class="t-th text-left">Date</th>
              <th class="t-th text-right">Previous Reading</th>
              <th class="t-th text-right">Current Reading</th>
              <th class="t-th text-right">Consumption</th>
              <th class="t-th text-right">Collections</th>
              <th class="t-th text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in store.meterReadings"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-semibold text-gray-700">{{ item.code_number }}</td>
              <td class="t-td">{{ formatDate(item.created_at, true) }}</td>
              <td class="t-td text-right font-medium">{{ item.previous_meter_reading?.toLocaleString() }}</td>
              <td class="t-td text-right font-medium">{{ item.current_meter_reading?.toLocaleString() }}</td>
              <td class="t-td text-right font-medium">
                {{ (item.current_meter_reading - item.previous_meter_reading)?.toLocaleString() }} Units
              </td>
              <td class="t-td text-right font-medium">{{ formatAmount(item.collections_sum_amount) }}</td>
              <td class="t-td text-center">
                <button @click="editItem(item)" class="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-3 py-1 rounded-lg shadow-sm transition duration-300">
                  Edit
                </button>
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
      :key="dialogVisible"
    >
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action == "create" ? "Add" : "Edit" }} Meter Reading
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <MeterReadingFormModal
        @close-modal="dialogVisible = false"
        :form="formData"
        :action="action"
      ></MeterReadingFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { useWaterMetersStore } from "@/store/water-meters.store";
import { formatAmount } from "@/composables/helper_functions";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const MeterReadingFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/meter-readings/MeterReadingFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const formData = ref({});
const action = ref("create");
const store = useWaterMetersStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const addItem = () => {
  action.value = "create";
  formData.value = {};
  dialogVisible.value = true;
};

const editItem = (item: any) => {
  action.value = "edit";
  formData.value = item;
  dialogVisible.value = true;
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getMeterReadings();
  } catch (error) {
    console.error("Failed to fetch meter readings:", error);
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
