<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Water Bills</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Water Bills
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Water Bills </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.clientBills.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Water Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.clientBills.reduce((a, b) => Number(a) + Number(b.amount_paid),
              0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Paid</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.clientBills.reduce((a, b) => Number(a) + (Number(b.amount) -
              Number(b.amount_paid)), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Water Bills</h4>
            <span class="text-gray-400 text-sm"> {{ filteredClientBills.length }} of {{ store.clientBills.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Bill
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Water Bills"
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
                  Bill #
                </th>
                <th class="t-th">
                  Client
                </th>
                <th class="t-th">From</th>
                <th class="t-th">To</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Balance</th>
                <th class="t-th">Due Date</th>
                <th class="t-th">Status</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredClientBills" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link class="font-semibold py-2" :to="{
                    name: 'tenant-bill',
                    params: { id: item.id },
                  }">
                    {{ item.bill_number }}
                  </router-link>
                </td>
                <td class="t-td">
                  {{ `${item.client_name} (Meter No. ${item.meter_number || '-'})` }}
                </td>
                <td class="t-td">
                  {{
                    formatDate(item.from)
                  }}
                </td>
                <td class="t-td">
                  {{
                    formatDate(item.to)
                  }}
                </td>
                <td class="t-td">{{ formatAmount(item.amount) }} </td>

                <td class="t-td">{{ formatAmount(item.amount - item.amount_paid) }} </td>

                <td class="t-td">
                  {{
                    formatDate(item.due_date)
                  }}
                </td>

                <td class="t-td">

                  <span v-if="item.payment_status == 'Paid'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    {{ item.payment_status }}
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    {{ item.payment_status }}
                  </span>
                </td>

                <td class="t-td text-end">
                  <el-dropdown trigger="click">
                    <span
                      class="el-dropdown-link inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 lg:px-3 lg:py-2 text-sm text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                      Action
                      <el-icon class="el-icon--right">
                        <i class="ri-arrow-down-s-line"></i>
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-item @click="editItem(item)" v-if="item.payment_status == 'Draft'">
                        <span class="font-semibold py-2"><i class="ri-edit-line text-orange-500"></i>
                          Edit</span>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="30%" :key="dialogVisible">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action === "create" ? "Add" : "Edit" }} Bill
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <WaterClientBillFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </WaterClientBillFormModal>
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
import { formatAmount } from "@/composables/helper_functions";
import moment from "moment";

const WaterClientBillFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/water-client-bills/WaterClientBillFormModal.vue")
);

const formData = ref({
})

const dialogVisible = ref(false);
const loading = ref(true);
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
  { value: 'Paid', label: 'Paid' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Pending', label: 'Pending' }
];

// Filtered client bills
const filteredClientBills = computed(() => {
  let filtered = store.clientBills;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((bill: any) => 
      bill.bill_number?.toLowerCase().includes(query) ||
      bill.client_name?.toLowerCase().includes(query) ||
      bill.client_phone?.toLowerCase().includes(query)
    );
  }

  // Apply date range filter
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter((bill: any) => {
      const billDate = moment(bill.bill_date);
      const fromDate = dateFrom.value ? moment(dateFrom.value) : null;
      const toDate = dateTo.value ? moment(dateTo.value) : null;
      
      if (fromDate && toDate) {
        return billDate.isBetween(fromDate, toDate, 'day', '[]');
      } else if (fromDate) {
        return billDate.isSameOrAfter(fromDate, 'day');
      } else if (toDate) {
        return billDate.isSameOrBefore(toDate, 'day');
      }
      return true;
    });
  }

  // Apply payment status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((bill: any) => {
      const totalAmount = Number(bill.amount);
      const paidAmount = Number(bill.amount_paid);
      
      if (selectedStatus.value === 'Paid') {
        return paidAmount >= totalAmount;
      } else if (selectedStatus.value === 'Partial') {
        return paidAmount > 0 && paidAmount < totalAmount;
      } else if (selectedStatus.value === 'Pending') {
        return paidAmount === 0;
      }
      return true;
    });
  }

  return filtered;
});

const addItem = () => {
  action.value = "create";
  formData.value = {
    water_client_id: "",
    from: "",
    to: "",
    previous_meter_reading: "",
    current_meter_reading: "",
    rate: "",
    amount: "",
    due_date: ""
  };
  dialogVisible.value = true;
};

const editItem = (item: any) => {
  action.value = "edit";
  formData.value = item;
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
    handleDateRangeFilter(dataTableRef.value, 2, from, to); // Date column is index 2
  }
};

const handleStatusFilter = (status: string) => {
  selectedStatus.value = status;
  // Custom filtering for payment status
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
  await store.getWaterClientBills();
  initDataTableWithSearch(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
