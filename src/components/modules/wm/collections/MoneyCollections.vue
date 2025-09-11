<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Money Collection</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Money Collection
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Money Collection </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ store.waterCollections.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Records</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterCollections.reduce((a, b) =>
              Number(a) + Number(b.amount), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Records</h4>
            <span class="text-gray-400 text-sm"> {{ filteredWaterCollections.length }} of {{ store.waterCollections.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Collection
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Money Collections"
          :enable-date-filter="true"
          :enable-category-filter="true"
          category-label="Payment Method"
          :categories="paymentMethodOptions"
          @search="handleSearch"
          @date-filter="handleDateFilter"
          @category-filter="handlePaymentMethodFilter"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">Date</th>
                <th class="t-th">Meter</th>
                <th class="t-th">Payment Method</th>
                <th class="t-th">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="loading" class="text-center">
                <td colspan="4" class="t-td">Loading...</td>
              </tr>
              <tr v-else-if="!filteredWaterCollections || filteredWaterCollections.length === 0" class="text-center">
                <td colspan="4" class="t-td text-gray-500">No money collections found</td>
              </tr>
              <tr v-else v-for="(item, index) in filteredWaterCollections" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ formatDate(item.created_at) }}
                </td>
                <td class="t-td font-semibold">
                  {{ item.water_meter?.code_number || 'N/A' }}
                </td>
                <td class="t-td font-semibold">
                  {{ item.payment_method || 'N/A' }}
                </td>
                <td class="t-td font-semibold">
                  {{ formatAmount(item.amount) }}
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
            {{ action === "create" ? "Add" : "Edit" }} Money Collection
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <MoneyCollectionFormModal @close-modal="dialogVisible = false" @submit-form="handleFormSubmit" :form="formData" :action="action">
      </MoneyCollectionFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed, nextTick } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { formatDate, initDataTableWithSearch, handleSearch as dtHandleSearch, handleDateRangeFilter, handleColumnSearch, clearDateRangeFilter, clearAllFilters } from "@/composables/dataTables";
import { formatAmount } from "@/composables/helper_functions";
import { useWaterCollectionsStore } from "@/store/water-collections.store";
import moment from "moment";

const MoneyCollectionFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/collections/MoneyCollectionFormModal.vue")
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
const selectedPaymentMethod = ref('');

// Payment method options for filtering
const paymentMethodOptions = computed(() => {
  const methods = [...new Set(store.waterCollections.map((collection: any) => collection.payment_method))].filter(Boolean);
  return methods.map(method => ({ value: method, label: method }));
});

// Filtered water collections
const filteredWaterCollections = computed(() => {
  let filtered = store.waterCollections;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((collection: any) => 
      collection.water_meter?.code_number?.toLowerCase().includes(query) ||
      collection.payment_method?.toLowerCase().includes(query) ||
      collection.amount?.toString().includes(query)
    );
  }

  // Apply date range filter
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter((collection: any) => {
      if (!collection.created_at) return true;
      
      const collectionDate = moment(collection.created_at);
      const fromDate = dateFrom.value ? moment(dateFrom.value) : null;
      const toDate = dateTo.value ? moment(dateTo.value) : null;
      
      if (fromDate && collectionDate.isBefore(fromDate, 'day')) {
        return false;
      }
      
      if (toDate && collectionDate.isAfter(toDate, 'day')) {
        return false;
      }
      
      return true;
    });
  }

  // Apply payment method filter
  if (selectedPaymentMethod.value) {
    filtered = filtered.filter((collection: any) => collection.payment_method === selectedPaymentMethod.value);
  }

  return filtered;
});

const addItem = () => {
  action.value = "create";
  formData.value = {};
  dialogVisible.value = true;
};

const handleFormSubmit = async () => {
  // Refresh the collections data after successful form submission
  try {
    await store.getWaterCollections();
    // Also refresh payments data since a new payment record is created
    await store.getPayments();
    console.log('Collections and payments refreshed after form submission');
  } catch (error) {
    console.error('Error refreshing collections:', error);
  }
};


// Search and filter handlers
const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (dataTableRef.value) {
    dtHandleSearch(dataTableRef.value, query);
  }
};

const handleDateFilter = (fromDate: string, toDate: string) => {
  dateFrom.value = fromDate;
  dateTo.value = toDate;
  if (dataTableRef.value) {
    clearDateRangeFilter(dataTableRef.value);
    if (fromDate || toDate) {
      handleDateRangeFilter(dataTableRef.value, 0, fromDate, toDate); // Date column is index 0
    }
  }
};

const handlePaymentMethodFilter = (method: string) => {
  selectedPaymentMethod.value = method;
  if (dataTableRef.value) {
    handleColumnSearch(dataTableRef.value, 2, method); // Payment Method column is index 2
  }
};

const handleClearFilters = () => {
  searchQuery.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  selectedPaymentMethod.value = '';
  if (dataTableRef.value) {
    clearAllFilters(dataTableRef.value);
  }
};

onMounted(async () => {
  try {
    console.log('Loading water collections...');
    await store.getWaterCollections();
    console.log('Water collections loaded:', store.waterCollections);
    console.log('Filtered collections:', filteredWaterCollections.value);
    loading.value = false;
    
    // Wait for DOM to be fully updated
    await nextTick();
    
    // Additional wait to ensure Vue has rendered all data
    setTimeout(() => {
      if (dataTableRef.value) {
        console.log('Initializing DataTable for Money Collections');
        console.log('Data count:', filteredWaterCollections.value.length);
        initDataTableWithSearch(dataTableRef.value);
      }
    }, 100);
  } catch (error) {
    console.error('Error loading water collections:', error);
    loading.value = false;
  }
});
</script>

<style></style>
