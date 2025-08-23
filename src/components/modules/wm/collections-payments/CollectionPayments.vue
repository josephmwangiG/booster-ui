<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">Collection Payments</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span>
          <span class="text-blue-600 font-medium"> Collection Payments</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Collection Payments Card -->
    <div v-else class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 animate-slide-up">
      <div class="flex justify-between items-center">
        <div class="title">
          <h4 class="font-semibold text-lg text-gray-800">All Collection Payments</h4>
          <span class="text-gray-500 text-sm">
            You have
            <span class="font-semibold text-gray-700">
              {{ store.waterCollectionsPayments?.length?.toLocaleString() || 0 }}
            </span>
            records
          </span>
        </div>
        <button
          @click="addItem"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
        >
          ➕ Add Payment
        </button>
      </div>

      <hr class="my-4" />

      <!-- Table -->
      <div class="overflow-x-auto w-full">
        <table class="w-full border-collapse text-sm" ref="dataTableRef">
          <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th class="t-th text-left">Client</th>
              <th class="t-th text-left">Phone</th>
              <th class="t-th text-left">Date</th>
              <th class="t-th text-left">Payment Method</th>
              <th class="t-th text-right">Amount</th>
              <th class="t-th text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in store.waterCollectionsPayments"
              :key="index"
              :class="index % 2 != 0 ? 'bg-gray-50' : ''"
              class="hover:bg-blue-50/40 transition-colors duration-300"
            >
              <td class="t-td font-semibold text-gray-700">{{ item.client_name }}</td>
              <td class="t-td">{{ item.phone_number }}</td>
              <td class="t-td">{{ formatDate(item.payment_date) }}</td>
              <td class="t-td">{{ item.payment_method }}</td>
              <td class="t-td text-right font-medium">{{ formatAmount(item.amount) }}</td>
              <td class="t-td text-center">
                <span
                  v-if="item.status == 'Complete'"
                  class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-green-100 text-green-800"
                >
                  Complete
                </span>
                <span
                  v-else
                  class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-red-100 text-red-800"
                >
                  Pending
                </span>
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
            {{ action === "create" ? "Add" : "Edit" }} Payment
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <CollectionPaymentFormModal
        @close-modal="dialogVisible = false"
        :form="formData"
        :action="action"
      >
      </CollectionPaymentFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { formatAmount } from "@/composables/helper_functions";
import { useWaterCollectionsStore } from "@/store/water-collections.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const CollectionPaymentFormModal = defineAsyncComponent(
  () =>
    import(
      "@/components/modules/wm/collections-payments/CollectionPaymentFormModal.vue"
    )
);

const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useWaterCollectionsStore();
const formData = ref({});

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const addItem = () => {
  action.value = "create";
  formData.value = {};
  dialogVisible.value = true;
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getPayments();
  } catch (error) {
    console.error("Failed to fetch collection payments:", error);
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
