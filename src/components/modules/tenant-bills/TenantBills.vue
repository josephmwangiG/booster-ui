<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Tenant Bills</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Tenant Bills
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Tenant Bills </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 mt-3 gap-4">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.tenantBills.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (totalAmount || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Amount</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (rentAmount || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Rent</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (utilityAmount || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Utilities</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (totalPaidAmount || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Paid</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ (totalPendingAmount || 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total Pending</span>
          </div>
        </div>
        
    
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Tenant Bills</h4>
            <span class="text-gray-400 text-sm"> {{ (filteredTenantBills || []).length }} of {{ (store.tenantBills || []).length }} items found </span>
          </div>
          <div class="actions flex gap-2 my-auto justify-end">
            <el-select @change="filterBills" placeholder="Year" v-model="params.year" clearable
              class="!w-[110px] !py-1 h-[42px]">
              <el-option v-for="item in years" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select @change="filterBills" v-model="params.month" placeholder="Month" clearable
              class="!w-[110px] !py-1 h-[42px]">
              <el-option v-for="item in months" :key="item" :label="item" :value="item" />
            </el-select>
            <button @click="navigateToGenerateBills" class="btn-primary my-auto mt-1 h-[35px]">
              Generate Bills
            </button>
          </div>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Tenant Bills"
          :enable-date-filter="true"
          :enable-status-filter="true"
          :status-options="paymentStatusOptions"
          @search="handleSearch"
          @date-filter="handleDateFilter"
          @status-filter="handleStatusFilter"
          @clear-filters="handleClearFilters"
        />
        <div class="overflow-x-auto w-full">
          <div v-if="!filteredTenantBills || filteredTenantBills.length === 0" class="text-center py-8 text-gray-500">
            <i class="ri-file-list-3-line text-4xl mb-2"></i>
            <p>No tenant bills found</p>
          </div>
          <table v-else class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">
                  Bill #
                </th>
                <th class="t-th">
                  Tenant
                </th>
                <th class="t-th">Period</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Utilities</th>
                <th class="t-th">Balance</th>
                <th class="t-th">Due Date</th>
                <th class="t-th">Status</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredTenantBills" :key="index" :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <router-link class="font-semibold py-2" :to="{
                    name: 'tenant-bill',
                    params: { id: item.id },
                  }">
                    {{ item.bill_number }}
                  </router-link>
                </td>
                <td class="t-td">
                  {{ item.tenant_name }}
                </td>
                <td class="t-td">
                  {{
                    item.period
                  }}
                </td>
                <td class="t-td">
                  <div class="text-sm">
                    <div class="font-semibold">KES {{ (item.amount || 0).toLocaleString() }}</div>
                    <div class="text-xs text-gray-500">
                      <span v-if="getBillUtilities(item.id).length > 0">
                        {{ getBillUtilities(item.id).length }} utilities
                      </span>
                      <span v-else>Rent only</span>
                    </div>
                  </div>
                </td>
                <td class="t-td">
                  <div class="text-xs">
                    <div v-if="getBillUtilities(item.id).length > 0" class="space-y-1">
                      <div v-for="utility in getBillUtilities(item.id).slice(0, 2)" :key="utility.id">
                        <span class="text-gray-600">{{ utility.item_name }}</span>
                      </div>
                      <div v-if="getBillUtilities(item.id).length > 2" class="text-gray-400 text-xs">
                        +{{ getBillUtilities(item.id).length - 2 }} more
                      </div>
                    </div>
                    <div v-else class="text-gray-400">No utilities</div>
                  </div>
                </td>
                <td class="t-td">KES {{ item.payment_status == 'Paid' ? 0 : ((item.amount || 0) -
                  (item.amount_paid || 0)).toLocaleString() }} </td>

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
                  <div class="flex justify-end">
                    <el-dropdown trigger="click">
                      <span
                        class="el-dropdown-link inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 lg:px-3 lg:py-2 text-sm text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50">
                        Action
                        <el-icon class="el-icon--right">
                          <i class="ri-arrow-down-s-line"></i>
                        </el-icon>
                      </span>
                    <template #dropdown>
                      <el-dropdown-item>
                        <router-link class="font-semibold py-2" :to="{
                          name: 'tenant-bill',
                          params: { id: item.id },
                        }"><i class="ri-external-link-line text-orange-500"></i>
                          View</router-link>
                      </el-dropdown-item>
                    </template>
                    </el-dropdown>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <!-- Utility Details Modal -->
    <el-dialog v-model="utilityDetailsVisible" :show-close="false" width="50%" class="utility-details-modal">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Utility Details - {{ selectedUtilityBill?.bill_number }}
          </h3>
          <CloseBtnComponent @click="utilityDetailsVisible = false" />
        </div>
      </template>
      
      <div v-if="selectedUtilityBill" class="space-y-4">
        <!-- Bill Summary -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">Bill Summary</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-600">Tenant:</span>
              <span class="ml-2 font-semibold">{{ selectedUtilityBill.tenant_name }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Period:</span>
              <span class="ml-2 font-semibold">{{ selectedUtilityBill.period }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Total Amount:</span>
              <span class="ml-2 font-semibold">KES {{ selectedUtilityBill.amount?.toLocaleString() }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Status:</span>
              <span class="ml-2" :class="selectedUtilityBill.payment_status === 'Paid' ? 'text-green-600' : 'text-orange-600'">
                {{ selectedUtilityBill.payment_status }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Utility Breakdown -->
        <div>
          <h4 class="font-medium text-gray-900 mb-3">Bill Items</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left p-2 font-medium text-gray-700">Item</th>
                  <th class="text-left p-2 font-medium text-gray-700">Unit</th>
                  <th class="text-right p-2 font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in getBillUtilities(selectedUtilityBill.id)" :key="item.id" class="hover:bg-gray-50">
                  <td class="p-2">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-black"></div>
                      <span class="font-medium">{{ item.item_name }}</span>
                    </div>
                  </td>
                  <td class="p-2 text-gray-600">{{ item.unit?.unit_code || '-' }}</td>
                  <td class="p-2 text-right font-semibold">KES {{ Number(item.amount).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { formatDate, initDataTableWithSearch, handleSearch as dtHandleSearch, handleDateRangeFilter, handleColumnSearch, clearDateRangeFilter, clearAllFilters } from "@/composables/dataTables";
import { useTenantBillsStore } from "@/store/tenant-bills.store";
import moment from "moment";


const params = ref({
  year: "",
  month: "",
})

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear + 1];
  for (let i = currentYear; i > currentYear - 3; i--) {
    years.push(i);
  }
  return years;
});


const utilityDetailsVisible = ref(false);
const selectedUtilityBill = ref<any>(null);
const loading = ref(true);
const store = useTenantBillsStore();
const router = useRouter();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Computed properties for totals including utilities
const totalAmount = computed(() => {
  let total = 0;
  
  // Use main bill amounts since they already include both rent and utilities
  if (store.tenantBills && store.tenantBills.length > 0) {
    store.tenantBills.forEach(bill => {
      total += Number(bill.amount) || 0;
    });
  }
  
  return total;
});

const rentAmount = computed(() => {
  let total = 0;
  
  // Calculate rent from bill items where item_name is "Rent"
  if (store.tenantBillItems && store.tenantBillItems.length > 0) {
    store.tenantBillItems.forEach(item => {
      if (item.item_name === 'Rent') {
        total += Number(item.amount) || 0;
      }
    });
  }
  
  return total;
});

const utilityAmount = computed(() => {
  let total = 0;
  
  // Calculate utilities from bill items where item_name is NOT "Rent"
  // Note: Some utilities might not have utility_id, so we check for non-rent items
  if (store.tenantBillItems && store.tenantBillItems.length > 0) {
    console.log('Calculating utility amount from bill items:', store.tenantBillItems.length, 'items');
    store.tenantBillItems.forEach(item => {
      console.log('Processing bill item:', {
        id: item.id,
        item_name: item.item_name,
        amount: item.amount,
        utility_id: item.utility_id,
        tenant_bill_id: item.tenant_bill_id
      });
      
      if (item.item_name !== 'Rent') {
        const amount = Number(item.amount) || 0;
        total += amount;
        console.log(`Adding utility item ${item.item_name}: ${amount}, total: ${total}`);
      }
    });
  } else {
    console.log('No tenant bill items available for utility calculation');
  }
  
  console.log('Total utility amount calculated:', total);
  return total;
});

const totalPaidAmount = computed(() => {
  let total = 0;
  
  // Calculate total paid from tenant bill payments
  if (store.tenantBillPayments && store.tenantBillPayments.length > 0) {
    store.tenantBillPayments.forEach(payment => {
      total += Number(payment.amount) || 0;
    });
  }
  
  return total;
});

const totalPendingAmount = computed(() => {
  let total = 0;
  
  // Calculate pending amount as total amount minus total paid
  const totalBillAmount = totalAmount.value;
  const totalPaid = totalPaidAmount.value;
  
  total = Math.max(0, totalBillAmount - totalPaid);
  
  return total;
});


// Search and filter state
const searchQuery = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const selectedStatus = ref('');

// Payment status options for filtering
const paymentStatusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' }
];

// Filtered tenant bills
const filteredTenantBills = computed(() => {
  let filtered = store.tenantBills || [];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((bill: any) => 
      bill.bill_number?.toLowerCase().includes(query) ||
      bill.tenant_name?.toLowerCase().includes(query) ||
      bill.period?.toLowerCase().includes(query) ||
      bill.amount?.toString().includes(query)
    );
  }

  // Apply date range filter
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter((bill: any) => {
      if (!bill.due_date) return true;
      
      const billDate = moment(bill.due_date);
      const fromDate = dateFrom.value ? moment(dateFrom.value) : null;
      const toDate = dateTo.value ? moment(dateTo.value) : null;
      
      if (fromDate && billDate.isBefore(fromDate, 'day')) {
        return false;
      }
      
      if (toDate && billDate.isAfter(toDate, 'day')) {
        return false;
      }
      
      return true;
    });
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((bill: any) => bill.payment_status === selectedStatus.value);
  }

  return filtered;
});

