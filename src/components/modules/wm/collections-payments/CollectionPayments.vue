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
            <h2 class="font-semibold">{{ store.waterCollectionsPayments.length.toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Records</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterCollectionsPayments.reduce((a, b) => b.status == "Complete" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Complete</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterCollectionsPayments.reduce((a, b) => b.status != "Complete" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Records</h4>
            <span class="text-gray-400 text-sm"> {{ store.waterCollectionsPayments.length }} items found </span>
          </div>
          <button @click="addItem" class="btn-primary my-auto">
            Add Payment
          </button>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="w-full" ref="dataTableRef">
            <thead class="t-head">
              <tr>
                <th class="t-th">Client</th>
                <th class="t-th">Phone</th>
                <th class="t-th">Date</th>
                <th class="t-th">Payment Method</th>
                <th class="t-th">Amount</th>
                <th class="t-th">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in store.waterCollectionsPayments" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold">
                  {{
                    item.client_name
                  }}
                </td>
                <td class="t-td font-semibold">
                  {{
                    item.phone_number
                  }}
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ formatDate(item.payment_date) }}
                </td>
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.payment_method }}
                </td>

                <td class="t-td font-semibold">
                  {{ formatAmount(item.amount) }}
                </td>
                <td class="t-td font-semibold">
                <td class="t-td">
                  <span v-if="item.status == 'Complete'" class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    Complete
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    Pending
                  </span>
                </td>
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
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
import { formatAmount } from "@/composables/helper_functions";
import { useWaterCollectionsStore } from "@/store/water-collections.store";

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

const addItem = () => {
  action.value = "create";
  formData.value = {};
  dialogVisible.value = true;
};

onMounted(async () => {
  await store.getPayments();
  initDataTable(dataTableRef.value);
  loading.value = false;

});
</script>

<style></style>
