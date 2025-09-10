<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Water Deliveries Payments</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Water Deliveries Payments
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Water Deliveries Payments </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">{{ store.waterDeliveriesPayments.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Water Payments</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterDeliveriesPayments.reduce((a, b) => b.water_delivery?.status === "completed" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Complete</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterDeliveriesPayments.reduce((a, b) => b.water_delivery?.status === "pending" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Complete</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Water Bills</h4>
            <span class="text-gray-400 text-sm"> {{ filteredWaterDeliveryPayments.length }} of {{ store.waterDeliveriesPayments.length }} items found </span>
          </div>
          <div class="actions flex gap-2 my-auto">
            <button @click="addItem" class="btn-primary my-auto">
              Add Payment
            </button>
          </div>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Water Delivery Payments"
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
                <th class="t-th">Delivery No.</th>
                <th class="t-th">
                  Client
                </th>
                <th class="t-th">P. Method</th>
                <th class="t-th">Ref</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Date</th>
                <th class="t-th">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredWaterDeliveryPayments" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  #{{ item.id }}
                </td>
                <td class="t-td">
                  {{ item.water_delivery?.id || 'N/A' }}
                </td>
                <td class="t-td">
                  {{ getClientName(item) }}
                </td>
                <td class="t-td">
                  {{ item.payment_method?.name || 'N/A' }}
                </td>
                <td class="t-td">
                  {{ item.reference_number || 'N/A' }}
                </td>
                <td class="t-td">{{ formatAmount(item.amount) }} </td>

                <td class="t-td">
                  {{
                    formatDate(item.payment_date)
                  }}
                </td>

                <td class="t-td">
                  <span v-if="item.water_delivery?.status === 'completed'"
                    class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    Complete
                  </span>
                  <span v-else-if="item.water_delivery?.status === 'pending'"
                    class="p-1 rounded bg-yellow-100 text-yellow-500 text-xs">
                    Complete
                  </span>
                  <span v-else class="p-1 rounded bg-gray-100 text-gray-500 text-xs">
                    {{ item.water_delivery?.status || 'Unknown' }}
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
            Add Payment
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <WaterDeliveryPaymentFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </WaterDeliveryPaymentFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { formatDate, initDataTable, handleSearch as dtHandleSearch, clearAllFilters } from "@/composables/dataTables";
import { useWaterDeliveriesStore } from "@/store/water-deliveries.store";
import { formatAmount } from "@/composables/helper_functions";

const WaterDeliveryPaymentFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/water-delivery-payments/WaterDeliveryPaymentFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const formData = ref({});
const action = ref("create");
const store = useWaterDeliveriesStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Search and filter state
const searchQuery = ref('');
const selectedStatus = ref('');
const dateRange = ref<[string, string] | null>(null);

// Payment status options for filtering
const paymentStatusOptions = [
  { value: 'Paid', label: 'Paid' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Failed', label: 'Failed' }
];

// Filtered water delivery payments
const filteredWaterDeliveryPayments = computed(() => {
  let filtered = store.waterDeliveriesPayments;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((payment: any) => 
      payment.id?.toString().toLowerCase().includes(query) ||
      payment.water_delivery?.id?.toString().toLowerCase().includes(query) ||
      getClientName(payment).toLowerCase().includes(query) ||
      payment.payment_method?.name?.toLowerCase().includes(query) ||
      payment.reference_number?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((payment: any) => {
      const status = payment.water_delivery?.status === 'completed' ? 'Paid' : 
                    payment.water_delivery?.status === 'pending' ? 'Pending' : 'Unknown';
      return status === selectedStatus.value;
    });
  }

  // Apply date range filter
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const startDate = new Date(dateRange.value[0]);
    const endDate = new Date(dateRange.value[1]);
    filtered = filtered.filter((payment: any) => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }

  return filtered;
});

const addItem = (prefilledData: any = {}) => {
  action.value = "create";
  formData.value = prefilledData;
  dialogVisible.value = true;
};

// Helper function to get client name from nested water_delivery object
const getClientName = (item: any) => {
  // Check if water_delivery exists and has water_client information
  if (item.water_delivery?.water_client) {
    return item.water_delivery.water_client.name || item.water_delivery.water_client.client_name || 'N/A';
  }
  // Check if there's a client name directly in water_delivery
  if (item.water_delivery?.client_name) {
    return item.water_delivery.client_name;
  }
  // For now, show the water_client_id as a fallback
  if (item.water_delivery?.water_client_id) {
    return `Client ${item.water_delivery.water_client_id}`;
  }
  return 'N/A';
};

// Search and filter handlers
const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (dataTableRef.value) {
    dtHandleSearch(dataTableRef.value, query);
  }
};

const handleStatusFilter = (status: string) => {
  selectedStatus.value = status;
};

const handleDateRange = (range: [string, string] | null) => {
  dateRange.value = range;
};

const handleClearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  dateRange.value = null;
  if (dataTableRef.value) {
    clearAllFilters(dataTableRef.value);
  }
};

onMounted(async () => {
  // Fetch water delivery payments from API
  await store.getPayments();
  
  // Fetch water deliveries to have access to delivery data
  await store.getWaterDeliveries();
  
  initDataTable(dataTableRef.value);
  loading.value = false;

  // Check for delivery_id parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const deliveryId = urlParams.get('delivery_id');
  
  if (deliveryId) {
    // Find the delivery data and pre-fill the form
    const delivery = store.waterDeliveries.find((d: any) => d.id == deliveryId);
    if (delivery) {
      const prefilledData = {
        water_delivery_id: delivery.id,
        amount: delivery.total_amount,
        payment_date: new Date().toISOString().split('T')[0]
      };
      // Open the payment modal with pre-filled data
      addItem(prefilledData);
    }
  }
});
</script>

<style></style>
