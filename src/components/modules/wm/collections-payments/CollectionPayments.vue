<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Collection Payments</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Collection Payments
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Collection Payments </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ (store.waterCollectionsPayments?.length || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Records</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (store.waterCollectionsPayments || []).reduce((a, b) => b.status == "Complete" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Complete</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (store.waterCollectionsPayments || []).reduce((a, b) => b.status != "Complete" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Records</h4>
            <span class="text-gray-400 text-sm"> {{ filteredCollectionPayments?.length || 0 }} of {{ store.waterCollectionsPayments?.length || 0 }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Payment
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Collection Payments"
          :enable-date-filter="true"
          :enable-status-filter="true"
          :status-options="paymentStatusOptions"
          @search="handleSearch"
          @date-filter="handleDateRange"
          @status-filter="handleStatusFilter"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">Client</th>
                <th class="t-th">Phone</th>
                <th class="t-th">Meter</th>
                <th class="t-th">Date</th>
                <th class="t-th">Payment Method</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-if="loading">
                <tr class="text-center">
                  <td colspan="7" class="t-td">Loading...</td>
                </tr>
              </template>
              <template v-else-if="!filteredCollectionPayments || filteredCollectionPayments.length === 0">
                <tr class="text-center">
                  <td colspan="7" class="t-td text-gray-500">No collection payments found</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(item, index) in filteredCollectionPayments" :key="item.id || index"
                  :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                  <td class="t-td font-semibold">
                    {{ item.water_collection?.water_client?.client_name || item.client_name || 'N/A' }}
                  </td>
                  <td class="t-td font-semibold">
                    {{ item.water_collection?.phone_number || item.water_collection?.water_client?.phone || item.phone_number || 'N/A' }}
                  </td>
                  <td class="t-td font-semibold">
                    {{ item.water_collection?.water_meter?.code_number || 'N/A' }}
                  </td>
                  <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                    {{ formatDate(item.payment_date) }}
                  </td>
                  <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                    {{ item.payment_method?.name || item.payment_method || 'N/A' }}
                  </td>
                  <td class="t-td font-semibold">
                    {{ formatAmount(item.amount) }}
                  </td>
                  <td class="t-td font-semibold">
                    <span v-if="item.status === 'Complete' || item.status === 'completed'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                      Complete
                    </span>
                    <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                      Pending
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%" :key="dialogVisible">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action === "create" ? "Add" : "Edit" }} Payment
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <CollectionPaymentFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </CollectionPaymentFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
// CollectionPayments Component - Fixed imports and filtering
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, onUnmounted, ref, computed, nextTick, watch } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import $ from "jquery";
import { formatAmount } from "@/composables/helper_functions";
import { useWaterCollectionsStore } from "@/store/water-collections.store";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";

const CollectionPaymentFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/collections-payments/CollectionPaymentFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useWaterCollectionsStore();
const formData = ref({});

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Search and filter state
const searchQuery = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const selectedStatus = ref('');

// Payment status options (assuming based on template)
const paymentStatusOptions = [
  { value: 'Complete', label: 'Complete' },
  { value: 'Pending', label: 'Pending' }
];

// Computed property for filtered payments
const filteredCollectionPayments = computed(() => {
  let filtered = [...(store.waterCollectionsPayments || [])];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.water_collection?.water_client?.client_name?.toLowerCase().includes(query) ||
      item.client_name?.toLowerCase().includes(query) ||
      item.water_collection?.phone_number?.toLowerCase().includes(query) ||
      item.water_collection?.water_client?.phone?.toLowerCase().includes(query) ||
      item.phone_number?.toLowerCase().includes(query) ||
      item.water_collection?.water_meter?.code_number?.toLowerCase().includes(query)
    );
  }

  // Apply date filter
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.payment_date);
      const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
      const toDate = dateTo.value ? new Date(dateTo.value) : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value);
  }

  return filtered;
});

// Event handlers
const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handleDateRange = (from: string, to: string) => {
  dateFrom.value = from;
  dateTo.value = to;
};

const handleStatusFilter = (status: string) => {
  selectedStatus.value = status;
};

const handleClearFilters = () => {
  searchQuery.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  selectedStatus.value = '';
};

const addItem = () => {
  action.value = "create";
  formData.value = {};
  dialogVisible.value = true;
};


onMounted(async () => {
  try {
    await store.getPayments();
    loading.value = false;
    // Initialize DataTable after data is loaded
    await nextTick();
    if (dataTableRef.value) {
      initDataTable(dataTableRef.value);
    }
  } catch (error) {
    console.error('Error loading collection payments:', error);
    loading.value = false;
  }
});

onUnmounted(() => {
  // Clean up DataTable if it was initialized
  if (dataTableRef.value) {
    try {
      const dt = $(dataTableRef.value).DataTable();
      if (dt) {
        dt.destroy();
      }
    } catch (error) {
      console.warn('Error cleaning up DataTable:', error);
    }
  }
});
</script>

<style></style>
