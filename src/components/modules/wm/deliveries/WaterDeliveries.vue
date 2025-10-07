<template>
  <div class="content">
    <div class="top-section">
      <div class="bread-crumb">
        <h2 class="font-semibold">Water Deliveries</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home ></span> Water Deliveries
        </span>
      </div>
    </div>
    <div class="">
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6">
        <h4 class="font-semibold">Water Deliveries </h4>
        <div class="grid grid-cols-3 mt-3 gap-6">
          <div class="border border-dashed p-3 px-4 rounded col-span-1">
            <h2 class="font-semibold">{{ store.waterDeliveries.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Deliveries</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterDeliveries.reduce((a, b) =>
              Number(a) + Number(b.total_amount), 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Total</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterDeliveries.reduce((a, b) =>
              b.status === 'Paid and delivery completed' ? Number(a) + Number(b.total_amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Paid</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Deliveries</h4>
            <span class="text-gray-400 text-sm"> {{ filteredWaterDeliveries.length }} of {{ store.waterDeliveries.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Water Delivery
          </button>
        </div>
        
        <!-- Search and Filter Component -->
        <SearchAndFilter
          entity-name="Water Deliveries"
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
                <th class="t-th">Delivery ID</th>
                <th class="t-th">Client</th>
                <th class="t-th">Contacts</th>
                <th class="t-th">Address</th>
                <th class="t-th">Vehicle</th>
                <th class="t-th">Driver</th>
                <th class="t-th">Delivery Date</th>
                <th class="t-th">Status</th>
                <th class="t-th">Capacity</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Amount Paid</th>
                <th class="t-th text-end">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in filteredWaterDeliveries" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <span>#{{
                    item.id
                  }}</span>
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  <span>{{
                    item.water_client?.client_name || 'N/A'
                  }}</span>
                </td>
                <td class="t-td">
                  {{
                    item.water_client?.phone || 'N/A'
                  }}
                </td>
                <td class="t-td">
                  {{
                    item.water_client?.address || 'N/A'
                  }}
                </td>
                <td class="t-td">{{ item.vehicle ? `${item.vehicle.plate_number} (${item.vehicle.brand || 'N/A'} ${item.vehicle.model || 'N/A'})` : 'N/A' }}</td>
                <td class="t-td">{{ item.driver?.user_name || 'N/A' }}</td>
                <td class="t-td font-semibold">
                  {{ formatDate(item.delivery_date, true) }}
                </td>
                <td class="t-td font-semibold">
                  <span v-if="item.status === 'Paid and delivery completed'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    Completed
                  </span>
                  <span v-else-if="item.status === 'Payment and delivery not completed'" class="p-1 rounded bg-yellow-100 text-yellow-500 text-xs">
                    Payment and delivery not completed
                  </span>
                  <span v-else-if="item.status === 'Paid, but delivery not completed'" class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    Paid, but delivery not completed
                  </span>
                  <span v-else-if="item.status === 'Delivered but payment not yet received'" class="p-1 rounded bg-yellow-100 text-yellow-500 text-xs">
                    Delivered but payment not yet received
                  </span>
                </td>
                <td class="t-td font-semibold">
                  {{ formatNumber(item.quantity_liters) }} Litres
                </td>
                <td class="t-td font-semibold">
                  {{ formatAmount(item.total_amount) }}
                </td>
                <td class="t-td font-semibold">
                  {{ item.status === 'completed' ? formatAmount(item.total_amount) : 'KES 0.00' }}
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
                      <el-dropdown-menu>
                        <el-dropdown-item @click="editItem(item)">
                          <span class="font-semibold py-2"><i class="ri-edit-line text-orange-500"></i>
                            Edit</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="item.status !== 'completed' && item.status !== 'Paid and delivery completed' && item.status !== 'Delivered but payment not yet received'"
                          @click="markComplete(item)"
                        >
                          <span class="font-semibold py-2"><i class="ri-check-line text-green-500"></i>
                            Mark Complete</span>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-if="item.status !== 'Paid and delivery not completed' && item.status !== 'Paid, but delivery not completed' && item.status !== 'Paid and delivery completed' && item.status !== 'completed'"
                          @click="recordPayment(item)"
                        >
                          <span class="font-semibold py-2"><i class="ri-money-dollar-circle-line text-blue-500"></i>
                            Record Payment</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
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
    <el-dialog v-model="dialogVisible" :show-close="false" style="min-width: 300px" width="40%" :key="dialogVisible">
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action === "create" ? "Add" : "Edit" }} Water Delivery
          </h3>
          <CloseBtnComponent @click="dialogVisible = false" />
        </div>
      </template>
      <WaterDeliveryFormModal @close-modal="dialogVisible = false" :form="formData" :action="action">
      </WaterDeliveryFormModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import SearchAndFilter from "@/components/shared/SearchAndFilter.vue";
import { formatDate, initDataTableWithSearch, handleSearch as dtHandleSearch, handleDateRangeFilter, handleColumnSearch, clearDateRangeFilter, clearAllFilters } from "@/composables/dataTables";
import { useWaterDeliveriesStore } from "@/store/water-deliveries.store";
import { formatAmount, formatNumber } from "@/composables/helper_functions";
import moment from "moment";

const WaterDeliveryFormModal = defineAsyncComponent(
  () => import("@/components/modules/wm/deliveries/WaterDeliveryFormModal.vue")
);

const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const store = useWaterDeliveriesStore();
const formData = ref({});

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

// Search and filter state
const searchQuery = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const selectedStatus = ref('');

// Delivery status options for filtering (aligned with new statuses)
const paymentStatusOptions = [
  { value: 'Paid and delivery completed', label: 'Paid and delivery completed' },
  { value: 'Paid, but delivery not completed', label: 'Paid, but delivery not completed' },
  { value: 'Payment and delivery not completed', label: 'Payment and delivery not completed' },
  { value: 'Delivered but payment not yet received', label: 'Delivered but payment not yet received' }
];

// Filtered water deliveries
const filteredWaterDeliveries = computed(() => {
  let filtered = store.waterDeliveries;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((delivery: any) => 
      delivery.id?.toString().includes(query) ||
      delivery.water_client?.client_name?.toLowerCase().includes(query) ||
      delivery.water_client?.phone?.toLowerCase().includes(query) ||
      delivery.water_client?.address?.toLowerCase().includes(query) ||
      delivery.vehicle?.plate_number?.toLowerCase().includes(query) ||
      delivery.driver?.user_name?.toLowerCase().includes(query)
    );
  }

  // Apply date range filter
  if (dateFrom.value || dateTo.value) {
    filtered = filtered.filter((delivery: any) => {
      const deliveryDate = moment(delivery.delivery_date);
      const fromDate = dateFrom.value ? moment(dateFrom.value) : null;
      const toDate = dateTo.value ? moment(dateTo.value) : null;
      
      if (fromDate && toDate) {
        return deliveryDate.isBetween(fromDate, toDate, 'day', '[]');
      } else if (fromDate) {
        return deliveryDate.isSameOrAfter(fromDate, 'day');
      } else if (toDate) {
        return deliveryDate.isSameOrBefore(toDate, 'day');
      }
      return true;
    });
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter((delivery: any) => {
      return delivery.status === selectedStatus.value;
    });
  }

  return filtered;
});

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

const markComplete = async (item: any) => {
  try {
    const res = await store.markWaterDeliveryComplete(item.id);
    if (res.status === 200 || res.status === 201) {
      ElNotification({
        title: "Success",
        message: "Delivery marked as complete",
        type: "success",
      });
      // Refresh the deliveries list
      await store.getWaterDeliveries();
    }
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "Failed to mark delivery as complete",
      type: "error",
    });
  }
};

const recordPayment = (item: any) => {
  // Navigate to water delivery payments page
  window.location.href = `/water-deliveries/payments?delivery_id=${item.id}`;
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
  await store.getWaterDeliveries();
  initDataTableWithSearch(dataTableRef.value);
  loading.value = false;
});
</script>

<style></style>
