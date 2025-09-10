<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Pending Money Collection</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Pending Money Collection
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Pending Money Collection </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ (store.pendingWaterCollections?.length || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Records</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (store.pendingWaterCollections || []).reduce((a, b) =>
              Number(a) + Number(b.amount), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (store.pendingWaterCollections || []).reduce((a, b) =>
              Number(a) + Number(b.paid_amount), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Paid</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Records</h4>
            <span class="text-gray-400 text-sm"> {{ filteredPendingCollections?.length || 0 }} of {{ store.pendingWaterCollections?.length || 0 }} items found </span>
          </div>
          <!-- Add Pending Collection button disabled as API only supports GET and HEAD methods -->
          <!-- <button @click="addItem" class="btn-primary my-auto">
            Add Pending Collection
          </button> -->
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Pending Collections"
          :enable-date-filter="true"
          @search="handleSearch"
          @date-filter="handleDateRange"
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
                <th class="t-th">Amount</th>
                <th class="t-th">Payment Method</th>
                <th class="t-th">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="loading" class="text-center">
                <td colspan="7" class="t-td">Loading...</td>
              </tr>
              <tr v-else-if="!filteredPendingCollections || filteredPendingCollections.length === 0" class="text-center">
                <td colspan="7" class="t-td text-gray-500">No pending collections found</td>
              </tr>
              <tr v-else v-for="(item, index) in filteredPendingCollections" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''"
                >
                <td class="t-td font-semibold">
                  {{ item.water_client?.client_name || 'N/A' }}
                </td>
                <td class="t-td font-semibold">
                  {{ item.phone_number || item.water_client?.phone || 'N/A' }}
                </td>
                <td class="t-td font-semibold">
                  {{ item.water_meter?.code_number || 'N/A' }}
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ formatDate(item.created_at) }}
                </td>
                <td class="t-td font-semibold">
                  {{ formatAmount(item.amount) }}
                </td>
                <td class="t-td font-semibold">
                  {{ item.payment_method || 'N/A' }}
                </td>
                <td class="t-td">
                  <span v-if="item.status === 'completed'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    Completed
                  </span>
                  <span v-else-if="item.status === 'pending'" class="p-1 rounded bg-yellow-100 text-yellow-500 text-xs">
                    Pending
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    {{ item.status || 'Unknown' }}
                  </span>
                </td>
              </tr>
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
            {{ action === "create" ? "Add" : "Edit" }} Pending Collection
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <PendingMoneyCollectionFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </PendingMoneyCollectionFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
// PendingMoneyCollections Component - Fixed imports and filtering
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed, nextTick } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { formatAmount } from "@/composables/helper_functions";
import { useWaterCollectionsStore } from "@/store/water-collections.store";

const PendingMoneyCollectionFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/pending-collections/PendingMoneyCollectionFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useWaterCollectionsStore();
const formData = ref({});

// Search and filter state
const searchQuery = ref('');
const dateFrom = ref('');
const dateTo = ref('');

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Computed property for filtered collections
const filteredPendingCollections = computed(() => {
  let filtered = [...(store.pendingWaterCollections || [])];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.water_client?.client_name?.toLowerCase().includes(query) ||
      item.phone_number?.toLowerCase().includes(query) ||
      item.water_client?.phone?.toLowerCase().includes(query) ||
      item.water_meter?.code_number?.toLowerCase().includes(query)
    );
  }

  // Apply date filter
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.created_at);
      const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
      const toDate = dateTo.value ? new Date(dateTo.value) : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });
  }

  return filtered;
});

// Event handlers for SearchAndFilter component
const handleSearch = (query: string) => {
  searchQuery.value = query;
  reinitializeDataTable();
};

const handleDateRange = (from: string, to: string) => {
  dateFrom.value = from;
  dateTo.value = to;
  reinitializeDataTable();
};

const handleClearFilters = () => {
  searchQuery.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  reinitializeDataTable();
};

const reinitializeDataTable = async () => {
  // Destroy existing DataTable if it exists
  try {
    const $ = (window as any).$;
    if ($ && $.fn.DataTable.isDataTable(dataTableRef.value)) {
      $(dataTableRef.value).DataTable().destroy();
    }
  } catch (error) {
    console.warn('Error destroying existing DataTable:', error);
  }
  
  // Wait for next tick and reinitialize
  await nextTick();
  if (filteredPendingCollections.value && filteredPendingCollections.value.length > 0 && dataTableRef.value) {
    initDataTable(dataTableRef.value);
  }
};

// const addItem = () => {
//   action.value = "create";
//   formData.value = {};
//   dialogVisible.value = true;
// };

onMounted(async () => {
  try {
    await store.getPendingWaterCollections();
    loading.value = false;
    
    // Wait for next tick to ensure DOM is fully rendered
    await nextTick();
    
    // Initialize DataTable after data is loaded
    if (dataTableRef.value) {
      initDataTable(dataTableRef.value);
    }
  } catch (error) {
    console.error('Error loading pending water collections:', error);
    loading.value = false;
  }
});
</script>

<style></style>
