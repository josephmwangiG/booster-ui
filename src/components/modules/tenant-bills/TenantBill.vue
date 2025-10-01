<template>
  <div class="content p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="top-section mb-6 animate-fade-in">
      <div class="bread-crumb">
        <h2 class="font-bold text-2xl text-gray-800">Bill Details</h2>
        <span class="text-sm">
          <span class="text-gray-400">Home > Tenant Bills ></span>
          <span class="text-blue-600 font-medium"> Bill Details</span>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Bill Details Card -->
    <div v-else>
      <div class="w-full bg-white p-3 lg:p-6 mt-3 lg:mt-6 rounded-2xl shadow-lg animate-slide-up">
        <h4 class="font-semibold text-lg text-gray-800">Bill | {{ store.tenantBill?.bill_number }} - {{ store.tenantBill?.tenant?.tenant_name }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-gray-900">KES {{ store.tenantBill?.amount }}</h2>
            <span class="text-gray-600 text-sm">Total Bill</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-gray-900">{{ store.tenantBill?.bill_items?.length }}</h2>
            <span class="text-gray-600 text-sm">Items</span>
          </div>
          <div class="border border-dashed p-4 rounded-lg text-center">
            <h2 class="font-bold text-2xl text-green-600">KES {{ store.tenantBill?.amount_paid.toLocaleString() }}</h2>
            <span class="text-gray-600 text-sm">Amount Paid</span>
          </div>
        </div>
      </div>

      <div class="shadow-lg rounded-2xl py-6 px-5 bg-white border border-gray-100 mt-6 animate-slide-up">
        <div class="flex justify-between items-center">
          <div class="title">
            <h4 class="font-semibold text-lg text-gray-800">Bill Items</h4>
            <span class="text-gray-500 text-sm">
              {{ store?.tenantBill?.bill_items?.length }} items
            </span>
          </div>
          <div class="flex justify-end gap-2">
            <button
              @click="completeDialogVisible = true"
              class="bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm py-2 px-4 shadow hover:shadow-md transform hover:-translate-y-0.5 transition duration-300"
              v-if="store.tenantBill?.payment_status == 'Draft'"
            >
              Complete
            </button>
          </div>
        </div>

        <hr class="my-4" />

        <!-- Table -->
        <div class="overflow-x-auto w-full">
          <table class="w-full border-collapse text-sm" ref="dataTableRef">
            <thead class="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th class="t-th text-left">Item</th>
                <th class="t-th text-left">Unit</th>
                <th class="t-th text-right">Previous M. Reading</th>
                <th class="t-th text-right">Current M. Reading</th>
                <th class="t-th text-right">Consumption</th>
                <th class="t-th text-right">Amount</th>
                <th class="t-th text-center" v-if="store.tenantBill?.payment_status == 'Draft'">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in store?.tenantBill?.bill_items"
                :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''"
                class="hover:bg-blue-50/40 transition-colors duration-300"
              >
                <td class="t-td font-semibold text-gray-700">{{ item.item_name }}</td>
                <td class="t-td">{{ item.unit?.unit_code }}</td>
                <td class="t-td text-right font-medium">
                  {{ item?.utility && item.utility.category == "Meter Reading" ? Number(item.previous_meter_reading).toLocaleString() : "-" }}
                </td>
                <td class="t-td text-right font-medium">
                  {{ item?.utility && item.utility.category == "Meter Reading" ? Number(item.current_meter_reading).toLocaleString() : "-" }}
                </td>
                <td class="t-td text-right font-medium">
                  {{ item?.utility && item.utility.category == "Meter Reading" ? (Number(item.current_meter_reading) - Number(item.previous_meter_reading)).toLocaleString() : "-" }} {{ item?.utility && item.utility.category == "Meter Reading" ? "Units" : "" }}
                </td>
                <td class="t-td text-right font-medium">KES {{ Number(item.amount).toLocaleString() }}</td>
                <td class="t-td text-center" v-if="store.tenantBill?.payment_status == 'Draft'">
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
  </div>
  <teleport to="body">
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      style="min-width: 300px"
      width="40%"
    >
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            {{ action == "create" ? "Add" : "Edit" }} Bill Item
          </h3>
          <CloseBtnComponent @click="closeModal" />
        </div>
      </template>
      <TenantBillItemFormModal
        @close-modal="closeModal"
        :form="formData"
        :action="action"
        :key="(dialogVisible as any)"
      >
      </TenantBillItemFormModal>
    </el-dialog>

    <el-dialog
      v-model="completeDialogVisible"
      :show-close="false"
      style="min-width: 300px"
      width="30%"
    >
      <template #header>
        <div class="modal-header flex justify-between items-center">
          <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
            Complete Bill Editing
          </h3>
          <CloseBtnComponent @click="completeDialogVisible = false" />
        </div>
      </template>
      <CompleteTenantBillModal
        @close-modal="completeDialogVisible = false"
        :form="params"
        :key="(completeDialogVisible as any)"
      >
      </CompleteTenantBillModal>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { initDataTable } from "@/composables/dataTables";
import { useRouter } from "vue-router";
import { useTenantBillsStore } from "@/store/tenant-bills.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const TenantBillItemFormModal = defineAsyncComponent(
  () => import("@/components/modules/tenant-bills/TenantBillItemFormModal.vue")
);
const CompleteTenantBillModal = defineAsyncComponent(
  () => import("@/components/modules/tenant-bills/CompleteTenantBillModal.vue")
);

const completeDialogVisible = ref(false);
const dialogVisible = ref(false);
const loading = ref(true);
const action = ref("create");
const router = useRouter();
const store = useTenantBillsStore();

const dataTableRef = ref(null);
DataTable.use(DataTablesCore);

const params = ref({
  id: router.currentRoute.value.params.id as string,
});
const formData = ref({});

const editItem = (item: any) => {
  action.value = "edit";
  formData.value = { ...item };
  dialogVisible.value = true;
};

const closeModal = () => {
  dialogVisible.value = false;
  formData.value = {};
};

onMounted(async () => {
  loading.value = true;
  try {
    await store.getTenantBill((router.currentRoute.value.params.id as string) || "");
  } catch (error) {
    console.error("Failed to fetch bill details:", error);
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
