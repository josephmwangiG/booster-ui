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
            <span class="text-gray-400 text-sm">Water Bills</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterDeliveriesPayments.reduce((a, b) => b.payment_status == "Paid" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Complete</span>
          </div>
          <div class="border border-dashed p-3 px-4 rounded">
            <h2 class="font-semibold">KES {{ store.waterDeliveriesPayments.reduce((a, b) => b.payment_status != "Paid" ?
              Number(a) + Number(b.amount) : a, 0).toLocaleString() }}</h2>
            <span class="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-3 lg:p-6 mt-3 lg:mt-6 bg-white col-span-3">
        <div class="flex justify-between align-center">
          <div class="">
            <h4 class="font-semibold">Water Bills</h4>
            <span class="text-gray-400 text-sm"> {{ store.waterDeliveriesPayments.length }} items found </span>
          </div>
          <div class="actions flex gap-2 my-auto">
            <button @click="addItem" class="btn-primary my-auto">
              Add Payment
            </button>
          </div>
        </div>
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
              <tr v-for="(item, index) in store.waterDeliveriesPayments" :key="index"
                :class="index % 2 != 0 ? 'bg-gray-50' : ''">
                <td class="t-td font-semibold text-gray-500 cursor-pointer hover:text-blue-400">
                  {{ item.payment_code }}
                </td>
                <td class="t-td">
                  {{
                    item.delivery_number
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
                    item.payment_reference
                  }}
                </td>
                <td class="t-td">{{ formatAmount(item.amount) }} </td>

                <td class="t-td">
                  {{
                    formatDate(item.payment_date)
                  }}
                </td>

                <td class="t-td">
                  <span v-if="item.payment_status == 'Paid'"
                    class="p-1 rounded bg-green-100 text-green-500 text-xs">
                    Complete
                  </span>
                  <span v-else class="p-1 rounded bg-red-100 text-red-500 text-xs">
                    {{ item.payment_status }}
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
import { defineAsyncComponent, onMounted, ref } from "vue";
import CloseBtnComponent from "@/components/shared/CloseBtnComponent.vue";
import { formatDate, initDataTable } from "@/composables/dataTables";
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
