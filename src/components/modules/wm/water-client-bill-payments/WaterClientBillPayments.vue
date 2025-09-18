<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Water Bill Payments</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Water Bill Payments
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Water Bill Payments </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.clientBillPayments.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Water Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.clientBillPayments.reduce((a, b) => b.status == "Complete" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Complete</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.clientBillPayments.reduce((a, b) => b.status != "Complete" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Water Bills</h4>
            <span class="text-gray-400 text-sm"> {{ filteredClientBillPayments.length }} of {{ store.clientBillPayments.length }} items found </span>
          </div>
          <div class="actions flex gap-2 my-auto">
            <button @click="addItem" class="btn-primary my-auto">
              Add Payment
            </button>
          </div>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Water Bill Payments"
          :enable-date-range="true"
          :enable-status-filter="true"
          :status-options="paymentStatusOptions"
          @search="handleSearch"
          @date-range="handleDateRange"
          @status-filter="handleStatusFilter"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>

                <th class="t-th">
                  Payment #
                </th>
                <th class="t-th">Bill No.</th>
                <th class="t-th">
                  Tenant
                </th>
                <th class="t-th">P. Method</th>
                <th class="t-th">Ref</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Date</th>
                <th class="t-th">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredClientBillPayments" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.payment_code }}
                </td>
                <td class="t-td">
                  {{
                    item.bill_number
                  }}
                </td>
                <td class="t-td">
                  {{
                    item.client_name
                  }}
                </td>
                <td class="t-td">
                  {{
                    item.payment_method
                  }}
                </td>
                <td class="t-td">
                  {{
                    item.payment_ref
                  }}
                </td>
                <td class="t-td">KES {{ item.amount.toLocaleString() }} </td>

                <td class="t-td">
                  {{
                    formatDate(item.payment_date)
                  }}
                </td>

                <td class="t-td">
                  <span v-if="item.status == 'Complete'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    {{ item.status }}
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    {{ item.status }}
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
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Generate Bills
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <WaterClientBillPaymentFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </WaterClientBillPaymentFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { formatDate, initDataTableWithSearch, handleSearch as dtHandleSearch, handleDateRangeFilter, handleColumnSearch, clearDateRangeFilter, clearAllFilters } from "@/composables/dataTables";
import { useWaterClientBillsStore } from "@/store/water-client-bills.store";
import moment from "moment";

const WaterClientBillPaymentFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/water-client-bill-payments/WaterClientBillPaymentFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const formData = ref({
  id: null,
  water_client_bill_id: null,
  amount: null,
  payment_date: '',
  payment_ref: '',
  payment_method: ''
});
const action = ref("create");
const store = useWaterClientBillsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Search and filter state
const searchQuery = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const selectedStatus = ref('');

// Payment status options for filtering
const paymentStatusOptions = [
  { value: 'Complete', label: 'Complete' },
  { value: 'Pending', label: 'Pending' }
];

// Filtered client bill payments
const filteredClientBillPayments = computed(() => {
  let filtered = store.clientBillPayments;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((payment: any) => 
      payment.payment_number?.toLowerCase().includes(query) ||
      payment.client_name?.toLowerCase().includes(query) ||
      payment.client_phone?.toLowerCase().includes(query)
    );
  }

  // Apply date range filter
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter((payment: any) => {
      const paymentDate = moment(payment.payment_date);
      const fromDate = dateFrom.value ? moment(dateFrom.value) : null;
      const toDate = dateTo.value ? moment(dateTo.value) : null;
      
      if (fromDate && toDate) {
        return paymentDate.isBetween(fromDate, toDate, 'day', '[]');
      } else if (fromDate) {
        return paymentDate.isSameOrAfter(fromDate, 'day');
      } else if (toDate) {
        return paymentDate.isSameOrBefore(toDate, 'day');
      }
      return true;
    });
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((payment: any) => payment.status === selectedStatus.value);
  }

  return filtered;
});

const addItem = () => {
  action.value = "create";
  formData.value = {
    id: null,
    water_client_bill_id: null,
    amount: null,
    payment_date: '',
    payment_ref: '',
    payment_method: ''
  };
  dialogVisible.value = true;
};

// Search and filter handlers
const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (dataTableRef.value) {
    dtHandleSearch(dataTableRef.value, query);
  }
};

const handleDateRange = (from: string, to: string) => {
  dateFrom.value = from;
  dateTo.value = to;
  if (dataTableRef.value) {
    handleDateRangeFilter(dataTableRef.value, 6, from, to); // Date column is index 6
  }
};

const handleStatusFilter = (status: string) => {
  selectedStatus.value = status;
  if (dataTableRef.value && status) {
    handleColumnSearch(dataTableRef.value, 7, status); // Status column is index 7
  }
};

const handleClearFilters = () => {
  searchQuery.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  selectedStatus.value = '';
  if (dataTableRef.value) {
    clearDateRangeFilter(dataTableRef.value);
    clearAllFilters(dataTableRef.value);
  }
};

onMounted(async () => {
  await store.getWaterClientBillPayments();
  initDataTableWithSearch(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