const filterBills = async () => {
  await Promise.all([
    store.getTenantBills(params.value),
    store.getBillItems(),
    store.getTenantBillPayments()
  ]);
}

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
      handleDateRangeFilter(dataTableRef.value, 5, fromDate, toDate); // Due Date column is index 5
    }
  }
};

const handleStatusFilter = (status: string) => {
  selectedStatus.value = status;
  if (dataTableRef.value) {
    handleColumnSearch(dataTableRef.value, 6, status); // Status column is index 6
  }
};

const handleClearFilters = () => {
  searchQuery.value = '';
  dateFrom.value = '';
  dateTo.value = '';
  selectedStatus.value = '';
  if (dataTableRef.value) {
    clearAllFilters(dataTableRef.value);
  }
};

// Function to get utilities for a specific bill
const getBillUtilities = (billId: string) => {
  if (!store.tenantBillItems || store.tenantBillItems.length === 0) {
    console.log('No tenant bill items available for bill utilities');
    return [];
  }
  
  const utilities = store.tenantBillItems.filter(item => 
    item.tenant_bill_id === billId && item.item_name !== 'Rent'
  );
  
  console.log(`Utilities for bill ${billId}:`, utilities);
  return utilities;
};




// Function to navigate to generate bills page
const navigateToGenerateBills = () => {
  router.push({ name: 'generate-tenant-bills' });
};


onMounted(async () => {
  // Load tenant bills, bill items, and payments to get complete totals
  try {
    await Promise.all([
      store.getTenantBills({}),
      store.getBillItems(),
      store.getTenantBillPayments()
    ]);
    
    console.log('Initial data loaded:', {
      bills: store.tenantBills.length,
      billItems: store.tenantBillItems.length,
      payments: store.tenantBillPayments.length,
      totalAmount: totalAmount.value,
      totalPaid: totalPaidAmount.value,
      totalPending: totalPendingAmount.value
    });
    
    if (dataTableRef.value && filteredTenantBills.value && filteredTenantBills.value.length > 0) {
      initDataTableWithSearch(dataTableRef.value);
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
  } finally {
    loading.value = false;
  }
  
});
</script>

<style>

/* Utility Details Modal Styles */
.utility-details-modal .el-dialog {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.utility-details-modal .el-dialog__header {
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 24px;
  margin: 0;
}

.utility-details-modal .el-dialog__body {
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
}
</style>
